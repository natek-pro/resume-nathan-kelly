"""Compare the source content with text extracted from an exported PDF.

Usage: python3 scripts/check-export.py [source.md] [export.pdf]
Requires pypdf; available in the Codex bundled Python runtime.
"""
from pathlib import Path
import re
import sys
import unicodedata
from pypdf import PdfReader

root = Path(__file__).resolve().parent.parent
source = root / (sys.argv[1] if len(sys.argv) > 1 else 'resume_source.md')
pdf = root / (sys.argv[2] if len(sys.argv) > 2 else 'output/pdf/Nathan-Kelly-Resume.pdf')
markdown = source.read_text()
# Compare visible link labels, not Markdown link destinations.
visible = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', markdown)
reader = PdfReader(pdf)
pages = []
for number, page in enumerate(reader.pages, 1):
    lines = (page.extract_text() or '').splitlines()
    if number > 1:
        # Exclude only exact labels derivable from source headings and role context.
        organization = ''
        candidates = {'Nathan Kelly'}  # Supports the saved pre-consistency baseline.
        source_lines = markdown.splitlines()
        for i, source_line in enumerate(source_lines):
            match = re.match(r'^(#{2,4}) (.+)$', source_line)
            if not match:
                continue
            level = len(match[1])
            label = match[2].rsplit(' — ', 1)[0]
            if level == 2:
                organization = ''
            if level == 3:
                organization = label
            context = next((line for line in source_lines[i + 1:] if line.strip()), '')
            if context.startswith('*') and context.endswith('*') and not context.startswith('**'):
                context = context.strip('*').split(' · ')[0]
            else:
                context = label
            candidates.add(f'{organization} — {context} (continued)' if level == 4 and organization else f'{label} (continued)')
        counter = f'{number} / {len(reader.pages)}'
        for marker in [counter, *candidates, *(f'{label} {counter}' for label in candidates)]:
            matches = [i for i, line in enumerate(lines) if line.strip() == marker]
            if len(matches) > 1:
                sys.exit(f'FAIL: Unexpected repeated running header on page {number}.')
            if matches:
                lines.pop(matches[0])
    pages.append('\n'.join(lines))
extracted = '\n'.join(pages)


def normalized(text):
    return ''.join(c for c in unicodedata.normalize('NFKC', text).casefold() if c.isalnum())


if not pages or any(not page.strip() for page in pages):
    sys.exit('FAIL: PDF contains a blank or non-extractable page.')
if '\ufffd' in extracted:
    sys.exit('FAIL: Extracted text contains replacement characters.')
if normalized(visible) != normalized(extracted):
    sys.exit('FAIL: PDF text differs from the source or is out of reading order.')
print(f'PASS: {len(pages)} pages; all source letters and numbers preserved in order.')
print('This checks content extraction, not layout, punctuation, hyperlinks, or ATS field classification.')
