# Repository maintenance

## Source of truth and scope

This directory is a self-contained resume source and PDF generator. All paths below are relative to this directory, so these instructions remain useful when the folder moves to a new project.

- Active wording and emphasis: `resume_source.md`.
- Current public export: `output/pdf/Nathan-Kelly-Resume.pdf`.
- Portable public pair for sparse checkout: `portable-resumes/Nathan-Kelly-Resume.md` and `.pdf`. The [generator guide](docs/generator.md) covers how to refresh and validate the pair and its PDF provenance. Keep application PDFs with private contacts out of this folder.
- Bullet-selection reference: generated `docs/bullet-catalog.md`; tag metadata: `config/bullet-tags.json`.
- Historical sources, dated PDFs, drafts, and `versions/` are references, not alternate editing baselines.
- Targeted resume drafting lives in the separate [resume-targeted project](../resume-targeted/AGENTS.md). Its [targeting brief](../resume-targeted/docs/targeting-brief.md) is the single source of truth for variant drafting rules. This project’s master-layout and publication rules do not govern those drafts.

## Editorial practices

- Follow the editorial objective, proposal gate, and work discipline in the [targeting brief](../resume-targeted/docs/targeting-brief.md). For the master, assess its complete career positioning and usefulness for the standing role directions; for a variant, assess its intended role. Establish a clear net gain before proposing an edit, compare with retaining the current text, and account for evidence lost. Retaining effective text is a successful review outcome; editing and activity are not measures of progress. When the sibling project is unavailable, these requirements still apply.
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
| `scripts/export-portable-resume.mjs` | Validates and refreshes the public PDF and portable pair from one render, or checks existing copies. |
| `templates/resume.html` | Document wrapper. |
| `templates/resume.css` | Typography, aligned headings, spacing, and page-break rules. |
| `scripts/continuation-headers.py` | Reads actual PDF heading positions with `pdfplumber`, derives continuation context, and adds embedded-font headers with ReportLab and `pypdf`. |
| `scripts/check-export.py` | Compares normalized source letters/numbers with extracted PDF text in order. |
| `scripts/check-fonts.py` | Rejects rendered font substitutions and emits a per-page font report. |
| `scripts/snapshot-resume.mjs` | Saves source, generator, documentation, configuration, and top-level PDF exports with SHA-256 hashes. |
| `scripts/generate-bullet-catalog.mjs` | Copies experience bullets into the agent catalog with role-relative indexes and fingerprint-bound targeting tags. |

## Bullet catalog maintenance and selection

