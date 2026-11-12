import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const sourceMarkdown = 'resume_source.md';
const reviewedPdf = 'output/pdf/Nathan-Kelly-Resume.pdf';
const portableMarkdown = 'portable-resumes/Nathan-Kelly-Resume.md';
const portablePdf = 'portable-resumes/Nathan-Kelly-Resume.pdf';

const markdown = await fs.readFile(path.join(root, sourceMarkdown));
if (check) {
  const copiedMarkdown = await fs.readFile(path.join(root, portableMarkdown));
  if (!copiedMarkdown.equals(markdown)) throw new Error(`Stale portable resume: ${portableMarkdown}`);

  // The reviewed output/ PDF is local and ignored. CI validates the committed PDF directly.
  const pdfPath = path.join(root, portablePdf);
  await fs.access(pdfPath);
  const python = process.env.RESUME_PYTHON || 'python3';
  execFileSync(python, ['scripts/check-export.py', sourceMarkdown, portablePdf], { cwd: root, stdio: 'inherit' });
  execFileSync(python, ['scripts/check-fonts.py', portablePdf], { cwd: root, stdio: 'inherit' });

  // When the reviewed local PDF exists, also require exact copy parity.
  try {
    const localPdf = await fs.readFile(path.join(root, reviewedPdf));
    const copiedPdf = await fs.readFile(pdfPath);
    if (!copiedPdf.equals(localPdf)) throw new Error(`Stale portable resume: ${portablePdf}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
} else {
  const pdf = await fs.readFile(path.join(root, reviewedPdf));
  await fs.mkdir(path.join(root, 'portable-resumes'), { recursive: true });
  await fs.writeFile(path.join(root, portableMarkdown), markdown);
  await fs.writeFile(path.join(root, portablePdf), pdf);
}

console.log(`PASS: portable public Markdown/PDF pair ${check ? 'validated' : 'updated from'} current source and reviewed PDF.`);
