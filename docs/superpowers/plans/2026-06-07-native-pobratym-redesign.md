# Ветеран PRO native redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Expo/RN app (`/root/app/native`) into the dark, MoVA-branded, gamified "Побратим-style" experience: needs-focused 6-step onboarding → transparent path-build → automatic specialist assignment → gamified Home, plus a Можливості offers tab, a Мої послуги catalogue, and a streaming AI-бро chat.

**Architecture:** Pure, framework-free logic (path building, leveling, specialist assignment, data) lives in `lib/*` + `content/*` and is unit-tested with the existing `ts-jest` (node) runner. Screens are thin expo-router views composed from small reusable components, styled from a single dark token set in `lib/theme.ts`. State persists via the existing zustand + AsyncStorage store. **Source of visual truth = the committed mockups in `docs/mockups/screens/*.html`** — screens port those layouts 1:1 into RN.

**Tech Stack:** Expo SDK 54, expo-router, React Native, react-native-reanimated 4 (+ worklets), zustand, AsyncStorage, @expo/vector-icons (MaterialCommunityIcons), TypeScript, jest + ts-jest.

**Testing reality:** `jest.config.js` is `ts-jest`/`testEnvironment: node`, `testMatch: __tests__/**/*.test.ts`. So **only pure `.ts` logic is unit-tested** (TDD tasks below). RN screens/components are **verified manually in Expo Go** (`npm start`, open on device) — each screen task lists exactly what to check. Do not add `.tsx` tests; the runner has no RN/jsdom preset.

**Reference docs:** spec `docs/superpowers/specs/2026-06-07-native-pobratym-redesign-design.md`; scrape report `docs/superpowers/specs/veteranpro-scrape-report.md`; mockups `docs/mockups/screens/`.

**Native-feel mandate (cross-cutting — applies to every screen task):** the app must feel as
native as possible on iPhone (target **iPhone 17 Pro Max**, ProMotion 120 Hz, Dynamic Island).
This overrides the brand's "minimal motion" where they conflict. For each screen: add smooth
expo-router transitions, Reanimated UI-thread animations (press scale 0.97–0.98, level-ring/progress
animating to value, avatar spring on assignment, mission-complete micro-animation), and `expo-haptics`
feedback (selection tick on taps/tabs, success notification on mission-complete / step-done /
specialist-assigned, light impact on primary buttons). Respect `useSafeAreaInsets()`. Keep effects
150–280 ms and purposeful. See spec §3 "Native feel (iOS-first)".

---

## File Structure (what gets created / changed)

**Theme & infra**
- `lib/theme.ts` — MODIFY: dark token set (new semantic keys).
- `lib/icons.ts` — MODIFY: add new `ri:*`→MCI mappings.

