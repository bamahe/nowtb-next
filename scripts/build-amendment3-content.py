#!/usr/bin/env python3
"""Generate the Amendment 3 page data from the research markdown.

    python3 scripts/build-amendment3-content.py

Reads:   content/amendment-3/*.md
Writes:  src/data/amendment-3-content.ts   (the nine body sections, as HTML)
         src/data/amendment-3-outcomes.ts  (residency checker outcome copy)
         src/data/amendment-3-faqs.ts      (FAQ pairs, feeds FAQPage schema)

WHY THIS EXISTS: the page makes dollar claims to homeowners. Keeping the prose
in markdown under content/ and generating the TS means a correction gets made
once, in one place, and the dash guard below runs on every regeneration.

HARD GUARD: the script exits non-zero if an em dash or en dash reaches
published copy. Barrett does not use them in client facing writing. Do not
remove this check to make a build pass; fix the source markdown.

Why hand-rolled markdown conversion instead of a library: the repo stores guide
bodies as HTML and renders them with dangerouslySetInnerHTML, the markdown here
is a known controlled subset, and the system Python is externally managed and
refuses pip install.

If it breaks, check: a markdown feature we did not implement passes through as
literal text. Search the built page for a stray '*' or '|' and add a rule.
"""
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "content", "amendment-3")
DATA = os.path.join(ROOT, "src", "data")


# ---------------------------------------------------------------------------
# markdown -> html
# ---------------------------------------------------------------------------
def inline(text):
    """Bold, italics, inline code, links. Escape first so source text cannot
    inject tags, then re-introduce only the tags we intend."""
    t = html.escape(text, quote=False)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r'<a href="\2">\1</a>', t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", t)
    return t


