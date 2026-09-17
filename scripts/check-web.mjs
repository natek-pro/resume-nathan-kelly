import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { dependency, generateWeb } from './generate-web.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = dependency('playwright');
const { marked } = dependency('marked');
const html = await fs.readFile(path.join(root, 'output/web/resume/index.html'), 'utf8');
assert.equal(html, await generateWeb(), 'Web output is stale');
const source = await fs.readFile(path.join(root, 'resume_source.md'), 'utf8');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.route('**/*', route => route.abort());
  await page.setContent(marked.parse(source));
  const reference = await page.evaluate(() => ({
    text: document.body.textContent.replace(/\s+/g, ' ').trim(),
    bold: [...document.querySelectorAll('strong')].map(e => e.textContent),
    links: [...document.querySelectorAll('a')].map(e => e.getAttribute('href')),
  }));
  await page.setContent(html);
  const result = await page.evaluate(() => ({
    text: document.querySelector('main').textContent.replace(/\s+/g, ' ').trim(),
    bold: [...document.querySelectorAll('main strong')].map(e => e.textContent),
    links: [...document.querySelectorAll('main a')].map(e => e.getAttribute('href')),
  }));
  assert.deepEqual(result, reference, 'Resume text, bolding, or links differ from source');
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('script').count(), 0);
  assert.ok(await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(a.hash.slice(1)))));
  await fs.mkdir(path.join(root, 'tmp/web-review'), { recursive: true });
  for (const width of [1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
    await page.screenshot({ path: path.join(root, `tmp/web-review/${width}.png`), fullPage: true });
  }
  console.log('PASS: exact source text, bolding, links, anchors, no scripts, and no overflow at 1280/768/390/320px.');
} finally { await browser.close(); }
