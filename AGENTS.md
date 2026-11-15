# Repository maintenance

## Source of truth and scope

This directory is a self-contained resume source and PDF generator. All paths below are relative to this directory, so these instructions remain useful when the folder moves to a new project.

- Active wording and emphasis: `resume_source.md`.
- Tracked public exports: `portable-resumes/Nathan-Kelly-Resume.md`, `portable-resumes/Nathan-Kelly-Resume.pdf`, and `portable-resumes/pdf-manifest.json`. Keep application PDFs with private contacts out of this folder.
- Local public PDF: `output/pdf/Nathan-Kelly-Resume.pdf`. See the [generator guide](docs/generator.md) for the build and review process.
- Bullet-selection reference: generated `docs/bullet-catalog.md`; tag metadata: `config/bullet-tags.json`.
- Historical sources, dated PDFs, drafts, and `versions/` are references, not alternate editing baselines.
- Targeted resume drafting lives in a separate checkout. For work in that checkout, follow its `AGENTS.md` and `docs/targeting-brief.md`.

## Editorial practices

- Assess the master's overall career positioning and usefulness for the standing role directions. Establish a clear net gain before proposing an edit, compare with retaining the current text, and account for evidence lost. Retaining effective text is a successful review outcome.
- Exercise editorial judgment. The user's explanations supply evidence, not an obligation to include every detail. Preserve meaningful technical substance; avoid padding and indiscriminate shortening.
- For substantive wording, emphasis, or structural proposals, show original and proposed text, explain the tradeoff, and obtain approval before applying. Existing approval carries forward; do not ask again for an already approved change.
- Keep formatting work separate from claims. A bolding-only pass must not silently change words, punctuation, dates, or qualifications.
- Bold short contributions, distinctive technical work, or meaningful results. Do not bold every opening verb, whole sentences, or scattered keywords merely because they are technical. Keep qualifications such as “approximately” attached to emphasized metrics.
- Preserve informative cuts in supporting material; discard simple redundancy. Keep useful cuts in a clearly named local supporting document under ignored `reference/`.
- The substantial ASU research section is intentional: it demonstrates ML and hardware experience less prominent in recent leadership roles. Do not shorten it solely because it is older.
- Additional Skills supplements keyword coverage with defensible experience. Do not add tools based only on awareness or insert invisible text, white text, or unreadably small keyword lists.

## Bullet catalog maintenance and selection

- Read `docs/bullet-catalog.md` before selecting bullets for a resume variant, then verify freshness with `npm run check:catalog`. The catalog is an index, not an alternate editing source. Never edit its generated text directly.
- IDs use `company-role-00`, starting at zero within each role. Prefixes are registered in `config/bullet-tags.json`. IDs are positional: insertions, removals, and reorders can change them. Record the catalog's source SHA-256 with any selection and verify the text before reusing older selections.
- After any `resume_source.md` change, run `npm run build` to refresh the homepage, catalog, and portable files. Use `npm run catalog` to regenerate the catalog after tag-only changes. Commit generated changes with their inputs. CI checks the committed copies. The catalog copies bullet text verbatim.
- An agent must review tags after new/changed bullets. Run `npm run catalog`, read pending entries and the corresponding source/role context, and add an entry in that role's `bullets` object in `config/bullet-tags.json`, keyed by the bullet SHA-256 printed in the catalog. Choose at least three unique registered tags, including at least one `target` tag and evidence-supported `capability` tags. Targets indicate possible application directions, not claims of having held those titles. Use editorial judgment; do not tag tools, responsibilities, or outcomes absent from the evidence.
- Reviewed tags follow exact bullet Markdown by fingerprint, even when reordered. Wording or bolding edits produce a new fingerprint and pending review; do not blindly copy old tags. Pending bullets have broad role defaults, explicitly marked as unreviewed. Remove obsolete fingerprint entries after assessing the edit. A new or renamed organization/role requires updating its explicit mapping; preserve existing prefixes where the role identity is unchanged.
- Rebuild after metadata edits, then run `npm run check:catalog -- --require-reviewed` and `npm run test:catalog`. Commit the source, metadata, and generated catalog together when applicable. The strict check requires reviewed tags.
- The catalog covers Professional Experience list bullets. Read role descriptions, the patent block, summary, competencies, education, and skills separately when tailoring a resume. Their absence from the catalog does not make them irrelevant. Selecting/rewriting a variant still follows the editorial approval rules above.

## Markdown and layout

- `#` is the person's name. The initial paragraphs become the headline and contact block.
- `##` identifies major sections; the exact names `Core Competencies` and `Additional Skills` receive special styling.
- `### Organization — Location` and `#### Role — Dates` split at the **last** literal ` — `. The right-hand field is aligned right and the separator is omitted in the PDF.
- An immediately following italic-only paragraph supplies organization description or role context. ASU labs, partner organizations, and programs belong here, beneath the role title.
- Continuation labels follow actual pagination. For a role, the label combines the organization and role title, using the first context segment before ` · ` when present. From page two onward, a page that starts with a matched heading receives only the page counter. If heading matching fails, check for wrapped headings.

The reviewed master is five US Letter pages with a single column, 10.5 pt Georgia, and right-aligned dates and locations. Review pagination after meaningful changes and preserve legibility and approved content.

## Safe edit and export workflow

1. Before changing source or generator, create a snapshot with `npm run snapshot -- YYYY-MM-DD-before-description`. Use a new label.
2. Follow the [build instructions](docs/generator.md#setup-and-public-build) and run `npm run check`. Use `npm run build:draft` for an isolated preview.
3. Render and inspect **every page** with `pdftoppm`. Check contact details, links, heading and date association, bolding, and page breaks. Look for split bullets, orphaned headings, and clipping. Keep previews and diagnostics under `tmp/`.
4. Snapshot the accepted source, exporter, and PDF together. Commit changed print inputs with the reviewed portable files and manifest. Update `docs/generator.md` for material workflow changes.

Do not edit immutable snapshots. Restore by copying one into a separate draft directory, assessing it, and selectively copying back approved files. Snapshots exclude `output/pdf/drafts/`, `tmp/`, and `reference/`. A snapshot is not a full-directory backup.

Inspect unfiltered PDF text for word boundaries and role attribution. Extractors can place continuation labels before or after the page body. Use the [validation limits](docs/generator.md#validation-limits) when reporting results. Do not upload the resume to third-party services without authorization.

## Dependencies and execution

- Prefer bundled dependencies when available. Resolve their paths with the workspace-dependency tool. Recheck pagination when changing hosts or fonts.
- Use `RESUME_PYTHON` to select the PDF helper interpreter and `RESUME_HEADER_FONT` to select the continuation font.
- Use the dedicated Chromium headless shell with normal execution permission. Do not bypass sandbox restrictions or repeat a known-blocked launch.
- Follow the available PDF skill for PDF authoring and review. Run its artifact-operation marker for PDF creation or edits.

## Private materials

Use synthetic contacts in tests. Keep private PDFs, generated Markdown, previews, extracted text, subprocess logs, and decryption identities out of GitHub. See the [generator guide](docs/generator.md#github-actions) for the public and encrypted release jobs.
