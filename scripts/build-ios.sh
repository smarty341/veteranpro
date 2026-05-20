#!/usr/bin/env bash
# Mac-side build helper for the Veteran PRO Capacitor app.
#
# What this does:
#   1. Builds the React app (Vite → dist/)
#   2. Copies dist/ into the iOS Capacitor project
#   3. Runs pod install for native dependencies
#   4. Opens Xcode at the workspace, ready to ⌘+R
#
# First-time setup (one-off, before running this script):
#   xcode-select --install                          # Xcode CLI tools
#   sudo gem install cocoapods                      # if `pod` not found
#   npm install                                     # JS deps
#   npx cap add ios                                 # creates ios/ folder (one-time)
#   ./scripts/build-ios.sh                          # this script
#
# Ongoing: just run ./scripts/build-ios.sh after a `git pull`.

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "→ npm ci"
npm ci

echo "→ npm run build (Vite → dist/)"
npm run build

echo "→ npx cap copy ios"
npx cap copy ios

echo "→ pod install"
( cd ios/App && pod install )

echo
echo "✅ Ready. Opening Xcode…"
open ios/App/App.xcworkspace
echo
echo "In Xcode:"
echo "  1. Top-left device picker → pick a Simulator or your connected iPhone"
echo "  2. ⌘+R to build & run"
echo "  3. (First run only) Signing & Capabilities tab → set your Apple Team"
