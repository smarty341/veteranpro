# Veteran PRO — Native (React Native + Expo) Slice

**Status:** Design approved — pending user review of this spec
**Date:** 2026-05-22
**Owner:** oleg.shimanskyy@gmail.com
**Predecessor:** `2026-05-19-veteran-pro-companion-app-design.md` (the current React/PWA + Capacitor build)

---

## 1. Purpose & scope

The existing app is a React PWA wrapped by Capacitor. Capacitor renders the entire UI inside a `WKWebView` — so it inevitably *feels* like a website in a wrapper (web-style scroll, no native gestures, no native page transitions). The user has confirmed this and asked whether a genuinely native rewrite would feel better.

This spec describes a **vertical slice rewrite in React Native + Expo** designed to answer that question on the user's iPhone within ~1 day of work, **without** committing to a full rewrite up front. If the slice feels right, we expand it screen by screen. If it doesn't, we've spent a day and the Capacitor build remains as the fallback.

### In scope (the slice)

1. **Onboarding flow** — Login → Status → Region → Interests (4 screens, faithful to the existing app)
2. **Bottom tab navigation** with the 4 real tabs (Каталог · Головна · AI · Мої послуги) and the existing active-tab indicator
3. **Каталог** — the full 2-column grid of all 10 category tiles ("matrix of topics")
4. **Головна (Home)** — greeting, status/region chips, AI tile, "Рекомендовано вам" list filtered by status + interests
5. **AI** and **Мої послуги** tabs — stub screens that render a *"Цей розділ — у повній версії"* placeholder so the tab bar is fully navigable
6. Persistent profile (status / region / interests / didOnboard) via `AsyncStorage`
7. Brand-faithful visual styling using the existing scraped design tokens

### Out of scope (deliberately)

- Catalog category detail pages (tapping a tile shows a stub alert)
- Service detail pages (tapping a recommended article shows a stub alert)
- The actual AI chat (the AI tab is a stub)
- The applications/checklist feature (the Мої послуги tab is a stub)
- Settings screen and accessibility controls (the gear icon is a stub alert)
- Real authentication
- Real Claude AI / serverless function
- Native-shell signing, TestFlight, App Store submission (Expo Go handles install)
- iOS-only verification for now — Android works trivially via Expo Go too if desired later, but is not a requirement of the slice
- NativeWind / Tailwind for React Native (see §6)

### Success criteria

- The user installs **Expo Go** on the iPhone once, scans a QR code, and the slice runs end-to-end:
  - Completes onboarding (Login → Status → Region → Interests → Home).
  - Switches between all 4 bottom tabs without errors.
  - Browses the catalog grid and sees all 10 categories with correct icons + Ukrainian labels.
  - Sees status + interest chips on Home and a "Рекомендовано вам" list filtered by their selections.
  - Force-quits and reopens the app — onboarding is remembered (lands on Home).
- The user can subjectively answer: **"Does native React Native feel meaningfully better than the Capacitor build?"** That subjective verdict is the slice's purpose.
- `npx expo export` succeeds on the Linux box (production bundle compiles cleanly) before the user is told to pull.

---

## 2. Where it lives in the repo

A new top-level folder: **`native/`**.

```
/root/app/
├── src/               EXISTING React/PWA app — UNTOUCHED
├── ios/               EXISTING Capacitor iOS shell — UNTOUCHED
├── android/           (future Capacitor Android) — UNTOUCHED
├── native/            NEW — self-contained Expo project
│   ├── app/           Expo Router screens (file-based routing)
│   ├── components/    Button, Card, Chip, IconTile, ScreenContainer, Header
│   ├── content/       statuses, regions, interests, categories, articles (copied)
│   ├── lib/           store (Zustand), haptics, plurals, theme tokens
│   ├── assets/        logo PNG, app icon, splash
│   ├── app.json       Expo config (name, slug, bundleId, icon, splash, scheme)
│   ├── package.json   isolated — no shared deps with the web app
│   └── tsconfig.json
└── docs/superpowers/specs/2026-05-22-veteran-pro-native-slice-design.md
```

