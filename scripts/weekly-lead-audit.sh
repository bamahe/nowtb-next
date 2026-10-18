#!/bin/bash
# =============================================================================
# nowtb.com WEEKLY LEAD AUDIT + AUTO-FIX
# =============================================================================
#
# Runs once a week. Three phases:
#   1. AUDIT  — scripts/weekly_audit.py finds everything costing leads (offline,
#               deterministic, free).
#   2. FIX    — a headless Claude pass fixes the top findings and writes one
#               genuinely useful new article, then typechecks and builds.
#   3. SHIP   — commits and pushes to main, which triggers the Vercel deploy.
#
# WHY IT WORKS IN ITS OWN WORKTREE
# --------------------------------
# ~/Projects/nowtb-next is routinely left on a feature branch with a large pile
# of uncommitted edits. Deploying from there would push unreviewed work — at one
# point including a factually false "24+ years" experience claim across 66
# files — straight to production. So this script works from a DEDICATED clean
# worktree checked out from origin/main, and never touches Barrett's tree.
#
# WHY THE PATH LINE MATTERS
# -------------------------
# cron runs with PATH=/usr/bin:/bin:/usr/sbin:/sbin. None of node, npx, vercel,
# claude or Homebrew python3 are on it. The previous daily automation failed
# every single night for exactly this reason — the log just said
# "vercel: command not found" and the script reported success anyway. Hence the
# explicit PATH below and the `require` checks.
#
# RUN IT BY HAND
# --------------
#     bash ~/Projects/nowtb-next/scripts/weekly-lead-audit.sh
#     AUDIT_ONLY=1 bash .../weekly-lead-audit.sh   # phase 1 only, no changes
#     DRY_RUN=1    bash .../weekly-lead-audit.sh   # fix + build, never push
#
# IF IT BREAKS, CHECK THIS
# ------------------------
#   * "command not found" in the log  -> a tool moved. Update PATH below.
#   * "build failed"                  -> nothing is pushed, by design. Read the
#                                        tail of the log for the tsc/next error.
#   * "nothing to commit"             -> the fix pass found nothing to change.
#                                        That is a success, not a failure.
#   * merge conflict on posts-export.json -> the content automation moved main.
#                                        Take --theirs on that file; it owns it.
# =============================================================================

set -uo pipefail

# --- Explicit PATH. The whole reason the old automation silently no-op'd. -----
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

MAIN_REPO="$HOME/Projects/nowtb-next"
WORKTREE="$HOME/Projects/nowtb-weekly-audit"
BRANCH="automation/weekly-audit"
LOG_DIR="$HOME/.barrett-ops/nowtb-audit"
LOG="$LOG_DIR/weekly-audit-$(date +%Y-%m-%d).log"
REPORT_ARCHIVE="$LOG_DIR/reports"

mkdir -p "$LOG_DIR" "$REPORT_ARCHIVE"

# Everything from here on is logged to file AND stdout.
exec > >(tee -a "$LOG") 2>&1

say() { echo ""; echo "=== $(date '+%Y-%m-%d %H:%M:%S')  $* ==="; }
die() { echo "FATAL: $*"; exit 1; }

require() {
  command -v "$1" >/dev/null 2>&1 || die "'$1' not on PATH. cron PATH problem — see the header of this script."
}

say "nowtb.com weekly lead audit starting"
for t in git python3 node npx; do require "$t"; done
echo "node   $(node -v)"
echo "python $(python3 --version)"

# -----------------------------------------------------------------------------
# PHASE 0 — refresh a clean worktree off origin/main
# -----------------------------------------------------------------------------
say "PHASE 0  preparing clean worktree"

cd "$MAIN_REPO" || die "cannot cd to $MAIN_REPO"
git fetch origin --quiet || die "git fetch failed"

if [ ! -d "$WORKTREE" ]; then
  echo "creating worktree $WORKTREE on $BRANCH"
  git worktree prune
  git worktree add -B "$BRANCH" "$WORKTREE" origin/main || die "worktree add failed"
else
  echo "reusing worktree $WORKTREE"
fi

cd "$WORKTREE" || die "cannot cd to $WORKTREE"

