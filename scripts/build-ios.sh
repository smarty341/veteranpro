#!/usr/bin/env bash
# Mac-side build helper for the Veteran PRO Capacitor app.
#
# What this does:
#   1. Builds the React app (Vite → dist/)
#   2. Syncs dist/ + native deps into the iOS Capacitor project
#   3. Opens Xcode at the project, ready to ⌘+R
#
# Capacitor 8 uses Swift Package Manager — NO CocoaPods, no `pod install`,
# no .xcworkspace. Xcode resolves Swift packages itself on first open.
#
# First-time setup (one-off, before running this script):
#   xcode-select --install                          # Xcode CLI tools
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

echo "→ npx cap sync ios"
npx cap sync ios

echo
echo "✅ Ready. Opening Xcode…"
open ios/App/App.xcodeproj
echo
echo "In Xcode:"
echo "  1. Top-left device picker → pick a Simulator or your connected iPhone"
echo "  2. ⌘+R to build & run"
echo "  3. (First run only) Signing & Capabilities tab → set your Apple Team"
