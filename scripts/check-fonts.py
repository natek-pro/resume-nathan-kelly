"""Reject font substitutions relative to the reviewed Georgia/Arial design.

Checks fonts actually used by PDF characters, not just declared resources.
Does not certify layout, exact font versions, embedding, or ATS compatibility.
"""
import argparse
import json
from pathlib import Path
import re
import sys

import pdfplumber

EXPECTED = {'Georgia', 'Georgia-Bold', 'Georgia-Italic', 'ArialMT', 'Arial-BoldMT'}


def inspect_fonts(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        pages = [sorted({re.sub(r'^[A-Z]{6}\+', '', c['fontname'])
                         for c in page.chars if c['text'].strip()}) for page in pdf.pages]
    actual = set().union(*map(set, pages))
    unexpected = sorted(actual - EXPECTED)
    missing = sorted(EXPECTED - actual)
    return {
        'passed': not unexpected and not missing,
        'pages': len(pages),
        'fonts_by_page': pages,
        'expected_fonts': sorted(EXPECTED),
        'unexpected_fonts': unexpected,
        'missing_fonts': missing,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('pdf', nargs='?', default='output/pdf/drafts/resume.pdf')
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    report = inspect_fonts(args.pdf)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(('PASS' if report['passed'] else 'FAIL') + ': Reviewed Georgia/Arial font check')
    for page, fonts in enumerate(report['fonts_by_page'], 1):
        print(f'Page {page}: {", ".join(fonts)}')
    if report['unexpected_fonts']:
        print('Unexpected fonts: ' + ', '.join(report['unexpected_fonts']))
    if report['missing_fonts']:
        print('Missing expected fonts: ' + ', '.join(report['missing_fonts']))
    if report['pages'] != 4:
        print(f'REVIEW: {report["pages"]} pages; the reviewed baseline has 4. Page count is not a failure by itself.')
    if not report['passed']:
        print('Use an environment with the reviewed fonts. Do not accept substitutions silently.')
    return 0 if report['passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
