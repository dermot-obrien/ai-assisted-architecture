# SPDX-FileCopyrightText: 2026 Dermot O'Brien
# SPDX-License-Identifier: Apache-2.0
"""The post-install check: exit 0 when the bindings resolve, 1 with one line per problem."""
import os
import subprocess
import sys
import tempfile
import unittest

SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHECK = os.path.join(SKILL, "bin", "check.py")


def run(cwd, *args):
    return subprocess.run([sys.executable, CHECK, *args], cwd=cwd, capture_output=True, text=True,
                          env=dict(os.environ, SKILL_DIR=SKILL))


class CheckTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.ws = self.tmp.name
        os.makedirs(os.path.join(self.ws, ".agents"))

    def tearDown(self):
        self.tmp.cleanup()

    def bind(self, text):
        with open(os.path.join(self.ws, ".agents", "skill-bindings.toml"), "w", encoding="utf-8") as fh:
            fh.write(text)

    def test_bound_directories_that_exist_pass(self):
        os.makedirs(os.path.join(self.ws, "caps"))
        self.bind('[suite.aaa-rung]\ncapabilityDir = "../caps"\n')
        r = run(self.ws)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("aaa-rung: ok", r.stdout)

    def test_a_bound_directory_that_is_missing_is_a_problem(self):
        self.bind('[suite.aaa-rung]\ncapabilityDir = "../caps"\n')
        r = run(self.ws)
        self.assertEqual(r.returncode, 1)
        self.assertIn("capabilityDir", r.stdout)

    def test_no_binding_file_is_a_problem(self):
        r = run(self.ws)
        self.assertEqual(r.returncode, 1)

    def test_an_argument_is_a_usage_error(self):
        self.assertEqual(run(self.ws, "--nope").returncode, 2)


if __name__ == "__main__":
    unittest.main()
