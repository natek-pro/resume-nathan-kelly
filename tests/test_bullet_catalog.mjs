import test from 'node:test';
import assert from 'node:assert/strict';
import { collectBullets, fingerprint, renderCatalog } from '../scripts/generate-bullet-catalog.mjs';

const first = 'Built **a system** with qualified results.';
const second = 'Led a team.';
const tags = ['leadership', 'delivery', 'systems'];
const config = () => ({
  tags: {
    leadership: { kind: 'target', description: 'Leadership roles.' },
    delivery: { kind: 'capability', description: 'Delivery.' },
    systems: { kind: 'capability', description: 'Systems.' },
    research: { kind: 'target', description: 'Research roles.' },
  },
  roles: [{
    organization: 'Example', role: 'Engineer', code: 'EX-ENG', defaultTags: tags,
    bullets: { [fingerprint(first)]: tags, [fingerprint(second)]: ['research', 'delivery', 'systems'] },
  }],
});
const source = bullets => `# Person\n\n## Professional Experience\n\n### Example — City\n\n#### Engineer — 2020–2021\n\n*Lab context*\n\n${bullets.map(text => `- ${text}`).join('\n')}\n\n## Education\n\n- A degree\n`;

test('copies exact bullet Markdown, context, and role-relative zero-based identifiers', () => {
  const groups = collectBullets(source([first, second]), config());
  assert.equal(groups.length, 1);
  assert.equal(groups[0].context, '*Lab context*');
  assert.deepEqual(groups[0].bullets.map(({ id, text, reviewed }) => ({ id, text, reviewed })), [
    { id: 'EX-ENG-00', text: first, reviewed: true },
    { id: 'EX-ENG-01', text: second, reviewed: true },
  ]);
});

test('reviewed tags follow content when bullets are reordered, while indexes change', () => {
  const [group] = collectBullets(source([second, first]), config());
  assert.deepEqual(group.bullets[0].tags, ['research', 'delivery', 'systems']);
  assert.deepEqual(group.bullets[1].tags, tags);
  assert.equal(group.bullets[1].id, 'EX-ENG-01');
});

test('changed/new text never inherits reviewed tags from a former index', () => {
  const modified = first.replace('qualified', 'different');
  const { content, pending } = renderCatalog(source([modified, second, 'New evidence.']), config());
  assert.deepEqual(pending.map(bullet => bullet.id), ['EX-ENG-00', 'EX-ENG-02']);
  assert.ok(content.includes(modified));
  assert.ok(content.includes('pending — role defaults only'));
});

test('multiline bullet text is kept as one entry; subsequent list blocks share the role index', () => {
  const markdown = source(['First line\n  continuation **text**.', second]).replace(`- ${second}`, `\nA supporting paragraph.\n\n- ${second}`);
  const [group] = collectBullets(markdown, config());
  assert.equal(group.bullets.length, 2);
  assert.equal(group.bullets[0].text, 'First line\ncontinuation **text**.');
  assert.equal(group.bullets[1].id, 'EX-ENG-01');
});

test('new roles, nested lists, and invalid tags fail rather than silently omit/mislabel evidence', () => {
  assert.throws(() => collectBullets(source([first]).replace('#### Engineer', '#### Scientist'), config()), /Register organization\/role/);
  assert.throws(() => collectBullets(source(['Parent\n  - Child']), config()), /nested bullets/);
  const invalid = config();
  invalid.roles[0].bullets[fingerprint(first)] = ['unknown', 'delivery', 'systems'];
  assert.throws(() => collectBullets(source([first]), invalid), /registered tags/);
});

test('indexes reset at each role and education bullets stay outside the catalog', () => {
  const settings = config();
  settings.roles.push({ ...settings.roles[0], code: 'EX-RA', role: 'Research Assistant' });
  const markdown = source([first, second]).replace('## Education', `#### Research Assistant — 2019\n\n- ${second}\n\n## Education`);
  const groups = collectBullets(markdown, settings);
  assert.deepEqual(groups.map(group => group.bullets.map(bullet => bullet.id)), [
    ['EX-ENG-00', 'EX-ENG-01'], ['EX-RA-00'],
  ]);
});
