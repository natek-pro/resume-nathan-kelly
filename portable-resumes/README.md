# Portable master resume

`Nathan-Kelly-Resume.md` and `Nathan-Kelly-Resume.pdf` are the public master resume in readable Markdown and reviewed PDF form. Agents can read the Markdown directly without this repository's renderer. Both omit private email and phone; the application resume remains available only through the separate encrypted workflow.

These are generated copies. Edit `resume_source.md`, review and promote the exact public PDF to `output/pdf/Nathan-Kelly-Resume.pdf`, then run `npm run portable` and `npm run check:portable`. Never edit the portable copies directly.

To check out this folder without the generator and historical material:

```sh
git clone --filter=blob:none --sparse <resume-nathan-kelly-repository-url> resume-nathan-kelly
cd resume-nathan-kelly
git sparse-checkout set portable-resumes
```

To bring the resume into another repo, copy the two `Nathan-Kelly-Resume` files from this directory. A sparse checkout also retains a few root-level repository files, as Git's cone mode requires.