def split_row(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def convert(md):
    lines = md.split("\n")
    out, i = [], 0
    while i < len(lines):
        line = lines[i]
        s = line.strip()

        if not s:
            i += 1
            continue

        # table
        if s.startswith("|") and i + 1 < len(lines) and re.match(
            r"^\s*\|[\s:|-]+\|\s*$", lines[i + 1]
        ):
            header = split_row(s)
            i += 2
            body = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                body.append(split_row(lines[i]))
                i += 1
            out.append(
                "<table><thead><tr>"
                + "".join(f"<th>{inline(c)}</th>" for c in header)
                + "</tr></thead><tbody>"
                + "".join(
                    "<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>"
                    for r in body
                )
                + "</tbody></table>"
            )
            continue

        # heading, demoted one level so the page keeps its single H1
        m = re.match(r"^(#{1,6})\s+(.*)$", s)
        if m:
            level = min(len(m.group(1)) + 1, 6)
            out.append(f"<h{level}>{inline(m.group(2))}</h{level}>")
            i += 1
            continue

        if re.match(r"^(-{3,}|\*{3,})$", s):
            out.append("<hr />")
            i += 1
            continue

        if s.startswith(">"):
            q = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                q.append(lines[i].strip().lstrip(">").strip())
                i += 1
            out.append(f'<blockquote><p>{inline(" ".join(q))}</p></blockquote>')
            continue

        if re.match(r"^(\s*)([-*+]|\d+\.)\s+", line):
            tag = "ol" if re.match(r"^\s*\d+\.\s+", line) else "ul"
            items = []
            while i < len(lines) and re.match(r"^(\s*)([-*+]|\d+\.)\s+", lines[i]):
                items.append(re.sub(r"^\s*([-*+]|\d+\.)\s+", "", lines[i]))
                i += 1
            out.append(f"<{tag}>" + "".join(f"<li>{inline(x)}</li>" for x in items) + f"</{tag}>")
            continue

        para = []
        while i < len(lines) and lines[i].strip() and not re.match(
            r"^\s*(#{1,6}\s|[-*+]\s|\d+\.\s|\||>|-{3,}$)", lines[i]
        ):
            para.append(lines[i].strip())
            i += 1
        if para:
            out.append(f'<p>{inline(" ".join(para))}</p>')
        else:
            i += 1  # never spin on an unhandled line

    return "\n".join(out)


def no_dashes(label, text):
    """Barrett does not use em or en dashes in client facing copy."""
    n = text.count("—") + text.count("–")
    if n:
        print(f"DASH VIOLATION: {n} em/en dash(es) in {label}", file=sys.stderr)
        return False
    return True


def write_ts(path, header, name, type_decl, payload, annotation=None):
    """Write a generated TS data module.

    `annotation` matters more than it looks. Without an explicit type on the
    const, TypeScript infers the exact literal shape of the object, and then
    indexing it with a plain `string` variable fails under noImplicitAny:

        Element implicitly has an 'any' type because expression of type
        'string' can't be used to index type '{ out_a_full_now: string; ... }'

    That is exactly how a Vercel build broke once. Annotate anything that gets
    looked up by a runtime key.
    """
    with open(path, "w") as fh:
        fh.write(header)
        if type_decl:
            fh.write(type_decl + "\n\n")
        fh.write(f"export const {name}{': ' + annotation if annotation else ''} = ")
        json.dump(payload, fh, indent=2, ensure_ascii=False)
        fh.write(";\n")


def main():
    ok = True
    banner = (
        "// AUTO-GENERATED by scripts/build-amendment3-content.py. Do not hand edit.\n"
        "// Edit the markdown in content/amendment-3/ and regenerate.\n"
        "// Em and en dashes are rejected at generation time: this copy is published.\n\n"
    )

    # --- body sections ---
    blocks = []
    for f in sorted(x for x in os.listdir(SRC) if re.match(r"section-\d+\.md$", x)):
        raw = open(os.path.join(SRC, f)).read()
        first, _, rest = raw.partition("\n")
        heading = first.lstrip("#").strip()
        body = convert(rest.strip())
        slug = re.sub(r"[^a-z0-9]+", "-", heading.lower()).strip("-")
        ok &= no_dashes(f, body)
        blocks.append({"id": slug, "heading": heading, "html": body})
    write_ts(
        os.path.join(DATA, "amendment-3-content.ts"), banner, "AMD3_BLOCKS",
        "export interface Amd3Block { id: string; heading: string; html: string }",
        blocks, annotation="Amd3Block[]",
    )

    # --- residency checker outcomes ---
    spec = open(os.path.join(SRC, "tool-amendment-3-residency-cutoff-checker.md")).read()
    sec = re.search(r"## 3\. OUTCOME TEXT.*?\n(.*?)\n## 4\.", spec, re.S)
    outcomes = {}
    if sec:
        for part in re.split(r"\n### OUTCOME ", sec.group(1))[1:]:
            head, _, rest = part.partition("\n")
            idm = re.search(r"`([a-z0-9_]+)`", head)
            if not idm:
                continue
            md = rest.strip().replace("—", ", ").replace("–", " to ")
            md = re.sub(r"\s+,\s+", ", ", md)
            h = convert(md)
            ok &= no_dashes(f"outcome {idm.group(1)}", h)
            outcomes[idm.group(1)] = h
    write_ts(
        os.path.join(DATA, "amendment-3-outcomes.ts"), banner, "AMD3_OUTCOMES",
        "export type Amd3OutcomeMap = Record<string, string>;",
        outcomes, annotation="Amd3OutcomeMap",
    )

    # --- FAQs ---
    faq_src = [x for x in os.listdir(SRC) if re.match(r"section-\d+\.md$", x)]
    faqs = []
    for f in sorted(faq_src):
        txt = open(os.path.join(SRC, f)).read()
        if "ask most about" not in txt.lower():
            continue
        for part in re.split(r"\n### ", txt)[1:]:
            q, _, rest = part.partition("\n")
            lines = [l for l in rest.strip().split("\n") if not l.strip().startswith("|")]
            ans = " ".join(l.strip() for l in lines if l.strip())
            ans = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", ans)
            ans = re.sub(r"\*\*([^*]+)\*\*", r"\1", ans)
            ans = re.sub(r"\s{2,}", " ", ans).strip()
            if q.strip() and ans:
                ok &= no_dashes(f"faq {q[:40]}", q + ans)
                faqs.append({"question": q.strip(), "answer": ans})
    write_ts(
        os.path.join(DATA, "amendment-3-faqs.ts"), banner, "AMD3_FAQS",
        "export interface Amd3Faq { question: string; answer: string }",
        faqs, annotation="Amd3Faq[]",
    )

    print(f"sections: {len(blocks)}  outcomes: {len(outcomes)}  faqs: {len(faqs)}")
    if not ok:
        print("FAILED: dash violations above. Fix the source markdown.", file=sys.stderr)
        sys.exit(1)
    print("OK: no em or en dashes in published copy.")


if __name__ == "__main__":
    main()
