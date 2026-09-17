# Resume generator

The root `resume_source.md` is the only editable resume source for both public and encrypted builds. `.github/README.md` is a generated display copy that GitHub renders on the repository homepage. Never edit the generated copy; operational instructions live here.

Run `npm run readme` to refresh the homepage locally (`npm run build` also refreshes it). The **Update resume homepage** workflow automatically regenerates and commits `.github/README.md` after source or generator changes reach `main`; it can also be run manually on `main`. Pull requests do not receive write permissions. If branch protection prevents the bot commit, run `npm run readme` and commit the generated file with your source change. `npm run check:readme` detects a stale display copy.

## Outputs and privacy

| Output | Contact information | Where it goes |
| --- | --- | --- |
| Public resume | City and visible LinkedIn URL | Public PDF artifact and public diagnostics |
| Application resume | Adds email and phone at build time | Only an age-encrypted artifact |

Both outputs use the same experience, education, and skills. `EMAIL` and `PHONE_NUMBER` are GitHub Actions secrets; `AGE_RECIPIENT` is a repository variable containing the public age recipient key. The private decryption identity stays on the owner's computer, never in GitHub.

The public PDF is hosted at [natek.pro/resume-pdf](https://natek.pro/resume-pdf/) through the `natek-pro/natek.pro` GitHub Pages repository. A minimal `resume-pdf/index.html` redirects to `resume-pdf/Nathan-Kelly-Resume.pdf` and provides a fallback link.

Deployment runs automatically on `main` only after **both** `validate` and `encrypted` succeed. Failed, cancelled, or skipped prerequisites prevent publishing; PRs and other branches never deploy. The deployment job downloads only the current run's named public artifact, verifies its SHA-256 against the validation job's output, commits that exact PDF into `natek-pro/natek.pro`, then polls the live HTTPS URL until its SHA-256 matches. It does not rebuild the PDF or download private artifacts. GitHub Pages publishes the website commit. A publication or verification failure fails the deployment job; the run summary links the verified PDF only on success.

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

## GitHub Actions

The **Generate and validate resume** workflow (`.github/workflows/validate.yml`) contains three jobs:

1. **validate** runs on PRs, pushes to `main`, and manual dispatch. It tests privacy helpers, checks the public source, builds the public PDF, validates content/fonts, and saves public-only diagnostics.
2. **encrypted** runs only on `main`, after public validation, for pushes or manual dispatch. It installs dependencies before receiving contact secrets, builds and validates the private PDF in a restricted temporary directory, encrypts it, and uploads only the ciphertext.
3. **deploy** runs only on `main`, after both preceding jobs succeed, publishes the exact validated public PDF, and verifies the live bytes.

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
