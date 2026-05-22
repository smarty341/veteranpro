# Session Notes — Veteran PRO Companion App

Working continuation document. Read this first when picking up the project in a fresh session.

**Last updated:** 2026-05-22 · main @ `d8f8116`

---

## ⏯ RESUME HERE — where we left off (2026-05-22)

**Current task:** wrapping the app in Capacitor for a native iOS shell, sideloaded from a borrowed Mac.

**Status:** Capacitor is fully installed and configured *in the repo* (commit `d8f8116`). The native `ios/` folder has **not** been generated yet — that requires a one-time `npx cap add ios` run on a Mac.

**The user is mid-setup on a borrowed Mac.** They were running the first-time prerequisites and got stuck on `sudo gem install cocoapods` (it hangs — macOS system Ruby is old; `gem install` compiles native extensions silently for 5–10 min or fails on permissions).

**Resolution given (not yet confirmed working):** install CocoaPods via Homebrew instead — `brew install cocoapods`, then `pod --version` to confirm. `DEPLOY.md` Option D has been corrected to recommend Homebrew. If `brew` itself is missing, install Homebrew first, then `brew install cocoapods`. Last-resort fallback: `brew install ruby` then `gem install cocoapods` (no sudo) using the Homebrew Ruby.

**Next concrete steps for the user (on the Mac), in order:**
1. Get `pod --version` to print a version (1.12+).
2. `git clone git@github.com:smarty341/veteranpro.git && cd veteranpro && npm install`
3. `npx cap add ios` — generates the `ios/` Xcode project; first run downloads the CocoaPods spec repo (~hundreds of MB, genuinely slow ~several min, looks idle — let it run).
4. `git add ios && git commit -m "chore: add iOS Capacitor platform" && git push` — so the `ios/` folder is committed and future builds skip the add step.
5. `./scripts/build-ios.sh` → opens Xcode → device picker → ⌘+R.
6. First run only: Xcode → App project → Signing & Capabilities → set Team to their Apple ID.

**What the next AI session should do:** ask the user whether the Mac setup succeeded. If yes and `ios/` is now committed, the native path is live — help with signing/TestFlight as needed. If they hit new errors, debug from `DEPLOY.md` Option D. If they abandoned the Mac route, the PWA at the live URL is fully functional and demo-ready as-is.

---

## TL;DR — current state

The MVP is built, deployed, and demo-ready. Live on iPhone home-screen via PWA install.

- **Live URL:** https://smarty341.github.io/veteranpro/
- **GitHub repo:** git@github.com:smarty341/veteranpro.git (private to user `smarty341`)
- **Working directory:** `/root/app` on the CC machine
- **Branch:** `main` (feature branch `feat/companion-app-impl` merged & deleted)
- **Tests:** 61 passing across 26 files
- **Lint:** clean (`tsc --noEmit`)
- **Build target:** static SPA + optional Netlify/CF function for real Claude AI; demo-mode AI is the default
- **Capacitor native shell:** configured but iOS/Android folders not yet generated (needs `npx cap add ios` on a Mac — first-time step). See `DEPLOY.md` Option D for the sideload workflow.

## What this project is