**Content (data — all in Ukrainian)**
- `content/stages.ts`, `content/health.ts`, `content/housing.ts`, `content/work.ts` — CREATE.
- `content/interests.ts` — REPLACE (prototype's 4 mission-interests).
- `content/specialists.ts` — CREATE (pool of 3).
- `content/offers.ts` — CREATE (WOG / Riot Division / Mindly + fillers).
- `content/aiCanned.ts` — CREATE (opening message, prompts, canned replies).
- `content/pathBase.ts` — CREATE (the 18-step base УБД path, 5 etapy).
- `content/services.ts` — CREATE (merges `articles.generated.ts` + `services.scraped.json`).

**Pure logic (TDD)**
- `lib/leveling.ts` — CREATE.
- `lib/buildPath.ts` — CREATE.
- `lib/assignSpecialist.ts` — CREATE.
- `lib/store.ts` — MODIFY: extend `Profile`, seeding, `resetDemo`.
- `lib/recommendations.ts` — MODIFY: adapt to new interest set.

**Reusable components**
- `components/Avatar.tsx`, `components/LevelRing.tsx`, `components/StreakStrip.tsx`, `components/ProgressBar.tsx`, `components/MissionCard.tsx`, `components/SpecialistCard.tsx`, `components/OfferCard.tsx`, `components/QrSheet.tsx`, `components/ChatBubble.tsx`, `components/TypingDots.tsx` — CREATE.
- `lib/useTypewriter.ts` — CREATE (hook; pure enough to unit-test the reveal math is overkill — verify in app).
- `components/OnboardingScaffold.tsx` — MODIFY: N-step dots.
- Existing `components/Button.tsx`, `Card.tsx`, `Chip.tsx`, `IconTile.tsx`, `Header.tsx`, `GearButton.tsx`, `ScreenContainer.tsx` — MODIFY: re-point to dark tokens.

**Screens (expo-router)**
- `app/_layout.tsx` — MODIFY: register `path` + onboarding routes; dark theme.
- `app/index.tsx` — MODIFY: gate to new first onboarding route.
- `app/onboarding/_layout.tsx` — keep.
- `app/onboarding/stage.tsx`, `health.tsx`, `housing.tsx`, `work.tsx`, `profile.tsx`, `building.tsx`, `assignment.tsx` — CREATE.
- `app/onboarding/interests.tsx` — REWORK to prototype interests; delete `interests-grid.tsx`, `interests-list.tsx`, `region.tsx`, `status.tsx` (logic folded into new screens).
- `app/(tabs)/_layout.tsx` — MODIFY: 4 tabs (Головна/Можливості/AI-бро/Мої послуги), remove catalog tab.
- `app/(tabs)/index.tsx` — REWRITE: gamified Home (Variant A).
- `app/(tabs)/opportunities/_layout.tsx` + `index.tsx` — CREATE.
- `app/(tabs)/ai/index.tsx` — REWRITE: streaming chat.
- `app/(tabs)/applications/index.tsx` — REWRITE: «В роботі» + category grid.
- `app/(tabs)/applications/[category].tsx` — CREATE: category service list (absorbs old catalog detail).
- Remove `app/(tabs)/catalog/` (move detail into `applications/[category].tsx`).
- `app/path.tsx` — CREATE: full path screen.

---

## Phase 0 — Theme & icons

### Task 1: Dark theme tokens

**Files:** Modify `lib/theme.ts`

- [ ] **Step 1: Replace the `colors` object** (keep `radius`, `space`, `fontSize`, `weight`; adjust `elevation`).

```ts
// Dark MoVA "inverse/memorial" surface. Values mirror docs/mockups/_brand.css.
export const colors = {
  surface:     "#1A1714", // app background (warm near-black)
  surfaceCard: "#322D2A", // raised cards
  surfaceCard2:"#3C3633", // nested / pressed
  border:      "#473F3B", // hairline on dark
  text:        "#E9E4E3", // primary (paper)
  textMuted:   "#A89F98", // secondary
  textFaint:   "#7A736D", // tertiary
  accent:      "#EE754D", // orange
  accentPress: "#C9531F",
  onAccent:    "#241200", // text on orange
  tintHealth:  "#A19388", // warm gray
  tintSport:   "#E6E88F", // light
  tintEdu:     "#B0AB75", // khaki
  white:       "#FFFFFF", // logo chips only
} as const;
```

- [ ] **Step 2: Update `radius` + `elevation`** (rounded corners confirmed by user — keep `card: 16`, but mockups use ~10; set to 14 as the middle, pill 999):

```ts
export const radius = { card: 14, pill: 999, iconTile: 10 } as const;

export const elevation = {
  card:   { shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  button: { shadowColor: "#000", shadowOpacity: 0.22, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
} as const;
```

- [ ] **Step 3: Type-check.** Run: `npx tsc --noEmit` — Expected: errors ONLY in files still referencing old color keys (`colors.brand`, `colors.beige`, `colors.beigeSoft`, `colors.muted`, `colors.olive`, `colors.oliveSoft`, `colors.inactive`). These are fixed in Task 2 + Phase 6. Note the list.

- [ ] **Step 4: Commit.** `git add lib/theme.ts && git commit -m "feat(native): dark MoVA theme tokens"`

### Task 2: Icon mappings

**Files:** Modify `lib/icons.ts`

- [ ] **Step 1: Add entries to `mciFor`** (after the existing ones):

```ts
  // Tabs (new)
  "ri:price-tag-3-line":  "tag-outline",
  "ri:price-tag-3-fill":  "tag",
  // Actions / chrome
  "ri:qr-code-line":      "qrcode",
  "ri:chat-3-line":       "chat-outline",
  "ri:phone-line":        "phone-outline",
  "ri:arrow-left-s-line": "chevron-left",
  "ri:arrow-right-s-line":"chevron-right",
  "ri:arrow-down-s-line": "chevron-down",
  "ri:arrow-up-line":     "arrow-up",
  "ri:id-card-line":      "card-account-details-outline",
  "ri:heart-pulse-line":  "heart-pulse",
  "ri:close-line":        "close",
  "ri:check-line":        "check",
```

- [ ] **Step 2: Type-check** `npx tsc --noEmit` (icons.ts should be clean). **Commit.** `git add lib/icons.ts && git commit -m "feat(native): add icon mappings for new screens"`

---

## Phase 1 — Content data

> All these are plain data modules with a `validXIds` set, mirroring `content/statuses.ts`. Each gets a tiny uniqueness test.

### Task 3: Onboarding option content (stages / health / housing / work)

**Files:** Create `content/stages.ts`, `content/health.ts`, `content/housing.ts`, `content/work.ts`; Test `__tests__/content.test.ts`

- [ ] **Step 1: Write `content/stages.ts`** (ported from prototype `data-step="0"`):

```ts
export type StageId = "serving" | "leaving" | "out" | "family";
export const stages: { id: StageId; emoji: string; title: string; hint: string }[] = [
  { id: "serving", emoji: "🪖", title: "Ще служу",                    hint: "Підготовка до переходу за 90 днів до виходу" },
  { id: "leaving", emoji: "📋", title: "Звільняюсь найближчим часом", hint: "Рапорт, ОГД, документи" },
  { id: "out",     emoji: "🏠", title: "Вже звільнився / звільнилась", hint: "Адаптація, пільги, робота, ком'юніті" },
  { id: "family",  emoji: "👪", title: "Я з родини ветерана",         hint: "Допомога близькій людині" },
];
export const validStageIds = new Set(stages.map(s => s.id));
```

- [ ] **Step 2: Write `content/health.ts`** (prototype `data-step="2"`):

```ts
export type HealthId = "ok" | "treat" | "disability" | "skip";
export const healthOptions: { id: HealthId; emoji: string; title: string; hint: string }[] = [
  { id: "ok",         emoji: "💪", title: "Все гаразд",            hint: "Базовий медичний блок" },
  { id: "treat",      emoji: "🩺", title: "Є поранення / лікуюсь", hint: "Реабілітація та лікарі — на початок шляху" },
  { id: "disability", emoji: "♿", title: "Оформлена інвалідність", hint: "+ кроки МСЕК, протезування, авто, податкові пільги" },
  { id: "skip",       emoji: "🤐", title: "Не хочу відповідати",   hint: "Ок. Медичний блок буде стандартним" },
];
export const validHealthIds = new Set(healthOptions.map(h => h.id));
```

- [ ] **Step 3: Write `content/housing.ts`** (multi-select flags, prototype `data-step="3"`):

```ts
export type HousingId = "kids" | "ownhome" | "rent" | "damaged";
export const housingOptions: { id: HousingId; emoji: string; title: string; hint: string }[] = [
  { id: "kids",    emoji: "🧒", title: "Є діти",                  hint: "+ грант на освіту дітей, дитячі табори" },
  { id: "ownhome", emoji: "🏡", title: "Є своє житло",           hint: "Пільги на комуналку −75%" },
  { id: "rent",    emoji: "🔑", title: "Орендую / шукаю житло",  hint: "+ єОселя: іпотека під 7%" },
  { id: "damaged", emoji: "🧱", title: "Житло пошкоджене / зруйноване", hint: "+ єВідновлення: компенсація або сертифікат" },
];
export const validHousingIds = new Set(housingOptions.map(h => h.id));
```

- [ ] **Step 4: Write `content/work.ts`** (prototype `data-step="4"`):

```ts
export type WorkId = "return" | "new" | "biz" | "study";
export const workOptions: { id: WorkId; emoji: string; title: string; hint: string }[] = [
  { id: "return", emoji: "↩️", title: "Повернусь на старе місце", hint: "Воно зберігається за тобою за законом" },
  { id: "new",    emoji: "🔍", title: "Шукатиму нову роботу",     hint: "+ «Кар'єра ветерана», резюме з ментором" },
  { id: "biz",    emoji: "🏪", title: "Хочу свій бізнес",         hint: "+ бізнес-трек: грант УВФ, статус ветеранського бізнесу" },
  { id: "study",  emoji: "🎓", title: "Навчання / перекваліфікація", hint: "+ безоплатна освіта, ваучери на навчання" },
];
export const validWorkIds = new Set(workOptions.map(w => w.id));
```

- [ ] **Step 5: Write `__tests__/content.test.ts`** (uniqueness):

```ts
import { stages, validStageIds } from "../content/stages";
import { healthOptions, validHealthIds } from "../content/health";
import { housingOptions, validHousingIds } from "../content/housing";
import { workOptions, validWorkIds } from "../content/work";

describe("onboarding content", () => {
  it("has unique ids per set", () => {
    expect(validStageIds.size).toBe(stages.length);
    expect(validHealthIds.size).toBe(healthOptions.length);
    expect(validHousingIds.size).toBe(housingOptions.length);
    expect(validWorkIds.size).toBe(workOptions.length);
  });
});
```

- [ ] **Step 6: Run** `npx jest content` — Expected: PASS. **Commit.** `git add content/ __tests__/content.test.ts && git commit -m "feat(native): onboarding option content (stage/health/housing/work)"`

### Task 4: Replace interests content

**Files:** Modify `content/interests.ts`

- [ ] **Step 1: Replace file body** with prototype's 4 mission-interests, keeping the `Interest` shape (each maps to content categories so `recommend()` still works):

```ts
import type { CategoryId } from "./types";
export interface Interest { id: string; nameUa: string; emoji: string; categories: CategoryId[]; }
export const interests: Interest[] = [
  { id: "sport",     nameUa: "Спорт",              emoji: "🏃", categories: ["sport"] },
  { id: "hobby",     nameUa: "Творчість і хобі",   emoji: "🎸", categories: ["regional"] },
  { id: "community", nameUa: "Ком'юніті та події", emoji: "🤝", categories: ["regional", "sport"] },
  { id: "volunteer", nameUa: "Волонтерство",       emoji: "🚒", categories: ["regional"] },
];
export const validInterestIds = new Set(interests.map(i => i.id));
```

- [ ] **Step 2: Type-check** `npx tsc --noEmit` (recommendations.ts still compiles — it reads `.categories`). **Note:** `__tests__/recommendations.test.ts` references old interest ids (`treatment`, `grants`) — it will fail until Task 9. That's expected; do not run it yet.
- [ ] **Step 3: Commit** `git add content/interests.ts && git commit -m "feat(native): replace interests with prototype mission-interests"`

### Task 5: Specialists pool

**Files:** Create `content/specialists.ts`

- [ ] **Step 1: Write file:**

```ts
export interface Specialist {
  id: string; name: string; initials: string; role: string;
  oblast: string; blurb: string; phone: string; tint: "tintHealth" | "tintEdu" | "tintSport";
}
export const specialists: Specialist[] = [
  { id: "okravets",  name: "Оксана Кравець",   initials: "ОК", role: "Фахівчиня із супроводу ветеранів",
    oblast: "Київська область", blurb: "Я поруч на кожному кроці — від документів до роботи. Пишіть без вагань.",
    phone: "0 800 505 217", tint: "tintHealth" },
  { id: "ploginov",  name: "Павло Логінов",    initials: "ПЛ", role: "Фахівець із супроводу ветеранів",
    oblast: "Львівська область", blurb: "Розберемо ваші пільги та подамо заявки разом. Без зайвої бюрократії.",
    phone: "0 800 505 217", tint: "tintEdu" },
  { id: "imelnyk",   name: "Ірина Мельник",    initials: "ІМ", role: "Фахівчиня із супроводу родин",
    oblast: "Дніпропетровська область", blurb: "Супроводжую родини Захисників. Допоможу з виплатами та підтримкою.",
    phone: "0 800 505 217", tint: "tintSport" },
];
export const validSpecialistIds = new Set(specialists.map(s => s.id));
```

- [ ] **Step 2: Commit** `git add content/specialists.ts && git commit -m "feat(native): specialist concierge pool"`

### Task 6: Offers + AI canned + base path content

**Files:** Create `content/offers.ts`, `content/aiCanned.ts`, `content/pathBase.ts`

- [ ] **Step 1: `content/offers.ts`** (logos already at `docs/mockups/assets/logos/`; for the app, copy them to `assets/logos/` in Task 19 — here just reference filenames). Use a `logo` field that is `null` for emoji fillers:

```ts
export interface Offer {
  id: string; name: string; meta: string; discount: string;
  logo: string | null;   // require()-able asset key resolved in the screen; null → use emoji
  emoji?: string; category: "fuel" | "clothing" | "health" | "food";
}
export const offers: Offer[] = [
  { id: "wog",    name: "WOG",             meta: "Мережа АЗК",            discount: "−5 ₴/л",          logo: "wog",          category: "fuel" },
  { id: "riot",   name: "Riot Division",   meta: "Одяг та екіпірування",  discount: "−50%",            logo: "riotdivision", category: "clothing" },
  { id: "mindly", name: "Mindly",          meta: "Психотерапія онлайн",   discount: "5 год безкоштовно", logo: "mindly",      category: "health" },
  { id: "tyl",    name: "Кав'ярня «Тил»",  meta: "350 м · ветеранський бізнес", discount: "−20%",      logo: null, emoji: "☕", category: "food" },
];
```

- [ ] **Step 2: `content/aiCanned.ts`:**

```ts
export const aiOpening =
  "Привіт, я — твій цифровий бро. Підкажу по послугам від держави без «згідно-відповідно».";
export const aiPrompts = [
  "Яка допомога мені належить?",
  "Що таке Ветеран-бокс?",
  "Знижки поруч",
];
export const aiReplies: Record<string, string> = {
  "Яка допомога мені належить?":
    "Залежить від статусу. Для УБД це передусім грошова допомога, пільги на комуналку та проїзд, безоплатне лікування й «Ветеранський спорт». Відкрий «Мої послуги» — там усе по поличках.",
  "Що таке Ветеран-бокс?":
    "Ветеран-бокс — це вітальний набір для ветерана: корисний мерч, дрібниці та промокоди партнерів. Замовляєш у застосунку, забираєш у ветеранському просторі або отримуєш доставкою. Це окрема місія на головній.",
  "Знижки поруч":
    "Загляни у «Можливості» — там WOG (−5 ₴/л), Riot Division (−50%) та Mindly (5 год терапії безкоштовно). Показуєш QR на касі — і все.",
};
export const aiFallback =
  "Поки що я демо, але в повній версії я відповім детально й допоможу подати заявку. Спробуй одну з підказок нижче.";
```

- [ ] **Step 3: `content/pathBase.ts`** — the 18-step base УБД path, 5 etapy (ported from prototype `#s-path`). Each step has `id, etap, title, note, xp?, done?`:

```ts
export interface PathStep { id: string; etap: string; title: string; note: string; xp?: number; done?: boolean; }
export const ETAPY = [
  "Етап 1 · Ще на службі",
  "Етап 2 · Перші 30 днів",
  "Етап 3 · Фінанси та пільги",
  "Етап 4 · Здоров'я та відновлення",
  "Етап 5 · Розвиток",
] as const;
export const basePath: PathStep[] = [
  { id: "ubd-status",   etap: ETAPY[0], title: "Статус УБД",                 note: "Вноситься в ЄДРВВ автоматично протягом 5 днів", done: true },
  { id: "report",       etap: ETAPY[0], title: "Рапорт і наказ про звільнення", note: "Обхідний лист, здача майна", done: true },
  { id: "ogd",          etap: ETAPY[0], title: "Одноразова грошова допомога (ОГД)", note: "50% / 25% за кожен рік служби", done: true },
  { id: "tck",          etap: ETAPY[1], title: "Військовий облік у ТЦК",     note: "Статус оновлюється в «Резерв+»", done: true },
  { id: "support",      etap: ETAPY[1], title: "Фахівець із супроводу",      note: "Ветеранський простір або Ветеран PRO у Дії", done: true },
  { id: "vet-box",      etap: ETAPY[1], title: "Ветеран-бокс",               note: "Вітальний набір ветерана · активна місія", xp: 150 },
  { id: "indep-help",   etap: ETAPY[2], title: "Щорічна допомога до Дня Незалежності", note: "Через ПФУ онлайн", done: true },
  { id: "utility-75",   etap: ETAPY[2], title: "Знижка 75% на комуналку",   note: "Монетизована — ПФУ компенсує на картку", xp: 150 },
  { id: "transport",    etap: ETAPY[2], title: "Пільговий проїзд",          note: "Міський транспорт і приміські поїзди — 0 грн", xp: 50 },
  { id: "pension",      etap: ETAPY[2], title: "Пенсійні переваги",         note: "Рік бойових = 1,5 року стажу, +25% ПМ", xp: 100 },
  { id: "family-doc",   etap: ETAPY[3], title: "Сімейний лікар і направлення", note: "Стоматологія, протезування, зір — безоплатно", xp: 100 },
  { id: "rehab",        etap: ETAPY[3], title: "Реабілітація",              note: "Медична, фізична, психологічна — безоплатно", xp: 200 },
  { id: "psych",        etap: ETAPY[3], title: "Психологічна допомога",     note: "Направлення не потрібне · реєстр надавачів", xp: 200 },
  { id: "vet-sport",    etap: ETAPY[3], title: "«Ветеранський спорт» у Дії", note: "1 500 грн щокварталу · активна місія", xp: 200 },
  { id: "career",       etap: ETAPY[4], title: "«Кар'єра ветерана»",        note: "Повернення на робоче місце або нова робота", xp: 300 },
  { id: "education",    etap: ETAPY[4], title: "Безоплатне навчання",       note: "Бюджет поза конкурсом + стипендія + гуртожиток", xp: 250 },
  { id: "housing",      etap: ETAPY[4], title: "Житло: єОселя 7% / єВідновлення", note: "Іпотека 7% або компенсація за зруйноване", xp: 300 },
  { id: "kids-grant",   etap: ETAPY[4], title: "Грант на освіту дітей",     note: "Держава платить закладу освіти напряму", xp: 200 },
];
```

- [ ] **Step 4: Type-check** `npx tsc --noEmit` (these files are self-contained). **Commit.** `git add content/offers.ts content/aiCanned.ts content/pathBase.ts && git commit -m "feat(native): offers, AI canned content, base path"`

### Task 7: Merge scraped services into a typed module

**Files:** Create `content/services.ts`; Test `__tests__/services.test.ts`

- [ ] **Step 1: Write `content/services.ts`** that concatenates the generated articles with the scraped JSON (resolve types):

```ts
import type { Article } from "./types";
import { articles as generated } from "./articles.generated";
import scrapedRaw from "./services.scraped.json";

const scraped = scrapedRaw as unknown as Article[];
// De-dupe by id (generated wins on collision).
const seen = new Set(generated.map(a => a.id));
export const services: Article[] = [
  ...generated,
  ...scraped.filter(a => !seen.has(a.id)),
];
export const servicesByCategory = (cat: string): Article[] =>
  services.filter(a => a.category === cat);
```

- [ ] **Step 2: Enable JSON imports** — in `jest.config.js` the ts-jest tsconfig needs `resolveJsonModule: true`. Add it to the inline `tsconfig` block. Also add `"resolveJsonModule": true` to the app's `tsconfig.json` `compilerOptions` (check it exists; if `extends` expo's base, add the option).

