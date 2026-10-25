# Resume generator

For agents or other repositories that need only the public master resume, `portable-resumes/` contains a standalone Markdown copy of `resume_source.md` and a byte-identical copy of the reviewed `output/pdf/Nathan-Kelly-Resume.pdf`. Refresh them with `npm run portable` after promoting a reviewed public PDF; `npm run check:portable` detects drift. They are the narrow exception to the generated-output Git policy below. The application resume and its private contacts never enter this folder.

The root `resume_source.md` is the only editable resume source for both public and encrypted builds. `.github/README.md` is a generated display copy that GitHub renders on the repository homepage. Never edit the generated copy; operational instructions live here.

Run `npm run readme` to refresh the homepage locally (`npm run build` also refreshes it). The **Update resume homepage and bullet catalog** workflow automatically regenerates and commits `.github/README.md` and `docs/bullet-catalog.md` after source or relevant generator/tag changes reach `main`; it can also be run manually on `main`. Pull requests do not receive write permissions. If branch protection prevents the bot commit, run `npm run readme` and `npm run catalog` and commit the generated files with your source change. `npm run check:readme` detects a stale display copy.

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

`npm run build` rebuilds the catalog, and `npm run check` checks its freshness. CI tests the parser, rebuilds the catalog, and checks freshness; the main-only homepage workflow commits the generated document. Automation keeps text synchronized, but pending tag review is reported rather than guessed. Freshness passes with pending tags; `--require-reviewed` is the separate acceptance check for agent-maintained metadata. Catalog generation does not alter the resume source or require browser/PDF rendering.

## Outputs and privacy

| Output | Contact information | Where it goes |
| --- | --- | --- |
| Public resume | City and visible LinkedIn URL | Public PDF artifact and public diagnostics |
| Application resume | Adds email and phone at build time | Only an age-encrypted artifact |

Both outputs use the same experience, education, and skills. `EMAIL` and `PHONE_NUMBER` are GitHub Actions secrets; `AGE_RECIPIENT` is a repository variable containing the public age recipient key. The private decryption identity stays on the owner's computer, never in GitHub.

