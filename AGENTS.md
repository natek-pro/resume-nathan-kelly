# Resume generation: agent handoff

## Source of truth and scope

This directory is a self-contained resume source and PDF generator. All paths below are relative to this directory, so these instructions remain useful when the folder moves to a new project.

- Active wording and emphasis: `README.md`.
- Current reviewed export: `output/pdf/Nathan-Kelly-Resume.pdf`.
- Operational reference: `docs/generator.md`.
- Historical sources, dated PDFs, drafts, and `versions/` are references, not alternate editing baselines.

The user explicitly designated this source as active after moving the generator here. Older parent-project instructions pointing to `resume-editing/resume working source material.md` describe the previous workspace. Do not revert to that baseline.

## Editorial practices

- Exercise editorial judgment. The user's explanations supply evidence, not an obligation to include every detail. Preserve meaningful technical substance; avoid padding and indiscriminate shortening.
- For substantive wording, emphasis, or structural proposals, show original and proposed text, explain the tradeoff, and obtain approval before applying. Existing approval carries forward; do not ask again for an already approved change.
- Keep formatting work separate from claims. A bolding-only pass must not silently change words, punctuation, dates, or qualifications.
- Bold short contributions, distinctive technical work, or meaningful results. Do not bold every opening verb, whole sentences, or scattered keywords merely because they are technical. Keep qualifications such as “approximately” attached to emphasized metrics.
- Preserve informative cuts in supporting material; discard simple redundancy. The earlier workspace used `resume-editing/resume-supporting-material.md`. If that file is absent after migration, retain useful cuts in a clearly named local supporting document rather than losing them.
- The substantial ASU research section is intentional: it demonstrates ML and hardware experience less prominent in recent leadership roles. Do not shorten it solely because it is older.
- Additional Skills supplements keyword coverage with defensible experience. Do not add tools based only on awareness or insert invisible text, white text, or unreadably small keyword lists.

## Generator architecture

| File | Responsibility |
| --- | --- |
| `scripts/export-resume.mjs` | Converts Markdown with `marked`, assembles HTML/CSS, renders a tagged PDF with Playwright/Chromium, then invokes the continuation-header helper. |
| `templates/resume.html` | Document wrapper. |
| `templates/resume.css` | Typography, aligned headings, spacing, and page-break rules. |
| `scripts/continuation-headers.py` | Reads actual PDF heading positions with `pdfplumber`, derives continuation context, and adds embedded-font headers with ReportLab and `pypdf`. |
| `scripts/check-export.py` | Compares normalized source letters/numbers with extracted PDF text in order. |
| `scripts/check-fonts.py` | Rejects rendered font substitutions and emits a per-page font report. |
| `scripts/snapshot-resume.mjs` | Saves source, generator, documentation, configuration, and top-level PDF exports with SHA-256 hashes. |

The exporter resolves source/output arguments relative to this directory, blocks browser network requests, waits for fonts, and writes temporary files before atomically replacing the destination on successful export. Rendering success alone is not visual or ATS approval.

Markdown conventions are part of the rendering contract:

- `#` is the person's name. The initial paragraphs become the headline and contact block.
- `##` identifies major sections; the exact names `Core Competencies` and `Additional Skills` receive special styling.
- `### Organization — Location` and `#### Role — Dates` split at the **last** literal ` — `. The right-hand field is aligned right and the separator is omitted in the PDF.
- An immediately following italic-only paragraph supplies organization description or role context. ASU labs, partner organizations, and programs belong here, beneath the role title.
- Continuation labels use the organization plus role, or the first context segment before ` · `. Changing this structure can affect the labels.

Continuation labels are derived after actual pagination, never from hardcoded page numbers. A page beginning with a new heading receives no continuation label. Missing heading matches or overly wide labels cause export to fail. The matcher currently expects each heading's extracted text on one line; inspect wrapped headings if it fails rather than bypassing validation. The helper retains the document structure, outline, and links and marks its headers as pagination artifacts, but this does **not** guarantee that text extractors will ignore them.

