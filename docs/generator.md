# Resume generator

`resume_source.md` is the editable source for the public and encrypted builds. The reviewed public deliverable is the [portable Markdown/PDF pair](../portable-resumes/README.md). GitHub Actions publishes the committed portable PDF. The private application build adds contact details at export time.

Run `npm run build` to refresh the generated homepage, bullet catalog, portable exports, and local PDF and HTML. Review the PDF, then commit the changed inputs and their updated tracked outputs together. These include `.github/README.md`, `docs/bullet-catalog.md`, and the reviewed Markdown, PDF, and manifest under `portable-resumes/`. Files under `output/` are local build outputs.

Run `npm run check` to verify source structure, homepage and catalog freshness, PDF provenance, PDF text and fonts, and parity with the local PDF when present. CI checks the committed homepage and catalog before rendering previews. To regenerate those two files separately, use `npm run readme` and `npm run catalog`.

## Agent bullet catalog

`docs/bullet-catalog.md` is a tracked, generated index for selecting resume subsets. It contains the exact Markdown text of each Professional Experience list bullet, grouped by organization and role, with targeting/capability tags and a review status. It excludes prose role descriptions, the patent block, and other sections; the master source remains authoritative for those.

```sh
npm run catalog
npm run check:catalog
npm run check:catalog -- --require-reviewed
npm run test:catalog
```

Identifiers use a registered company/role prefix and a zero-based index: `TPT-HPT-02` is the third Head of Product & Technology bullet; `TPT-FEDS-00` is the first Founding Engineer & Data Scientist bullet. The index resets per role and changes after inserting/removing/reordering bullets. The catalog embeds a SHA-256 of the complete source; store it with a selection to detect drift. These are readable positional references, not permanent identifiers.

`config/bullet-tags.json` defines role prefixes, tag vocabulary, broad fallback tags, and reviewed per-bullet tags keyed by SHA-256 of the bullet's Markdown text (excluding the list marker and trailing whitespace). Fingerprint matching prevents reviewed tags from shifting to unrelated bullets when indexes move. New/changed bullets receive only broad role defaults and are visibly marked pending; editing bolding also triggers review. Adding or renaming a role requires an explicit mapping, and unsupported nested/task/ordered experience lists fail rather than silently dropping evidence.

After a source edit, rebuild and have an agent read pending text in context, select evidence-supported tags from the vocabulary, and register the displayed fingerprint under the correct role. Remove obsolete entries; add vocabulary terms only when useful and defensible. Rebuild again and run the strict reviewed check. Detailed agent instructions are in `AGENTS.md`. Tags guide selection; they do not add resume claims or calculate a job-fit score.

Freshness checks allow pending tags. Use `npm run check:catalog -- --require-reviewed` to require reviewed tags for every bullet. You can regenerate and check the catalog with Node alone.

## Web quick start

With Node 22 installed, run the following commands and open `output/web/resume/index.html` in a browser.

```sh
npm ci
npm run build:web
```

## Outputs and privacy

| Output | Contact information | Where it goes |
| --- | --- | --- |
| Public resume | City and visible LinkedIn URL | Public PDF artifact and public diagnostics |
| Application resume | Adds email and phone at build time | Only an age-encrypted artifact |

Both outputs use the same experience, education, and skills. `EMAIL` and `PHONE_NUMBER` are GitHub Actions secrets; `AGE_RECIPIENT` is a repository variable containing the public age recipient key. The private decryption identity stays on the owner's computer, never in GitHub.

