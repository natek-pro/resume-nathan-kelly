import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2];
const sourceMarkdown = 'resume_source.md';
const localPdf = 'output/pdf/Nathan-Kelly-Resume.pdf';
const portableMarkdown = 'portable-resumes/Nathan-Kelly-Resume.md';
const portablePdf = 'portable-resumes/Nathan-Kelly-Resume.pdf';

if (mode && mode !== '--build' && mode !== '--check') {
  throw new Error('Use npm run build, npm run portable, or npm run check:portable.');
}
const bundledPython = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3');
const python = process.env.RESUME_PYTHON || (await fs.access(bundledPython).then(() => bundledPython, () => 'python3'));

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: 'inherit' });
}

function validatePdf(source, pdf) {
  run(python, ['scripts/check-export.py', source, pdf]);
  run(python, ['scripts/check-fonts.py', pdf]);
}

// Stage alongside each destination so replacements are atomic even across mounts.
async function replaceOutputs(files) {
  const staged = [];
  const replaced = [];
  try {
    for (const [relative, content] of files) {
      const output = path.join(root, relative);
      const parent = path.dirname(output);
      await fs.mkdir(parent, { recursive: true });
      const previous = await fs.lstat(output).catch(error => {
        if (error.code !== 'ENOENT') throw error;
      });
      if (previous && !previous.isFile()) throw new Error(`Expected a regular file: ${relative}`);
      const directory = await fs.mkdtemp(path.join(parent, '.resume-build-'));
      const candidate = path.join(directory, 'new');
      const backup = previous && path.join(directory, 'previous');
      staged.push({ output, directory, candidate, backup });
      await fs.writeFile(candidate, content, { mode: previous?.mode });
      if (backup) await fs.copyFile(output, backup);
    }
    for (const file of staged) {
      await fs.rename(file.candidate, file.output);
      replaced.push(file);
    }
  } catch (error) {
    const rollbackErrors = [];
    for (const file of replaced.reverse()) {
      try {
        if (file.backup) await fs.rename(file.backup, file.output);
        else await fs.unlink(file.output);
      } catch (rollbackError) {
        file.keepBackup = true;
        rollbackErrors.push(new Error(`Could not restore ${file.output}. Staged files are in ${file.directory}.`, { cause: rollbackError }));
      }
    }
    if (rollbackErrors.length) throw new AggregateError([error, ...rollbackErrors], 'Public resume update and rollback failed.');
    throw error;
  } finally {
    await Promise.all(staged.filter(file => !file.keepBackup)
      .map(({ directory }) => fs.rm(directory, { recursive: true, force: true })));
  }
}

if (mode === '--check') {
  const [markdown, copiedMarkdown] = await Promise.all(
    [sourceMarkdown, portableMarkdown].map(file => fs.readFile(path.join(root, file))),
  );
  if (!copiedMarkdown.equals(markdown)) throw new Error(`Stale portable resume: ${portableMarkdown}`);

  // CI validates the committed PDF directly. The local output is ignored.
  validatePdf(sourceMarkdown, portablePdf);
  const local = await fs.readFile(path.join(root, localPdf)).catch(error => {
    if (error.code !== 'ENOENT') throw error;
  });
  if (local && !(await fs.readFile(path.join(root, portablePdf))).equals(local)) {
    throw new Error(`PDF copies differ: ${localPdf} and ${portablePdf}`);
  }
  console.log('PASS: portable public Markdown/PDF pair matches the current source and local PDF if present.');
} else {
  // A fixed workspace also prevents simultaneous builds from interleaving writes.
  const work = path.join(root, 'tmp/public-resume-build');
  await fs.mkdir(path.dirname(work), { recursive: true });
  await fs.mkdir(work).catch(error => {
    if (error.code !== 'EEXIST') throw error;
    throw new Error(`Public resume update may already be running. If no build is active, remove ${work} and retry.`);
  });
  try {
    const source = path.join(work, 'resume.md');
    const candidate = path.join(work, 'resume.pdf');
    const markdown = await fs.readFile(path.join(root, sourceMarkdown));
    await fs.writeFile(source, markdown);
    run(process.execPath, ['scripts/check-source.mjs', source]);
    if (mode === '--build') {
      run(process.execPath, ['scripts/export-resume.mjs', source, candidate]);
    } else {
      await fs.copyFile(path.join(root, localPdf), candidate);
    }
    validatePdf(source, candidate);
    if (!(await fs.readFile(path.join(root, sourceMarkdown))).equals(markdown)) {
      throw new Error('The public source changed during the build. Run the command again.');
    }

    const pdf = await fs.readFile(candidate);
    const files = [[portableMarkdown, markdown], [portablePdf, pdf]];
    if (mode === '--build') files.unshift([localPdf, pdf]);
    await replaceOutputs(files);
    console.log(`PASS: refreshed ${files.map(([file]) => file).join(', ')}.`);
  } finally {
    await fs.rm(work, { recursive: true, force: true });
  }
}
