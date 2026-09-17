"""Build a private application PDF and export only age ciphertext.

EMAIL and PHONE_NUMBER are read from the environment. AGE_RECIPIENT is a
public age key; its private counterpart must never be present in CI.
Private sources/PDFs and captured subprocess output are never uploaded or logged.
"""
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'dist/encrypted/Nathan-Kelly-Resume.pdf.age'


def contact_values(env):
    email = env.get('EMAIL', '').strip()
    phone = env.get('PHONE_NUMBER', '').strip()
    recipient = env.get('AGE_RECIPIENT', '').strip()
    if not re.fullmatch(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', email):
        raise ValueError('EMAIL is missing or invalid.')
    if not re.fullmatch(r'\+?[0-9 ().-]+', phone) or not 7 <= len(re.sub(r'\D', '', phone)) <= 15:
        raise ValueError('PHONE_NUMBER is missing or invalid.')
    if not re.fullmatch(r'age1[0-9a-z]{58}', recipient):
        raise ValueError('AGE_RECIPIENT must be a native age public key.')
    return email, phone, recipient


def application_source(public, email, phone):
    anchor = 'Phoenix, AZ  \n'
    if public.count(anchor) != 1:
        raise ValueError('Expected exactly one public contact line in resume_source.md.')
    # Escape Markdown label syntax; the mailto destination is separately restricted.
    label = re.sub(r'([\\`*_{}\[\]<>])', r'\\\1', email)
    contact = f'Phoenix, AZ · {phone} · [{label}](mailto:{email})  \n'
    return public.replace(anchor, contact, 1)


def run_checked(label, command, env):
    # Never print subprocess output: error messages can contain private source text.
    result = subprocess.run(command, cwd=ROOT, env=env, capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(f'{label} failed. Private subprocess output was suppressed.')


def main():
    os.umask(0o077)
    email, phone, recipient = contact_values(os.environ)
    if not shutil.which('age'):
        raise ValueError('Install age before building an encrypted resume.')
    env = {key: value for key, value in os.environ.items() if key not in {'EMAIL', 'PHONE_NUMBER'}}
    python = env.get('RESUME_PYTHON', sys.executable)
    env['RESUME_PYTHON'] = python
    run_checked('Public source check', ['node', 'scripts/check-source.mjs'], env)
    source = application_source((ROOT / 'resume_source.md').read_text(), email, phone)
    with tempfile.TemporaryDirectory(prefix='resume-private-', dir=env.get('RUNNER_TEMP')) as folder:
        work = Path(folder)
        md, pdf, encrypted = work / 'source.md', work / 'resume.pdf', work / 'resume.pdf.age'
        md.write_text(source)
        run_checked('Private PDF export', ['node', 'scripts/export-resume.mjs', str(md), str(pdf)], env)
        run_checked('Private content validation', [python, 'scripts/check-export.py', str(md), str(pdf)], env)
        run_checked('Private font validation', [python, 'scripts/check-fonts.py', str(pdf)], env)
        run_checked('Encryption', ['age', '--encrypt', '-r', recipient, '-o', str(encrypted), str(pdf)], env)
        if not encrypted.read_bytes().startswith(b'age-encryption.org/v1\n'):
            raise RuntimeError('Encryption output is not an age file.')
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        # Publish only completed ciphertext, even across filesystem boundaries.
        staged = OUTPUT.with_suffix('.age.tmp')
        try:
            shutil.copyfile(encrypted, staged)
            staged.replace(OUTPUT)
        finally:
            staged.unlink(missing_ok=True)
    print('PASS: Application resume validated and encrypted. Only ciphertext was exported.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, RuntimeError) as error:
        # These are the fixed configuration/stage messages defined above.
        # Captured child-process output and environment values are never included.
        print(f'FAIL: {error}', file=sys.stderr)
        sys.exit(1)
    except OSError:
        print('FAIL: Encrypted build could not access a required file or executable.', file=sys.stderr)
        sys.exit(1)
