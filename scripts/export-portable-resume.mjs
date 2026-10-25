import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const files = [
  ['resume_source.md', 'portable-resumes/Nathan-Kelly-Resume.md'],
  ['output/pdf/Nathan-Kelly-Resume.pdf', 'portable-resumes/Nathan-Kelly-Resume.pdf'],
];

for (const [source, output] of files) {
  const expected = await fs.readFile(path.join(root, source));
  const destination = path.join(root, output);
  if (check) {
    const actual = await fs.readFile(destination);
    if (!actual.equals(expected)) throw new Error(`Stale portable resume: ${output}`);
  } else {
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, expected);
  }
}

console.log(`PASS: portable public Markdown/PDF pair ${check ? 'matches' : 'updated from'} current source and reviewed PDF.`);