## Safe edit and export workflow

Run commands from this directory:

```sh
npm run snapshot -- YYYY-MM-DD-before-description
npm run export -- README.md output/pdf/drafts/description.pdf
python3 scripts/check-export.py README.md output/pdf/drafts/description.pdf
```

1. Save a snapshot before changing source or generator. Use a new descriptive name; existing snapshots cannot be overwritten.
2. Make only the authorized changes and export to a distinct draft path.
3. Render **every page** to images with `pdftoppm` and inspect them. Keep previews and diagnostics under `tmp/`.
4. Check text extraction, heading/date association, contact details, links, page boundaries, and selective bolding. Confirm individual bullets are not split, headings are not orphaned, and content is not clipped.
5. Promote the exact reviewed draft to the canonical PDF, or regenerate and reverify if anything changed. Snapshot the accepted source, exporter, and PDF together; update `docs/generator.md` for material workflow changes.

Do not edit immutable snapshots. Restore by copying one into a separate draft directory, assessing it, and selectively copying back approved files. Snapshots exclude `output/pdf/drafts/`, `tmp/`, and `reference/`. New snapshots include `AGENTS.md`, dependency configuration, and CI workflows and exclude Python caches. Snapshots predating the Git foundation may not include those files. A snapshot is not a full-directory backup.

## Current reviewed baseline

As of September 16, 2026:

- Canonical PDF: four pages, promoted from `output/pdf/drafts/headers-v3.pdf`.
- Matching accepted snapshot: `versions/2026-09-15-header-consistency/`.
- Prior baseline: `versions/2026-09-15-before-header-consistency/`.
- Earlier four-page bolding/layout pass: `versions/2026-09-15-readability/`.
- Original five-page baseline: `versions/2026-09-15-before-readability/`.

The current design is single-column US Letter, Georgia 10.5 pt, 1.25 line height, 0.62-inch vertical and 0.72-inch horizontal margins. Organization headers are larger than role headers; dates and locations align right without a leading dash. Optional descriptions and ASU units sit on separate italic lines. Pause's redundant aggregate employment dates were removed; role dates remain. Continuation headers identify the role continuing at the top of each page, with a page counter at right.

Four pages is the reviewed result, not an invariant. Small changes can push the last skills lines onto a mostly empty fifth page. Inspect pagination after every meaningful change; do not force four pages by shrinking text excessively or cutting unapproved content.

## ATS verification: evidence and outstanding proposals

The current PDF was tested with `pypdf`, `pdfplumber`, and Poppler `pdftotext` in both normal and layout modes. All 1,832 source word tokens were preserved in order **after excluding generated continuation labels and counters**. Contact details, employers, roles, dates, degrees, and representative skills extracted intact. Bolding and right-aligned dates did not scramble body order. The PDF was unencrypted, contained no images, and was approximately 408 KiB. Links, outline, and the structure tree were retained.

The historical ATS review identified these findings; their current status is:

1. **Continuation headers enter raw extracted text.** Some extractors place them at the start of a page, while `pypdf` puts them after the final body text on that page. This can inject an earlier employer/title after a later role. An ATS-oriented export without these labels was recommended, while preserving the reader-oriented version. There is currently no ATS export mode or separate ATS PDF.
2. **Resolved September 17:** the user approved displaying `linkedin.com/in/natejkelly` in place of the LinkedIn label. The public source no longer contains phone/email; the private build injects them from environment secrets.

The existing checker deliberately removes recognized margin labels and normalizes away spaces and punctuation. It proves basic content preservation, not clean raw extraction, intact word boundaries, or correct ATS field assignment. For stronger review, inspect unfiltered output and compare word tokens with the source. Poppler may extract counters as `2/4` while other tools use `2 / 4`.

