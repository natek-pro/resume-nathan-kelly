import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const label = process.argv[2];
if (!label || !/^[a-z0-9][a-z0-9._-]*$/i.test(label)) {
  throw new Error('Provide a snapshot name: npm run snapshot -- YYYY-MM-DD-description');
}
const destination = path.join(root, 'versions', label);
await fs.mkdir(path.dirname(destination), { recursive: true });
// Existing snapshots are never overwritten.
await fs.mkdir(destination);
const files = ['package.json', 'package-lock.json', 'requirements.txt', 'resume_source.md', 'AGENTS.md', '.gitignore', '.nvmrc'];
async function collect(directory) {
  for (const entry of await fs.readdir(path.join(root, directory), { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === '__pycache__' || /\.py[cod]$/.test(entry.name)) continue;
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(relative);
    else if (entry.isFile()) files.push(relative);
  }
}
await collect('scripts');
await collect('templates');
await collect('docs');
await collect('tests');
await collect('.github');
// A fresh clone may not have any local PDF exports yet.
const exports = await fs.readdir(path.join(root, 'output/pdf'), { withFileTypes: true }).catch(error => {
  if (error.code === 'ENOENT') return [];
  throw error;
});
for (const entry of exports) {
  if (entry.isFile() && entry.name.endsWith('.pdf')) files.push(path.join('output/pdf', entry.name));
}
const sha256 = {};
for (const relative of files.sort()) {
  const bytes = await fs.readFile(path.join(root, relative));
  await fs.mkdir(path.dirname(path.join(destination, relative)), { recursive: true });
  await fs.writeFile(path.join(destination, relative), bytes);
  sha256[relative] = createHash('sha256').update(bytes).digest('hex');
}
await fs.writeFile(path.join(destination, 'manifest.json'), JSON.stringify({
  label, createdAt: new Date().toISOString(), sha256,
}, null, 2) + '\n');
console.log(`Saved ${files.length} files to ${destination}`);
