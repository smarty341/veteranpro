# Veteran PRO — Companion App (Mock-up)

**Status:** Design approved · ready for implementation plan
**Date:** 2026-05-19
**Owner:** oleg.shimanskyy@gmail.com (owns veteranpro.gov.ua — authorized to reuse its assets)

## 1. Purpose & scope

A high-fidelity, mobile-first **Progressive Web App (PWA)** that complements the national veteran services portal at [veteranpro.gov.ua](https://veteranpro.gov.ua). Visually a true extension of the portal — it reuses the site's logo, color palette, typography, icon set and design language. Functionally it adds three things the website doesn't offer: a personal, status-aware view of relevant services; a real AI assistant grounded in the site's content; and a personal checklist for tracking services the user has applied for.

The artifact produced is a **mock-up suitable for pre-sale demos** — a polished, installable iPhone home-screen app driven by sample data. It is not a production product: no real authentication, no backend, no live data sync.

### In scope (MVP)

1. **Catalog of services** — browsable by the same thematic categories as the website.
2. **Personalized hub** — onboarding picks status (УБД / ОІВВ / ЧСЗ) + region; "Home" tailors content accordingly.
3. **AI assistant** — chat answering questions from a curated set of provided articles ("Запитати в AI").
4. **My applications** — services the user marks as applied-for, with checkable steps and required documents.

### Out of scope

- Real authentication (Diia or otherwise)
- Server-side accounts / backend database / cross-device sync
- Live scraping of veteranpro.gov.ua at runtime
- Push notifications
- App Store / Google Play submission
- Full catalog (the demo ships a curated subset of articles)
- Embedding the live `veteranpro.gov.ua/ai-chat-bot` chatbot — blocked today by portal CSP `X-Frame-Options: SAMEORIGIN` and AWS API Gateway CORS allowlist; documented for later (§7)

### Success criteria

- Loads as a Veteran PRO–branded app via "Add to Home Screen" on iPhone and works **fully offline** thereafter (the only network dependency is the AI in real-mode).
- Visually indistinguishable as an official Veteran PRO product: e-Ukraine font, scraped color tokens, real wordmark and ministry logos.
- Three end-to-end flows demonstrate without bugs in a 5-minute pre-sale demo:
  1. Onboard → browse catalog → open a service → read details.
  2. From a service, "Запитати в AI про цю послугу" → coherent answer citing the source article.
  3. Add a service to "Мої послуги" → tick off steps → see progress update.
- A `npm run reset-demo` action restores a clean state for the next demo.

## 2. User-facing design

### 2.1 Visual system (scraped from veteranpro.gov.ua)

| Token | Hex | Role |
|---|---|---|
| `--vp-brand` | `#2D2926` | Primary text, dark surfaces, primary buttons (confirmed from `veteran_logo.svg`, `min-veteran.svg`, `kmu.svg`) |
| `--vp-beige` | `#E9E4E3` | Icon tiles, subtle surfaces (confirmed from brand SVGs) |
| `--vp-beige-2` | `#F4F0EE` | App background (derived light tint) |
| `--vp-border` | `#D1CBCB` | Card and divider lines (confirmed) |
| `--vp-mut` | `#6B6664` | Secondary text (derived) |
| `--vp-olive` | `#757341` | Highlight accent — progress bars, checkmarks, active-nav indicator (provided by owner) |
| `--vp-olive-soft` | `#B0AB75` | Secondary olive — status/region chips, accent surfaces (confirmed from the "PRO" badge in `veteran_logo.svg`) |
| `--vp-radius` | `12px` | Standard corner radius for cards/buttons (matches site) |
| `--vp-elevation` | `0 1px 3px rgba(0,0,0,.06)` | Card shadow (matches site's Material elevation tier 1) |

- **Typography:** `e-Ukraine` (Light 300 / Regular 400 / Medium 600), bundled from `https://veteranpro.gov.ua/fonts/e-Ukraine/*.otf` at build time. Falls back to system sans-serif.
- **Icons:** Remix Icons (`ri:*`) via the iconify SVG set — same family used by the site (`ri:hand-coin-line`, `ri:heart-add-line`, `ri:building-line`, `ri:bus-line`, `ri:file-copy-2-line`, `ri:graduation-cap-line`, `ri:shield-user-line`, `ri:basketball-fill`, `ri:refund-2-fill`, etc.). Bundled locally as SVG components; no runtime CDN call.
- **Logos / images bundled locally:** `assets/logo/veteran_logo.svg` (full "ВЕТЕРАН PRO" wordmark + olive PRO badge — primary brand mark supplied by the owner), plus `min-veteran.svg`, `kmu.svg`, `home-hero.svg`, `favicon.ico` (scraped from veteranpro.gov.ua).

### 2.2 Information architecture

Four-pillar bottom navigation, 74px tall (iPhone safe-area aware), labels + icons, active item marked with a 3px olive `--vp-olive` indicator above the icon:

```
[ Каталог ]  [ Головна ]  [ AI ]  [ Мої послуги ]
```

### 2.3 Screens

| # | Screen | Purpose |
|---|---|---|
| 1 | **Splash / Diia-style login** | Skippable. "Увійти через Дія" (mock — any tap proceeds) and "Продовжити без входу" link. Polish for pre-sale; never collects credentials. |
| 2 | **Onboarding — status** | Three large cards: УБД, ОІВВ, ЧСЗ. One selectable. |
| 3 | **Onboarding — region** | Search/scroll list of Ukrainian oblasts; selection optional ("Пропустити" allowed). |
| 4 | **Home (Головна)** | Greeting + status/region chips, "Запитати в AI" entry tile, "Рекомендовано вам" list of services filtered by status+region, snapshot of "Мої послуги" progress. |
| 5 | **Catalog (Каталог)** | 2-column grid of thematic categories with Remix-icon tiles. Mirrors the site's categories: Health & recovery, Social protection & finance, Housing & infrastructure, Transport & utilities, Documents & status, Education & work, Tax & administrative benefits, Sport & competitions, Grants & business, Services by region. |
| 6 | **Category → service list** | Scrollable list of services in that category, filterable by status. |
| 7 | **Service detail** | Title, status & category chips, "Хто може отримати", "Потрібні документи", "Кроки", "Контакти", plus two CTAs: "➕ Додати в Мої послуги" (primary, brand-black) and "Запитати в AI про цю послугу" (secondary, outlined). |
| 8 | **AI assistant (AI)** | Chat surface. User asks a question; the app retrieves the most relevant article(s) and answers, citing the source article title. Includes a few suggested-prompt chips. |
| 9 | **My applications (Мої послуги)** | List of services the user has added. Each card shows a progress bar (olive `--vp-olive` fill) and checkable steps. Empty state nudges to the catalog. |
| 10 | **Settings** | Reset demo, accessibility (font size, letter spacing, contrast — matching the site's `font-size-level-*`, `letter-space-level-*`, color-mode classes), language label (Ukrainian), version, link to veteranpro.gov.ua. |

### 2.4 Language

Ukrainian UI only (matches the portal and the article dataset). No translation layer in MVP.

### 2.5 Accessibility

Reproduce the website's accessibility controls in `Settings`:

- Font size: 3 levels (mapped to root font-size).
- Letter spacing: 3 levels.
- Contrast mode: standard / high-contrast.
- All controls persist to `localStorage` and apply on next launch.

## 3. Architecture

### 3.1 Stack

- **Build:** Vite + React 18 + TypeScript + Tailwind CSS v4.
- **Routing:** React Router (memory-friendly for PWA).
- **State:** lightweight Zustand store; persisted slices to `localStorage`.
- **PWA:** `vite-plugin-pwa` for service worker, web app manifest, offline pre-cache, "Add to Home Screen" metadata.
- **Tests:** Vitest + React Testing Library; Playwright optional for one end-to-end smoke later.

Single static bundle. No server is required to *run* the app; a tiny serverless function is involved only for AI real-mode (Section 3.4).

### 3.2 Module layout

```
src/
  app/                    routing, providers, shell, bottom-nav
  features/
    onboarding/           login mock, status, region pickers
    home/                 personalized hub
    catalog/              category grid, list, service detail
    ai/                   chat surface, retrieval, model adapter
    applications/         "Мої послуги" list, checklist, progress
    settings/             accessibility, reset, links
  content/
    articles.ts           generated bundle (compiled from content/articles/*.md)
    categories.ts         the 10 thematic categories (id, ua-name, icon, color)
    statuses.ts           UBD, OIVV, CHSZ (ua-name, short, description)
    regions.ts            list of Ukrainian oblasts
  ui/
    tokens.css            scraped color/spacing tokens (Section 2.1)
    components/           Card, Chip, Button, Tile, Checkbox, ProgressBar, BottomNav
  lib/
    store.ts              Zustand store (profile, applications, settings)
    storage.ts            localStorage adapter with schema versioning
    ai/
      retrieve.ts         keyword retrieval over articles
      provider.ts         demo-mode | real-mode adapter
public/
  assets/                 logo/veteran_logo.svg (primary brand mark),
                          min-veteran.svg, kmu.svg, home-hero.svg,
                          favicon.ico, e-Ukraine fonts, ri-* icons
content/
  articles/               *.md files dropped here by the owner
scripts/
  build-articles.ts       reads content/articles/, emits src/content/articles.ts
  fetch-vp-assets.ts      one-time downloader for logos + fonts from veteranpro.gov.ua
```

Each feature folder owns its routes, components, and tests. Cross-cutting concerns (store, storage, AI provider) live in `lib/`. UI primitives in `ui/` are unaware of feature logic.

### 3.3 Content pipeline

The owner drops articles into `content/articles/` as Markdown with YAML front-matter:

```yaml
---
id: ubd-money-help                  # required; unique slug
title: Грошова допомога УБД          # required
category: social-protection         # required; one of categories.ts ids
statuses: [UBD, OIVV]               # required; ≥ 1 of UBD|OIVV|CHSZ
region: Полтавська область          # optional; omit = national
documents:                          # optional; renders as a bullet list
  - Паспорт громадянина України
  - РНОКПП
  - Посвідчення УБД
  - Банківські реквізити (IBAN)
steps:                              # optional; becomes the checklist
  - Зібрати документи
  - Подати заяву в ЦНАП
  - Отримати виплату
contacts: |
  ЦНАП, тел. +380...
source: https://veteranpro.gov.ua/...   # optional citation back to the portal
---
Full markdown body — eligibility narrative, details, links.
```

`scripts/build-articles.ts` reads the folder at build time and emits a typed `src/content/articles.ts` containing every parsed article. Files with parse errors fail the build with a clear message naming the file and field. Missing optional fields degrade gracefully in the UI (e.g., no `steps` → no checklist, just a "Reading" tick). The MVP ships **4–6 representative seed articles** sourced from veteranpro.gov.ua so the demo is full before the owner supplies the real dataset.

### 3.4 AI assistant — adapter-based, Plan C for MVP

The MVP ships our own AI assistant over the owner-provided article dataset. The portal already operates a production chatbot (see §7); we document its architecture and the path to embedding it in a later milestone, but the MVP does not depend on it. The AI feature is built behind a swappable `AiProvider` interface so the future migration to the live chatbot is a single-file change, not a refactor.

```ts
interface AiProvider {
  ask(question: string, context: { status?: Status; region?: string }): AsyncIterable<AiToken>;
}
```

The chat surface UI calls `AiProvider.ask()` and renders tokens; it never knows which provider is in play.

**MVP providers (both behind the same interface):**

- **Retrieval (shared):** BM25-style keyword scoring over `title`, `category`, `documents`, `steps` and body of all articles, plus a heuristic boost for articles matching the user's current `status` and `region`. Returns top-3 articles.
- **`DemoAiProvider` (default):** Composes an answer from the retrieved articles using a deterministic template ("На запит «{question}» — за матеріалами «{article.title}»: …"). Always cites the source article title. Works offline, zero cost, deterministic — safe to ship.
- **`ClaudeAiProvider` (optional):** If `VITE_AI_ENDPOINT` is configured at build time, the same retrieved articles are sent to a small serverless function (e.g., Netlify Function) that holds the Anthropic API key and calls `claude-sonnet-4-6` with prompt caching on the system prompt and the stable article corpus block. The function returns the model's answer; the UI is identical. The API key never appears in the client bundle.

A future `EmbeddedChatBotProvider` (§7) will be added when the portal's allowlists permit it.

### 3.5 State & persistence

`localStorage` only. Keys are namespaced under `vp-companion:` and versioned with a `schema` field for future migrations.

| Slice | Persisted | Notes |
|---|---|---|
| `profile` | yes | `{ status, region, didOnboard, didMockLogin }` |
| `applications` | yes | `{ [articleId]: { addedAt, stepsCompleted: number[] } }` |
| `settings` | yes | `{ fontLevel, spacingLevel, contrastMode }` |
| `chat` | session only | last few messages, cleared on reset |

`Settings → Reset demo` clears all `vp-companion:*` keys and routes to the splash.

## 4. Error handling

- **Malformed article at build time:** `build-articles.ts` fails the build, printing the file path and the offending field. Implementation includes test coverage.
- **No articles match a query (AI):** Friendly fallback message with two suggested-prompt chips drawn from the catalog.
- **No articles match status+region (Home recommendations):** Show all national articles for that status; if still empty, show the catalog entry-point card.
- **Real-mode AI endpoint fails / times out (5s):** Silently fall back to demo-mode composition for that turn; surface a small "офлайн відповідь" badge under the message.
- **PWA offline + real mode:** The chat tile shows a non-blocking "офлайн режим — відповіді з кешу" hint; demo-mode answers continue to work.
- **localStorage unavailable / quota exceeded:** Fall back to in-memory state with a single toast informing the user that progress won't persist; never crash.
- **Unrecognized article id in `applications` (e.g., dataset changed):** Skip the entry on render and remove it on next save.

## 5. Testing

Vitest + React Testing Library, organized per feature.

- **Content pipeline:** `build-articles.ts` parses well-formed Markdown; rejects malformed front-matter with a useful error; handles missing optional fields; produces stable output.
- **Retrieval:** Keyword scoring returns expected article for representative questions; status/region boost behaves correctly; empty-result path returns fallback.
- **Store / storage:** Profile persists across reloads; applications mutate immutably; reset clears all `vp-companion:*` keys.
- **UI behavior:** Onboarding required before Home; catalog filters by category; service detail "Add to Мої послуги" appears in `applications`; checking a step updates progress.
- **PWA:** Manifest validates; service worker pre-caches the article bundle and key routes.
- **Accessibility settings:** Font-size and letter-spacing levels apply to root, persist, and reset cleanly.

One Playwright smoke test (optional, post-MVP) walks the three demo flows from §1 success criteria end-to-end.

## 6. Delivery

- Produce a production build with `npm run build` → static `dist/`.
- Deploy `dist/` to a free static host (Netlify recommended for trivial PWA support and edge functions; Vercel and GitHub Pages also work — GitHub Pages cannot host the AI real-mode function).
- The owner receives a public URL and a QR code; opens it once on iPhone Safari → **Share → Add to Home Screen** → app installs with the Veteran PRO icon. Offline thereafter.

A short `README.md` documents: how to add articles, how to enable real AI mode (drop in `VITE_AI_ENDPOINT`), and how to reset the demo.

## 7. Roadmap — embedding the live Veteran PRO chatbot (Plan A)

The portal at `/ai-chat-bot` runs a custom Angular chatbot fronting AWS-hosted infrastructure. The MVP ships our own AI (§3.4); this section captures everything needed to swap to the live one in a later milestone.

### 7.1 Discovered architecture (as of 2026-05-19)

- **Page config endpoint** (UI strings only): `GET https://api.veteranpro.gov.ua/api/front/page/chat_bot` — returns welcome message, placeholder, button labels.
- **AI brain — AWS API Gateway:** `https://04n4s8na5k.execute-api.eu-central-1.amazonaws.com/test/api`
  - `POST /chat` — start a new conversation. Body: `{ message, user_id, mode: "async", is_csat_continue, csat_id, payloadExtras? }`. Returns `202` + a `conversation_id`; client polls `/conversations/{id}` for the completed response.
  - `POST /chat/{conversationId}` — follow-up message (same body shape). Supports `is_edit` / `edit_message_id` and `is_redo` / `redo_message_id`.
  - `GET /conversations`, `GET /conversations/{id}`, `DELETE /conversations/{id}` — conversation management.
  - `POST /csat` — submit feedback.
  - `POST /clarifying-question`, `POST /category-selection` — onboarding-prompt helpers.
- **Auth:** AWS Cognito User Pool. User Pool ID `eu-central-1_17qhYLdmY`, App Client ID `3p1u02hjq4lt4qlkninuootio9`. Calls to the chat API require a valid Cognito JWT in the `Authorization` header.
- **Streaming:** the page polls until 202→completed and renders the final text with a JS-only "typewriter" effect (not real SSE/streaming).
- **Iframe policy (current):** `X-Frame-Options: SAMEORIGIN` and CSP `frame-ancestors 'self' https://*.clarity.ms` — only same-origin (or Microsoft Clarity) can frame `/ai-chat-bot`.
- **CORS policy (current):** `Access-Control-Allow-Origin: https://veteranpro.gov.ua` only.

### 7.2 What the portal owner needs to change to unblock the embed

1. Add the companion app's deployed origin (e.g., `https://veteranpro-companion.netlify.app`) to:
   - The page's CSP `frame-ancestors` directive on `/ai-chat-bot`.
   - The AWS API Gateway CORS allowlist on `04n4s8na5k.execute-api.eu-central-1.amazonaws.com`.
2. (Recommended) Honor a `?embed=1` query parameter on `/ai-chat-bot` that hides the portal's global header, footer, accessibility chrome and bottom CTA — so the iframe shows only the chat surface. (Patch to the portal: roughly a `[hidden]="route.queryParamMap['embed']==='1'"` on three layout components.)
3. Decide whether anonymous users may chat (no Cognito login) or whether the companion app must trigger Cognito Hosted UI on first use. If the latter, add the companion's redirect URI(s) to the Cognito App Client's allowed callback URLs.

### 7.3 Companion-side migration

When (1) and (2) above are in place:

- Add `EmbeddedChatBotProvider` implementing the `AiProvider` interface — internally renders an `<iframe src="https://veteranpro.gov.ua/ai-chat-bot?embed=1">` styled to the AI tab's frame (full-bleed, no rounded corners outside the device frame).
- Build-time variable `VITE_AI_PROVIDER=embed | claude | demo` selects which provider compiles in (defaults `demo`).
- Keep `DemoAiProvider` registered as the offline fallback the iframe wrapper falls back to when `frame load` errors or the network is unavailable, so the demo path never breaks.

### 7.4 Alternative: same-origin deploy (Plan B)

If the companion app is later hosted under `veteranpro.gov.ua` (a subpath like `/app/` or a subdomain like `app.veteranpro.gov.ua` with API CORS updated for the subdomain), no portal allowlist edits are needed — iframe and direct API call both work out of the box. This is the lowest-friction long-term answer and is captured here for visibility, but not required for the MVP.

## 8. Open questions for the implementation plan

- Region list — full 24 oblasts + Crimea + Kyiv, or shorter starter set for the mock? (Default: full list, but the onboarding lets the user skip.)
- Real-mode AI hosting — Netlify Functions vs. Vercel Edge vs. Cloudflare Workers. (Default: Netlify Functions, simplest.)
- Settings panel placement — separate route under bottom-nav overflow ("⚙" on Home) vs. dedicated 5th tab. (Default: gear icon on Home, no 5th tab — keeps the four-pillar nav clean.)
- Whether to include a one-page "About / Acknowledgements" linking to veteranpro.gov.ua and the ministries. (Default: yes, surfaced from Settings.)

These are not blocking — defaults are stated and can be revised during implementation.
