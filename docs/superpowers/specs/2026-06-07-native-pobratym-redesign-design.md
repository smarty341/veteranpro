# Native redesign — Побратим-style onboarding, gamification & specialist concierge

**Date:** 2026-06-07
**Branch:** `feature/native-polish-pass`
**Scope:** `/root/app/native/` (Expo / React Native vertical slice)
**Status:** Design approved (pending spec review)

---

## 1. Goal

Bring three things the user liked in `pobratym-prototype.html` into the native app, while
staying on the **MoVA (Ministry of Veterans Affairs)** brand:

1. A more human, **needs-focused onboarding flow** (ported faithfully from the prototype).
2. **Gamification** — levels, XP, daily streak, and a step-by-step "path".
3. A **dark** visual treatment.

Plus one **new feature** not in the prototype: **automatic assignment of a personal veteran
support specialist** ("Вам призначено персонального фахівця супроводу") with a visual assignment
moment and a persistent concierge profile.

Everything is **local mock** — no backend. This is a vertical slice / prototype to evaluate
expanding into a full rewrite.

---

## 2. Brand decisions (resolved)

The prototype is dark with gold/green gradients and emoji. The MoVA brand is normally
light/paper, charcoal + single orange accent, square corners, no gradients, no emoji. Resolution:

- **Dark is on-brand** via MoVA's charcoal **"inverse / memorial" surface** (`#2D2926` ground,
  paper-tone text `#E9E4E3`, orange accent `#EE754D`). We adopt this instead of inventing a dark
  theme.
- **Copy the prototype's logic, not its skin.** Gold/green → brand orange + secondary tints.
  Gradients → flat fills. Rounded 16px → square (radius 0–10; pill only for badges/chips).
- **Emoji are kept** — explicit user override of the brand's no-emoji rule (they make the app
  feel friendlier). This is a deliberate, documented deviation.
- **Category tints:** MoVA's secondary tones become quiet category/gamification accents —
  `warmgray #A19388` (health), `light #E6E88F` (sport/positive), `khaki #B0AB75` (education),
  `orange #EE754D` (social/primary).

---

## 3. Visual system (theme overhaul)

`lib/theme.ts` moves from the light paper palette to a dark token set. New/changed tokens:

```
surface       #2D2926   app background (brand inverse)
surfaceCard   #383330   raised cards
surfaceCard2  #423C38   nested / pressed
border        #4A433F   hairline on dark
text          #E9E4E3   primary (paper)
textMuted     #A89F98   secondary
textFaint     #7A736D   tertiary
accent        #EE754D   orange — buttons, active tab, XP, progress fill
accentPress   #C9531F
tintHealth    #A19388   warm gray
tintSport     #E6E88F   light
tintEdu       #B0AB75   khaki
success       #B0AB75   (no green in brand; khaki/light stand in)
```

- Keep `radius` (card 16 → review per-component; brand prefers square — use 10 for cards,
  0 where structural, 999 for chips/badges only).
- `elevation`: dark theme leans on borders + slightly lighter card fills, not shadows. Keep a
  soft low shadow only for modals/sheets.
- All existing components (`Button`, `Card`, `Chip`, `IconTile`, `Header`, `Logo`,
  `OnboardingScaffold`, `ScreenContainer`, `GearButton`, `FadeUp`) are re-pointed at the dark
  tokens. **Structure/props unchanged** — this is a recolor, not a rewrite.
- `StatusBar` style flips to `light` app-wide.

---

## 4. Navigation

Final tab bar (flat line icons retained, active tint = orange):

```
🏠 Головна  |  🏷 Можливості  |  ✨ AI-бро  |  📋 Мої послуги
```

- **Каталог tab removed.** The category grid (`catalog/index.tsx` + `catalog/[id].tsx`) moves
  under `applications/` (Мої послуги). Routes change from `/(tabs)/catalog/*` to
  `/(tabs)/applications/catalog/*` (or equivalent nested route).
- **AI tab** is relabelled **"AI-бро"** (label only; route stays `ai`).
- New tab **"Можливості"** added (`app/(tabs)/opportunities/`).
- `app/(tabs)/_layout.tsx` `TAB_ICONS` + `<Tabs.Screen>` order updated accordingly.

---

## 5. Onboarding — 6 screens, ported from the prototype

The prototype's wizard is ported faithfully (not compressed). `OnboardingScaffold` is generalized
from a fixed 3 dots to **N dots** (here 6); `step` prop becomes `step: number` + `total: number`.