# Hard-reset the automation branch to current main. Any leftovers from last
# week were either merged already or deliberately abandoned; either way we
# always start the week from exactly what is live.
git reset --hard origin/main --quiet || die "reset failed"
git clean -fd --quiet

# node_modules is gitignored, so a fresh worktree has none. Symlink the main
# checkout's instead of a 3-minute install. Safe because package.json is
# identical — we just reset to the same commit it came from.
if [ ! -e node_modules ]; then
  if diff -q "$MAIN_REPO/package.json" package.json >/dev/null 2>&1; then
    ln -s "$MAIN_REPO/node_modules" node_modules
    echo "symlinked node_modules from main checkout"
  else
    echo "package.json differs from main checkout — installing fresh"
    npm ci || die "npm ci failed"
  fi
fi

echo "worktree is at $(git rev-parse --short HEAD) ($(git log -1 --format=%s | cut -c1-60))"

# -----------------------------------------------------------------------------
# PHASE 1 — the audit
# -----------------------------------------------------------------------------
say "PHASE 1  running deterministic audit"

python3 scripts/weekly_audit.py || die "audit script failed"

# Keep every week's report so trends are visible over time.
cp WEEKLY-AUDIT.md   "$REPORT_ARCHIVE/WEEKLY-AUDIT-$(date +%Y-%m-%d).md"   2>/dev/null
cp weekly-audit.json "$REPORT_ARCHIVE/weekly-audit-$(date +%Y-%m-%d).json" 2>/dev/null

CRITICAL=$(python3 -c "import json;print(json.load(open('weekly-audit.json'))['severity_counts'].get('critical',0))" 2>/dev/null || echo 0)
HIGH=$(python3     -c "import json;print(json.load(open('weekly-audit.json'))['severity_counts'].get('high',0))"     2>/dev/null || echo 0)
echo "audit result: $CRITICAL critical, $HIGH high"

if [ "${AUDIT_ONLY:-0}" = "1" ]; then
  say "AUDIT_ONLY set — stopping before any changes"
  echo "report: $WORKTREE/WEEKLY-AUDIT.md"
  exit 0
fi

# -----------------------------------------------------------------------------
# PHASE 2 — the fix pass
# -----------------------------------------------------------------------------
# Headless Claude reads the report and fixes what is safely fixable. It is
# deliberately fenced: a tight scope, a hard rule list, and a build gate after.
# If `claude` is missing we still ship the report rather than failing the week.
say "PHASE 2  automated fix pass"

if ! command -v claude >/dev/null 2>&1; then
  echo "WARNING: 'claude' not on PATH — skipping the fix pass, report still archived."
else
  claude -p "$(cat <<'PROMPT'
You are the weekly maintenance engineer for nowtb.com, a Tampa Bay real estate
site owned by Barrett Henry (REALTOR, Broker Associate, REMAX Collective).
Business goal: MORE LEADS. You are running unattended — be conservative and
correct, never clever.

Read WEEKLY-AUDIT.md in this repo. It is ranked by severity x pages affected.

YOUR JOB THIS WEEK, in order:

1. Fix every `critical` finding you can fix safely and verifiably. Highest
   value first. Prefer template-level fixes — one edit to a shared component in
   src/components/pages/ fixes hundreds of pages at once.

2. Then fix up to 5 `high` findings.

3. Then write ONE new blog post into src/data/posts-export.json on a timely,
   high-intent Tampa Bay topic that the site does not already cover. Check for
   an existing post on the topic FIRST and improve that instead of duplicating.
   Requirements: 1,000+ words, one H1, question-format H2s, a direct answer in
   the first 2-3 sentences, 4-5 FAQs, 6-8 internal links to real existing pages,
   a mid-article CTA with the phone number, and today's date. Prefer topics with
   seller or buyer intent over general interest.

HARD RULES — a violation is worse than doing nothing:
- "REMAX", never "RE/MAX" with a slash.
- "owners suite", never "master suite".
- The experience claim is exactly the `correct_experience_claim` value in
  weekly-audit.json. NEVER a higher number, and NEVER attached to a place.
  "23+ years of real estate experience" is right; "23 years in Tampa Bay" is a
  FALSE claim. Local tenure is "over a decade", never a year count.
