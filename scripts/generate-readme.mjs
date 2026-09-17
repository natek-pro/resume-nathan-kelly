import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, '.github/README.md');
const source = await fs.readFile(path.join(root, 'resume_source.md'), 'utf8');
const generated = '<!-- Generated from ../resume_source.md. Do not edit; run npm run readme. -->\n\n' + source;
if (process.argv.includes('--check')) {
  const current = await fs.readFile(target, 'utf8').catch(error => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (current !== generated) {
    console.error('FAIL: .github/README.md is stale. Run npm run readme.');
    process.exitCode = 1;
  } else {
    console.log('PASS: Homepage matches resume_source.md.');
  }
} else {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, generated);
  console.log('Generated .github/README.md from resume_source.md.');
}
