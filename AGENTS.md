# Repository maintenance

## Source of truth and scope

This directory is a self-contained resume source and PDF generator. All paths below are relative to this directory, so these instructions remain useful when the folder moves to a new project.

- Active wording and emphasis: `resume_source.md`.
- Current reviewed export: `output/pdf/Nathan-Kelly-Resume.pdf`.
- Operational reference: `docs/generator.md`.
- Historical sources, dated PDFs, drafts, and `versions/` are references, not alternate editing baselines.

## Editorial practices

- Exercise editorial judgment. The user's explanations supply evidence, not an obligation to include every detail. Preserve meaningful technical substance; avoid padding and indiscriminate shortening.
- For substantive wording, emphasis, or structural proposals, show original and proposed text, explain the tradeoff, and obtain approval before applying. Existing approval carries forward; do not ask again for an already approved change.
- Keep formatting work separate from claims. A bolding-only pass must not silently change words, punctuation, dates, or qualifications.
- Bold short contributions, distinctive technical work, or meaningful results. Do not bold every opening verb, whole sentences, or scattered keywords merely because they are technical. Keep qualifications such as “approximately” attached to emphasized metrics.
- Preserve informative cuts in supporting material; discard simple redundancy. Keep useful cuts in a clearly named local supporting document under ignored `reference/`.
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
npm run export -- resume_source.md output/pdf/drafts/description.pdf
python3 scripts/check-export.py resume_source.md output/pdf/drafts/description.pdf
```

1. Save a snapshot before changing source or generator. Use a new descriptive name; existing snapshots cannot be overwritten.
2. Make only the authorized changes and export to a distinct draft path.
3. Render **every page** to images with `pdftoppm` and inspect them. Keep previews and diagnostics under `tmp/`.
4. Check text extraction, heading/date association, contact details, links, page boundaries, and selective bolding. Confirm individual bullets are not split, headings are not orphaned, and content is not clipped.
5. Promote the exact reviewed draft to the canonical PDF, or regenerate and reverify if anything changed. Snapshot the accepted source, exporter, and PDF together; update `docs/generator.md` for material workflow changes.

Do not edit immutable snapshots. Restore by copying one into a separate draft directory, assessing it, and selectively copying back approved files. Snapshots exclude `output/pdf/drafts/`, `tmp/`, and `reference/`. A snapshot is not a full-directory backup.

## Layout

The current design is single-column US Letter, Georgia 10.5 pt, 1.25 line height, 0.62-inch vertical and 0.72-inch horizontal margins. Organization headers are larger than role headers; dates and locations align right without a leading dash. Optional descriptions and ASU units sit on separate italic lines. Continuation headers identify the role continuing at the top of each page, with a page counter at right.

Four pages is the reviewed result, not an invariant. Small changes can push the last skills lines onto a mostly empty fifth page. Inspect pagination after every meaningful change; do not force four pages by shrinking text excessively or cutting unapproved content.

## Text extraction limits

Continuation headers enter some raw extracted text. Some extractors place them at the start of a page, while `pypdf` can place them after the body text. This can affect employer/title association. There is currently no separate ATS export mode.

The existing checker deliberately removes recognized margin labels and normalizes away spaces and punctuation. It proves basic content preservation, not clean raw extraction, intact word boundaries, or correct ATS field assignment. For stronger review, inspect unfiltered output and compare word tokens with the source. Poppler may extract counters as `2/4` while other tools use `2 / 4`.

No live ATS parser was tested. Do not describe these checks as ATS certification, a guaranteed parsing result, a ranking score, or proof of correct employer/role association. Do not upload the resume to third-party services without authorization. For the vendor guidance consulted, see [Greenhouse's parsing documentation](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse).

## Dependencies and execution

Requires Node.js 22+, `marked`, Playwright and a Chromium browser; Python 3 with `pypdf`, `pdfplumber`, and `reportlab`; and Poppler for rendering/extraction inspection. See `docs/generator.md` for installation commands.

- Prefer available Codex bundled dependencies. Discover current paths with the workspace-dependency tool rather than assuming paths from the previous host.
- The exporter tries local Node dependencies, then Codex's bundled packages. The browser must be Playwright's dedicated Chromium headless shell, installed with `npm run browser:install`. There is no fallback to installed Google Chrome; a missing browser produces a setup error.
- Python selection: `RESUME_PYTHON`, otherwise the known Codex bundled interpreter if present, otherwise `python3`.
- Header font selection: `RESUME_HEADER_FONT`, otherwise common system Arial/DejaVu Sans paths. Fonts affect wrapping and pagination; reverify on a new host.
- Browser startup in a restricted environment requires normal execution permission. Do not bypass sandbox restrictions or repeat a known-blocked launch.
- Capture verbose rendering diagnostics under `tmp/`; inspect exit status and output when diagnosing failures.
- Read and follow the available PDF skill for PDF authoring/review. Its artifact-operation marker applies to create/edit work, not read-only verification or edits to this handoff file.

## Builds and publication

- Git tracks source, generator, templates, dependency configuration, documentation, and CI workflows. Generated PDFs, previews, references, and snapshots are local-only and ignored.
- `npm run build` exports a draft; `npm run check` validates extracted content and font faces. See `docs/generator.md` for setup and commands.
- CI validates builds and publishes the public PDF on `main` after the validation and encryption jobs succeed. Automated validation does not replace visual review.
- Promote the exact reviewed draft to the local canonical PDF. Do not commit generated outputs.

The Generate and validate resume workflow names CI downloads `Resume-Nathan-Kelly-<UTC timestamp>-Public`, `Resume-Nathan-Kelly-<UTC timestamp>-Public-Diagnostics`, and (main only) `Resume-Nathan-Kelly-<UTC timestamp>-Encrypted`. Timestamps use `YYYYMMDDTHHMMSSZ` and are shared across both jobs. Only public output may enter diagnostics. Private contact secrets are injected in a separate main-only job; only age ciphertext may leave that job. Never upload or print private generated Markdown, PDFs, previews, extracted text, or subprocess errors. Keep decryption identities outside the repository and outside GitHub.

## Public and private variants

The root `resume_source.md` is the only editable resume source; `.github/README.md` is generated for homepage display. Run `npm run readme` after source edits and never edit the generated copy directly. A main-only workflow also commits homepage updates automatically; move operational explanations to `docs/generator.md`. The public contact stanza intentionally omits email/phone and displays the LinkedIn URL. `scripts/build-encrypted.py` injects `EMAIL` and `PHONE_NUMBER` in a restricted temporary directory, validates the application PDF, and encrypts to the public `AGE_RECIPIENT`. Missing configuration must fail closed. Do not run secret-bearing code from PR refs. Use synthetic contact details in tests; never commit private keys.
