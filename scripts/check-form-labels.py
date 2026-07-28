#!/usr/bin/env python3
"""Find form controls with no accessible name.

Written after three false-positive rounds. The naive regex version failed on:
  - `>` inside arrow handlers: onChange={(e) => f(e)} truncated the attribute
    capture, hiding any aria-label that came after it
  - tags mentioned inside // and /* */ comments
  - <input> wrapped in a <label> further than a fixed lookback window
So: strip comments, then walk the tag tracking brace/quote depth.
"""
import re
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "src"
TAGS = ("input", "textarea", "select")


def strip_comments(s: str) -> str:
    """Blank out // and /* */ comments, preserving offsets and newlines."""
    out, i, n = [], 0, len(s)
    while i < n:
        two = s[i:i + 2]
        if two == "//":
            j = s.find("\n", i)
            j = n if j < 0 else j
            out.append(" " * (j - i)); i = j
        elif two == "/*":
            j = s.find("*/", i + 2)
            j = n if j < 0 else j + 2
            out.append("".join(c if c == "\n" else " " for c in s[i:j])); i = j
        else:
            out.append(s[i]); i += 1
    return "".join(out)


def tag_end(s: str, start: int) -> int:
    """Offset just past the `>` closing the tag opened at `start`."""
    i, depth, quote = start, 0, None
    while i < len(s):
        c = s[i]
        if quote:
            if c == quote:
                quote = None
        elif c in "\"'":
            quote = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        elif c == ">" and depth == 0:
            return i + 1
        i += 1
    return len(s)


def audit():
    problems = []
    for path in sorted(SRC.rglob("*")):
        if path.suffix not in {".tsx", ".astro", ".mdx"} or not path.is_file():
            continue
        if "/simulators/" in str(path):
            continue  # moving to the standalone sandstr project
        raw = path.read_text(encoding="utf-8", errors="ignore")
        code = strip_comments(raw)

        for m in re.finditer(r"<(" + "|".join(TAGS) + r")\b", code):
            attrs = code[m.start():tag_end(code, m.start())]

            if "aria-label" in attrs:          # covers aria-label + aria-labelledby
                continue
            if re.search(r'\btype=["\']?(hidden|submit|button|reset)\b', attrs):
                continue

            # wrapped in a <label>?
            depth = 0
            for lm in re.finditer(r"<label\b|</label>", code[:m.start()]):
                depth += 1 if lm.group(0).startswith("<label") else -1
            if depth > 0:
                continue

            # id associated with a label's htmlFor / for?
            idm = re.search(r'\bid=(?:\{)?["\']?([\w-]+)["\']?(?:\})?', attrs)
            if idm:
                ident = re.escape(idm.group(1))
                if re.search(r'(?:htmlFor|for)=\{?["\']?' + ident, code):
                    continue
            idexpr = re.search(r"\bid=\{(\w+)\}", attrs)
            if idexpr and re.search(r"htmlFor=\{" + re.escape(idexpr.group(1)) + r"\}", code):
                continue

            problems.append((str(path.relative_to(SRC.parent)),
                             code[:m.start()].count("\n") + 1,
                             m.group(1)))
    return problems


if __name__ == "__main__":
    probs = audit()
    print(f"controls with no accessible name: {len(probs)}")
    for f, line, tag in probs:
        print(f"  {f}:{line}  <{tag}>")
    sys.exit(1 if probs else 0)
