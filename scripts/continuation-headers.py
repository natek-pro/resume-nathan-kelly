"""Add continuation labels derived from the PDF's actual heading locations.

Usage: continuation-headers.py body.pdf headings.json output.pdf
The Chromium body, links, outline, and structure tree are retained. Running
headers are marked as pagination artifacts, rather than resume body content.
"""
from io import BytesIO
import json
import os
from pathlib import Path
import sys
import unicodedata

import pdfplumber
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


def normalized(text):
    return ''.join(c for c in unicodedata.normalize('NFKC', text).casefold() if c.isalnum())


def continuation_labels(page_lines, headings):
    """Match headings in source order and identify the context at each page start."""
    current = None
    next_heading = 0
    labels = []
    for page_number, lines in enumerate(page_lines, 1):
        lines = [normalized(line) for line in lines if normalized(line)]
        expected = normalized(headings[next_heading]['text']) if next_heading < len(headings) else None
        starts_with_heading = bool(lines and lines[0] == expected)
        labels.append(current if page_number > 1 and not starts_with_heading else None)
        for line in lines:
            if next_heading < len(headings) and line == normalized(headings[next_heading]['text']):
                current = headings[next_heading]['continuation']
                next_heading += 1
    if next_heading != len(headings):
        raise ValueError(f"Could not locate heading in PDF: {headings[next_heading]['text']}")
    return labels


def main():
    source, headings_file, destination = map(Path, sys.argv[1:])
    headings = json.loads(headings_file.read_text())
    with pdfplumber.open(source) as document:
        page_lines = [(page.extract_text() or '').splitlines() for page in document.pages]
    labels = continuation_labels(page_lines, headings)
    reader = PdfReader(source)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    # Embed the header font for reliable rendering on other machines.
    configured_font = os.environ.get('RESUME_HEADER_FONT')
    font_paths = [Path(configured_font)] if configured_font else [
        Path('/System/Library/Fonts/Supplemental/Arial.ttf'),
        Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'),
        Path('C:/Windows/Fonts/arial.ttf'),
    ]
    font_path = next((font for font in font_paths if font.is_file()), None)
    if not font_path:
        raise ValueError('Set RESUME_HEADER_FONT to a TrueType sans-serif font path.')
    pdfmetrics.registerFont(TTFont('ResumeHeader', str(font_path)))
    for number, (page, label) in enumerate(zip(writer.pages, labels), 1):
        if number == 1:
            continue
        width, height = float(page.mediabox.width), float(page.mediabox.height)
        margin = 0.72 * 72
        counter = f'{number} / {len(writer.pages)}'
        if label and stringWidth(label, 'ResumeHeader', 8) > width - 2 * margin - 48:
            raise ValueError(f'Continuation label is too wide on page {number}: {label}')
        buffer = BytesIO()
        overlay = canvas.Canvas(buffer, pagesize=(width, height))
        overlay.addLiteral('/Artifact <</Type /Pagination /Subtype /Header>> BDC')
        overlay.setFont('ResumeHeader', 8)
        overlay.setFillColorRGB(0.4, 0.4, 0.4)
        if label:
            overlay.drawString(margin, height - 25, label)
        overlay.drawRightString(width - margin, height - 25, counter)
        overlay.addLiteral('EMC')
        overlay.save()
        buffer.seek(0)
        page.merge_page(PdfReader(buffer).pages[0])
        print(f'Page {number}: {label or "starts a new section"}')
    writer.write(destination)


if __name__ == '__main__':
    main()