| # | Route | Screen | Source | Type |
|---|-------|--------|--------|------|
| 1 | `onboarding/stage` | **Етап** — «На якому ти етапі?» (служу / звільняюсь / звільнився / з родини) | prototype `data-step="0"` | single |
| 2 | `onboarding/health` | **Здоров'я** (все гаразд / лікуюсь / інвалідність / не відповідати) | prototype `data-step="2"` | single |
| 3 | `onboarding/housing` | **Сім'я і житло** (діти / своє житло / оренда / пошкоджене) | prototype `data-step="3"` | multi |
| 4 | `onboarding/work` | **Робота** (старе місце / нова / бізнес / навчання) | prototype `data-step="4"` | single |
| 5 | `onboarding/interests` | **Інтереси** (спорт / творчість / ком'юніті / волонтерство) | prototype `data-step="5"` | multi |
| 6 | `onboarding/profile` | **Локація + Статус** — region picker **and** УБД/ОІВВ/ЧСЗ status on one screen | our `regions` + `statuses` | two pickers |

- Single-choice screens auto-advance on tap (≈280ms) like the prototype.
- Multi-choice screens have a "Далі" button + "Пропустити".
- `onboarding/login.tsx` (Дія mock login) stays as the pre-onboarding entry; flow:
  `login → stage → health → housing → work → interests → profile → building → assignment → home`.
- `app/index.tsx` routing gate updated for the new first onboarding route.

### Content files (new / changed)

- `content/stages.ts` (new): `serving | leaving | out | family`, each `{ id, emoji, title, hint }`.
- `content/health.ts` (new): `ok | treat | disability | skip`.
- `content/housing.ts` (new): `kids | ownhome | rent | damaged` (multi-select flags).
- `content/work.ts` (new): `return | new | biz | study`.
- `content/interests.ts` (**replaced**): prototype's 4 mission-interests `sport | hobby | community | volunteer`.
- `content/statuses.ts`, `content/regions.ts`: unchanged, reused on screen 6.

---

## 6. "Будуємо ваш шлях" + path model

A pure function `lib/buildPath.ts` ports the prototype's `buildPath()` transparency logic.

- **Input:** the full profile (`stage, health, housing[], work, interests[], status, region`).
- **Output:** `{ lines: PathLine[], steps: PathStep[], total: number }` where `lines` are the
  add/modify/remove explanations shown on the reveal screen, and `steps` are the 18-step
  «Твій шлях: УБД» content (5 etapy), ported from the prototype's `#s-path` markup, filtered/
  augmented by the answers.
- **Path keys off BOTH Етап and Статус** (resolved): Етап drives prototype branches (90-day mode,
  family mode, etc.); Статус adds its own blocks (e.g. ОІВВ → МСЕК / протезування / авто /
  податкові пільги). Both merge into one ordered path.

### Reveal screen `app/onboarding/building.tsx`

Ports `#s-build`: animated `bline` rows fade in sequentially (brand-styled: orange/khaki/muted
markers, no gradient), then a summary card "Ваш шлях готовий: N кроків у 5 етапах" and a "Далі"
button → specialist assignment.

---

## 7. NEW: specialist concierge assignment

### Content `content/specialists.ts` (new)

A pool of 3 specialists: `{ id, name, role, oblast, blurb, phone, initials, tint }`. Assignment
is **deterministic** (no randomness): pick by `region` (fallback by `status`, fallback first).
Stored as `profile.assignedSpecialistId`.

### Assignment screen `app/onboarding/assignment.tsx`

After "building": full-screen moment.
- Heading: **«Вам призначено персонального фахівця супроводу»**.
- **Circular avatar** (initials-in-circle, orange ring) fades + scales in (Reanimated, brand
  motion: 150–250ms ease-out, no bounce).
- Concierge card: name · role · oblast · short blurb.
- Buttons: **«Звʼязатися»** (mock — toast/alert) and **«Почати»** (→ Home, sets `didOnboard`).

> Avatar is initials-in-circle for the slice (no photo sourcing). Swap to a bundled/duotone
> photo later. Circular shape is an intentional deviation (brand is square) — matches the user's
> explicit "circular profile pic" request.

### Persistence

A compact **specialist card** appears on Home (and in Мої послуги): avatar + name + role +
"Звʼязатися". Reads `assignedSpecialistId` from the store.

---

## 8. Gamification — full RPG layer

### Store additions (`lib/store.ts`)

`Profile` (or a parallel `progress` slice) gains:

```
stage, health, housing[], work        // onboarding answers
status, region, interests[]           // (status/region/interests already partly exist)
assignedSpecialistId
level: number                         // seeded 1
xp: number                            // seeded 0
streak: number                        // seeded 1 (days)
completedMissionIds: string[]         // seeded []
```

- `path` itself is **derived** (not stored) via `buildPath(profile)` so it stays consistent.
- Seeded on first onboard. `resetDemo()` extended to clear all new fields.
- XP→level curve: a small pure helper `lib/leveling.ts` (e.g. 500 XP/level). Completing a mission
  adds XP, may trigger a level-up (haptic + toast).

### Home `app/(tabs)/index.tsx` (rebuilt)

Ports the prototype `#s-home`, brand-styled:
- Greeting + **level ring** (conic-style ring → RN: orange arc over track, level number center).
- **Streak strip** (7 day cells; filled = orange-tinted).
- **«Ваш шлях» progress card**: flat orange progress bar, "N / 18 кроків", → full path screen.
- **Active missions** list (cards: emoji tile, title, meta, "+XP"): tap a mission →
  complete → +XP, haptic, toast, level-up check; completed missions persist.
- **Specialist card** (section 7).
- **Можливості teaser** (1–2 featured offers → Можливості tab).

### Path screen `app/path.tsx` (stack screen pushed from Home, not a tab)

Ports `#s-path`: the 18-step path grouped in 5 etapy, each step with done-tick + XP, derived from
`buildPath(profile)`. "Єдина ветеранська лінія" callout card at the bottom (ported). Registered in
the root `app/_layout.tsx` stack (outside the tab bar) and opened via `router.push("/path")`.

---

## 9. Можливості (offers) — new tab

### Content `content/offers.ts` (new)

Mock partners (seeded):

| Partner | Offer | Category / tint |
|---|---|---|
| **WOG** | −5 ₴/л пального | transport / orange |
| **Riot Division** | −50% одяг | lifestyle |
| **Mindly** | 5 год безкоштовної терапії | health / warmgray |
| Кавʼярня «Тил» | −20% | food (filler, from prototype) |
| Sport Life | −50% перший місяць | sport (filler) |
| Аптека «Подорожник» | −15% | health (filler) |

Each offer: `{ id, name, emoji|logo, discountLabel, meta, category, veteranBiz?: bool }`.

### Screen `app/(tabs)/opportunities/index.tsx`

Ports `#s-off`: search field (visual only), category chips, offer cards with discount badge and
"Показати QR" → **QR sheet modal** (ports `#m-qr`: CSS-pattern QR, "✓ Статус ветерана
верифіковано", "оновлюється щохвилини"). Brand-styled (square cards, orange accents, dark sheet).

---

## 10. Мої послуги (services) — absorbs the catalogue

`app/(tabs)/applications/index.tsx` (rebuilt) becomes:
- Top: in-progress / recommended services (re-keyed off `status` + needs via the existing
  `recommend()` in `lib/recommendations.ts`, adapted to the new profile shape).
- Below: the full **category grid** (moved from the old Каталог tab) → category detail screens.
- The specialist card also surfaces here.

---

## 11. Components — new / changed

| Component | Change |
|---|---|
| `lib/theme.ts` | dark token set (section 3) |
| `lib/store.ts` | new profile/progress fields + extended `resetDemo()` |
| `lib/buildPath.ts` | **new** — pure path/explanation builder |
| `lib/leveling.ts` | **new** — XP→level helper |
| `components/OnboardingScaffold.tsx` | generalize dots to N steps |
| `components/Avatar.tsx` | **new** — circular initials avatar with ring |
| `components/LevelRing.tsx` | **new** — level ring |
| `components/StreakStrip.tsx` | **new** — 7-day streak |
| `components/ProgressBar.tsx` | **new** — flat orange path bar |
| `components/MissionCard.tsx` | **new** |
| `components/OfferCard.tsx` + `components/QrSheet.tsx` | **new** |
| `components/SpecialistCard.tsx` | **new** |
| Onboarding screens | `stage/health/housing/work` new; `interests` reworked; `profile` (loc+status) new; `building`, `assignment` new |

---

## 12. Scope / mock boundaries (YAGNI)

- No backend, no real auth, no real QR. All data from `content/*` + zustand/AsyncStorage.
- Avatars = initials-in-circle (photo later).
- "Звʼязатися", search, "Подати заявку" = toast/alert stubs.
- Offers/discounts are illustrative mocks.
- Reuse existing `lib/haptics.ts`, `lib/icons.ts`, `lib/plurals.ts`, `FadeUp`, Reanimated setup.

---

## 13. Open questions / confirmations

- None blocking. (Onboarding order, both-keys path logic, dark+tints palette, 4-tab layout with
  catalogue merged, emoji-kept, full RPG depth — all resolved with the user.)

---

## 14. Out of scope (explicitly not now)

- iOS native build / `npx cap`-style packaging (separate track).
- Real partner integrations, real Дія/ЕДРВВ verification.
- Replacing the Archivo→Ki / e-Ukraine font substitution work.
- Live chatbot integration (separate effort).
