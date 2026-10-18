#!/bin/bash
# =============================================================================
# Daily page enrichment ANALYSIS for nowtb.com
# =============================================================================
# Scores every city page and writes ENRICHMENT-REPORT.md listing the weakest
# ones (missing FAQs, missing neighborhood descriptions, posts without images).
# Read that report to decide what to enrich next.
#
# WHAT CHANGED AND WHY (Oct 2026)
# -------------------------------
# This script was silently broken and quietly dangerous at the same time.
#
# 1. BROKEN: cron runs with PATH=/usr/bin:/bin:/usr/sbin:/sbin, which contains
#    none of node, npx, vercel, claude or Homebrew python3. Every night the log
#    read "vercel: command not found" and the script then printed
#    "Deploy complete" anyway, so the failure looked like a success and nobody
#    noticed. Fixed by setting PATH explicitly and by never claiming success
#    for a step that did not run.
#
# 2. DANGEROUS: it ran `vercel --prod --yes` from ~/Projects/nowtb-next, which
#    is routinely left on a feature branch with a large pile of uncommitted
#    edits. The CLI deploys LOCAL FILES, so this would have pushed unreviewed
#    work straight to production. At the time of writing that pile included 66
#    files asserting "24+ years of real estate experience" — a claim that is
#    factually false until September 2027. The only reason it never shipped is
#    that `vercel` was not on the cron PATH. Fixing the PATH without removing
#    the deploy would have published those false claims the next morning.
#
#    It also gated the deploy on `git diff --stat` being non-empty, which on a
#    permanently dirty tree is ALWAYS true — so it would have redeployed that
#    same stale tree every single day regardless of what this script did.
#
#    Note that scripts/daily-enrich.py only ever WRITES ENRICHMENT-REPORT.md;
#    it changes no page content. So there was never anything here worth
#    deploying in the first place.
#
#    Deploying is now the job of scripts/weekly-lead-audit.sh, which works from
#    a clean worktree off origin/main, gates on a passing production build, and
#    ships by pushing to main so Vercel deploys from git.
#
# RUN IT BY HAND
# --------------
#     bash ~/Projects/nowtb-next/scripts/daily-enrich.sh
#
# IF IT BREAKS, CHECK THIS
# ------------------------
#   * "command not found"  -> a tool moved; update the PATH line below.
#   * "No such file"       -> daily-enrich.py expects ~/Projects/nowtb-next to
#                             exist (it hardcodes that path internally).
#   * Empty report         -> daily-enrich.py failed; its error is above in the
#                             log. This script now exits non-zero in that case
#                             instead of pretending everything is fine.
# =============================================================================

set -uo pipefail

# The whole reason this automation silently no-op'd for weeks.
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

REPO="$HOME/Projects/nowtb-next"
cd "$REPO" || { echo "FATAL: cannot cd to $REPO"; exit 1; }

echo "$(date): starting daily enrichment analysis"

if ! command -v python3 >/dev/null 2>&1; then
  echo "FATAL: python3 not on PATH — cron PATH problem. See the header of this script."
  exit 1
fi

# --- The analysis itself ------------------------------------------------------
if python3 scripts/daily-enrich.py 2>&1; then
  echo "$(date): enrichment analysis complete"
else
  echo "$(date): FAILED — daily-enrich.py exited non-zero (see error above)"
  exit 1
fi

# --- Optional image backfill -------------------------------------------------
# This used to point at /tmp/download-blog-images.py, which does not exist, so
# it errored every night. /tmp is wiped by macOS anyway, which makes it the
# wrong home for a scheduled script. Run it only if it is actually present.
IMG_SCRIPT="$REPO/scripts/download_blog_images.py"
if [ -f "$IMG_SCRIPT" ]; then
  echo "$(date): backfilling missing blog images"
  python3 -u "$IMG_SCRIPT" 2>&1 | tail -5
else
  echo "$(date): skipping image backfill — $IMG_SCRIPT not present (this is not an error)"
fi

# --- Report, do not deploy ---------------------------------------------------
# Deliberately no deploy step here. See note 2 in the header.
if [ -f ENRICHMENT-REPORT.md ]; then
  echo "$(date): report written to $REPO/ENRICHMENT-REPORT.md"
  echo "--- weakest pages this run ---"
  sed -n '1,25p' ENRICHMENT-REPORT.md
else
  echo "$(date): WARNING — no ENRICHMENT-REPORT.md was produced"
fi

echo "$(date): daily enrichment analysis finished (no deploy — weekly-lead-audit.sh ships changes)"
