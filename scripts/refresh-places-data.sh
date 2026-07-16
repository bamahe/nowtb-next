#!/usr/bin/env bash
#
# refresh-places-data.sh
# Enriches ANY of your vendor directory JSON files with LIVE Google data:
#   - current rating + review count
#   - website URL
#   - official Google Maps URL
#   - current opening hours
#
# Works on any file that has a top-level array of records with a "place_id"
# field (insurance, inspectors, lenders, or anything you build next).
#
# USAGE:
#   chmod +x refresh-places-data.sh          (first time only)
#   ./refresh-places-data.sh tampa-bay-home-inspectors.json
#   ./refresh-places-data.sh tampa-bay-insurance-partners.json
#
# OUTPUT:
#   <same-name>.enriched.json   (new file, your seed stays untouched)

set -euo pipefail

# ---------------------------------------------------------------------------
# 1) INPUT FILE
# ---------------------------------------------------------------------------
SEED="${1:-}"
if [ -z "$SEED" ] || [ ! -f "$SEED" ]; then
  echo "USAGE: ./refresh-places-data.sh <file.json>"
  echo "Example: ./refresh-places-data.sh tampa-bay-home-inspectors.json"
  exit 1
fi
OUT="${SEED%.json}.enriched.json"

# ---------------------------------------------------------------------------
# 2) API KEY (from bubba-keys, with env fallback)
# If your key is stored under a different name, change GOOGLE_KEY_NAME.
# ---------------------------------------------------------------------------
GOOGLE_KEY_NAME="GOOGLE_MAPS_API_KEY"

if command -v bubba-keys >/dev/null 2>&1; then
  API_KEY="$(bubba-keys get "$GOOGLE_KEY_NAME" 2>/dev/null || true)"
fi
API_KEY="${API_KEY:-${GOOGLE_MAPS_API_KEY:-}}"

if [ -z "${API_KEY}" ]; then
  echo "ERROR: No API key found."
  echo "Fix: run 'bubba-keys list' to find your key name, set it in GOOGLE_KEY_NAME,"
  echo "or run: export GOOGLE_MAPS_API_KEY=your_key_here  then rerun."
  exit 1
fi

echo "Refreshing live Google data in $SEED ..."

# ---------------------------------------------------------------------------
# 3) ENRICH (python3 is already on your Mac, no jq needed)
# Auto-detects the records array (agencies / inspectors / lenders / etc.)
# ---------------------------------------------------------------------------
API_KEY="$API_KEY" SEED="$SEED" OUT="$OUT" python3 <<'PY'
import json, os, time, urllib.request, urllib.error, datetime

api_key = os.environ["API_KEY"]
seed    = os.environ["SEED"]
out     = os.environ["OUT"]

data = json.load(open(seed))

# Find the list of records: first top-level value that is a list of dicts
records, key_used = None, None
for k, v in data.items():
    if isinstance(v, list) and v and isinstance(v[0], dict) and "place_id" in v[0]:
        records, key_used = v, k
        break
if records is None:
    raise SystemExit("Could not find a record array with place_id fields in " + seed)

fields = "id,displayName,formattedAddress,nationalPhoneNumber,rating,userRatingCount,websiteUri,googleMapsUri,regularOpeningHours,location"

def details(pid):
    url = f"https://places.googleapis.com/v1/places/{pid}"
    req = urllib.request.Request(url, headers={
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": fields,
    })
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)

ok, fail = 0, 0
for a in records:
    pid = a.get("place_id")
    if not pid:
        continue
    try:
        d = details(pid)
        if "rating" in d:                a["google_rating"] = d["rating"]
        if "userRatingCount" in d:       a["google_review_count"] = d["userRatingCount"]
        if d.get("websiteUri"):          a["website"] = d["websiteUri"]
        if d.get("googleMapsUri"):       a["google_maps_url"] = d["googleMapsUri"]
        if d.get("formattedAddress"):    a["address"] = d["formattedAddress"]
        if d.get("nationalPhoneNumber"): a["phone"] = d["nationalPhoneNumber"]
        loc = d.get("location") or {}
        if "latitude" in loc:  a["lat"] = loc["latitude"]
        if "longitude" in loc: a["lng"] = loc["longitude"]
        hrs = (d.get("regularOpeningHours") or {}).get("weekdayDescriptions")
        if hrs: a["hours"] = hrs
        ok += 1
        print(f"  ok   {a.get('name','?')}  ({a.get('google_rating')} / {a.get('google_review_count')})")
        time.sleep(0.1)
    except urllib.error.HTTPError as e:
        fail += 1
        print(f"  FAIL {a.get('name','?')}  HTTP {e.code} (check key/billing/place_id)")
    except Exception as e:
        fail += 1
        print(f"  FAIL {a.get('name','?')}  {e}")

if isinstance(data.get("meta"), dict):
    data["meta"]["last_updated"] = datetime.date.today().isoformat()

json.dump(data, open(out, "w"), indent=2, ensure_ascii=False)
print(f"\nDone ({key_used}). {ok} updated, {fail} failed. Wrote {out}")
PY

echo ""
echo "Next: point your Next.js build at $OUT (or copy it over the seed)."

# ---------------------------------------------------------------------------
# IF IT BREAKS, CHECK THIS:
#  - "HTTP 403" -> key not enabled for "Places API (New)", or billing off.
#  - "HTTP 400" -> field mask typo, or Places API (New) not enabled.
#  - "No API key found" -> wrong bubba-keys name. Run: bubba-keys list
#  - "command not found: python3" -> run: brew install python
#  - Ratings unchanged -> they genuinely didn't move since last pull.
# ---------------------------------------------------------------------------