The public PDF is hosted at [natek.pro/resume-pdf](https://natek.pro/resume-pdf/) through the `natek-pro/natek.pro` GitHub Pages repository. A minimal `resume-pdf/index.html` redirects to `resume-pdf/Nathan-Kelly-Resume.pdf` and provides a fallback link.

The HTML version at `/resume/` uses `scripts/generate-web.mjs` and `templates/resume-web.css`. `npm run check:web` uses the dedicated Playwright browser to verify source text, bolding, links, section anchors, and horizontal fit at 1280, 768, 390, and 320 pixels. It saves screenshots in `tmp/web-review/`. CI requires this check before deployment.

Deployment runs automatically on `main` only after **both** `validate` and `encrypted` succeed. The public PDF artifact is the committed, reviewed `portable-resumes/Nathan-Kelly-Resume.pdf`; the newly rendered draft is retained for diagnostics and comparison. Failed, cancelled, or skipped prerequisites prevent publishing; PRs and other branches never deploy. The deployment job downloads only the current run's named public PDF and web artifacts, verifies their SHA-256 hashes against the validation job's outputs, commits those exact files into `natek-pro/natek.pro`, then polls both live HTTPS URLs until their hashes match. It does not rebuild the outputs or download private artifacts. GitHub Pages publishes the website commit. A publication or verification failure fails the deployment job; the run summary links the verified outputs only on success.

`WEBSITE_DEPLOY_KEY` is an Actions secret containing a dedicated SSH private key; its public key is a write-enabled deploy key on `natek-pro/natek.pro` only. It is distinct from the age decryption identity and the contact secrets. Rotate it by replacing the website deploy key and the source repository secret together. Automated checks do not replace visual layout review when changing resume content or styling.

A public build artifact is accessible to people with repository read access; the deployed PDF is accessible to everyone. The application artifact is safe to share only because its contents are encrypted; artifact access alone is not privacy protection.

## Setup and public build

Use Node 22 (`.nvmrc`), Python 3.12, Playwright's dedicated browser, and Poppler. The reviewed font environment is macOS with Georgia and Arial. Font substitutions cause validation to fail.

```sh
npm ci
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
npm run browser:install
brew install poppler
export RESUME_PYTHON="$PWD/.venv/bin/python3"
npm test
npm run build
npm run check
```

Node dependencies are locked; Python dependencies are pinned. System packages and font/browser rendering differences still require visual review. Exports never use your installed Google Chrome as a fallback. Restricted agent environments must obtain normal execution permission before browser startup.

`npm run build` renders the public PDF once, validates its text and fonts, and updates the local PDF and portable files. The tracked `portable-resumes/pdf-manifest.json` records SHA-256 hashes for the PDF and its print inputs, including the source, templates, renderer, and dependency pins. Commit the manifest with the reviewed PDF. `npm run check:portable` rejects changed inputs or PDF bytes and validates the committed PDF directly. Font checks and visual review cover runtime differences such as installed font versions.

`npm run build:draft` writes `output/pdf/drafts/resume.pdf` and `output/web/resume/index.html` for previews and CI diagnostics. Both paths are ignored by Git. For a standalone PDF preview, pass an explicit draft destination to `npm run export`. The default `npm run export` writes the local public PDF and its provenance. After reviewing that exact local PDF, use `npm run portable` to promote it. The command checks provenance before copying the PDF and validates its text and fonts.

The reviewed master spans five US Letter pages. The font checker reports page counts that differ from this baseline for visual review.

Render every page of the local output before committing the portable files:

```sh
mkdir -p tmp/review
pdftoppm -png output/pdf/Nathan-Kelly-Resume.pdf tmp/review/page
pdftotext -layout output/pdf/Nathan-Kelly-Resume.pdf tmp/review/text.txt
```

The source checker rejects email addresses and common formatted phone numbers in the public Markdown. Keep the `Phoenix, AZ` contact line intact; the private builder uses that one line as its injection point. Do not put personal contact values in code, tests, documentation, or workflow configuration.

## GitHub Actions

The **Generate and validate resume** workflow (`.github/workflows/validate.yml`) contains three jobs:

1. **validate** runs on PRs, pushes to `main`, and manual dispatch. It checks the committed homepage and catalog, uses `npm run build:draft` for diagnostics, checks the draft's content and fonts, then uploads the independently validated portable PDF.
2. **encrypted** runs only on `main`, after public validation, for pushes or manual dispatch. It installs dependencies before receiving contact secrets, builds and validates the private PDF in a restricted temporary directory, encrypts it, and uploads only the ciphertext.
3. **deploy** runs only on `main`, after both preceding jobs succeed, publishes the exact validated public PDF and HTML, and verifies their live bytes.

PRs never receive the contact secrets. No private PDFs, page previews, extracted text, generated Markdown, or captured subprocess logs are uploaded. The private builder suppresses subprocess output on failure as well as success; failures must not echo contact values. Temporary plaintext is removed when the builder exits normally or with a handled error; abrupt runner termination relies on the ephemeral runner's disposal. Do not use this job on a persistent self-hosted runner without additional cleanup guarantees.

Download from **Actions → a run → Summary**:

- `Nathan-Kelly-Public-Resume-<timestamp>` contains the public PDF named `Nathan-Kelly-Resume.pdf`.
- `Nathan-Kelly-Web-Resume-<timestamp>` contains the validated public web resume.
- `Nathan-Kelly-Public-Resume-Diagnostics-<timestamp>` contains public page images, extraction, font report, metadata, and provenance. It may exist on a failed run.
- `Nathan-Kelly-Application-Resume-<timestamp>-Encrypted` contains `Nathan-Kelly-Application-Resume.pdf.age` after the application PDF passes validation and encryption succeeds.

All artifacts from a build share a UTC timestamp in `YYYYMMDDTHHMMSSZ` format, such as `20260917T180000Z`. Rerunning the public job creates a new timestamp. Rerunning only the encrypted job reuses the successful public job’s timestamp. The filenames inside the downloads are stable.

Downloads expire after 14 days. Main builds fail rather than silently omit private contact fields when secrets or the public recipient are missing/invalid. Review all workflow/code/dependency changes before merging: code run on main can access secrets. Protect main with required reviews/checks if accepting contributions.

## Decrypt your application PDF

Install age once (`brew install age`). Extract the encrypted file from the downloaded ZIP, then run:

```sh
age --decrypt \
  -i "$HOME/.config/age/resume-identity.txt" \
  -o "$HOME/Downloads/Nathan-Kelly-Application-Resume.pdf" \
  "$HOME/Downloads/Nathan-Kelly-Application-Resume.pdf.age"
```

Adjust the input path to where the ZIP was extracted. The output is an ordinary, unencrypted PDF suitable for sending to an employer. Keep it out of the public repo. `age -o` can overwrite an existing destination, so use a fresh output filename when needed.

Back up the identity file securely, such as in an encrypted password-manager attachment. Anyone with the identity can decrypt its matching artifacts; losing it means losing access to those downloads. GitHub cannot recover it. Never paste the private identity into an issue, chat, repository secret, or workflow log.

To configure a new recipient, generate an identity locally with `age-keygen -o <private-file>`, derive only its public recipient with `age-keygen -y <private-file>`, and set the `AGE_RECIPIENT` repository variable. Preserve the previous identity for older artifacts when rotating keys. The private build accepts native `age1...` recipient keys.

## Validation limits

- Source lint checks structure, public contact policy, links, placeholders, and merge conflicts. It does not verify career claims or implement a complete Markdown parser.
- `check-export.py` compares normalized letters/numbers in order using pypdf, excluding recognized continuation labels/counters. It rejects blank pages and replacement characters, but ignores whitespace/punctuation and checks visible labels rather than link destinations.
- `check-fonts.py` checks font names actually used by characters. It does not prove identical font versions, layout, or embedding.
- Continuation headers still enter some raw extraction. Neither output is a separately simplified ATS format. No live ATS parser is tested or contacted.

## Files and version control

| Path | Purpose |
| --- | --- |
| `resume_source.md` | Only editable resume source |
| `.github/README.md` | Generated homepage display copy |
| `scripts/generate-readme.mjs` | Generate or check the homepage copy |
| `docs/generator.md` | Setup, CI, privacy, and decryption instructions |
| `AGENTS.md` | Repository maintenance and editorial rules |
| `templates/` | HTML wrapper and styles for PDF and web output |
| `scripts/export-resume.mjs` | Markdown → HTML → tagged PDF |
| `scripts/public-pdf-provenance.mjs`, `portable-resumes/pdf-manifest.json` | Print input and reviewed PDF checksums |
| `scripts/continuation-headers.py` | Derive continuation headers from actual pagination |
| `scripts/check-source.mjs` | Public source checks |
| `scripts/check-export.py`, `scripts/check-fonts.py` | PDF content/font checks |
| `scripts/build-encrypted.py` | Temporary secret injection, validation, and age encryption |
| `tests/` | Bullet catalog and privacy tests using synthetic contacts |
| `scripts/snapshot-resume.mjs` | Immutable local snapshots with checksums |

`output/`, `dist/`, `tmp/`, `versions/`, `reference/`, `.private/`, `.venv/`, and `node_modules/` are ignored. Private identities belong outside this repository. Snapshots and historical local PDFs can contain earlier personal contact details. Keep them local. Clear disposable previews from `output/pdf/drafts/` and scratch files from `tmp/` after review. Keep approved renders and review notes with their snapshots or reference material.

Before changing source or generator:

```sh
npm run snapshot -- YYYY-MM-DD-before-description
```

Snapshots include source, documentation, scripts, templates, tests, workflows and configuration, the portable files, and top-level local PDFs. They preserve both PDF manifests when available. Existing snapshots are immutable.

Deleting personal details from current files does not erase historical commits, PR references, old artifacts, downloaded copies, or forks. History/artifact cleanup is a separate operation, and GitHub-retained references may require GitHub Support.