Rationale for isolation:
- Web and React Native have entirely different dependency trees (`react-dom` vs `react-native`, Tailwind/Vite vs Metro, etc.). A single `package.json` would constantly fight version resolution.
- Either codebase can be deleted without affecting the other.
- The slice can be evaluated, then either expanded or thrown away with one `rm -rf native/`.

---

## 3. How the user runs it (no Mac required)

1. **One-time:** install the free **Expo Go** app from the App Store on the iPhone.
2. From any machine (Linux box or Mac — either works):
   ```bash
   cd native
   npm install
   npx expo start --tunnel
   ```
3. Scan the QR code in the terminal with the iPhone Camera app — Expo Go opens and loads the slice.
4. Save any file → phone updates in ~1 second (Fast Refresh).

`--tunnel` mode routes through Expo's relay (ngrok-based), so the phone does not need to be on the same network as the dev machine. Slightly slower than LAN; eliminates the firewall / IP-discovery question.

**Cold-start: no Xcode, no code signing, no provisioning profile, no 7-day expiry, no CocoaPods/SPM, no Simulator.**

---

## 4. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Runtime | **Expo (latest stable SDK)** (managed workflow) | Maximum compatibility with Expo Go; no native module ejection needed for any feature in the slice. SDK pinned during implementation against the latest Expo Go version available on the iOS App Store at install time. |
| Language | **TypeScript** (strict) | Matches the existing web app; reuses content types verbatim |
| Navigation | **Expo Router** (file-based, native-stack + tabs) | Modern Expo default; provides native iOS slide push transitions and native tab bar |
| State | **Zustand** + `persist` middleware on `@react-native-async-storage/async-storage` | Existing store ports almost verbatim; persist middleware handles hydration cleanly |
| Styling | **Plain `StyleSheet` + a `theme.ts` token file** | NOT NativeWind. See §6 |
| Icons | **`@expo/vector-icons`** (MaterialCommunityIcons) | Bundled with Expo; rich icon set covering everything in the slice |
| Safe areas | **`react-native-safe-area-context`** | Standard solution for notch / home-indicator insets |
| Haptics | **`expo-haptics`** | Supported in Expo Go; mirrors the existing `tapLight()` / `tapMedium()` helpers |
| Logo / assets | PNG (from existing `public/icons/icon-512.png`) | Avoids `react-native-svg-transformer` config risk |

**Expo Go limitations confirmed acceptable for the slice:** none of the chosen libraries require a custom development build. Everything works in stock Expo Go.

---

## 5. Navigation structure

Using Expo Router's file-based routing:

```
native/app/
├── _layout.tsx                    Root layout: decides onboarding vs main
├── onboarding/
│   ├── _layout.tsx                Native stack (slide transitions)
│   ├── login.tsx                  Login screen
│   ├── status.tsx                 Status selection
│   ├── region.tsx                 Region selection (searchable list)
│   └── interests.tsx              Interests word-cloud (multi-select)
├── (tabs)/
│   ├── _layout.tsx                Bottom tab bar (4 tabs)
│   ├── catalog.tsx                Catalog grid
│   ├── index.tsx                  Home (the "Головна" tab; index = default)
│   ├── ai.tsx                     Stub
│   └── applications.tsx           Stub
└── +not-found.tsx
```

**Launch behavior (in root `_layout.tsx`):**
- Hydrate Zustand store from `AsyncStorage`.
- If `profile.didOnboard === true` → redirect to `(tabs)` (lands on Home tab).
- Else → redirect to `onboarding/login`.

**Onboarding flow:**
- Login → `markMockLoggedIn()` → push `onboarding/status` (or "Продовжити без входу" → push status).
- Status → `setProfile({ status })` → push `onboarding/region`.
- Region → `setProfile({ region })` → push `onboarding/interests`. "Пропустити" → push interests with no region change.
- Interests → `setProfile({ interests })` → **replace** stack with `(tabs)` (no back-to-onboarding).