- [ ] **Step 3: Write `__tests__/services.test.ts`:**

```ts
import { services, servicesByCategory } from "../content/services";
const CATS = ["health","social-protection","housing","transport","documents","education","tax","sport","grants","regional"];
describe("services", () => {
  it("has unique ids", () => {
    expect(new Set(services.map(s => s.id)).size).toBe(services.length);
  });
  it("covers every category with at least 3 items", () => {
    for (const c of CATS) expect(servicesByCategory(c).length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 4: Run** `npx jest services` — Expected: PASS (scrape gave ≥3 per category; tax has exactly 3). If a category is short, that's a data gap — log it, do not fabricate. **Commit.** `git add content/services.ts jest.config.js tsconfig.json __tests__/services.test.ts && git commit -m "feat(native): merge scraped services into typed module"`

---

## Phase 2 — Store & pure logic (TDD)

### Task 8: Extend the store

**Files:** Modify `lib/store.ts`; Test `__tests__/store.test.ts`

- [ ] **Step 1: Write the failing test** `__tests__/store.test.ts`:

```ts
import { useStore } from "../lib/store";

const reset = () => useStore.getState().resetDemo();

describe("store", () => {
  beforeEach(reset);

  it("setProfile merges and marks didOnboard", () => {
    useStore.getState().setProfile({ stage: "out", status: "UBD" });
    const p = useStore.getState().profile;
    expect(p.stage).toBe("out");
    expect(p.status).toBe("UBD");
    expect(p.didOnboard).toBe(true);
  });

  it("seeds gamification on first onboard", () => {
    useStore.getState().setProfile({ stage: "out" });
    const p = useStore.getState().profile;
    expect(p.level).toBe(1);
    expect(p.xp).toBe(0);
    expect(p.streak).toBeGreaterThanOrEqual(1);
    expect(p.completedMissionIds).toEqual([]);
  });

  it("completeMission adds xp and records the id once", () => {
    useStore.getState().setProfile({ stage: "out" });
    useStore.getState().completeMission("vet-box", 150);
    useStore.getState().completeMission("vet-box", 150); // idempotent
    const p = useStore.getState().profile;
    expect(p.completedMissionIds).toEqual(["vet-box"]);
    expect(p.xp).toBe(150);
  });

  it("resetDemo clears everything", () => {
    useStore.getState().setProfile({ stage: "out", status: "UBD" });
    reset();
    expect(useStore.getState().profile.didOnboard).toBe(false);
    expect(useStore.getState().profile.assignedSpecialistId).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run** `npx jest store` — Expected: FAIL (new fields/methods missing).

- [ ] **Step 3: Update `lib/store.ts`** — extend `Profile`, `defaultProfile`, seeding in `setProfile`, add `completeMission`:

```ts
import type { StageId } from "../content/stages";
import type { HealthId } from "../content/health";
import type { HousingId } from "../content/housing";
import type { WorkId } from "../content/work";
// ...existing imports (Status, AsyncStorage, create, persist)...

export interface Profile {
  // identity / onboarding
  stage?: StageId | null;
  health?: HealthId | null;
  housing?: HousingId[];
  work?: WorkId | null;
  status: Status | null;
  region?: string;
  interests?: string[];
  // concierge
  assignedSpecialistId?: string;
  // gamification
  level?: number;
  xp?: number;
  streak?: number;
  completedMissionIds?: string[];
  // flags
  didOnboard: boolean;
  didMockLogin: boolean;
}

const defaultProfile: Profile = {
  stage: null, health: null, housing: [], work: null,
  status: null, region: undefined, interests: undefined,
  assignedSpecialistId: undefined,
  level: undefined, xp: undefined, streak: undefined, completedMissionIds: undefined,
  didOnboard: false, didMockLogin: false,
};

interface State {
  profile: Profile;
  setProfile: (p: Partial<Profile>) => void;
  completeMission: (id: string, xp: number) => void;
  markMockLoggedIn: () => void;
  resetDemo: () => void;
  _hasHydrated: boolean;
}
```

In `setProfile`, seed gamification the first time we onboard:

```ts
setProfile: (p) => {
  const prev = get().profile;
  const next: Profile = { ...prev, ...p, didOnboard: true };
  if (next.level === undefined) {        // first onboard → seed
    next.level = 1; next.xp = 0; next.streak = 1; next.completedMissionIds = [];
  }
  set({ profile: next });
},
completeMission: (id, xp) => {
  const prev = get().profile;
  const done = prev.completedMissionIds ?? [];
  if (done.includes(id)) return;
  set({ profile: { ...prev, completedMissionIds: [...done, id], xp: (prev.xp ?? 0) + xp } });
},
```

- [ ] **Step 4: Run** `npx jest store` — Expected: PASS.
- [ ] **Step 5: Commit** `git add lib/store.ts __tests__/store.test.ts && git commit -m "feat(native): extend store with onboarding + gamification state"`

### Task 9: Adapt recommendations to the new interest set

**Files:** Modify `__tests__/recommendations.test.ts` (the impl already reads `.categories`, so only the test's interest ids change)

- [ ] **Step 1: Update the two interest-driven test cases** to the new ids (`treatment`→`sport`, mapping to category `sport`; `grants` case → an interest with no matching corpus). Replace the last two `it(...)` blocks:

```ts
  it("filters by interest→category mapping when interests are selected", () => {
    const profile: Profile = { status: "UBD", didOnboard: true, didMockLogin: false, interests: ["sport"] };
    const result = recommend(services, profile);
    for (const a of result) {
      expect(a.statuses).toContain("UBD");
      expect(a.category).toBe("sport");
    }
  });

  it("returns only mapped categories for the chosen interest", () => {
    const profile: Profile = { status: "UBD", didOnboard: true, didMockLogin: false, interests: ["community"] };
    const result = recommend(services, profile);
    for (const a of result) expect(["regional","sport"]).toContain(a.category);
  });
```

  Also change the import corpus from `articles` to the merged `services`:
  `import { services } from "../content/services";` and replace `articles` usages with `services`.

- [ ] **Step 2: Run** `npx jest recommendations` — Expected: PASS. (No impl change needed; `recommend()` is generic.) **Commit.** `git add __tests__/recommendations.test.ts && git commit -m "test(native): update recommendations for new interest set"`

### Task 10: Leveling helper

**Files:** Create `lib/leveling.ts`; Test `__tests__/leveling.test.ts`

- [ ] **Step 1: Write failing test:**

```ts
import { levelForXp, xpIntoLevel, XP_PER_LEVEL } from "../lib/leveling";
describe("leveling", () => {
  it("level 1 at 0 xp", () => expect(levelForXp(0)).toBe(1));
  it("levels up every XP_PER_LEVEL", () => {
    expect(levelForXp(XP_PER_LEVEL - 1)).toBe(1);
    expect(levelForXp(XP_PER_LEVEL)).toBe(2);
    expect(levelForXp(XP_PER_LEVEL * 3)).toBe(4);
  });
  it("xpIntoLevel is the remainder", () => {
    expect(xpIntoLevel(XP_PER_LEVEL + 150)).toBe(150);
  });
});
```

- [ ] **Step 2: Run** `npx jest leveling` — FAIL.
- [ ] **Step 3: Implement `lib/leveling.ts`:**

```ts
export const XP_PER_LEVEL = 500;
export const levelForXp = (xp: number): number => Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
export const xpIntoLevel = (xp: number): number => Math.max(0, xp) % XP_PER_LEVEL;
export const xpToNext = (xp: number): number => XP_PER_LEVEL - xpIntoLevel(xp);
```

- [ ] **Step 4: Run** `npx jest leveling` — PASS. **Commit.** `git add lib/leveling.ts __tests__/leveling.test.ts && git commit -m "feat(native): xp/level helper"`

### Task 11: Specialist assignment

**Files:** Create `lib/assignSpecialist.ts`; Test `__tests__/assignSpecialist.test.ts`

- [ ] **Step 1: Write failing test** (deterministic — same profile → same specialist):

```ts
import { assignSpecialist } from "../lib/assignSpecialist";
import type { Profile } from "../lib/store";
const base: Profile = { status: "UBD", didOnboard: true, didMockLogin: false };
describe("assignSpecialist", () => {
  it("is deterministic", () => {
    const p = { ...base, region: "Львівська область" };
    expect(assignSpecialist(p)).toBe(assignSpecialist(p));
  });
  it("matches region when a specialist serves it", () => {
    expect(assignSpecialist({ ...base, region: "Львівська область" })).toBe("ploginov");
  });
  it("routes ЧСЗ to the family specialist when no region match", () => {
    expect(assignSpecialist({ ...base, status: "CHSZ", region: "Сумська область" })).toBe("imelnyk");
  });
  it("always returns a valid id", () => {
    const id = assignSpecialist({ ...base, region: undefined });
    expect(["okravets","ploginov","imelnyk"]).toContain(id);
  });
});
```

- [ ] **Step 2: Run** `npx jest assignSpecialist` — FAIL.
- [ ] **Step 3: Implement `lib/assignSpecialist.ts`:**

```ts
import { specialists } from "../content/specialists";
import type { Profile } from "./store";

/** Deterministic: region match → ЧСЗ family specialist → stable hash fallback. */
export function assignSpecialist(profile: Profile): string {
  const byRegion = specialists.find(s => profile.region && s.oblast === profile.region);
  if (byRegion) return byRegion.id;
  if (profile.status === "CHSZ") {
    const family = specialists.find(s => s.id === "imelnyk");
    if (family) return family.id;
  }
  const key = `${profile.region ?? ""}|${profile.status ?? ""}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return specialists[h % specialists.length].id;
}
```

- [ ] **Step 4: Run** `npx jest assignSpecialist` — PASS. **Commit.** `git add lib/assignSpecialist.ts __tests__/assignSpecialist.test.ts && git commit -m "feat(native): deterministic specialist assignment"`

### Task 12: buildPath (the transparent path logic)

**Files:** Create `lib/buildPath.ts`; Test `__tests__/buildPath.test.ts`

- [ ] **Step 1: Write failing test:**

```ts
import { buildPath } from "../lib/buildPath";
import type { Profile } from "../lib/store";
const base: Profile = { status: "UBD", didOnboard: true, didMockLogin: false, housing: [] };

describe("buildPath", () => {
  it("always includes the 18 base steps", () => {
    const { steps } = buildPath(base);
    expect(steps.length).toBeGreaterThanOrEqual(18);
  });
  it("adds a serving-mode line for stage=serving", () => {
    const { lines } = buildPath({ ...base, stage: "serving" });
    expect(lines.some(l => l.kind === "add" && /90 днів/.test(l.text))).toBe(true);
  });
  it("adds МСЕК/protез block for status=OIVV", () => {
    const { lines } = buildPath({ ...base, status: "OIVV" });
    expect(lines.some(l => /МСЕК|протез/i.test(l.text))).toBe(true);
  });
  it("adds єОселя for rent housing", () => {
    const { lines } = buildPath({ ...base, housing: ["rent"] });
    expect(lines.some(l => /єОселя/.test(l.text))).toBe(true);
  });
  it("total equals base + added steps", () => {
    const r = buildPath({ ...base, status: "OIVV", housing: ["kids","rent"], work: "biz" });
    expect(r.total).toBe(r.steps.length);
  });
  it("is deterministic", () => {
    const p = { ...base, stage: "out" as const, work: "new" as const };
    expect(buildPath(p)).toEqual(buildPath(p));
  });
});
```

- [ ] **Step 2: Run** `npx jest buildPath` — FAIL.
- [ ] **Step 3: Implement `lib/buildPath.ts`** — pure port of the prototype's `buildPath()` add/modify rules, keyed off BOTH stage and status. Each "add" line also appends a synthetic step so `total === steps.length`:

```ts
import { basePath, type PathStep } from "../content/pathBase";
import type { Profile } from "./store";

export type PathLineKind = "base" | "add" | "mod" | "rem";
export interface PathLine { kind: PathLineKind; marker: string; text: string; }

export interface BuiltPath { lines: PathLine[]; steps: PathStep[]; total: number; }

export function buildPath(p: Profile): BuiltPath {
  const lines: PathLine[] = [{ kind: "base", marker: "📋", text: "Базовий шлях УБД — 18 кроків (Ветеран PRO)" }];
  const steps: PathStep[] = [...basePath];
  const add = (text: string, step?: Partial<PathStep>) => {
    lines.push({ kind: "add", marker: "＋", text });
    if (step) steps.push({ id: step.id!, etap: step.etap ?? "Етап 5 · Розвиток", title: step.title ?? text, note: step.note ?? "", xp: step.xp });
  };
  const mod = (text: string) => lines.push({ kind: "mod", marker: "↑", text });

  // ── Stage (Етап) ──
  if (p.stage === "serving") add("Режим «90 днів до виходу»: підготовка ще на службі", { id: "x-90days", etap: "Етап 1 · Ще на службі", title: "Підготовка за 90 днів", note: "Документи й рапорт заздалегідь", xp: 100 });
  if (p.stage === "leaving") add("Першими йдуть: рапорт, ОГД, військовий облік", { id: "x-leaving", etap: "Етап 1 · Ще на службі", title: "Пакет звільнення", note: "Рапорт, ОГД, ТЦК", xp: 100 });
  if (p.stage === "family")  add("Режим родини: кроки, які можна зробити за близьку людину", { id: "x-family", etap: "Етап 2 · Перші 30 днів", title: "Супровід родини", note: "Дії за дорученням", xp: 100 });

  // ── Status (наш) ──
  if (p.status === "OIVV") add("Статус ОІВВ → МСЕК, протезування, авто, податкові пільги", { id: "x-oivv", etap: "Етап 4 · Здоров'я та відновлення", title: "МСЕК, протезування, авто", note: "Пакет ОІВВ", xp: 300 });
  if (p.status === "CHSZ") add("Статус ЧСЗ → одноразова допомога, житло, психологічна підтримка", { id: "x-chsz", etap: "Етап 3 · Фінанси та пільги", title: "Допомога членам сім'ї", note: "Виплати та пільги ЧСЗ", xp: 300 });

  // ── Health ──
  if (p.health === "treat")      mod("Реабілітація та лікарі підняті на початок шляху");
  if (p.health === "disability") add("Додано: МСЕК, протезування, авто, податкові пільги", { id: "x-disab", etap: "Етап 4 · Здоров'я та відновлення", title: "Інвалідність: пакет послуг", note: "МСЕК, протез, авто", xp: 250 });

  // ── Housing (multi) ──
  const h = new Set(p.housing ?? []);
  if (h.has("kids"))    add("Грант на освіту дітей — держава платить закладу напряму", { id: "x-kids", etap: "Етап 5 · Розвиток", title: "Грант на освіту дітей", note: "Оплата закладу напряму", xp: 200 });
  if (h.has("ownhome")) add("Комуналка −75% через ПФУ", { id: "x-utility", etap: "Етап 3 · Фінанси та пільги", title: "Комуналка −75%", note: "Монетизація через ПФУ", xp: 150 });
  if (h.has("rent"))    add("єОселя: іпотека під 7% річних", { id: "x-oselya", etap: "Етап 5 · Розвиток", title: "єОселя 7%", note: "Пільгова іпотека", xp: 300 });
  if (h.has("damaged")) add("єВідновлення: компенсація за пошкоджене житло", { id: "x-vidnov", etap: "Етап 5 · Розвиток", title: "єВідновлення", note: "Компенсація / сертифікат", xp: 300 });

  // ── Work ──
  if (p.work === "biz")    add("Бізнес-трек: грант УВФ, статус ветеранського бізнесу", { id: "x-biz", etap: "Етап 5 · Розвиток", title: "Бізнес-трек", note: "Грант УВФ, статус бізнесу", xp: 300 });
  if (p.work === "new")    add("«Кар'єра ветерана» + резюме з ментором", { id: "x-career", etap: "Етап 5 · Розвиток", title: "Кар'єра ветерана", note: "Резюме з ментором", xp: 300 });
  if (p.work === "study")  add("Безоплатне навчання: бюджет поза конкурсом, стипендія", { id: "x-study", etap: "Етап 5 · Розвиток", title: "Безоплатне навчання", note: "Бюджет поза конкурсом", xp: 250 });
  if (p.work === "return") mod("Нагадаємо: робоче місце зберігається за тобою за законом");

  return { lines, steps, total: steps.length };
}
```

- [ ] **Step 4: Run** `npx jest buildPath` — PASS (the test for "adds МСЕК for OIVV" matches the OIVV add line). **Commit.** `git add lib/buildPath.ts __tests__/buildPath.test.ts && git commit -m "feat(native): transparent buildPath logic (stage + status)"`

- [ ] **Step 5: Run the whole logic suite** `npx jest` — Expected: all green. **Commit** if any incidental fixes.

---

## Phase 3 — Reusable components

> No unit tests (RN). After each, verify it compiles: `npx tsc --noEmit`. Visual check happens when first used on a screen. Each commit is its own step. Match `docs/mockups/_brand.css` classes for sizing.

### Task 13: Recolor existing components to dark tokens

**Files:** Modify `components/Button.tsx`, `Card.tsx`, `Chip.tsx`, `IconTile.tsx`, `Header.tsx`, `GearButton.tsx`, `ScreenContainer.tsx`, `OnboardingScaffold.tsx`, and screens not yet rewritten that reference old color keys.

- [ ] **Step 1:** Replace every old color key with its dark equivalent across these files:
  - `colors.brand` → `colors.text` (it was the ink/primary; on dark, primary text is paper) **EXCEPT** where it was a *filled background* (e.g. `Button` bg, `aiTile` bg) → use `colors.accent` for primary buttons; `IconTile` glyph color → `colors.tintEdu`.
  - `colors.white` (as text on filled) → `colors.onAccent` on orange; as surface → `colors.surfaceCard`.
  - `colors.beige`/`beigeSoft` (backgrounds) → `colors.surface` (screen) / `colors.surfaceCard` (cards).
  - `colors.border` stays (now dark hairline).
  - `colors.muted` → `colors.textMuted`; `colors.olive`/`oliveSoft` → `colors.accent` (active) / `colors.tintEdu`.
  Specifically: `Button` → bg `colors.accent`, label `colors.onAccent`. `Card` → bg `colors.surfaceCard`, border `colors.border`. `IconTile` tile bg `colors.surfaceCard2`, glyph `colors.tintEdu`.
- [ ] **Step 2:** `OnboardingScaffold` Dot active color → `colors.accent`, inactive → `colors.border`; title → `colors.text`, subtitle → `colors.textMuted`, root bg → `colors.surface`.
- [ ] **Step 3:** `npx tsc --noEmit` — Expected: no remaining references to removed keys. Fix stragglers.
- [ ] **Step 4: Commit** `git add components/ && git commit -m "refactor(native): recolor components to dark tokens"`

### Task 14: Avatar, LevelRing, StreakStrip, ProgressBar

**Files:** Create the four components.

- [ ] **Step 1: `components/Avatar.tsx`** — circular initials avatar with orange ring:

```tsx
import { View, Text, StyleSheet } from "react-native";
import { colors, weight } from "../lib/theme";
export function Avatar({ initials, size = 96, tint = colors.tintHealth }: { initials: string; size?: number; tint?: string }) {
  return (
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.fill, { width: size - 6, height: size - 6, borderRadius: (size - 6) / 2, backgroundColor: tint }]}>
        <Text style={[styles.txt, { fontSize: size * 0.34 }]}>{initials}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  ring: { borderWidth: 3, borderColor: colors.accent, alignItems: "center", justifyContent: "center" },
  fill: { alignItems: "center", justifyContent: "center" },
  txt: { color: colors.onAccent, fontWeight: weight.semibold },
});
```

- [ ] **Step 2: `components/ProgressBar.tsx`** — flat orange fill:

```tsx
import { View, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
export function ProgressBar({ pct }: { pct: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, pct))}%` }]} />
    </View>
  );
}
const styles = StyleSheet.create({
  track: { height: 7, backgroundColor: colors.surfaceCard2, borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.accent, borderRadius: 999 },
});
```

- [ ] **Step 3: `components/LevelRing.tsx`** — orange arc over track. Use two stacked semicircle borders (no SVG dep needed for a simple ring; or use `react-native-svg` which IS a dependency). Use `react-native-svg`:

```tsx
import Svg, { Circle } from "react-native-svg";
import { View, Text, StyleSheet } from "react-native";
import { colors, weight } from "../lib/theme";
export function LevelRing({ level, pct, size = 56 }: { level: number; pct: number; size?: number }) {
  const r = (size - 6) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(1, pct / 100)));
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size/2} cy={size/2} r={r} stroke={colors.surfaceCard2} strokeWidth={4} fill="none" />
        <Circle cx={size/2} cy={size/2} r={r} stroke={colors.accent} strokeWidth={4} fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
      </Svg>
      <View style={StyleSheet.absoluteFill as any}>
        <View style={styles.center}><Text style={styles.lvl}>{level}</Text><Text style={styles.cap}>рівень</Text></View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  lvl: { color: colors.accent, fontWeight: weight.bold, fontSize: 15 },
  cap: { color: colors.textMuted, fontSize: 8 },
});
```

- [ ] **Step 4: `components/StreakStrip.tsx`** — 7 day cells:

```tsx
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
const DAYS = ["пн","вт","ср","чт","пт","сб","нд"];
export function StreakStrip({ filled }: { filled: number }) {
  return (
    <View style={styles.row}>
      {DAYS.map((d, i) => (
        <View key={d} style={[styles.cell, i < filled && styles.on]}>
          <Text style={[styles.txt, i < filled && styles.txtOn]}>{d}</Text>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 5, marginTop: 10 },
  cell: { flex: 1, height: 30, borderRadius: 7, backgroundColor: colors.surfaceCard2, alignItems: "center", justifyContent: "center" },
  on: { backgroundColor: "#3a2a20" },
  txt: { fontSize: 11, color: colors.textFaint },
  txtOn: { color: colors.accent },
});
```

- [ ] **Step 5:** `npx tsc --noEmit` clean. **Commit** `git add components/Avatar.tsx components/ProgressBar.tsx components/LevelRing.tsx components/StreakStrip.tsx && git commit -m "feat(native): gamification + avatar components"`

### Task 15: MissionCard, SpecialistCard, OfferCard, QrSheet

**Files:** Create the four. Port layout from mockups (`home-a.html`, `opportunities.html`, `reveal.html`).

- [ ] **Step 1: `components/MissionCard.tsx`** — emoji tile + title + meta + +XP + optional progress; `onPress`. (Match `home-a.html` `.mcard`.) Props: `{ emoji, title, meta, xp, pct?, onPress }`. Use `Card`, `ProgressBar`, `colors.accent` for XP.
- [ ] **Step 2: `components/SpecialistCard.tsx`** — compact + full modes. Props: `{ specialist, compact?, onContact }`. Uses `Avatar`. Compact = small row (avatar 44 + name + role + chat icon). Full = larger avatar + blurb + actions. (Match `reveal.html` screen 2 + `home-a.html` specialist row.)
- [ ] **Step 3: `components/OfferCard.tsx`** — logo chip (white) or emoji + name + meta + discount + "Показати QR". Logo resolved via a `require` map (Task 19 copies assets). Props: `{ offer, onShowQr }`.
- [ ] **Step 4: `components/QrSheet.tsx`** — RN `Modal` bottom sheet: drag handle, title, a faked QR (a `View` grid or a bundled image), "✓ Статус ветерана верифіковано" pill, "Закрити". Props: `{ visible, title, onClose }`.
- [ ] **Step 5:** `npx tsc --noEmit` clean. **Commit** `git add components/MissionCard.tsx components/SpecialistCard.tsx components/OfferCard.tsx components/QrSheet.tsx && git commit -m "feat(native): mission/specialist/offer/qr components"`

### Task 16: Chat components + typewriter hook

**Files:** Create `lib/useTypewriter.ts`, `components/ChatBubble.tsx`, `components/TypingDots.tsx`

- [ ] **Step 1: `lib/useTypewriter.ts`:**

```ts
import { useEffect, useRef, useState } from "react";
export function useTypewriter(target: string, speed = 24, startDelay = 0) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const i = useRef(0);
  useEffect(() => {
    i.current = 0; setShown(""); setDone(false);
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      i.current += 1;
      setShown(target.slice(0, i.current));
      if (i.current >= target.length) { setDone(true); return; }
      const ch = target[i.current - 1];
      t = setTimeout(tick, ch === "." ? speed * 12 : ch === "," ? speed * 6 : speed);
    };
    const start = setTimeout(tick, startDelay);
    return () => { clearTimeout(start); clearTimeout(t); };
  }, [target, speed, startDelay]);
  return { shown, done };
}
```

- [ ] **Step 2: `components/TypingDots.tsx`** — 3 dots with a Reanimated loop (or `Animated`). Keep simple with `Animated.loop` opacity.
- [ ] **Step 3: `components/ChatBubble.tsx`** — `{ role: "bot"|"me", children }`; bot = `surfaceCard` left, me = `accent` right. Bubble radius 13.
- [ ] **Step 4:** `npx tsc --noEmit` clean. **Commit** `git add lib/useTypewriter.ts components/ChatBubble.tsx components/TypingDots.tsx && git commit -m "feat(native): chat bubble, typing dots, typewriter hook"`

---

## Phase 4 — Onboarding flow

> Verify the whole flow in Expo Go at the end (Task 22). Each screen: `npx tsc --noEmit` + commit.

### Task 17: N-step scaffold + the 6 onboarding screens

**Files:** Modify `components/OnboardingScaffold.tsx`; create `app/onboarding/stage.tsx`, `health.tsx`, `housing.tsx`, `work.tsx`, `profile.tsx`; rework `interests.tsx`; delete `interests-grid.tsx`, `interests-list.tsx`, `status.tsx`, `region.tsx`.

- [ ] **Step 1: Generalize `OnboardingScaffold`** — change props `step: 1|2|3` → `step: number; total: number;`; render `Array.from({length: total})` dots; back button shows when `step > 1`.
- [ ] **Step 2: `app/onboarding/stage.tsx`** (step 1/6) — single-choice over `stages`; on tap `setProfile({ stage })` + `router.push("/onboarding/health")`. Port the option-row style from `onboarding.html` screen 1 (emoji + bold title + muted hint, selected = orange border). No back button.
- [ ] **Step 3: `health.tsx`** (2/6) — single-choice over `healthOptions` → `router.push("/onboarding/housing")`.
- [ ] **Step 4: `housing.tsx`** (3/6) — multi-select over `housingOptions` with checkbox; "Далі" → `work`; "Пропустити" → `work`.
- [ ] **Step 5: `work.tsx`** (4/6) — single-choice over `workOptions` → `interests`.
- [ ] **Step 6: `interests.tsx`** (5/6) — REWORK to multi-select over the new `interests` (emoji rows), "Далі" → `profile`. Remove the old pill-cloud + the `interests-grid` push.
- [ ] **Step 7: `profile.tsx`** (6/6) — TWO pickers on one screen: a region row (opens a simple list/Picker over `regions`, default "м. Київ") and a 3-way status segmented control (`statuses`: УБД/ОІВВ/ЧСЗ). "Завершити" → `setProfile({ region, status })` then `router.replace("/onboarding/building")`.
- [ ] **Step 8: Delete** `app/onboarding/interests-grid.tsx`, `interests-list.tsx`, `status.tsx`, `region.tsx`. Update any imports.
- [ ] **Step 9: Update `app/index.tsx`** redirect target from `/onboarding/login` (keep login as entry) — confirm `login.tsx` pushes to `/onboarding/stage` (was `/onboarding/status`). Edit `login.tsx`'s post-login navigation to `/onboarding/stage`.
- [ ] **Step 10:** `npx tsc --noEmit` clean. **Commit** `git add app/onboarding components/OnboardingScaffold.tsx app/index.tsx && git commit -m "feat(native): 6-step needs onboarding"`

### Task 18: Building-path reveal + specialist assignment screens

**Files:** Create `app/onboarding/building.tsx`, `app/onboarding/assignment.tsx`

- [ ] **Step 1: `building.tsx`** — read `profile` from store, compute `const built = buildPath(profile)`; animate `built.lines` in sequentially (use `FadeUp` with increasing delay, or a timed reveal). Show summary "Ваш шлях готовий: {built.total} кроків у 5 етапах". "Далі →" → `router.replace("/onboarding/assignment")`. (Match `reveal.html` screen 1; markers colored by `kind`: add→`tintEdu`, mod→`accent`, base→muted.)
- [ ] **Step 2: `assignment.tsx`** — compute `const id = assignSpecialist(profile)`; `useEffect(() => setProfile({ assignedSpecialistId: id }), [])`; look up the specialist; render the assignment moment with `Avatar` (animated scale/fade via Reanimated), `SpecialistCard` full mode, "Почати" → `router.replace("/(tabs)")`, "Написати" → `Alert`. (Match `reveal.html` screen 2.)
- [ ] **Step 3:** Register both under the onboarding stack (file-based — automatic). `npx tsc --noEmit` clean. **Commit** `git add app/onboarding/building.tsx app/onboarding/assignment.tsx && git commit -m "feat(native): path reveal + specialist assignment screens"`

---

## Phase 5 — App shell & tab screens

### Task 19: Copy partner logos into the app bundle

**Files:** Create `assets/logos/wog.png`, `riotdivision.png`, `mindly.png` (copy from `docs/mockups/assets/logos/`); create `assets/logos/index.ts` require-map.

- [ ] **Step 1:** `cp docs/mockups/assets/logos/*.png native/assets/logos/` (run from repo root; make the dir first).
- [ ] **Step 2: `assets/logos/index.ts`:**

```ts
export const logoSources: Record<string, any> = {
  wog: require("./wog.png"),
  riotdivision: require("./riotdivision.png"),
  mindly: require("./mindly.png"),
};
```

- [ ] **Step 3:** Wire `OfferCard` to `logoSources[offer.logo]` when `offer.logo` is set, else render `offer.emoji`. `npx tsc --noEmit`. **Commit** `git add native/assets/logos && git commit -m "feat(native): bundle partner logos"`

### Task 20: Tab layout (4 tabs, catalogue merged)

**Files:** Modify `app/(tabs)/_layout.tsx`; create `app/(tabs)/opportunities/_layout.tsx` + placeholder `index.tsx`; remove `app/(tabs)/catalog/`.

- [ ] **Step 1:** Update `TAB_ICONS` to `{ index, opportunities, ai, applications }` with the new `ri:*` names (home-5, price-tag-3, sparkling-2, file-list-3). Replace `<Tabs.Screen>` list/order to: `index` (Головна), `opportunities` (Можливості), `ai` (AI-бро), `applications` (Мої послуги). Remove the `catalog` screen. Set `tabBarStyle` bg → `colors.surface`, border → `colors.border`, active tint → `colors.accent`, inactive → `colors.textFaint`, label active bar → `colors.accent`.
- [ ] **Step 2:** Create `app/(tabs)/opportunities/_layout.tsx` (Stack, headerShown false) and a placeholder `index.tsx` (filled in Task 23).
- [ ] **Step 3:** Move `app/(tabs)/catalog/[id].tsx` logic to `app/(tabs)/applications/[category].tsx` (Task 22), then delete the `catalog/` folder.
- [ ] **Step 4:** `npx tsc --noEmit`. **Commit** `git add app/(tabs) && git commit -m "feat(native): 4-tab layout, catalogue merged into services"`

### Task 21: Home screen (Variant A)

**Files:** Rewrite `app/(tabs)/index.tsx`

- [ ] **Step 1:** Build the Path-hero Home from `docs/mockups/screens/home-a.html`:
  - Header: **single greeting** «Привіт, {ім'я} 👋» (hardcode "Андрію" for the demo) + `LevelRing(level, xpIntoLevel(xp)/XP_PER_LEVEL*100)`.
  - HERO: «Твій шлях: УБД» Card → `const built = buildPath(profile)`; done count = `built.steps.filter(s=>s.done).length + completedMissionIds.length`; `ProgressBar`; `StreakStrip(filled = streak clamped 0..7)`; tap → `router.push("/path")`.
  - «Активні місії»: 2 `MissionCard`s sourced from incomplete path steps that have `xp` (filter `built.steps.filter(s => !s.done && s.xp && !completedMissionIds.includes(s.id))`, take 2). Tap → `completeMission(step.id, step.xp)` + haptic + `Alert`/toast.
  - Compact `SpecialistCard` (look up `assignedSpecialistId`).
- [ ] **Step 2:** Verify it reads correctly (no duplicate greeting). `npx tsc --noEmit`.
- [ ] **Step 3: Commit** `git add app/(tabs)/index.tsx && git commit -m "feat(native): gamified Home (Path-hero)"`

### Task 22: Мої послуги + category detail

**Files:** Rewrite `app/(tabs)/applications/index.tsx`; create `app/(tabs)/applications/[category].tsx`; `app/(tabs)/applications/_layout.tsx` (Stack)

- [ ] **Step 1:** `_layout.tsx` — Stack (headerShown false) so `index` + `[category]` nest.
- [ ] **Step 2:** `index.tsx` from `docs/mockups/screens/services.html`: title + sub; **«В роботі»** section (2 mock in-progress rows — e.g. "Отримання Ветеран-боксу" крок 2 з 3 with `ProgressBar`); **«Категорії»** 2-col grid over `categories` (rounded `Card`, `IconTile` line icon + name), tap → `router.push("/(tabs)/applications/" + cat.id)`.
- [ ] **Step 3:** `[category].tsx` — read `useLocalSearchParams().category`; header = category name; list `servicesByCategory(category)` rows (title + meta + chevron), tap → `Alert` (detail is full-version). Port the old `catalog/[id].tsx` shared-element nicety if trivial; otherwise plain list.
- [ ] **Step 4:** `npx tsc --noEmit`. **Commit** `git add app/(tabs)/applications && git commit -m "feat(native): Мої послуги (in-progress + category grid + detail)"`

### Task 23: Можливості offers screen

**Files:** Rewrite `app/(tabs)/opportunities/index.tsx`

- [ ] **Step 1:** From `docs/mockups/screens/opportunities.html`: title + sub; a chip row (visual); list of `OfferCard` over `offers`; manage `const [qr, setQr] = useState<Offer|null>(null)`; `OfferCard.onShowQr` → `setQr(offer)`; render `<QrSheet visible={!!qr} title={qr ? `${qr.name} · ${qr.discount}` : ""} onClose={() => setQr(null)} />`.
- [ ] **Step 2:** `npx tsc --noEmit`. **Commit** `git add app/(tabs)/opportunities && git commit -m "feat(native): Можливості offers tab with QR sheet"`

### Task 24: AI-бро chat screen

**Files:** Rewrite `app/(tabs)/ai/index.tsx`

- [ ] **Step 1:** From `docs/mockups/screens/ai-bro.html`: a chat header (Avatar with sparkling glyph + "AI-бро" + "● онлайн"). State `messages: {role, text}[]`. On mount: after ~900ms show the bot opening via `useTypewriter(aiOpening)` rendered in a `ChatBubble`; while typing show cursor; before it, `TypingDots`. After done, show 3 prompt chips (`aiPrompts`). Tapping a chip / sending input: append `{role:"me"}` bubble, then a bot bubble that streams `aiReplies[prompt] ?? aiFallback`. Bottom input bar with send button.
- [ ] **Step 2:** `npx tsc --noEmit`. **Commit** `git add app/(tabs)/ai && git commit -m "feat(native): AI-бро streaming chat"`

### Task 25: Path screen

**Files:** Create `app/path.tsx`; register in `app/_layout.tsx`

- [ ] **Step 1:** `app/_layout.tsx` — add `<Stack.Screen name="path" options={{ presentation: "card" }} />`.
- [ ] **Step 2:** `app/path.tsx` from `docs/mockups`/spec: `const built = buildPath(profile)`; group `built.steps` by `etap` (use `ETAPY` order); render each etap as a section of step rows (done tick / empty + title + note + xp). Header with overall `ProgressBar`. Bottom "Єдина ветеранська лінія 0 800 505 217" callout. Back via `router.back()`.
- [ ] **Step 3:** `npx tsc --noEmit`. **Commit** `git add app/path.tsx app/_layout.tsx && git commit -m "feat(native): full path screen"`

---

## Phase 6 — Integration & verification

### Task 26: Full type-check + logic suite

- [ ] **Step 1:** `npx tsc --noEmit` — Expected: clean across the project.
- [ ] **Step 2:** `npx jest` — Expected: all suites green (content, services, store, recommendations, leveling, assignSpecialist, buildPath, haptics).
- [ ] **Step 3:** Commit any fixes.

### Task 27: Manual smoke test in Expo Go

- [ ] **Step 1:** `npm start`, open on **iPhone 17 Pro Max** (Expo Go; or iOS Simulator "iPhone 17 Pro Max"). Walk the flow and confirm:
  - login → stage → health → housing → work → interests → profile (6 dots advance; back works; skip works on multi-selects).
  - "Будуємо ваш шлях" reveals lines, summary shows a number; "Далі".
  - Assignment screen shows a circular avatar + a specialist (changes if you reset with a different region/status); "Почати" → Home.
  - Home: single greeting, level ring, streak, path card, 2 missions (tapping one bumps XP — re-open Home to see), compact specialist card.
  - Tabs: Головна / Можливості / AI-бро / Мої послуги (flat icons, orange active). No Каталог tab.
  - Можливості: WOG/Riot/Mindly logos render; "Показати QR" opens the sheet.
  - Мої послуги: «В роботі» on top, category grid below (rounded cards); tapping a category lists real scraped services.
  - AI-бро: typing dots → streamed greeting → prompt chips; sending shows a streamed reply.
  - Settings/GearButton → demo reset → returns to onboarding and clears gamification.
- [ ] **Step 2: Native-feel pass (iPhone 17 Pro Max).** Confirm: stack transitions are smooth at
  120 Hz; onboarding steps slide; the path-build lines stage in; the specialist avatar springs in;
  level-ring and progress bars animate to value; press states scale; QR sheet drags to dismiss;
  swipe-back works. Haptics fire on: option taps, tab switches, mission complete, step done,
  specialist assigned, primary buttons. Layout respects the Dynamic Island + bottom safe area.
- [ ] **Step 3:** Note any visual/motion gaps vs mockups + the native-feel mandate; fix in follow-up commits.

### Task 28: Update memory + spec status

- [ ] **Step 1:** Update `project-native-polish-pass-status.md` memory to reflect the redesign landed.
- [ ] **Step 2:** Mark the spec's §13 confirmations as implemented. Commit.

---

## Self-review notes (author)

- **Spec coverage:** theme (T1), tabs+catalogue merge (T20/T22), 6-step onboarding (T17), buildPath both-keys (T12), specialist assignment+card (T11/T15/T18/T21), full RPG (T8/T10/T14/T21/T25), Можливості WOG/Riot/Mindly (T6/T19/T23), AI-бро streaming (T16/T24), real scraped services (T7/T22), single greeting (T21), rounded cards (T1/T13). All present.
- **Data gaps:** `tax` has exactly 3 services (site limit) — T7's test asserts ≥3, OK. `discounts`/`business` site endpoints empty → offers are mock by design (spec §9, §12).
- **Type consistency:** `Profile` fields defined in T8 are used identically in T11/T12/T21/T25; `PathStep`/`PathLine` from T6/T12 reused in T18/T25; `completeMission(id, xp)` signature consistent T8↔T21.
- **No RN unit tests** — intentional (runner is node/ts-jest only); screens verified in T27.
