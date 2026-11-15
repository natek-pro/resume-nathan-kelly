import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

export const publicSource = 'resume_source.md';
export const localPdf = 'output/pdf/Nathan-Kelly-Resume.pdf';
export const localManifest = 'output/pdf/pdf-manifest.json';

const renderInputs = [
  publicSource,
  'templates/resume.html',
  'templates/resume.css',
  'scripts/export-resume.mjs',
  'scripts/continuation-headers.py',
  'scripts/public-pdf-provenance.mjs',
  '.nvmrc',
  'package-lock.json',
  'requirements.txt',
];

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

export async function readPrintInputs(root) {
  return Object.fromEntries(await Promise.all(renderInputs.map(async file => [
    file, sha256(await fs.readFile(path.join(root, file))),
  ])));
}

export async function checkPrintInputs(root, expected) {
  if (!isDeepStrictEqual(await readPrintInputs(root), expected)) {
    throw new Error('Public PDF render inputs changed during the build. Run the command again.');
  }
}

export function pdfManifest(inputs, pdf) {
  return { inputs, pdfSha256: sha256(pdf) };
}

export function formatPdfManifest(manifest) {
  return JSON.stringify(manifest, null, 2) + '\n';
}

export function verifyPdfManifest(recorded, expected, location) {
  if (!isDeepStrictEqual(recorded, expected)) {
    throw new Error(`PDF provenance does not match the current print inputs and PDF: ${location}. Run npm run build and review the public PDF.`);
  }
}
