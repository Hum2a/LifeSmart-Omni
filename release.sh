#!/bin/bash
# release.sh - Automated release script for LifeSmart (OmniPlatform)
# Usage: ./release.sh
# This script pulls latest code, installs dependencies, runs tests, builds, and tags a release.

set -e

# 1. Ensure script is run from repo root
echo "[release.sh] Running from: $(pwd)"
if [ ! -f package.json ]; then
  echo "[release.sh] Error: Run this script from the project root (where package.json is located)."
  exit 1
fi

# 2. Pull latest changes from main/master
echo "[release.sh] Pulling latest changes from origin/master..."
git pull origin master

# 3. Install dependencies
echo "[release.sh] Installing dependencies..."
npm install

# 4. Run tests
echo "[release.sh] Running tests..."
npm test -- --watchAll=false

# 5. Build production bundle
echo "[release.sh] Building production bundle..."
npm run build

# 6. Tag the release
echo "[release.sh] Tagging the release..."
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
IFS='.' read -r -a parts <<< "${LATEST_TAG#v}"
MAJOR=${parts[0]:-0}
MINOR=${parts[1]:-0}
PATCH=${parts[2]:-0}
NEW_TAG="v$MAJOR.$MINOR.$((PATCH+1))"
git tag "$NEW_TAG"
echo "[release.sh] Created tag $NEW_TAG"

echo "[release.sh] Release process complete!"
echo "[release.sh] Next steps:"
echo "  1. git push origin master --tags"
echo "  2. Deploy your build (see README or CI/CD pipeline)" 