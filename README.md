# Ветеран PRO — Companion App

A mobile-first PWA mock-up that complements [veteranpro.gov.ua](https://veteranpro.gov.ua).

## Develop

    npm install
    npm run dev          # http://localhost:5173

## Add or replace articles

Drop Markdown files into `content/articles/`. Front-matter convention:

    ---
    id: unique-slug
    title: Назва послуги
    category: social-protection | health | housing | transport | documents | education | tax | sport | grants | regional
    statuses: [UBD, OIVV, CHSZ]    # subset
    region: Полтавська область     # optional
    documents: [Паспорт, IBAN]     # optional
    steps: [Зібрати, Подати, Отримати]  # optional
    contacts: |                    # optional
      ЦНАП тел. ...
    source: https://veteranpro.gov.ua/...  # optional
    ---
    Markdown body.

Run `npm run build:articles` to regenerate `src/content/articles.generated.ts`.

## Enable real Claude AI (optional)

The app ships with a local, offline-safe demo AI by default. To switch on real Claude:

1. Deploy with Netlify (already configured via `netlify.toml`).
2. In Netlify site env vars, set `ANTHROPIC_API_KEY=<your key>`.
3. In your build env vars, set `VITE_AI_ENDPOINT=/api/ai`.
4. Redeploy. The AI screen now calls the Netlify Function which calls Claude.

## Install on iPhone

Open the deploy URL in Safari → Share → Add to Home Screen. The icon appears with the Ветеран PRO wordmark and the app runs offline thereafter (chat needs network only in real mode).

## Reset for the next demo

In the app: Settings → Скинути демо. Clears profile, applications and settings; everything stays on the device.

## Roadmap

Plan A — embed the live veteranpro.gov.ua chatbot — is captured in `docs/superpowers/specs/2026-05-19-veteran-pro-companion-app-design.md` §7. It needs CSP and CORS allowlist additions on the portal side.
