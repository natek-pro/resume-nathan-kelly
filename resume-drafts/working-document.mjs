// Working-document context stays outside the application PDF.
export const workingStart = '<!-- BEGIN WORKING RESUME -->';
export const workingEnd = '<!-- END WORKING RESUME -->';

export function extractWorkingResume(markdown) {
  const starts = markdown.split(workingStart);
  const ends = markdown.split(workingEnd);
  if (starts.length === 1 && ends.length === 1) return markdown;
  if (starts.length !== 2 || ends.length !== 2) throw new Error('Expected one complete working-resume region.');
  const start = markdown.indexOf(workingStart) + workingStart.length;
  const end = markdown.indexOf(workingEnd);
  if (end <= start || markdown.slice(start, start + 2) !== '\n\n' || markdown.slice(end - 2, end) !== '\n\n') {
    throw new Error('Malformed working-resume region.');
  }
  return markdown.slice(start + 2, end - 2);
}
