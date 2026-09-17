import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localRequire = createRequire(import.meta.url);
// Prefer project dependencies; use Codex's bundled runtime when available.
const bundledRequire = createRequire(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
function dependency(name) {
  try { return localRequire(name); }
  catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    try { return bundledRequire(name); }
    catch { throw new Error(`Missing ${name}. Run npm ci and npm run browser:install.`); }
  }
}
const { marked } = dependency('marked');
const { chromium } = dependency('playwright');
const source = path.resolve(root, process.argv[2] || 'resume_source.md');
const destination = path.resolve(root, process.argv[3] || 'output/pdf/Nathan-Kelly-Resume.pdf');
// A failed export must not truncate the last successful PDF.
const temporary = `${destination}.${process.pid}.tmp`;
const bodyPdf = `${temporary}.body.pdf`;
const headingFile = `${temporary}.headings.json`;
const [markdown, template, styles] = await Promise.all([
  fs.readFile(source, 'utf8'),
  fs.readFile(path.join(root, 'templates/resume.html'), 'utf8'),
  fs.readFile(path.join(root, 'templates/resume.css'), 'utf8'),
]);
const content = marked.parse(markdown);
const html = template.replace('{{styles}}', () => styles).replace('{{content}}', () => content);
await fs.mkdir(path.dirname(destination), { recursive: true });
let browser;
try {
  browser = await chromium.launch({ headless: true });
} catch (error) {
  // Never silently launch the user's installed Chrome application.
  if (error.message.includes("Executable doesn't exist")) {
    console.error('PDF browser is not installed. Run npm run browser:install, then retry.');
    process.exit(1);
  }
  console.error('PDF browser could not start. In a restricted agent environment, use the approved execution permission for this export.');
  throw error;
}
try {
  const page = await browser.newPage();
  // Resume exports never need network resources.
  await page.route('**/*', route => route.abort());
  await page.setContent(html, { waitUntil: 'load' });
  const headings = await page.evaluate(() => {
    const main = document.querySelector('main');
    const header = document.createElement('header');
    header.className = 'masthead';
    while (main.firstElementChild && main.firstElementChild.tagName !== 'H2') header.append(main.firstElementChild);
    main.prepend(header);
    const paragraphs = header.querySelectorAll('p');
    paragraphs[0]?.classList.add('headline');
    paragraphs[1]?.classList.add('contact');
    // Dates and locations occupy their own column; the source separator is not printed.
    for (const heading of main.querySelectorAll('h3, h4')) {
      const value = heading.textContent;
      const split = value.lastIndexOf(' — ');
      if (split < 0) continue;
      const label = document.createElement('span');
      const detail = document.createElement('span');
      label.className = 'entry-label';
      detail.className = 'entry-detail';
      label.textContent = value.slice(0, split);
      detail.textContent = value.slice(split + 3);
      heading.replaceChildren(label, detail);
      heading.classList.add('entry-heading');
    }
    // Describe real document boundaries for continuation labels after pagination.
    let organization = '';
    const headings = [...main.querySelectorAll('h2, h3, h4')].map(heading => {
      const level = Number(heading.tagName.slice(1));
      const label = (heading.querySelector('.entry-label') || heading).textContent;
      const detail = heading.querySelector('.entry-detail')?.textContent || '';
      if (level === 2) organization = '';
      if (level === 3) organization = label;
      const following = heading.nextElementSibling;
      const context = following?.matches('p:has(> em:only-child)') ? following.textContent : '';
      if (context) following.classList.add('entry-context');
      return {
        text: `${label} ${detail}`.trim(),
        level,
        continuation: level === 4 && organization
          ? `${organization} — ${context.split(' · ')[0] || label} (continued)`
          : `${label} (continued)`,
      };
    });
    for (const heading of [...main.querySelectorAll('h2')]) {
      const section = document.createElement('section');
      if (heading.textContent === 'Core Competencies') section.className = 'competencies';
      if (heading.textContent === 'Additional Skills') section.className = 'additional-skills';
      heading.before(section);
      section.append(heading);
      while (section.nextElementSibling && section.nextElementSibling.tagName !== 'H2') section.append(section.nextElementSibling);
    }
    return headings;
  });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: bodyPdf, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
  await fs.writeFile(headingFile, JSON.stringify(headings));
  const bundledPython = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3');
  const python = process.env.RESUME_PYTHON || (await fs.access(bundledPython).then(() => bundledPython, () => 'python3'));
  const result = await promisify(execFile)(python, [path.join(root, 'scripts/continuation-headers.py'), bodyPdf, headingFile, temporary]);
  process.stdout.write(result.stdout);
  await fs.rename(temporary, destination);
  console.log(`PDF exported: ${destination}`);
} finally {
  await Promise.all([temporary, bodyPdf, headingFile].map(file => fs.rm(file, { force: true })));
  await browser.close();
}
