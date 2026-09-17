import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(root, process.argv[2] || 'resume_source.md');
const markdown = await fs.readFile(source, 'utf8');
const errors = [];
const required = ['Summary', 'Core Competencies', 'Professional Experience', 'Education', 'Additional Skills'];
const sections = [];
let names = 0;
let organization = false;
let previousLevel = 0;
for (const [index, line] of markdown.split('\n').entries()) {
  const fail = message => errors.push(`Line ${index + 1}: ${message}`);
  if (/^(<{7}|={7}|>{7})(\s|$)/.test(line)) fail('Unresolved merge conflict.');
  if (/\b(TODO|FIXME|TBD)\b|\{\{[^}]+\}\}/.test(line)) fail('Unresolved placeholder.');
  const heading = /^(#{1,6})\s+(.+)$/.exec(line);
  if (!heading) continue;
  const level = heading[1].length;
  if (level > 4) fail('Only heading levels 1–4 are supported.');
  if (level > previousLevel + 1) fail('Heading skips a level.');
  if (level === 1) names += 1;
  if (level === 2) {
    sections.push(heading[2]);
    organization = false;
  }
  if (level === 3) organization = true;
  if (level === 4 && !organization) fail('Role has no preceding organization in this section.');
  // Dates are optional: Undergraduate Research intentionally has none.
  if (level >= 3 && heading[2].includes(' — ')) {
    const split = heading[2].lastIndexOf(' — ');
    if (!heading[2].slice(0, split).trim() || !heading[2].slice(split + 3).trim()) {
      fail('Heading has an empty label or right-hand field.');
    }
  }
  previousLevel = level;
}
if (names !== 1 || !markdown.startsWith('# ')) errors.push('Start with exactly one level-1 name heading.');
for (const section of required) {
  if (sections.filter(value => value === section).length !== 1) errors.push(`Expected exactly one ${section} section.`);
}
const contact = markdown.split(/^## /m)[0];
if (/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(markdown)) errors.push('Public source must not contain an email address.');
if (/(?:\+?1[ .-]?)?\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b/.test(markdown)) errors.push('Public source must not contain a phone number.');
if (!contact.includes('[linkedin.com/in/natejkelly](https://www.linkedin.com/in/natejkelly/)')) errors.push('Contact block must display the LinkedIn URL.');
for (const link of markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
  try {
    const url = new URL(link[1]);
    if (!['https:', 'mailto:', 'tel:'].includes(url.protocol)) throw new Error();
  } catch {
    errors.push(`Unsupported or invalid link target: ${link[1]}`);
  }
}
if (errors.length) {
  console.error(errors.map(error => `FAIL: ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('PASS: Source structure, contact presence, and recognized link targets.');
  console.log('This is a structural lint check, not verification of claims or complete Markdown validation.');
}
