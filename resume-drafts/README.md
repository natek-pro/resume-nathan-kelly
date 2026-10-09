# Applied AI layout experiment

The latest application review PDF is `output/pdf/drafts/applied-ai-project-review.pdf`. Selected Projects now includes a red, three-line personal workflow entry based on Nathan’s supplied evidence. Its [wording review](job-search-project-review.md) separates orchestration from claims of writing framework or integration code. Existing employment bullets and blue flags are unchanged.

Section 1 is complete for this working-draft stage. It specifies search titles, what a hiring manager must believe, the lead story, and level/evidence guardrails, grounded in the full master resume and separately recorded project evidence. Applied AI and FDE guardrails now account for the Selected Projects entry; the FDE travel line reads “travel OK.” Working resume bodies are unchanged in this pass.

Each working Markdown document now has three separated sections: target direction, working resume and supporting material, and the original full resume. The exporters render only the `BEGIN WORKING RESUME` / `END WORKING RESUME` region in section 2. Preserve those markers when editing. Refresh the direction and full-source reference copies with `node scripts/assemble-working-drafts.mjs`; verify them with `node scripts/assemble-working-drafts.mjs --check`. Refreshing preserves the working resume exactly.

Read the [primary targeting brief and full master resume](../docs/targeting-brief.md) before evaluating or editing these drafts. The current selection, summaries, and editorial comparisons are downstream proposals; they do not define the candidate’s background or target role.

The latest [positioning and scope review](positioning-scope-review.md) replaces summary recaps with three-line positioning and removes repeated selected accomplishments from timeline descriptions. The current application PDF is `output/pdf/drafts/applied-ai-scope-review.pdf`; blue bullet flags remain active.

[The bullet context review](bullet-context-review.md) evaluates all 40 selected occurrences across the five drafts. Unchanged bullets that need contextual revision are blue; proposed prose remains red. The marked application PDF is `output/pdf/drafts/applied-ai-context-review.pdf`.

The other four career directions now have [complete targeted review drafts](targeted/README.md), with separate wording, skills, selection provenance, and editorial comparisons. They use `export-targeted-review.mjs`; this Applied AI experiment remains separate.

`applied-ai-rough.md` is a review draft, not the master resume or a publication input. Its eight selected contribution bullets retain the exact Markdown from `resume_source.md`. The timeline repeats no accomplishment bullets: it lists employers, titles, dates, and scope paragraphs. Proposed headline, summary, contribution headings, tailored timeline scope descriptions, and skills are red for editorial review. Original and proposed descriptions and the tradeoffs are recorded in `role-description-review.md`; they are not automatic replacements for every career direction. Undergraduate research is omitted from this draft by user direction. The patent block is copied unchanged beneath RadiusAI.

The draft begins with summary and selected contributions, followed by employment timeline, patent, education, and skills. Two pages remains a possible final format, but is not a constraint during editorial review. Do not shorten existing copy merely to preserve that page count. Recheck pagination after wording or contact changes.

The application review copy is generated locally as `.private/applied-ai-review.md`, with the user-supplied email and phone. The full-resume link is labeled "Expanded résumé" and aligned to the right of Selected Contributions in both drafts. The application copy derives from the public draft; it is not an alternate editing baseline and must not be committed. Its PDF is `output/pdf/drafts/applied-ai-review.pdf`. The public source and public draft contact block remain unchanged.

## Regenerate

From the repository root:

```sh
node resume-drafts/export-applied-ai-rough.mjs
```

Render the local application review copy with:

```sh
node resume-drafts/export-applied-ai-rough.mjs .private/applied-ai-review.md output/pdf/drafts/applied-ai-review.pdf
```

Default output: `output/pdf/drafts/applied-ai-rough.pdf`. Optional source and destination arguments resolve relative to the repository root, as in the original exporter. The usual PDF dependencies and browser execution permissions apply.

`export-applied-ai-rough.mjs` copies `scripts/export-resume.mjs`, reusing the document template, base stylesheet, Playwright rendering, and continuation-header helper. It changes the default paths, loads `applied-ai-rough.css`, and adds a class for timeline spacing. The draft stylesheet corrects an overbroad keep-with-next rule for bold phrases inside bullets and reduces timeline spacing. Font sizes, line height, page size, and margins retain the master settings. The master exporter and stylesheet are unchanged.

## Selection provenance

Source SHA-256: `9199f58526e75d07ec696c144bea6872c3afa5f2f0de3d8ee06dbfdefa426903`

Bullet order: `TPT-FEDS-02`, `TPT-FEDS-03`, `TPT-FEDS-05`, `TPT-FEDS-00`, `TPT-FEDS-04`, `TPT-FEDS-06`, `RAI-DS-04`, `RAI-DS-05`.

IDs are positional. After a source change, check catalog freshness and compare the selected text before updating this draft; it does not automatically follow source changes. Do not edit copied bullets to adjust fit without explicit editorial approval.

The review PDF was checked for visible text preservation, font faces, contact and full-resume links, and visual layout on every page. Review color uses HTML spans, so text comparison removes those formatting tags from a temporary Markdown copy before running `scripts/check-export.py`; the master checker is unchanged. This is a proposed layout and wording draft, not an ATS parser result or an approved final resume.