- Never mention mobile or manufactured homes. Never mention AC in attic.
- Barrett's designations are e-PRO, MRP, SRS. He has no CRE designation.
- James Evans runs Best Bay Services. Barrett does not co-run it.
- Phone is (813) 733-7907. Email is barrett@nowtb.com.
- Never invent a statistic, price, school rating, or an Unsplash URL. A real
  Unsplash path matches photo-{13 digits}-{12 hex}. If you cannot verify a
  number, write the sentence without it.
- Never add AI/Claude/Anthropic attribution to any file or commit message.
- Never delete a content file. Never run `rm`.
- Do not touch src/data/posts-export.json except to APPEND your one new post —
  the scheduled content automation owns that file and a rewrite loses its work.

VERIFY BEFORE YOU STOP:
  npx tsc --noEmit    then    npx next build
Both must pass. If the build fails, revert your last change and try a smaller
one. Leaving the tree unbuildable is the one unacceptable outcome.

Finish by appending a short dated section to WEEKLY-AUDIT.md titled
"## Fixes applied this run" listing exactly what you changed and what you
deliberately skipped, with the reason.
PROMPT
)" \
    --permission-mode acceptEdits \
    --allowedTools "Read,Write,Edit,Grep,Glob,Bash,WebSearch,WebFetch" \
    2>&1 | tail -80
  echo "fix pass exited with status ${PIPESTATUS[0]}"
fi

# -----------------------------------------------------------------------------
# PHASE 3 — verify, then ship
# -----------------------------------------------------------------------------
say "PHASE 3  verification gate"

if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git status --porcelain)" ]; then
  echo "changes detected:"
  git status --short | head -40
else
  say "no changes this week — nothing to ship"
  echo "report archived at $REPORT_ARCHIVE/WEEKLY-AUDIT-$(date +%Y-%m-%d).md"
  exit 0
fi

# The build is the real gate. This repo has no ESLint config, so `next lint`
# only offers to create one — it proves nothing. tsc + build is the test.
say "typecheck"
if ! npx tsc --noEmit; then
  die "TYPECHECK FAILED — nothing pushed. Changes left in $WORKTREE for inspection."
fi

say "production build"
if ! npx next build; then
  die "BUILD FAILED — nothing pushed. Changes left in $WORKTREE for inspection."
fi

say "build passed — committing"

git add -A
git -c user.name="nowtb automation" -c user.email="barrett@nowtb.com" \
    commit -q -m "Weekly lead audit: fix $CRITICAL critical, $HIGH high findings

Automated weekly audit and fix pass. Full report in WEEKLY-AUDIT.md." \
  || die "commit failed"

if [ "${DRY_RUN:-0}" = "1" ]; then
  say "DRY_RUN set — committed locally, not pushing"
  echo "inspect:  cd $WORKTREE && git show"
  exit 0
fi

# Rebase onto whatever main looks like now. The content automation commits to
# main on its own schedule, so main almost certainly moved while we worked.
say "rebasing onto latest origin/main"
git fetch origin --quiet
if ! git rebase origin/main; then
  echo "rebase hit a conflict."
  # posts-export.json is owned by the content automation. Always take its
  # version so no generated batch is lost, then our append is reapplied.
  if git status --porcelain | grep -q "posts-export.json"; then
    echo "resolving posts-export.json in favour of origin/main (the automation owns it)"
    git checkout --theirs src/data/posts-export.json 2>/dev/null
    git add src/data/posts-export.json
    git rebase --continue || { git rebase --abort; die "rebase failed — resolve by hand in $WORKTREE"; }
  else
    git rebase --abort
    die "rebase conflict outside posts-export.json — resolve by hand in $WORKTREE"
  fi
fi

say "pushing to main (triggers Vercel production deploy)"
if git push origin HEAD:main; then
  say "SHIPPED"
  echo "commit:  $(git rev-parse --short HEAD)"
  echo "report:  $REPORT_ARCHIVE/WEEKLY-AUDIT-$(date +%Y-%m-%d).md"
else
  die "push failed — commit is safe in $WORKTREE, push by hand"
fi

say "weekly lead audit complete"