No live ATS parser was tested. Do not describe these checks as ATS certification, a guaranteed parsing result, a ranking score, or proof of correct employer/role association. Do not upload the resume to third-party services without authorization. For the vendor guidance consulted, see [Greenhouse's parsing documentation](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse).

## Dependencies and environment lessons

Requires Node.js 22+, `marked`, Playwright and a Chromium browser; Python 3 with `pypdf`, `pdfplumber`, and `reportlab`; and Poppler for rendering/extraction inspection. See `docs/generator.md` for installation commands.

- Prefer available Codex bundled dependencies. Discover current paths with the workspace-dependency tool rather than assuming paths from the previous host.
- The exporter tries local Node dependencies, then Codex's bundled packages. The browser must be Playwright's dedicated Chromium headless shell, installed with `npm run browser:install`. There is no fallback to installed Google Chrome; a missing browser produces a setup error.
- Python selection: `RESUME_PYTHON`, otherwise the known Codex bundled interpreter if present, otherwise `python3`.
- Header font selection: `RESUME_HEADER_FONT`, otherwise common system Arial/DejaVu Sans paths. Fonts affect wrapping and pagination; reverify on a new host.
- On the previous macOS host, sandboxed Chrome rendering failed and required an approved elevated `npm run export`. Use the host's normal approval mechanism when needed; do not bypass it. Do not repeat known-blocked launches in the sandbox; request normal elevated execution before browser startup on this host. Installing a dedicated browser does not itself grant sandbox permission.
- Poppler commands are not necessarily all on `PATH`; discover bundled binaries when needed. That host's Poppler emitted large volumes of Fontconfig configuration/cache warnings even when extraction succeeded. Capture diagnostic stderr to a temporary log, inspect exit status and output, and address runtime configuration if necessary. Do not mistake these runtime warnings for resume corruption or flood the conversation with them.
- Read and follow the available PDF skill for PDF authoring/review. Its artifact-operation marker applies to create/edit work, not read-only verification or edits to this handoff file.

When moving this folder, keep the active source, scripts, templates, package configuration, README, this AGENTS file, current PDF, and relevant snapshots together. Do not assume the new project has the previous project's supporting material, dependency installation, permissions, or tool paths.

## Git foundation (September 16, 2026)

- Git tracks the active source, generator, templates, dependency configuration, documentation, and CI workflow. `output/`, `tmp/`, `reference/`, and `versions/` are local-only and ignored. The historical snapshot paths above describe the original workspace, not files guaranteed in a clone.
- `npm run build` checks source structure and exports to `output/pdf/drafts/resume.pdf`; `npm run check` validates that draft’s extracted content and actual Georgia/Arial font faces. Use an activated Python environment and explicitly set `RESUME_PYTHON` as documented in README.
- CI builds and validates drafts and saves review artifacts. It does not publish, perform live ATS parsing, or replace human layout review. It targets macOS 15 and rejects substituted font faces. Its output still requires visual review; font versions and browser updates can change layout.
- Prefer promoting the exact reviewed draft, rather than regenerating after review. Do not commit generated outputs or automatically replace the reviewed local PDF with CI output.
- Experience, education, skills, and styling remain unchanged. The user approved removing phone/email from public source and displaying the LinkedIn URL.

CI downloads are `Nathan-Kelly-Resume-Public`, `resume-public-diagnostics`, and (main only) `Nathan-Kelly-Resume-Encrypted`. Only public output may enter diagnostics. Private contact secrets are injected in a separate main-only job; only age ciphertext may leave that job. Never upload or print private generated Markdown, PDFs, previews, extracted text, or subprocess errors. Keep decryption identities outside the repository and outside GitHub.

## Public and private variants

The root README is now the resume itself; move operational explanations to `docs/generator.md`. The public contact stanza intentionally omits email/phone and displays the LinkedIn URL. `scripts/build-encrypted.py` injects `EMAIL` and `PHONE_NUMBER` in a restricted temporary directory, validates the application PDF, and encrypts to the public `AGE_RECIPIENT`. Missing configuration must fail closed. Do not run secret-bearing code from PR refs. Use synthetic contact details in tests; never commit private keys. Historical token-count evidence above predates the approved contact changes.