The public PDF is hosted at [natek.pro/resume-pdf](https://natek.pro/resume-pdf/) through the `natek-pro/natek.pro` GitHub Pages repository. A minimal `resume-pdf/index.html` redirects to `resume-pdf/Nathan-Kelly-Resume.pdf` and provides a fallback link.

The HTML version targets `/resume/` and is generated from the same `resume_source.md`; it is never edited separately. `npm run build:web` writes `output/web/resume/index.html` using `scripts/generate-web.mjs` and `templates/resume-web.css`. `npm run check:web` uses the dedicated Playwright browser to verify exact source text, bolding, links, working section anchors, and no horizontal overflow at 1280, 768, 390, and 320 pixels. Screenshots are saved under `tmp/web-review/`. The main build includes HTML generation, and CI requires web checks before deployment. The generated page has no scripts or external font dependencies.

Deployment runs automatically on `main` only after **both** `validate` and `encrypted` succeed. Failed, cancelled, or skipped prerequisites prevent publishing; PRs and other branches never deploy. The deployment job downloads only the current run's named public PDF and web artifacts, verifies their SHA-256 hashes against the validation job's outputs, commits those exact files into `natek-pro/natek.pro`, then polls both live HTTPS URLs until their hashes match. It does not rebuild the outputs or download private artifacts. GitHub Pages publishes the website commit. A publication or verification failure fails the deployment job; the run summary links the verified outputs only on success.

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
brew install poppler age
export RESUME_PYTHON="$PWD/.venv/bin/python3"
npm test
npm run build
npm run check
```

Node dependencies are locked; Python dependencies are pinned. System packages and font/browser rendering differences still require visual review. Exports never use your installed Google Chrome as a fallback. Restricted agent environments must obtain normal execution permission before browser startup.

`build` checks the public source and writes `output/pdf/drafts/resume.pdf`. `check` validates source, extracted PDF text, and actual font faces. The font check expects Georgia regular/bold/italic and Arial regular/bold. Four pages is a review baseline, not a mandatory count.

Render every page before approving a new layout:

```sh
mkdir -p tmp/review
pdftoppm -png output/pdf/drafts/resume.pdf tmp/review/page
pdftotext -layout output/pdf/drafts/resume.pdf tmp/review/text.txt
```

The source checker rejects email addresses and common formatted phone numbers in the public Markdown. Keep the `Phoenix, AZ` contact line intact; the private builder uses that one line as its injection point. Do not put personal contact values in code, tests, documentation, or workflow configuration.

## Targeted resume project

Targeted drafting has moved to the sibling [resume-targeted project](../../resume-targeted/README.md). Read its [targeting brief](../../resume-targeted/docs/targeting-brief.md) for drafting rules and its [generator guide](../../resume-targeted/docs/generator.md) for commands. It owns copies of the renderer, template, styles, continuation helper, and checks; it reads a pinned public master input and reports drift without changing this source.

The current master keeps its publication flow, ASU date corrections, and bullet-catalog automation. The pre-separation state is preserved by local commit `606f92f` and the immutable snapshot `versions/2026-10-09-before-targeted-project-separation/`. Migrated local working files are archived under ignored `reference/targeted-project-migration/`; local targeted application copies are under `.private/targeted-project-archive/`. No remote was pushed.

## GitHub Actions

The **Generate and validate resume** workflow (`.github/workflows/validate.yml`) contains three jobs:

1. **validate** runs on PRs, pushes to `main`, and manual dispatch. It tests privacy helpers, checks the public source, builds the public PDF, validates content/fonts, and saves public-only diagnostics.
2. **encrypted** runs only on `main`, after public validation, for pushes or manual dispatch. It installs dependencies before receiving contact secrets, builds and validates the private PDF in a restricted temporary directory, encrypts it, and uploads only the ciphertext.
3. **deploy** runs only on `main`, after both preceding jobs succeed, publishes the exact validated public PDF and HTML, and verifies their live bytes.

PRs never receive the contact secrets. No private PDFs, page previews, extracted text, generated Markdown, or captured subprocess logs are uploaded. The private builder suppresses subprocess output on failure as well as success; failures must not echo contact values. Temporary plaintext is removed when the builder exits normally or with a handled error; abrupt runner termination relies on the ephemeral runner's disposal. Do not use this job on a persistent self-hosted runner without additional cleanup guarantees.

Download from **Actions → a run → Summary**:

- `Resume-Nathan-Kelly-<timestamp>-Public`: ZIP containing the identically named public PDF.
- `Resume-Nathan-Kelly-<timestamp>-Public-Diagnostics`: public page images, extraction, font report, metadata, and provenance; may exist on a failed run.
- `Resume-Nathan-Kelly-<timestamp>-Encrypted`: ZIP containing `Resume-Nathan-Kelly-<timestamp>.pdf.age`, produced only after the application PDF passes validation and encryption succeeds.

The timestamp is UTC in `YYYYMMDDTHHMMSSZ` format (for example, `20260917T180000Z`) and is shared by all downloads from a build. Rerunning the public job creates a new timestamp; rerunning only the encrypted job reuses the successful public job’s timestamp. The private builder uses a fixed local staging filename; CI renames only the completed ciphertext for download.

Downloads expire after 14 days. Main builds fail rather than silently omit private contact fields when secrets or the public recipient are missing/invalid. Review all workflow/code/dependency changes before merging: code run on main can access secrets. Protect main with required reviews/checks if accepting contributions.

## Decrypt your application PDF

Install age once (`brew install age`). Extract the encrypted file from the downloaded ZIP, then run:

```sh
age --decrypt \
  -i "$HOME/.config/age/resume-identity.txt" \
  -o "$HOME/Downloads/Resume-Nathan-Kelly-20260917T180000Z.pdf" \
  "$HOME/Downloads/Resume-Nathan-Kelly-20260917T180000Z.pdf.age"
```

Replace the example timestamp with the one in your download and adjust the input path to where the ZIP was extracted. The output is an ordinary, unencrypted PDF suitable for sending to an employer. Keep it out of the public repo. `age -o` can overwrite an existing destination, so use a fresh output filename when needed.

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
| `templates/` | HTML wrapper and print CSS |
| `scripts/export-resume.mjs` | Markdown → HTML → tagged PDF |
| `scripts/continuation-headers.py` | Derive continuation headers from actual pagination |
| `scripts/check-source.mjs` | Public source checks |
| `scripts/check-export.py`, `scripts/check-fonts.py` | PDF content/font checks |
| `scripts/build-encrypted.py` | Temporary secret injection, validation, and age encryption |
| `tests/` | Privacy regression tests with synthetic contacts |
| `scripts/snapshot-resume.mjs` | Immutable local snapshots with checksums |

`output/`, `dist/`, `tmp/`, `versions/`, `reference/`, `.private/`, `.venv/`, and `node_modules/` are ignored. Private identities belong outside this repository. Snapshots and historical local PDFs can contain earlier personal contact details; never upload them.

Before changing source or generator:

```sh
npm run snapshot -- YYYY-MM-DD-before-description
```

Snapshots include source, documentation, scripts, templates, tests, workflow/configuration, and top-level local PDFs. Existing snapshots are immutable; they are not full backups. Promote an exact reviewed draft rather than regenerating it after review.

Deleting personal details from current files does not erase historical commits, PR references, old artifacts, downloaded copies, or forks. History/artifact cleanup is a separate operation, and GitHub-retained references may require GitHub Support.
