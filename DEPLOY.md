# Deploying the Veteran PRO Companion App

The repo is configured for Netlify (`netlify.toml`). Two deploy paths:

## Option A — One-time CLI deploy (fastest)

```bash
# 1. Install the Netlify CLI globally (one-time)
npm install -g netlify-cli

# 2. Log into Netlify (opens a browser; one-time)
netlify login

# 3. From the repo root, link or create a site and deploy
cd /path/to/app
netlify init        # answer: create & deploy a new site
netlify deploy --build --prod
```

Netlify returns a Production URL like `https://veteranpro-companion.netlify.app`.

## Option B — Git-connected continuous deploy

1. Push this branch to a GitHub/GitLab/Bitbucket repo.
2. Netlify dashboard → "Add new site" → "Import from Git" → pick the repo.
3. Netlify reads `netlify.toml` automatically: build command `npm run build`, publish `dist`, functions `netlify/functions`. No further config.
4. Every push to the main branch deploys.

## Option C0 — GitHub Pages (free, host on GitHub itself, demo-mode AI)

Configured. A workflow at `.github/workflows/deploy-pages.yml` builds with the right subpath, copies `index.html` to `404.html` for SPA fallback, and publishes to GitHub Pages on every push.

### One-time setup

1. Create a new public repository on GitHub (e.g. `veteranpro-companion`).
2. On this machine, add the remote and push:
   ```bash
   cd /path/to/app
   git remote add origin git@github.com:<your-username>/veteranpro-companion.git
   git branch -M main          # GitHub default; harmless if already main
   git push -u origin main
   ```
3. In the GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The workflow runs automatically on the push. After ~1 minute the Actions tab shows a green check and the Pages section shows the live URL: `https://<your-username>.github.io/veteranpro-companion/`.

Subsequent pushes to `main` redeploy automatically.

### How the subpath works

The Vite config reads `BASE_PATH` from the environment; the workflow sets it to `/<repo-name>/`. React Router uses the same value as its `basename`. PWA manifest icons + `start_url` + `scope` are all rebased. The `404.html` ensures any direct URL load (e.g. opening `/catalog` from a bookmark) still hits the SPA.

### iPhone install on a subpath URL

Same as for the other hosts: open the GitHub Pages URL in Safari → Share → Add to Home Screen. The PWA respects the subpath; offline caching includes the full bundle under that path.

## Option C — Cloudflare Pages (static, demo-mode AI)

Cloudflare Pages serves the static `dist/` bundle and reads the same `public/_redirects` file for SPA fallback. **No code changes needed.** Real Claude AI is not enabled in this path (requires the Workers port — see "Real Claude on Cloudflare Workers" below).

### Quick deploy via Wrangler CLI

```bash
# 1. Install Wrangler globally (one-time)
npm install -g wrangler

# 2. Log into Cloudflare (opens browser; one-time)
wrangler login

# 3. Build the static bundle
cd /path/to/app
npm run build

# 4. Deploy. First run creates the project.
wrangler pages deploy dist --project-name veteranpro-companion --branch main
```

Wrangler returns a Production URL like `https://veteranpro-companion.pages.dev`. Subsequent deploys reuse the project.

### Git-connected continuous deploy

1. Push the repo to GitHub/GitLab.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Every push to `main` deploys.

### Real Claude on Cloudflare Workers (optional, post-MVP)

The current `netlify/functions/ai.ts` ports to a Cloudflare Pages Function in ~30 lines (Workers `fetch` handler instead of Netlify `Handler`). When you want this, ask and I'll write `functions/api/ai.ts`. Then set `ANTHROPIC_API_KEY` in the Pages project's environment variables and `VITE_AI_ENDPOINT=/api/ai` in the build env.

## Optional: Enable real Claude AI

The app ships with a local, offline demo AI. To turn on real Claude:

1. In Netlify site → **Site settings → Environment variables**, add:
   - `ANTHROPIC_API_KEY=<your Anthropic API key>` (server-side; never in client bundle)
   - `VITE_AI_ENDPOINT=/api/ai` (build-time; tells the client to use the Netlify function)
2. Trigger a redeploy.

The Netlify function at `netlify/functions/ai.ts` calls `https://api.anthropic.com/v1/messages` with `claude-sonnet-4-6` and prompt-caching enabled on the system + article corpus blocks.

## Install on iPhone

1. Open the deploy URL in Safari on iPhone (use the QR code shown by Netlify or share the link).
2. Tap **Share → Add to Home Screen → Add**.
3. The app icon appears with the Ветеран PRO branding.
4. Tap to launch — runs full-screen, offline-capable. Only the AI chat in real mode needs network.

