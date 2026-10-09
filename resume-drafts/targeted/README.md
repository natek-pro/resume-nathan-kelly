# Targeted resume review drafts

The FDE application review PDF is now `output/pdf/drafts/ai-solutions-deployment-engineering-project-review.pdf`, with a red personal-project entry for multi-agent job-search orchestration. [Evidence and wording review](../job-search-project-review.md). The same entry appears in Applied AI; the other versions are unchanged.

Section 1 is complete for this working-draft stage. It defines target titles, the hiring case, the lead story, and evidence/level guardrails. The FDE travel line reads “travel OK”; Applied AI and FDE guardrails account for the Selected Projects entry. The fourth direction is **ML Data & Evaluation, Computer Vision**; the filename remains unchanged for continuity. Predictive modeling is **conditional only**, with no standing headline or separate queue. Its existing material is a starting point for a worthwhile industrial/time-series posting. Earlier predictive PDFs are historical review passes, not an active general-purpose application resume. Working resume bodies remain unchanged during this brief revision.

Every working Markdown file has three clearly labeled sections: target role/direction; working resume and supporting material; original full resume. Public and local application copies use the same structure. The exporters render only the marked working-resume region in section 2. Run `node scripts/assemble-working-drafts.mjs` to refresh reference context, or add `--check` to verify freshness; neither operation rewrites working prose. Extract section 2 before validating selected bullets or comparing resume text with PDF output.

Read the [primary targeting brief and full master resume](../../docs/targeting-brief.md) first. Evaluate fit and level from the target direction and complete career evidence before consulting these selections or draft wording.

The latest [positioning and scope review](../positioning-scope-review.md) records before/proposed comparisons for the concise summaries and scope-only descriptions. Current application PDFs use `<direction>-scope-review.pdf`. All summaries render in three lines with no numbers. Computer vision and predictive ML currently span two pages; FDE and leadership span three. These counts are review results, not constraints. Earlier review passes remain available, and all blue bullet flags are preserved.

[The bullet context review](../bullet-context-review.md) records a decision for every selected occurrence across all five drafts. Blue means the unchanged bullet needs revision in its current context; red remains proposed prose. Current marked application PDFs use `<direction>-context-review.pdf`; earlier `<direction>-review.pdf` files remain available as the prior review pass. No source wording was changed during the color review.

These four complete drafts extend the Applied AI layout experiment to the other career directions. They are proposals for review, not replacements for `resume_source.md` or publication inputs. Each has its own headline, summary, contribution groups, employment scope descriptions, and Additional Skills emphasis.

| Direction | Editable public draft | Editorial comparison | Emphasis |
| --- | --- | --- | --- |
| AI solutions and deployment | [Markdown](ai-solutions-deployment-engineering.md) | [Notes](ai-solutions-deployment-engineering.notes.md) | Domain requirements, LLM integrations, production stabilization, customer demonstrations, and retail-system integration |
| Hands-on engineering leadership | [Markdown](hands-on-engineering-leadership.md) | [Notes](hands-on-engineering-leadership.notes.md) | Hiring, team development, delivery improvement, direct AI implementation, and production ownership |
| Computer vision and ML data systems | [Markdown](computer-vision-ml-data-systems.md) | [Notes](computer-vision-ml-data-systems.notes.md) | Imaging, recognition classes, capture pipelines, ground truth, retail events, and robot perception |
| Applied ML and predictive modeling | [Markdown](applied-ml-predictive-modeling.md) | [Notes](applied-ml-predictive-modeling.notes.md) | Forecasting, sensor diagnostics, tools for domain engineers, training-data reliability, and clinical assessment logic |

Generated wording appears in red through `proposed` spans. Black text retains existing source wording. Each draft copies eight bullets exactly, including their original bolding. Role changes within contribution groups have explicit attribution. The employment timeline uses titles, dates, context, and scope paragraphs without repeating accomplishment bullets. All drafts retain the source patent block and education; undergraduate research is omitted by the user's earlier direction.

The comparison notes show original and proposed role descriptions, explain the editorial tradeoffs, and document skills evidence. Useful source wording omitted from the scope paragraphs is also preserved under ignored `reference/resume-drafts/targeted/`. Each `.selection.json` records the master source hash, draft hash, bullet identifiers and fingerprints, grouping, and editorial decisions. These drafts do not automatically follow future source changes: check catalog freshness and exact bullet text before reuse.

The reviewed application copies are local-only under `.private/targeted-resumes/`, with the previously supplied email and phone. Public drafts retain the public contact stanza. PDFs are local-only under `output/pdf/drafts/` with filenames `<direction>-review.pdf`. The existing Applied AI draft is unchanged by this work.

## Render and review

Run from the repository root, substituting a direction slug from the table:

```sh
node resume-drafts/export-targeted-review.mjs resume-drafts/targeted/<direction>.md output/pdf/drafts/<direction>-public-review.pdf
node resume-drafts/export-targeted-review.mjs .private/targeted-resumes/<direction>.md output/pdf/drafts/<direction>-review.pdf
```

The renderer copies the Applied AI exporter and reuses the master template, base typography, network-blocked Playwright rendering, and actual-pagination continuation headers. It loads `targeted-review.css`, tightens timeline spacing, corrects the bold-phrase keep-with-next rule, and keeps Education together. The timeline follows contributions naturally; no fixed page break forces a mostly empty overflow page.

All four application drafts currently render to three pages. Two pages is not an editorial constraint. Every page was inspected for clipping, split bullets, orphan headings, date alignment, and red proposal text. Visible-text preservation, font faces, dates, patent, degrees, and email/phone/LinkedIn/Expanded résumé links passed checks. Review spans are removed from a temporary Markdown copy for the existing text checker; the master checker remains unchanged. No live ATS parser was tested.

Proposed wording remains subject to editorial approval. Do not promote these drafts to the canonical PDF or change source bullets simply to improve fit.
