import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { extractWorkingResume, workingStart, workingEnd } from '../resume-drafts/working-document.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const source = await fs.readFile(path.join(root, 'resume_source.md'), 'utf8');
const sourceHash = createHash('sha256').update(source).digest('hex');
const brief = await fs.readFile(path.join(root, 'docs/targeting-brief.md'), 'utf8');
const directions = [
  ['applied-ai', 'Applied AI engineering', 'resume-drafts/applied-ai-rough.md', '.private/applied-ai-review.md'],
  ['ai-solutions-deployment-engineering', 'AI solutions and deployment engineering'],
  ['hands-on-engineering-leadership', 'Hands-on engineering leadership'],
  ['computer-vision-ml-data-systems', 'ML data and evaluation, computer vision'],
  ['applied-ml-predictive-modeling', 'Applied ML and predictive modeling'],
];

for (const [slug, title, explicitPublic, explicitPrivate] of directions) {
  const publicFile = explicitPublic || `resume-drafts/targeted/${slug}.md`;
  const privateFile = explicitPrivate || `.private/targeted-resumes/${slug}.md`;
  const heading = `### ${title}\n\n`;
  const start = brief.indexOf(heading);
  if (start < 0) throw new Error(`Missing target direction: ${slug}`);
  const tail = brief.slice(start + heading.length);
  const nextHeading = tail.search(/^##?#[ ]|^## /m);
  const direction = (nextHeading < 0 ? tail : tail.slice(0, nextHeading)).split('\n\n').filter(p => /^\*\*[^\n]+:\*\*/.test(p));
  for (const required of ['Target roles', 'Hiring manager must believe', 'Lead story', 'Guardrails', 'Level and evidence guardrail']) {
    if (!direction.some(p => p.startsWith(`**${required}:**`))) throw new Error(`Missing ${required} in target direction: ${slug}`);
  }
  let publicText;
  for (const relativeFile of [publicFile, privateFile]) {
    const fullPath = path.join(root, relativeFile);
    let previous;
    try { previous = await fs.readFile(fullPath, 'utf8'); }
    catch (error) {
      if (error.code === 'ENOENT' && relativeFile === privateFile) continue;
      throw error;
    }
    const working = extractWorkingResume(previous);
    const link = target => path.relative(path.dirname(fullPath), path.join(root, target)).split(path.sep).join('/');
    const grouped = slug === 'applied-ai' ? 'applied-ai-engineering' : slug;
    const comparisons = slug === 'applied-ai' ? 'resume-drafts/role-description-review.md' : `resume-drafts/targeted/${slug}.notes.md`;
    const document = [
      `# Working document — ${title}`, '',
      '---', '',
      '# Section 1: Target role / direction', '',
      'Read this direction and Section 3 as the primary context before evaluating the working draft.', '',
      ...direction.flatMap(p => [`<span class="proposed">${p}</span>`, '']),
      `[Primary targeting brief](${link('docs/targeting-brief.md')})`, '',
      '---', '',
      '# Section 2: Working resume draft and material', '',
      workingStart, '', working, '', workingEnd, '',
      '### Supporting working material', '',
      'Review colors: red = proposed wording; blue = unchanged bullet flagged for revision; black = retained source wording.', '',
      `- [Grouped selection, rationale, and reserves](${link(`resume-subsets-grouped/${grouped}.md`)})`,
      `- [Role-description comparisons](${link(comparisons)})`,
      `- [Bullet context review](${link('resume-drafts/bullet-context-review.md')})`,
      `- [Positioning and scope comparisons](${link('resume-drafts/positioning-scope-review.md')})`, '',
      ...(working.includes('Multi-Agent Job-Search Workflow') ? [`- [Job-search project evidence and wording review](${link('resume-drafts/job-search-project-review.md')})`, ''] : []),
      '---', '',
      '# Section 3: Original full resume', '',
      `Copied verbatim from [resume_source.md](${link('resume_source.md')}). Source SHA-256: \`${sourceHash}\`. This is reference material; edit the master source rather than this copy.`, '',
      '<!-- BEGIN ORIGINAL FULL RESUME -->', '', source, '', '<!-- END ORIGINAL FULL RESUME -->', '',
    ].join('\n');
    if (extractWorkingResume(document) !== working) throw new Error(`Working text changed: ${slug}`);
    if (check) {
      if (previous !== document) throw new Error(`Working document context is stale: ${slug}`);
    } else {
      await fs.writeFile(fullPath, document);
    }
    if (relativeFile === publicFile) publicText = document;
  }
  if (!explicitPublic) {
    const manifestPath = path.join(root, publicFile.replace(/\.md$/, '.selection.json'));
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    const draftHash = createHash('sha256').update(publicText).digest('hex');
    if (check) {
      if (manifest.publicDraftSha256 !== draftHash) throw new Error(`Draft fingerprint stale: ${slug}`);
    } else {
      manifest.publicDraftSha256 = draftHash;
      manifest.primaryTargetDirection = { title, source: 'docs/targeting-brief.md' };
      manifest.workingDocument = { section1: 'Target role / direction', section2: 'Working resume draft and material', section3: 'Original full resume', originalSourceSha256: sourceHash };
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    }
  }
  console.log(`${check ? 'PASS' : 'Updated'}: ${slug}; three sections, working text preserved.`);
}
