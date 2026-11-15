# Portable master resume

This folder contains the tracked public master resume as [Markdown](Nathan-Kelly-Resume.md) and a [reviewed PDF](Nathan-Kelly-Resume.pdf). Both list the city and LinkedIn profile.

To update these files from a full checkout, edit `resume_source.md` and run `npm run build`. Review the PDF, then commit the pair and `pdf-manifest.json` with the changed inputs. Use `npm run check:portable` to verify the files. See the [generator guide](../docs/generator.md) for the export workflow.

To get the portable files in a sparse working tree:

```sh
git clone --filter=blob:none --sparse https://github.com/natek-pro/resume-nathan-kelly.git
cd resume-nathan-kelly
git sparse-checkout set portable-resumes
```

To use the resume in another repo, copy the Markdown and PDF from this directory. A sparse checkout also includes root-level files.