A high-fidelity mobile-first **PWA mock-up** complementing the national veteran services portal at [veteranpro.gov.ua](https://veteranpro.gov.ua). The user (`oleg.shimanskyy@gmail.com`) owns the portal and authorized full reuse of its visual assets. Installable to iPhone home screen for **pre-sale demos**.

Four pillars in the bottom nav: **Каталог · Головна · AI · Мої послуги**. Plus settings (accessed via gear icon on Home).

### Onboarding flow (in order)

1. Login (Diia-style mock, skippable)
2. Status — УБД / ОІВВ / ЧСЗ
3. Region — 26 Ukrainian oblasts, searchable, skippable
4. **Interests** — 8-option word cloud (Курси · Знижки · Лікування · Житло · Події · Здоров'я · Зустрічі · Гранти), multi-select, skippable
5. → Home

Each step persists to `localStorage`. Settings → "Скинути демо" clears everything and returns to the splash.

### Core features

- **Catalog** — 10 thematic categories mirroring the portal, grid of icon tiles
- **Personalized Home** — greeting, status/region chips, AI tile, "Рекомендовано вам" list filtered by both status AND interest-category mapping
- **Service detail** — full eligibility, documents, steps, contacts, two CTAs (add to checklist, ask AI)
- **My Services (Мої послуги)** — list of added services; each with progress bar + per-step Checkbox; data is persisted; data-drift safe
- **AI assistant** — hybrid adapter: DemoAiProvider works offline over the article corpus using BM25-ish retrieval with status/region boost; ClaudeAiProvider proxies to a Netlify/serverless function calling `claude-sonnet-4-6` with prompt caching
- **Settings** — accessibility (3 font sizes, 3 letter-spacing levels, contrast mode), reset demo, link to veteranpro.gov.ua. Settings apply at boot via `applyAccessibility()` and live via `App.tsx` useEffect.

## Tech stack

- Vite 5 · React 18 · TypeScript 5 (strict) · Tailwind CSS 4 (beta)
- Zustand store with `localStorage` adapter (schema-versioned, namespaced under `vp-companion:`)
- React Router 6 (`createBrowserRouter`, basename mirrors `import.meta.env.BASE_URL`)
- `vite-plugin-pwa` for manifest + service worker + offline pre-cache
- Vitest 2 + @testing-library/react + jsdom
- gray-matter for front-matter parsing in the content pipeline
- @iconify/react with Remix icons (`ri:*`)
- sharp for icon generation (`scripts/gen-icons.mjs`)
- React Markdown for article body rendering
- Optional: @netlify/functions for real-AI proxy
- Optional: @capacitor/{core,cli,ios,android,haptics,status-bar,splash-screen} for native shell

## Directory map

```
/root/app/
├── content/articles/          owner-supplied Markdown; 6 seed articles
├── docs/superpowers/
│   ├── specs/                 2026-05-19-veteran-pro-companion-app-design.md
│   └── plans/                 2026-05-19-veteran-pro-companion-app.md
├── netlify/functions/ai.ts    optional Claude proxy (port to other hosts as needed)
├── netlify.toml               Netlify build + SPA redirects + AI function path
├── public/
│   ├── _redirects             SPA fallback (read by Netlify and Cloudflare Pages)
│   ├── assets/                fonts/, logo/, img/
│   ├── icons/                 PWA icons (sharp-generated from the wordmark)
│   ├── favicon.ico
│   └── manifest.webmanifest   generated by vite-plugin-pwa
├── scripts/
│   ├── build-articles.ts      content → src/content/articles.generated.ts
│   ├── fetch-vp-assets.sh     pulls fonts/logos/hero from veteranpro.gov.ua
│   └── gen-icons.mjs          renders PWA icons from veteran_logo.svg via sharp
├── src/
│   ├── app/                   App, routes, Shell, BottomNav
│   ├── content/               types, categories, statuses, regions, interests, fixture, articles.generated (gitignored)
│   ├── features/              onboarding, home, catalog, ai, applications, settings
│   ├── lib/                   store, storage, asset, plurals, applyAccessibility, ai/
│   └── ui/                    tokens.css, globals.css, components/
├── .github/workflows/
│   └── deploy-pages.yml       GitHub Actions: build with BASE_PATH, copy 404.html, deploy
├── DEPLOY.md                  Netlify, Cloudflare Pages, GitHub Pages instructions
├── README.md                  contributor doc (add articles, enable real AI, install on iPhone, reset demo)
└── SESSION_NOTES.md           THIS FILE
```

---

## Commands cheatsheet

```bash
# Development
npm install
npm run dev                    # http://localhost:5173

# Tests + lint
npm test                       # full suite (currently 61 tests)
npm test -- <pattern>          # one file or directory
npm run lint                   # tsc --noEmit (strict)

# Build
npm run build                  # full static bundle to dist/
BASE_PATH=/veteranpro/ npm run build   # subpath build (this is what GitHub Pages does in CI)
npm run build:articles         # regenerate src/content/articles.generated.ts from Markdown

# Asset generation (only needed if you change the wordmark)
./scripts/fetch-vp-assets.sh   # re-fetches fonts/logos/hero from veteranpro.gov.ua
node scripts/gen-icons.mjs     # rebuild PWA icons (192/512/maskable/180) from the wordmark

# Git workflow
git status / git diff / git log --oneline
git push                       # main auto-deploys via GitHub Actions

# Force a fresh CI deploy without a code change
git commit --allow-empty -m "redeploy" && git push
```

---

## Deployment

### GitHub Pages (current)

- Configured via `.github/workflows/deploy-pages.yml`
- Self-enables Pages on first run via `actions/configure-pages@v5` with `enablement: true`
- Sets `BASE_PATH=/${repo_name}/` so the build adapts to any repo name automatically
- Copies `dist/index.html` to `dist/404.html` for SPA fallback (GitHub Pages doesn't natively support `_redirects` files)
- Builds on every push to `main`/`master`; takes ~1 minute end-to-end
- Action logs: https://github.com/smarty341/veteranpro/actions

### Other hosts documented in DEPLOY.md

- **Netlify** — `netlify.toml` is configured; supports the AI function out of the box. CLI or Git-connected modes.
- **Cloudflare Pages** — `wrangler pages deploy dist` or Git-connected. Demo-mode AI only unless you port the function to a CF Worker.

### SSH key already on this machine

This box already has an SSH key registered with the user's GitHub account (Settings → SSH and GPG keys → "Veteran PRO deploy box"). `~/.ssh/id_ed25519` exists and pushes work without prompting.

---

## Design tokens (final values)

| Token | Value | Role |
|---|---|---|
| `--vp-brand` | `#2D2926` | Primary text, dark surfaces, primary buttons (from `veteran_logo.svg`) |
| `--vp-beige` | `#E9E4E3` | Icon tiles, subtle surfaces (from logo) |
| `--vp-beige-2` | `#EFE9E5` | App background (saturated enough that cards stand out) |
| `--vp-border` | `#D1CBCB` | Card and divider lines |
| `--vp-mut` | `#6B6664` | Secondary text |
| `--vp-olive` | `#757341` | Highlight accent (progress, checkmarks, active-nav indicator) — provided by owner |
| `--vp-olive-soft` | `#B0AB75` | Secondary olive (status chips, the "PRO" badge in logo) |
| `--vp-radius` | `16px` | Cards and buttons |
| `--vp-elevation` | `0 4px 12px rgba(0,0,0,.08)` | Card shadow |
| `--vp-elevation-lg` | `0 14px 38px rgba(0,0,0,.14)` | Modal/raised surfaces |
| `--vp-button-shadow` | `0 4px 14px rgba(45,41,38,0.22)` | Primary CTA lift |

Base font-size is `17px` (set on `html` in `globals.css`) so all rem-based sizing reads larger on phones. Font family is **e-Ukraine** (bundled from veteranpro.gov.ua at `/assets/fonts/`), weights 300/400/500.

---

## Resolved issues & gotchas (the lessons that matter)

### 1. Tailwind v4 silently drops `@import` after `@config`

**Problem:** All design tokens (`--vp-brand`, `--vp-beige-2`, `--vp-radius`, …) were defined in `src/ui/tokens.css` but never reached production. Every `bg-beige-soft`, `text-brand`, `rounded-card` resolved to undefined variables → white background, square corners, no shadows. Bug was silent for the entire build cycle.

**Root cause:** CSS spec requires all `@import` rules to come **before** any other statements. `globals.css` had:
```css
@import "tailwindcss";
@config "../../tailwind.config.ts";    ← non-import statement
@import "./tokens.css";                ← gets silently dropped
```

Build emitted a warning that I missed: `@import must precede all other statements (besides @charset or empty @layer)`.

**Fix:** Reorder so all imports come first.
```css
@import "tailwindcss";
@import "./tokens.css";
@config "../../tailwind.config.ts";
```

**Verification:** `grep -oE ':root\s*\{[^}]+\}' dist/assets/*.css` must show the `:root { --vp-brand: … }` block. If empty, tokens are not loading.

**Commit:** `883720d`

### 2. Logo `<img src="/...">` broken on GitHub Pages subpath

**Problem:** Vite rewrites paths in `index.html`, CSS `url()`, and the PWA manifest — but **not** in runtime string literals inside JSX. So `<img src="/assets/logo/veteran_logo.svg">` resolved to `smarty341.github.io/assets/...` (outside the project) and 404'd.

**Fix:** Created `src/lib/asset.ts`:
```ts
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
```
Use in all JSX: `<img src={asset("assets/logo/veteran_logo.svg")} />`. Works on root deploys (`BASE_URL = "/"`) and subpath deploys (`BASE_URL = "/veteranpro/"`).

**Commit:** `1c1460d`

### 3. PWA manifest icons not auto-rebased

**Problem:** `VitePWA` plugin doesn't automatically prefix manifest icon paths with the base path. Manifest pointed to `/icons/icon-192.png` on the subpath deploy.

**Fix:** Build icon paths from the `BASE` constant in `vite.config.ts`:
```ts
icons: [
  { src: `${BASE}icons/icon-192.png`, ... },
  ...
]
```

**Commit:** `e3977ed`

### 4. iOS PWA standalone mode — content under the dynamic island

**Problem:** `apple-mobile-web-app-status-bar-style=black-translucent` + `viewport-fit=cover` means content extends to the screen edges (good), but without safe-area padding the logo slides under the dynamic island.

**Fix:** Apply `pt-[calc(env(safe-area-inset-top)+1.25rem)]` to `Header.tsx` and equivalent to onboarding screens' outer divs.

**Commit:** `24b9e57`

### 5. iOS PWA standalone — bottom nav icons cramped

**Problem:** Nav had fixed `h-[74px]` + `pb-[env(safe-area-inset-bottom)]`. In Safari (toolbar visible), safe-area is 0 → 74px of usable content. In standalone (home indicator visible), safe-area is ~34px → only 40px of usable content → icons + labels overlap and look "wrong size."

**Fix:** Remove fixed height; set `min-h-[64px] py-2` on each NavLink. Now nav grows naturally; safe-area-inset-bottom adds *below* content instead of being absorbed into a fixed box. Behaves identically in Safari preview and standalone PWA.

**Commit:** `89c5430`

### 6. React Router NavLink `data-[active=true]:` variant is dead code

**Problem:** I initially wrote `data-[active=true]:text-brand` on `NavLink` thinking React Router sets a `data-active` attribute. It doesn't — it sets `aria-current="page"` and adds the CSS class `active`. So the active text color and font-weight never applied.

**Fix:** Use the render-prop className function:
```tsx
className={({ isActive }) =>
  `... ${isActive ? "text-brand font-semibold" : "text-[#a39e9b] font-medium"}`
}
```

**Commit:** `768ff67`

### 7. GitHub Pages first-deploy failure when Pages not yet enabled

**Problem:** `actions/configure-pages@v5` 404s if the repo doesn't already have Pages configured. Catch-22: you can't enable Pages from the dashboard until you have a deployment.

**Fix:** Add `enablement: true` to the action's `with:` block. Requires `pages: write` permission (we have it). The workflow then self-bootstraps Pages on first run.

**Commit:** `086ba4c`

### 8. PWA icons started as 1×1 placeholders

**Problem:** `scripts/fetch-vp-assets.sh` falls back to placeholder icons when ImageMagick isn't installed. The placeholders made the home-screen icon blank.

**Fix:** Added `scripts/gen-icons.mjs` using `sharp` (npm dep) to render proper PNG icons from the wordmark on the brand-charcoal background. Produces 192/512/512-maskable/180 (apple-touch). The script reads the wordmark, centers it on a brand-dark canvas with padding-zone for maskable variant.

**Commit:** `24ef37a`

### 9. Service worker caches aggressively in standalone mode

**Symptom:** Changes don't show up after `git push` even when CI is green.

**Resolution playbook:**
1. Force-close the app from the iOS App Switcher (swipe-up gesture).
2. Relaunch — the new service worker activates on next start.
3. If still stale: long-press home-screen icon → Remove App → Delete; reopen Safari to the URL; re-add to home screen.

`registerType: "autoUpdate"` is set on `vite-plugin-pwa`, so the SW *should* pick up new builds automatically — but iOS aggressively keeps the cached copy alive for installed PWAs.

---

## Outstanding follow-ups (not blockers, captured from final review)

These were flagged in the holistic code review at `e3977ed`-ish but deferred because the demo works:

1. **`npm run reset-demo` script** — spec §1 wanted a CLI command in addition to the UI Settings button.
2. **Streaming AI in real-mode** — current Netlify Function returns the full Claude response in one shot rather than streaming via SSE; results in a 3-8s "loading cliff" UX.
3. **CategoryScreen status filter** — design said "filterable by status"; currently you only see status chips on items, no filter control.
4. **AI screen suggested-prompt chips** — design said "includes a few suggested-prompt chips" in the empty state.
5. **Home "Мої послуги" snapshot** — design called for a compact progress preview on Home.
6. **Hardcoded `#a39e9b` in BottomNav inactive label** — should be a CSS token.
7. **Settings About/Acknowledgements** — link to ministries from Settings; spec defaulted to "yes."
8. **Plan A: embed live veteranpro.gov.ua chatbot** — captured in spec §7. Requires user to update portal-side CORS + CSP `frame-ancestors`. Architecture is mapped (AWS API Gateway endpoint, Cognito User Pool IDs, request shapes all in the spec).

---

## Reference URLs

- **Live app:** https://smarty341.github.io/veteranpro/
- **GitHub:** https://github.com/smarty341/veteranpro
- **GitHub Pages settings:** https://github.com/smarty341/veteranpro/settings/pages
- **GitHub Actions:** https://github.com/smarty341/veteranpro/actions
- **Source portal:** https://veteranpro.gov.ua (user owns this)
- **Portal chatbot route:** https://veteranpro.gov.ua/ai-chat-bot (Plan A reference)
- **Live chatbot API base:** `https://04n4s8na5k.execute-api.eu-central-1.amazonaws.com/test/api` (AWS Cognito-gated)

---

## Working agreements with the user (preferences observed in this session)

- **Demos > production-grade.** This is a pre-sale mock-up. Don't over-engineer. Prefer convincing-on-stage to architecturally pristine.
- **Match the design.** Mockups in `.superpowers/brainstorm/` (gitignored, may not survive sessions) are the source of truth for visual feel. If something looks plainer than the mockup, it's broken — not a feature gap.
- **Per-step checklists** for My Services. The user reverted my "single received toggle" simplification — they want the multi-step progress UI.
- **Ukrainian first.** All user-facing copy is Ukrainian. English only in code, comments, and operational docs.
- **The user owns veteranpro.gov.ua** — assets reuse is authorized; the live chatbot integration is feasible long-term but blocked today by portal-side CORS/CSP.

---

## How to pick up next session

1. `cd /root/app && git pull` — sync.
2. Skim this file (you're reading it).
3. `npm install && npm test` — confirm 61 tests pass.
4. `npm run dev` — local preview at http://localhost:5173.
5. The brainstorm session left visual mockups under `.superpowers/brainstorm/` if the worktree still has them; otherwise the spec `docs/superpowers/specs/2026-05-19-veteran-pro-companion-app-design.md` has the design palette and screen-by-screen description.
6. Any new request: implement on `main` directly (this is a pre-sale demo, not a production app) → push → wait for CI → confirm on iPhone.

For substantial new features, follow the same flow as before: brainstorm → spec → plan → implement → review.