**Tab bar:**
- Tabs in order: Каталог · Головна · AI · Мої послуги (matches the existing `BottomNav`).
- Active state: filled icon + brand-color label + an olive bar above the active tab (mirrors the existing visual treatment).
- Uses `react-native-safe-area-context` so the bar respects the iPhone home indicator.

---

## 6. Styling: tokens & approach

### Why `StyleSheet`, not NativeWind

NativeWind v4 brings Tailwind class syntax to React Native, which would preserve continuity with the existing Tailwind class names. It was considered and rejected for this slice because:

- The implementer (Claude on the Linux box) cannot visually verify renders. NativeWind requires Babel plugin + Metro config + a `global.css` setup that is easy to get subtly wrong when developing blind, and config mistakes surface only at app launch in Expo Go.
- Plain `StyleSheet` is a single-file, declarative API with no build-time config beyond TypeScript. If it bundles, it works.

If the full rewrite is approved later, NativeWind can be revisited with proper iterative verification.

### Token file

`native/lib/theme.ts` carries the existing brand tokens verbatim:

```ts
export const colors = {
  brand:      "#2D2926",
  beige:      "#E9E4E3",
  beigeSoft:  "#EFE9E5",
  border:     "#D1CBCB",
  muted:      "#6B6664",
  olive:      "#757341",
  oliveSoft:  "#B0AB75",
  white:      "#FFFFFF",
  inactive:   "#A39E9B",
};

export const radius   = { card: 16, pill: 999 };
export const elevation = {
  card:   { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  button: { shadowColor: "#2D2926", shadowOpacity: 0.22, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
};

export const fontSize = { xs: 12, sm: 14, base: 16, lg: 18, xl: 22, "2xl": 24, "3xl": 30, "4xl": 36 };
export const weight   = { regular: "400", medium: "500", semibold: "600", bold: "700" } as const;
export const spacing  = (n: number) => n * 4;   // 4px grid, matches Tailwind defaults
```

### Components (`native/components/`)

Six components, each ~30–60 lines of `StyleSheet`:

- **`Button`** — primary CTA: brand background, white text, 16px radius, elevation.button, `expo-haptics` tap on press
- **`Card`** — white, beige border, 16px radius, elevation.card
- **`Chip`** — pill, white bg, beige border, brand text, sm font
- **`IconTile`** — 38×38 or 42×42 beige rounded square holding a 22×22 brand-colored icon
- **`Header`** — top bar with title (optional) and a gear icon button on the right (the gear shows a stub alert in the slice)
- **`ScreenContainer`** — `SafeAreaView` + `ScrollView` with consistent horizontal padding

---

## 7. State & persistence

`native/lib/store.ts` is a Zustand store with the **same `Profile` shape** as the web app:

```ts
interface Profile {
  status: "UBD" | "OIVV" | "CHSZ" | null;
  region?: string;
  interests?: string[];
  didOnboard: boolean;
  didMockLogin: boolean;
}
```

Persisted via `zustand/middleware`'s `persist` with the `AsyncStorage` adapter. Only the `profile` slice is persisted in the slice (no `applications` or `settings` yet — out of scope).

`setProfile()`, `markMockLoggedIn()`, and `resetDemo()` mirror the web semantics. `resetDemo()` is not user-facing in the slice (settings is stubbed) but exists so it's trivial to wire a debug-tap on the version label later.

---

## 8. Content