> **Regenerating icons:** PWA icons (`public/icons/icon-{192,512,512-maskable}.png` and `apple-touch-icon.png`) are generated from the wordmark SVG by `scripts/gen-icons.mjs` — run `node scripts/gen-icons.mjs` after replacing the wordmark to refresh them.

## Option D — Capacitor native shell (sideload to iPhone via Xcode)

This wraps the existing React app in a native iOS (and optionally Android) shell. The app installs from Xcode like any other iOS app — proper native splash, app icon in the dock, App Switcher card, no Safari chrome. **All editing still happens on the Linux box.** Xcode is only a build-and-sign tool.

### What's already configured in this repo

- `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android` — native shell runtime
- `@capacitor/haptics` — wired into the primary `<Button>` for a light tap feedback (no-op on web)
- `@capacitor/status-bar`, `@capacitor/splash-screen` — branded launch experience
- `capacitor.config.ts` — app id `ua.gov.veteranpro.companion`, brand colors, plugin config
- `scripts/build-ios.sh` — one-command Mac-side rebuild

### First-time setup (on the Mac, once)

You need a Mac for the build step. Borrow / rent / use a colleague's — anything from a 2017 Mac mini upward works.

```bash
# 1. Install Xcode (App Store) and the CLI tools
xcode-select --install

# 2. Install CocoaPods (native dep manager iOS uses)
sudo gem install cocoapods

# 3. Clone your repo on the Mac
git clone git@github.com:smarty341/veteranpro.git
cd veteranpro

# 4. Install JS dependencies
npm install

# 5. Create the iOS Capacitor project (one-time; commits the ios/ folder)
npx cap add ios
git add ios && git commit -m "chore: add iOS Capacitor platform" && git push

# 6. (Optional) Same for Android
npx cap add android
git add android && git commit -m "chore: add Android Capacitor platform" && git push
```

### Ongoing build loop (every time you want a new build on your iPhone)

```bash
git pull
./scripts/build-ios.sh
```

The script runs the Vite build, copies output into the iOS project, runs `pod install`, and opens Xcode at the workspace. In Xcode:

1. **Top-left device picker** → pick a Simulator (free) or your connected iPhone.
2. **⌘+R** to build and run.

### Signing for a real device (first time only)

In Xcode:

1. Select the `App` project in the left sidebar.
2. Go to **Signing & Capabilities**.
3. Check **Automatically manage signing**.
4. Set **Team** to your personal Apple ID (or paid Developer Program account).
5. The Bundle Identifier is already `ua.gov.veteranpro.companion`.

With a **free Apple ID**: the build is signed with a 7-day certificate. After 7 days the app on the phone fails to launch and you must rebuild via `./scripts/build-ios.sh` and reinstall.

With a **paid $99/yr Apple Developer Program** account: no expiry; you can also upload to TestFlight to share with up to 100 internal testers without needing the cable.

### Live-reload during active development

For iterative work, point the iOS app at your Linux dev server instead of the bundled `dist/`:

```bash
# On the Linux box (this machine):
npm run dev    # Vite at http://10.0.7.106:5173

# On the Mac:
npx cap run ios -l --external --host 10.0.7.106
```

This installs an iOS app that hot-reloads as you save files on Linux. ⌘+S in your editor → iPhone updates within ~1 second.

### Updating native plugin code

After installing or upgrading a `@capacitor/*` plugin (any change to `package.json`), run `./scripts/build-ios.sh` — it includes `pod install` which picks up the new pod.

If you only changed React/CSS code, you can skip `pod install`:

```bash
npm run build && npx cap copy ios && open ios/App/App.xcworkspace
```

## 5-minute demo walkthrough

Use this script to sanity-check the install before showing it to anyone:

1. Tap the app icon → "Увійти через Дія" → "УБД" → "Полтавська область" → lands on Home.
2. Home shows the УБД chip, the AI tile, and 2+ recommended services.
3. Tap "Каталог" tab → "Соцзахист і фінанси" → "Грошова допомога УБД".
4. Tap "➕ Додати в «Мої послуги»" → arrives on "Мої послуги" with 1 entry.
5. Toggle two checkboxes → progress bar fills to 2/3.
6. Tap "AI" tab → type "лікування" → Enter → response cites "Безоплатне лікування".
7. Tap gear icon on Home → "Скинути демо" → returns to login screen with no data.

If any step fails, file an issue with the device, iOS version, and the failing step.
