#!/bin/bash
# Daily page enrichment for nowtb.com
# Runs via cron — picks the weakest city pages and beefs them up
# Checks: post count, FAQs, neighborhood descriptions, images
# Then deploys changes

cd ~/Projects/nowtb-next

echo "$(date): Starting daily enrichment audit"

# Run the enrichment script
python3 scripts/daily-enrich.py 2>&1

# Download missing blog images (Unsplash, 45 max per run)
python3 -u /tmp/download-blog-images.py 2>&1 | tail -5

# Deploy if changes were made
CHANGES=$(git diff --stat 2>/dev/null | tail -1)
if [ -n "$CHANGES" ]; then
    echo "$(date): Deploying changes..."
    vercel --prod --yes 2>&1 | tail -3
    echo "$(date): Deploy complete"
else
    echo "$(date): No changes to deploy"
fi

echo "$(date): Daily enrichment complete"
