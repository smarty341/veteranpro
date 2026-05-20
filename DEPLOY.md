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

> **Note on icons:** The current `public/icons/` files are 1×1 pixel placeholders. Replace `public/icons/icon-192.png`, `public/icons/icon-512.png`, and `public/icons/apple-touch-icon.png` with properly sized artwork before the first public release. The 1×1 placeholders will produce a blank icon on the iPhone home screen.

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