Pure-data TypeScript files copied verbatim from the web app:
- `native/content/types.ts`
- `native/content/statuses.ts`
- `native/content/regions.ts`
- `native/content/interests.ts`
- `native/content/categories.ts`
- `native/content/articles.generated.ts` (snapshot copy — no markdown pipeline in the slice; drift if the web app's articles change later is acceptable)

No DOM dependencies in any of these — they're plain arrays/objects. Imports adjust from `@/content/...` to a relative path.

### Icon mapping

The web app uses `@iconify/react` with Remix icon names (`ri:*`). React Native maps them to `MaterialCommunityIcons` from `@expo/vector-icons` via a small table in `native/lib/icons.ts`:

| `ri:*` (web)            | MCI name (RN)                  | Used by                |
|--------------------------|--------------------------------|------------------------|
| `ri:heart-add-line`      | `heart-plus-outline`           | Category: health       |
| `ri:shield-user-line`    | `shield-account-outline`       | Category: social-protection |
| `ri:building-line`       | `office-building-outline`      | Category: housing      |
| `ri:bus-line`            | `bus`                          | Category: transport    |
| `ri:file-copy-2-line`    | `file-document-multiple-outline` | Category: documents  |
| `ri:graduation-cap-line` | `school-outline`               | Category: education    |
| `ri:refund-2-line`       | `cash-refund`                  | Category: tax          |
| `ri:basketball-line`     | `basketball`                   | Category: sport        |
| `ri:hand-coin-line`      | `hand-coin-outline`            | Category: grants       |
| `ri:map-pin-2-line`      | `map-marker-outline`           | Category: regional     |
| `ri:apps-2-line/fill`    | `apps` / `apps`                | Tab: Каталог           |
| `ri:home-5-line/fill`    | `home-outline` / `home`        | Tab: Головна           |
| `ri:sparkling-2-line/fill` | `creation` / `creation`      | Tab: AI, Home AI tile  |
| `ri:file-list-3-line/fill` | `clipboard-list-outline` / `clipboard-list` | Tab: Мої послуги |
| `ri:settings-3-line`     | `cog-outline`                  | Header gear            |

These are closest-fit substitutions, not pixel-perfect matches, and exact MCI icon names are verified against the current `@expo/vector-icons` set during implementation (substitutions may shift slightly). The user's subjective verdict on the slice should account for icon fidelity — improvable in the full rewrite by adding `react-native-remix-icon` later (deferred to avoid an extra dependency in the slice).

---

## 9. Screen-by-screen behavior (faithful mirror)

### 9.1 Login
- Centered: logo PNG, tagline "Державні послуги для ветеранів та ветеранок", primary `Button` "Увійти через Дія", link "Продовжити без входу".
- Primary button: `markMockLoggedIn()` + push `status`. Link: just push `status`.

### 9.2 Status
- Title "Оберіть свій статус", muted subtitle.
- Three full-width `Card`s for УБД / ОІВВ / ЧСЗ (short + full + description).
- Tap → `setProfile({ status })` + push `region`.

### 9.3 Region
- Title "Ваш регіон", muted subtitle, search `TextInput`.
- Scrollable `FlatList` of 26 regions filtered by case-insensitive search.
- Tap a region → `setProfile({ region })` + push `interests`.
- "Пропустити" link at bottom → `setProfile({})` + push `interests`.

### 9.4 Interests
- Title "Що вас найбільше цікавить?", subtitle "Можна обрати декілька…".
- 8 pill buttons in a `flexWrap` row, sized via the same `text-3xl / text-2xl / text-4xl / …` rotation from the web (translated to numeric font sizes from `theme.fontSize`).
- Tap a pill → toggle in local `selected` state. Selected: olive-soft bg, white text. Unselected: white bg, brand text, border.
- "Готово" → `setProfile({ interests: selected })` + **replace** with `(tabs)`. "Пропустити" → `setProfile({})` + replace with `(tabs)`.

### 9.5 Home (Головна tab)
- `Header` with gear (gear shows stub alert).
- "Доброго дня 👋" (muted, sm).
- "Ваші послуги" (semibold, 2xl).
- Row of `Chip`s — status short label + region (if set).
- AI tile: brand bg, white text, sparkling icon + "Запитати в AI — напишіть питання…". Tap → stub alert.
- "Рекомендовано вам" (muted, sm semibold).
- Up to 5 articles filtered by `(status matches) AND (no interests selected OR article's category is in interest→category mapping)`. Each rendered as a `Card`-style row with `IconTile` (category icon) + title + category name + step count. Tap → stub alert.

### 9.6 Catalog (Каталог tab)
- `Header` with title "Каталог послуг".
- 2-column grid (`FlatList` with `numColumns={2}` and `columnWrapperStyle`) of all 10 categories.
- Each tile: white card, 16px radius, `IconTile` (size 38) top-left, Ukrainian name semibold below. Min-height 112.
- Tap → stub alert.

### 9.7 AI tab (stub)
- Centered: large sparkling icon, "AI асистент" title, "Цей розділ — у повній версії." muted body.

### 9.8 Мої послуги tab (stub)
- Centered: large clipboard icon, "Мої послуги" title, "Цей розділ — у повній версії." muted body.

---

## 10. Verification strategy

### On the Linux box (me)

The slice must clear all of these before the user is told to pull:

1. **`npx tsc --noEmit`** — no type errors.
2. **`npx expo-doctor`** — no fatal configuration errors.
3. **`npx expo export --platform ios`** — full production JS bundle succeeds (proves every import resolves and Metro can bundle the entire app).
4. *Optional, time permitting:* a handful of pure-logic tests with Jest + `@testing-library/react-native`:
   - The Home recommendation filter returns the expected articles for each (status × interests) combination.
   - The interest pill toggle adds/removes ids correctly.

I cannot see rendered UI on Linux. That limitation is explicit and accepted; the user's iPhone is the rendering verifier.

### On the iPhone (user)

The user runs through the success-criteria checklist in §1.

---

## 11. Known limits & honest caveats

- **Icon fidelity** — Material Community Icons are close substitutes for Remix Icons, not identical. Some look-and-feel differences are inevitable. Not a slice blocker; addressable in the full rewrite by switching to a Remix-icon font.
- **Logo** — PNG, not the SVG wordmark. Crisp at 1× but loses some vector precision at larger sizes. Sufficient for the login screen at the chosen render size; addressable later by adding `react-native-svg-transformer` if needed.
- **Articles drift** — `articles.generated.ts` is a snapshot copy. If the web app's article markdown changes after this slice is built, the native slice's recommended list won't update automatically.
- **Tab bar styling** — Expo Router's default tab bar can be styled, but the exact "olive bar above active tab" indicator is a custom render. Implementing it requires `tabBarButton` / `tabBarIcon` custom components, which is straightforward but adds ~30 lines.
- **Tunnel start-up time** — `npx expo start --tunnel` takes 30-60s on first run to set up the ngrok tunnel. Subsequent starts are faster.
- **No Android verification** — the slice targets iOS only. It will likely run on Android via Expo Go without issue, but is not validated.

---

## 12. Decision points (already locked in)

- **Slice first, not full rewrite** — agreed
- **React Native + Expo, not Swift/Flutter** — agreed
- **`native/` folder co-located with the web app, not a separate repo** — agreed
- **`StyleSheet` + `theme.ts`, not NativeWind** — implementer decision (§6)
- **MaterialCommunityIcons, not `react-native-remix-icon`** — implementer decision (§8 icon mapping)
- **PNG logo, not SVG** — implementer decision (§4 stack)
- **Bottom-tab navigation with 2 real + 2 stub tabs** — agreed (this revision)

---

## 13. What comes after the slice

This spec deliberately defines no Phase 2. The slice's purpose is to inform a single decision:

> **"Does native React Native feel meaningfully better than the Capacitor build?"**

After the user's verdict:
- **Yes, meaningfully better** → write a new spec for expansion (catalog category pages → service detail → applications → AI chat → settings → real onboarding polish).
- **No, not enough to justify the cost** → keep the Capacitor build; the slice is archived under `native/` or deleted with `rm -rf native/`.
- **Yes, but only for certain things** → discuss a hybrid (e.g., keep web for content-heavy AI/articles, native for navigation/onboarding).

No code in the slice prejudges this outcome.