- Read `docs/bullet-catalog.md` before selecting bullets for a resume variant, then verify freshness with `npm run check:catalog`. The catalog is an index, not an alternate editing source. Never edit its generated text directly.
- IDs use `company-role-00`, starting at zero within each role. Prefixes are registered in `config/bullet-tags.json`. IDs are positional: insertions, removals, and reorders can change them. Record the catalog's source SHA-256 with any selection and verify the text before reusing older selections.
- After any `resume_source.md` change, run `npm run catalog`. `npm run build` also rebuilds it. The main-only homepage workflow can also regenerate and commit both the README and catalog. CI checks the committed copies. Generation copies text exactly; it does not invent or rewrite accomplishments.
- An agent must review tags after new/changed bullets. Run `npm run catalog`, read pending entries and the corresponding source/role context, and add an entry in that role's `bullets` object in `config/bullet-tags.json`, keyed by the bullet SHA-256 printed in the catalog. Choose at least three unique registered tags, including at least one `target` tag and evidence-supported `capability` tags. Targets indicate possible application directions, not claims of having held those titles. Use editorial judgment; do not tag tools, responsibilities, or outcomes absent from the evidence.
- Reviewed tags follow exact bullet Markdown by fingerprint, even when reordered. Wording or bolding edits produce a new fingerprint and pending review; do not blindly copy old tags. Pending bullets have broad role defaults, explicitly marked as unreviewed. Remove obsolete fingerprint entries after assessing the edit. A new or renamed organization/role requires updating its explicit mapping; preserve existing prefixes where the role identity is unchanged.
- Rebuild after metadata edits, then run `npm run check:catalog -- --require-reviewed` and `npm run test:catalog`. Commit the source, metadata, and generated catalog together when applicable. Freshness checks alone permit pending tags; the strict flag rejects them. GitHub Actions can rebuild text but cannot supply semantic tag review.
- The catalog covers Professional Experience list bullets. Read role descriptions, the patent block, summary, competencies, education, and skills separately when tailoring a resume. Their absence from the catalog does not make them irrelevant. Selecting/rewriting a variant still follows the editorial approval rules above.

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
npm run build
npm run check
```

1. Save a snapshot before changing source or generator. Use a new descriptive name; existing snapshots cannot be overwritten.
2. Make only the authorized changes and run the build. For an isolated preview, use `npm run build:draft` or pass an explicit draft path to `npm run export`.
3. Render **every page** to images with `pdftoppm` and inspect them. Keep previews and diagnostics under `tmp/`.
4. Check text extraction, heading/date association, contact details, links, page boundaries, and selective bolding. Confirm individual bullets are not split, headings are not orphaned, and content is not clipped.
5. Review the build's public PDF before committing its portable pair. Snapshot the accepted source, exporter, and PDF together. Update `docs/generator.md` for material workflow changes.

Do not edit immutable snapshots. Restore by copying one into a separate draft directory, assessing it, and selectively copying back approved files. Snapshots exclude `output/pdf/drafts/`, `tmp/`, and `reference/`. A snapshot is not a full-directory backup.

## Layout

The current design is single-column US Letter, Georgia 10.5 pt, 1.25 line height, 0.62-inch vertical and 0.72-inch horizontal margins. Organization headers are larger than role headers; dates and locations align right without a leading dash. Optional descriptions and ASU units sit on separate italic lines. Continuation headers identify the role continuing at the top of each page, with a page counter at right.

The current reviewed master uses five pages. Page five contains the end of Undergraduate Research, Personal Projects, Education, and Additional Skills. Inspect pagination after meaningful changes and preserve legibility and approved content.

## Text extraction limits

Continuation headers enter some raw extracted text. Some extractors place them at the start of a page, while `pypdf` can place them after the body text. This can affect employer/title association. There is currently no separate ATS export mode.

The existing checker deliberately removes recognized margin labels and normalizes away spaces and punctuation. It proves basic content preservation, not clean raw extraction, intact word boundaries, or correct ATS field assignment. For stronger review, inspect unfiltered output and compare word tokens with the source. Poppler may extract counters as `2/4` while other tools use `2 / 4`.

No live ATS parser was tested. Do not describe these checks as ATS certification, a guaranteed parsing result, a ranking score, or proof of correct employer/role association. Do not upload the resume to third-party services without authorization. For the vendor guidance consulted, see [Greenhouse's parsing documentation](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse).

## Dependencies and execution

Use the [setup instructions](docs/generator.md#setup-and-public-build) for dependencies, the dedicated Chromium headless shell, and reviewed fonts. `RESUME_PYTHON` selects the interpreter for PDF rendering helpers. `RESUME_HEADER_FONT` selects the continuation-header font. Recheck pagination when changing hosts or fonts.

- Prefer available Codex bundled dependencies. Discover current paths with the workspace-dependency tool.
- Browser startup in a restricted environment requires normal execution permission. Do not bypass sandbox restrictions or repeat a known-blocked launch.
- Keep rendering diagnostics under `tmp/`.
- Read and follow the available PDF skill for PDF authoring/review. Its artifact-operation marker applies to create/edit work, not read-only verification or edits to this handoff file.

## Builds and publication

Follow the [generator guide](docs/generator.md) for commands, CI artifacts, and publication. Commit the reviewed portable pair and its manifest with changed print inputs. CI publishes the validated committed PDF and generated HTML after the public and encrypted jobs succeed.

The public source omits email and phone. The separate main-only application job uses contact secrets and exports only age ciphertext. Use synthetic contacts in tests. Keep private PDFs, generated Markdown, previews, extracted text, subprocess logs, and decryption identities out of GitHub.
