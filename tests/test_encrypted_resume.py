"""Privacy regressions using synthetic contact details, never real secrets."""
import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('encrypted', Path(__file__).resolve().parents[1] / 'scripts/build-encrypted.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PrivateResumeTests(unittest.TestCase):
    def test_only_contact_stanza_changes(self):
        source = 'Phoenix, AZ  \n[linkedin.com/in/natejkelly](https://www.linkedin.com/in/natejkelly/)\n\n## Summary\nBody\n'
        result = module.application_source(source, 'test_user@example.invalid', '+1 (202) 555-0100')
        self.assertEqual(source.split('## Summary')[1], result.split('## Summary')[1])
        self.assertIn('mailto:test_user@example.invalid', result)
        self.assertIn('linkedin.com/in/natejkelly', result)

    def test_invalid_or_missing_inputs_fail_without_echo(self):
        for env in [{}, {'EMAIL': 'injected\n## secret-content'}, {'EMAIL': 'a@example.invalid', 'PHONE_NUMBER': '<script>secret-content</script>'}]:
            with self.assertRaises(ValueError) as failure:
                module.contact_values(env)
            self.assertNotIn('secret-content', str(failure.exception))

    def test_missing_or_ambiguous_anchor_rejected(self):
        for source in ['no anchor', 'Phoenix, AZ  \nPhoenix, AZ  \n']:
            with self.assertRaises(ValueError):
                module.application_source(source, 'a@example.invalid', '202-555-0100')

    def test_subprocess_failure_does_not_echo_output(self):
        with patch.object(module.subprocess, 'run', return_value=subprocess.CompletedProcess([], 1, 'private-data', 'private-data')):
            with self.assertRaises(RuntimeError) as failure:
                module.run_checked('Export', ['irrelevant'], {})
            self.assertNotIn('private-data', str(failure.exception))

    def test_invalid_build_has_no_output(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / 'resume.pdf.age'
            with patch.dict(module.os.environ, {}, clear=True), patch.object(module, 'OUTPUT', target):
                with self.assertRaises(ValueError):
                    module.main()
            self.assertFalse(target.exists())


if __name__ == '__main__':
    unittest.main()
