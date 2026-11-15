import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  publicSource as sourceMarkdown, localPdf, localManifest, readPrintInputs,
  checkPrintInputs, pdfManifest, formatPdfManifest, verifyPdfManifest,
} from './public-pdf-provenance.mjs';
import { createPublicBuildWorkspace, replaceOutputs } from './public-resume-outputs.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2];
const portableMarkdown = 'portable-resumes/Nathan-Kelly-Resume.md';
const portablePdf = 'portable-resumes/Nathan-Kelly-Resume.pdf';
const portableManifest = 'portable-resumes/pdf-manifest.json';

if (mode && mode !== '--build' && mode !== '--check') {
  throw new Error('Use npm run build, npm run portable, or npm run check:portable.');
}
const bundledPython = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3');
const python = process.env.RESUME_PYTHON || (await fs.access(bundledPython).then(() => bundledPython, () => 'python3'));

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: 'inherit' });
}

async function readManifest(file) {
  const data = await fs.readFile(path.join(root, file), 'utf8').catch(error => {
    if (error.code !== 'ENOENT') throw error;
    throw new Error(`Missing PDF provenance: ${file}. Run npm run build and review the public PDF.`);
  });
  return JSON.parse(data);
}

function validatePdf(source, pdf) {
  run(python, ['scripts/check-export.py', source, pdf]);
  run(python, ['scripts/check-fonts.py', pdf]);
}

if (mode === '--check') {
  const [markdown, copiedMarkdown] = await Promise.all(
    [sourceMarkdown, portableMarkdown].map(file => fs.readFile(path.join(root, file))),
  );
  if (!copiedMarkdown.equals(markdown)) throw new Error(`Stale portable resume: ${portableMarkdown}`);

  // CI validates the committed PDF directly. The local output is ignored.
  const pdf = await fs.readFile(path.join(root, portablePdf));
  const inputs = await readPrintInputs(root);
  verifyPdfManifest(await readManifest(portableManifest), pdfManifest(inputs, pdf), portableManifest);
  validatePdf(sourceMarkdown, portablePdf);
  const local = await fs.readFile(path.join(root, localPdf)).catch(error => {
    if (error.code !== 'ENOENT') throw error;
  });
  if (local && !pdf.equals(local)) {
    throw new Error(`PDF copies differ: ${localPdf} and ${portablePdf}`);
  }
  console.log('PASS: portable public Markdown/PDF pair matches the current source and local PDF if present.');
} else {
  const work = await createPublicBuildWorkspace(root);
  try {
    const inputs = await readPrintInputs(root);
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

    await checkPrintInputs(root, inputs);
    const pdf = await fs.readFile(candidate);
    const manifest = pdfManifest(inputs, pdf);
    if (mode !== '--build') {
      const receipt = await fs.access(path.join(root, localManifest)).then(
        () => localManifest,
        error => { if (error.code !== 'ENOENT') throw error; return portableManifest; },
      );
      verifyPdfManifest(await readManifest(receipt), manifest, receipt);
    }
    const provenance = formatPdfManifest(manifest);
    const files = [[portableMarkdown, markdown], [portablePdf, pdf], [portableManifest, provenance]];
    if (mode === '--build') files.unshift([localPdf, pdf], [localManifest, provenance]);
    await replaceOutputs(root, files);
    console.log(`PASS: refreshed ${files.map(([file]) => file).join(', ')}.`);
  } finally {
    await fs.rm(work, { recursive: true, force: true });
  }
}
