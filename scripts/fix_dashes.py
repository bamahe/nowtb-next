#!/usr/bin/env python3
"""Replace em and en dashes in client-facing copy, context-aware.

Barrett does not use em or en dashes. There are ~11,000 across the site.

A blind "replace every dash with a comma" is how a previous sweep broke
statutory building ages, so every substitution here is driven by what sits on
each side of the dash:

  numeric range      1920–1945      -> "1920 to 1945"
  time range         2–4 PM         -> "2 to 4 PM"
  money range        $200k–$300k    -> "$200k to $300k"
  parenthetical      word — word    -> "word, word"
  leading clause     — word         -> ", word"  (or dropped at a line start)
  bullet prefix      "— item"       -> "item"

Run with --dry to see a sample and a count before changing anything.
"""
import json
import os
import re
import sys

EM, EN = "—", "–"

# A dash sitting between two numberish things is a RANGE, never a comma.
NUMBERISH = re.compile(r"""
    (?:\$?\d[\d,.]*\s*(?:k|K|M|%|am|pm|AM|PM|a\.m\.|p\.m\.)?)\s*$
""", re.X)
NUMBERISH_AHEAD = re.compile(r"""
    ^\s*(?:\$?\d[\d,.]*\s*(?:k|K|M|%|am|pm|AM|PM|a\.m\.|p\.m\.)?)
""", re.X)


def fix_text(s):
    """Return (fixed, n_changed) for one string."""
    if EM not in s and EN not in s:
        return s, 0
    out = []
    i = 0
    n = 0
    for m in re.finditer(f"[{EM}{EN}]+", s):
        before = s[i:m.start()]
        out.append(before)
        left = s[:m.start()]
        right = s[m.end():]
        n += 1

        # Range between numbers -> " to "
        if NUMBERISH.search(left) and NUMBERISH_AHEAD.search(right):
            out.append(" to ")
        # Dash at the very start of a string or line -> drop it
        elif not left.strip() or left.rstrip().endswith(("\n", ">")):
            out.append("")
        # Dash immediately before end -> drop
        elif not right.strip():
            out.append("")
        else:
            # Parenthetical / appositive -> comma. Collapse any spaces the
            # dash was carrying so we do not produce " , ".
            out.append(", ")
        i = m.end()
    out.append(s[i:])
    r = "".join(out)
    # Tidy artifacts: " ,", ",,", ", ." and doubled spaces.
    r = re.sub(r"\s+,", ",", r)
    r = re.sub(r",\s*,", ",", r)
    r = re.sub(r",\s*([.!?])", r"\1", r)
    r = re.sub(r"[ \t]{2,}", " ", r)
    return r, n


def walk_json(o, counter):
    if isinstance(o, str):
        f, n = fix_text(o)
        counter[0] += n
        return f
    if isinstance(o, list):
        return [walk_json(x, counter) for x in o]
    if isinstance(o, dict):
        return {k: walk_json(v, counter) for k, v in o.items()}
    return o


def main():
    dry = "--dry" in sys.argv
    targets = [a for a in sys.argv[1:] if not a.startswith("--")]
    grand = 0
    samples = []

    for path in targets:
        if not os.path.exists(path):
            print(f"  skip (missing): {path}")
            continue
        raw = open(path, encoding="utf-8").read()
        if EM not in raw and EN not in raw:
            continue

        if path.endswith(".json"):
            data = json.loads(raw)
            c = [0]
            fixed = walk_json(data, c)
            new = json.dumps(fixed, ensure_ascii=False, indent=2) + "\n"
            cnt = c[0]
        else:
            new, cnt = fix_text(raw)

        # Collect a few before/after samples for eyeballing.
        for m in list(re.finditer(f"[^{EM}{EN}]{{0,55}}[{EM}{EN}][^{EM}{EN}]{{0,55}}", raw))[:3]:
            frag = m.group(0).replace("\n", " ")
            samples.append((os.path.basename(path), frag, fix_text(frag)[0]))

        grand += cnt
        print(f"  {os.path.basename(path):34} {cnt:6} dashes")
        if not dry:
            open(path, "w", encoding="utf-8").write(new)

    print(f"\n  TOTAL: {grand} dashes{' (dry run, nothing written)' if dry else ' replaced'}")
    if samples:
        print("\n  samples:")
        for f, b, a in samples[:12]:
            print(f"    [{f}]")
            print(f"      before: ...{b.strip()}...")
            print(f"      after:  ...{a.strip()}...")


if __name__ == "__main__":
    main()
