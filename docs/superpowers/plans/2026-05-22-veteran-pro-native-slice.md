# Veteran PRO Native Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a vertical-slice native iOS app (React Native + Expo) covering onboarding (Login → Status → Region → Interests) and a bottom-tab main shell with real Каталог + Головна tabs and stub AI + Мої послуги tabs, runnable on the user's iPhone via Expo Go.

**Architecture:** A self-contained Expo project under `native/` with no shared dependencies with the existing web app. Expo Router provides file-based navigation (a native-stack for onboarding, then a bottom-tab group for the main app). State lives in a Zustand store persisted to `AsyncStorage`. Styling uses plain `StyleSheet` against a shared `theme.ts` of design tokens carried over from the web app.

**Tech Stack:** Expo (latest stable SDK), Expo Router, TypeScript (strict), React Native, Zustand + AsyncStorage, `@expo/vector-icons` (MaterialCommunityIcons), `react-native-safe-area-context`, `expo-haptics`, Jest + ts-jest for pure-logic tests.

**Spec:** `docs/superpowers/specs/2026-05-22-veteran-pro-native-slice-design.md`

---

## File Map

Created under `native/`:

```
native/
├── app/
│   ├── _layout.tsx                  Root Stack
│   ├── index.tsx                    Route gate (→ onboarding or tabs)
│   ├── onboarding/
│   │   ├── _layout.tsx              Native stack
│   │   ├── login.tsx
│   │   ├── status.tsx
│   │   ├── region.tsx
│   │   └── interests.tsx
│   └── (tabs)/
│       ├── _layout.tsx              Tab bar
│       ├── index.tsx                Home tab (Головна)
│       ├── catalog.tsx
│       ├── ai.tsx                   Stub
│       └── applications.tsx         Stub
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Chip.tsx
│   ├── IconTile.tsx
│   ├── Header.tsx
│   ├── ScreenContainer.tsx
│   └── StubScreen.tsx
├── content/
│   ├── types.ts
│   ├── statuses.ts
│   ├── regions.ts
│   ├── interests.ts
│   ├── categories.ts
│   └── articles.generated.ts
├── lib/
│   ├── theme.ts                     Design tokens
│   ├── store.ts                     Zustand + persist
│   ├── icons.ts                     ri:* → MCI mapping
│   ├── haptics.ts                   expo-haptics wrapper
│   ├── plurals.ts                   Ukrainian plurals
│   └── recommendations.ts           Pure filter (testable)
├── __tests__/
│   └── recommendations.test.ts
├── assets/
│   ├── icon.png                     App icon (copied from public/icons)
│   ├── splash.png
│   └── logo.png                     Login screen logo
├── app.json
├── package.json
├── tsconfig.json
├── babel.config.js
├── jest.config.js
└── .gitignore
```

Repo root files untouched: `src/`, `ios/`, `public/`, `package.json` etc. — the web app and Capacitor shell remain intact as fallbacks.

---

## Task 1: Bootstrap the Expo project

**Files:**
- Create: `native/` (whole directory, scaffolded by Expo CLI)
- Verify: `native/package.json`, `native/app.json`, `native/tsconfig.json`

- [ ] **Step 1.1: Scaffold a blank TypeScript Expo project**

From repo root:

```bash
cd /root/app
npx create-expo-app@latest native --template blank-typescript --no-install --yes
```

Expected: creates `/root/app/native/` with starter files. No interactive prompts (the `--yes --no-install` flags skip them).

- [ ] **Step 1.2: Install JS dependencies**

```bash
cd /root/app/native
npm install
```

Expected: `node_modules/` populated, no fatal errors. (Deprecation warnings are fine.)

- [ ] **Step 1.3: Install runtime deps the slice needs**

```bash
cd /root/app/native
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar expo-haptics @react-native-async-storage/async-storage @expo/vector-icons
npm install zustand
```

Expected: `expo install` resolves versions compatible with the current Expo SDK. `zustand` installs as a plain npm dep.

- [ ] **Step 1.4: Install dev deps for testing**

```bash
cd /root/app/native
npm install --save-dev jest @types/jest ts-jest
```

- [ ] **Step 1.5: Wire `expo-router` entry in `package.json`**

In `/root/app/native/package.json`, replace the `"main"` field with the expo-router entry, and add a `"test"` script:

```json
{
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest"
  }
}
```

(Preserve all other fields and the existing `"dependencies"` / `"devDependencies"` keys.)

- [ ] **Step 1.6: Configure `app.json` for expo-router and branding**

Replace `/root/app/native/app.json` with:

```json
{
  "expo": {
    "name": "Ветеран PRO",
    "slug": "veteranpro-native",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "veteranpro",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#EFE9E5"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "ua.gov.veteranpro.native"
    },
    "android": {
      "package": "ua.gov.veteranpro.native",
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#EFE9E5"
      }
    },
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

- [ ] **Step 1.7: Strict TypeScript**

Edit `/root/app/native/tsconfig.json` to extend Expo's base and enforce strict:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": "."
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

- [ ] **Step 1.8: Copy asset images from the web app**

```bash
cp /root/app/public/icons/icon-512.png /root/app/native/assets/icon.png
cp /root/app/public/icons/icon-512.png /root/app/native/assets/splash.png
cp /root/app/public/icons/icon-512.png /root/app/native/assets/logo.png
```

(These will visually be the existing app icon — adequate for the slice. The login screen logo is the same square mark; the dedicated wordmark SVG is out of scope.)

- [ ] **Step 1.9: Remove the starter `App.tsx`**

`create-expo-app` ships an `App.tsx`. expo-router uses the `app/` directory instead, so:

```bash
cd /root/app/native
rm -f App.tsx
```

- [ ] **Step 1.10: Create a `.gitignore`**

`/root/app/native/.gitignore`:

```
node_modules/
.expo/
dist/
web-build/
*.log
.DS_Store
.env*.local
coverage/
```

- [ ] **Step 1.11: Verify TypeScript compiles**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS (no errors). No `app/` files yet — `tsc` succeeds trivially.

- [ ] **Step 1.12: Commit**

```bash
cd /root/app
git add native/
git commit -m "feat(native): bootstrap Expo project shell (no screens yet)"
```

---

## Task 2: Copy content data verbatim

**Files:**
- Create: `native/content/types.ts`, `statuses.ts`, `regions.ts`, `interests.ts`, `categories.ts`, `articles.generated.ts`

- [ ] **Step 2.1: Copy the six pure-data files**

```bash
cd /root/app
cp src/content/types.ts            native/content/types.ts
cp src/content/statuses.ts         native/content/statuses.ts
cp src/content/regions.ts          native/content/regions.ts
cp src/content/interests.ts        native/content/interests.ts
cp src/content/categories.ts       native/content/categories.ts
cp src/content/articles.generated.ts native/content/articles.generated.ts
```

These files have no DOM / React / browser dependencies — they're plain TypeScript arrays.

- [ ] **Step 2.2: Rewrite the `@/content/...` imports in each file**

Each copied file may import from `./types` (relative) already — verify with:

```bash
cd /root/app/native
grep -rn '@/content' content/
```

Expected: no matches. The internal imports in those files are relative (`./types`). Nothing to fix.

- [ ] **Step 2.3: Verify TypeScript still passes**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 2.4: Commit**

```bash
cd /root/app
git add native/content/
git commit -m "feat(native): copy content data (statuses, regions, interests, categories, articles)"
```

---

## Task 3: Design tokens, icon mapping, plurals, haptics

**Files:**
- Create: `native/lib/theme.ts`, `native/lib/icons.ts`, `native/lib/plurals.ts`, `native/lib/haptics.ts`

- [ ] **Step 3.1: Write `lib/theme.ts`**

`/root/app/native/lib/theme.ts`:

```ts
// Design tokens carried over from the web app's tokens.css.
// See: src/ui/tokens.css

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
} as const;

export const radius = { card: 16, pill: 999, iconTile: 10 } as const;

export const elevation = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  button: {
    shadowColor: "#2D2926",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
} as const;

export const fontSize = {
  xs:   12,
  sm:   14,
  base: 16,
  lg:   18,
  xl:   20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const weight = {
  regular:  "400",
  medium:   "500",
  semibold: "600",
  bold:     "700",
} as const;

export const space = (n: number) => n * 4;
```

- [ ] **Step 3.2: Write `lib/icons.ts`**

`/root/app/native/lib/icons.ts`:

```ts
// Maps the web app's iconify Remix icon names (ri:*) to MaterialCommunityIcons
// names available in @expo/vector-icons. Closest-fit substitutions, not pixel
// matches. See spec §8 for rationale.

import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type MciName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const mciFor: Record<string, MciName> = {
  // Category icons
  "ri:heart-add-line":       "heart-plus-outline",
  "ri:shield-user-line":     "shield-account-outline",
  "ri:building-line":        "office-building-outline",
  "ri:bus-line":             "bus",
  "ri:file-copy-2-line":     "file-document-multiple-outline",
  "ri:graduation-cap-line":  "school-outline",
  "ri:refund-2-line":        "cash-refund",
  "ri:basketball-line":      "basketball",
  "ri:hand-coin-line":       "hand-coin-outline",
  "ri:map-pin-2-line":       "map-marker-outline",

  // Tab bar
  "ri:apps-2-line":          "apps",
  "ri:apps-2-fill":          "apps",
  "ri:home-5-line":          "home-outline",
  "ri:home-5-fill":          "home",
  "ri:sparkling-2-line":     "creation-outline",
  "ri:sparkling-2-fill":     "creation",
  "ri:file-list-3-line":     "clipboard-list-outline",
  "ri:file-list-3-fill":     "clipboard-list",

  // Misc
  "ri:settings-3-line":      "cog-outline",
  "ri:bookmark-line":        "bookmark-outline",
};

/** Resolve a Remix icon name to its MCI counterpart, with a sensible fallback. */
export function mci(name: string): MciName {
  return mciFor[name] ?? "help-circle-outline";
}
```

- [ ] **Step 3.3: Write `lib/plurals.ts`**

`/root/app/native/lib/plurals.ts`:

```ts
// Ukrainian plural rules. Same logic as the web app's src/lib/plurals.ts —
// no DOM dependencies, no React imports.

/** Returns "1 крок", "2 кроки", "5 кроків". */
export function stepsLabel(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} крок`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} кроки`;
  return `${n} кроків`;
}
```

- [ ] **Step 3.4: Write `lib/haptics.ts`**

`/root/app/native/lib/haptics.ts`:

```ts
// Thin wrapper around expo-haptics. Mirrors the web app's src/lib/haptics.ts
// API so screen code reads the same on both platforms.

import * as Haptics from "expo-haptics";

export const tapLight   = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)  .catch(() => {});
export const tapMedium  = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) .catch(() => {});
export const tapSuccess = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
```

- [ ] **Step 3.5: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3.6: Commit**

```bash
cd /root/app
git add native/lib/
git commit -m "feat(native): design tokens, icon mapping, plurals, haptics helpers"
```

---

## Task 4: Recommendation filter (TDD)

The Home screen's "Рекомендовано вам" filter is pure logic — perfect for TDD. Extracting it into `lib/recommendations.ts` keeps `app/(tabs)/index.tsx` thin and gives us a real test gate.

**Files:**
- Create: `native/lib/recommendations.ts`
- Create: `native/__tests__/recommendations.test.ts`
- Create: `native/jest.config.js`
- Create: `native/babel.config.js`

- [ ] **Step 4.1: Configure Jest with ts-jest**

`/root/app/native/jest.config.js`:

```js
/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
};
```

- [ ] **Step 4.2: Add a Babel config (Expo Router requires this)**

`/root/app/native/babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
```

- [ ] **Step 4.3: Write the failing test**

`/root/app/native/__tests__/recommendations.test.ts`:

```ts
import { recommend } from "../lib/recommendations";
import { articles } from "../content/articles.generated";
import type { Profile } from "../lib/store";

describe("recommend()", () => {
  it("returns up to 5 articles", () => {
    const profile: Profile = { status: null, didOnboard: false, didMockLogin: false };
    expect(recommend(articles, profile).length).toBeLessThanOrEqual(5);
  });

  it("filters by status when status is set", () => {
    const profile: Profile = { status: "UBD", didOnboard: true, didMockLogin: false };
    const result = recommend(articles, profile);
    for (const a of result) expect(a.statuses).toContain("UBD");
  });

  it("returns all relevant articles when no interests are selected", () => {
    const profile: Profile = { status: "UBD", didOnboard: true, didMockLogin: false, interests: [] };
    const result = recommend(articles, profile);
    const allUBD = articles.filter((a) => a.statuses.includes("UBD"));
    expect(result.length).toBe(Math.min(5, allUBD.length));
  });

  it("filters by interest→category mapping when interests are selected", () => {
    // 'treatment' maps to category 'health'
    const profile: Profile = {
      status: "UBD",
      didOnboard: true,
      didMockLogin: false,
      interests: ["treatment"],
    };
    const result = recommend(articles, profile);
    for (const a of result) {
      expect(a.statuses).toContain("UBD");
      expect(a.category).toBe("health");
    }
  });

  it("returns no results when status matches nothing in the corpus", () => {
    // CHSZ-only article exists, but if we filter for an interest with no matching category, expect empty.
    const profile: Profile = {
      status: "UBD",
      didOnboard: true,
      didMockLogin: false,
      // grants interest → categories: ['grants']. If no UBD articles tagged 'grants', result is empty.
      interests: ["grants"],
    };
    const result = recommend(articles, profile);
    const expected = articles.filter(
      (a) => a.statuses.includes("UBD") && a.category === "grants"
    );
    expect(result.length).toBe(Math.min(5, expected.length));
  });
});
```

- [ ] **Step 4.4: Run the test — expect FAIL**

```bash
cd /root/app/native
npm test
```

Expected: FAIL — `recommendations.ts` and `store.ts` don't exist yet, plus `Cannot find module`.

- [ ] **Step 4.5: Create a minimal `lib/store.ts` so the test can import `Profile`**

`/root/app/native/lib/store.ts` (minimal — full version in Task 5):

```ts
import type { Status } from "../content/types";

export interface Profile {
  status: Status | null;
  region?: string;
  interests?: string[];
  didOnboard: boolean;
  didMockLogin: boolean;
}
```

- [ ] **Step 4.6: Implement `lib/recommendations.ts`**

`/root/app/native/lib/recommendations.ts`:

```ts
import type { Article } from "../content/types";
import { interests as INTERESTS } from "../content/interests";
import type { Profile } from "./store";

/**
 * Filter articles for the Home "Рекомендовано вам" list.
 *
 * Rules (matches the web app's Home behavior):
 *  - If a status is set, drop articles that don't include it.
 *  - If any interests are selected, drop articles whose category is not in
 *    the union of those interests' mapped categories.
 *  - Cap result at 5 items.
 */
export function recommend(all: Article[], profile: Profile): Article[] {
  const interestCategories = new Set(
    (profile.interests ?? []).flatMap(
      (id) => INTERESTS.find((it) => it.id === id)?.categories ?? []
    )
  );

  return all
    .filter((a) => !profile.status || a.statuses.includes(profile.status))
    .filter((a) => interestCategories.size === 0 || interestCategories.has(a.category))
    .slice(0, 5);
}
```

- [ ] **Step 4.7: Run the tests — expect PASS**

```bash
cd /root/app/native
npm test
```

Expected: 5 tests pass.

- [ ] **Step 4.8: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 4.9: Commit**

```bash
cd /root/app
git add native/lib/recommendations.ts native/lib/store.ts native/__tests__/ native/jest.config.js native/babel.config.js
git commit -m "feat(native): recommendation filter (TDD) + jest/babel setup"
```

---

## Task 5: Full Zustand store with AsyncStorage persistence

**Files:**
- Modify: `native/lib/store.ts`

- [ ] **Step 5.1: Replace the minimal stub with the full store**

Overwrite `/root/app/native/lib/store.ts`:

```ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Status } from "../content/types";

export interface Profile {
  status: Status | null;
  region?: string;
  interests?: string[];
  didOnboard: boolean;
  didMockLogin: boolean;
}

interface State {
  profile: Profile;
  setProfile: (p: Partial<Profile>) => void;
  markMockLoggedIn: () => void;
  resetDemo: () => void;
  _hasHydrated: boolean;
}

const defaultProfile: Profile = {
  status: null,
  region: undefined,
  interests: undefined,
  didOnboard: false,
  didMockLogin: false,
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      _hasHydrated: false,
      setProfile: (p) => {
        const next: Profile = { ...get().profile, ...p, didOnboard: true };
        set({ profile: next });
      },
      markMockLoggedIn: () => {
        set({ profile: { ...get().profile, didMockLogin: true } });
      },
      resetDemo: () => {
        set({ profile: defaultProfile });
      },
    }),
    {
      name: "vp-companion-native",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ profile: s.profile }),
      onRehydrateStorage: () => (state) => {
        if (state) state._hasHydrated = true;
      },
    }
  )
);

/** Convenience selector for components that should wait for hydration. */
export const useHasHydrated = () => useStore((s) => s._hasHydrated);
```

- [ ] **Step 5.2: Verify the recommendation tests still pass**

```bash
cd /root/app/native
npm test
```

Expected: 5 tests pass (the `Profile` shape is unchanged from Task 4's stub).

- [ ] **Step 5.3: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 5.4: Commit**

```bash
cd /root/app
git add native/lib/store.ts
git commit -m "feat(native): Zustand store with AsyncStorage persistence"
```

---

## Task 6: UI components

Seven small components, each ~20–60 lines of `StyleSheet`. Built together because they share styling patterns and none has logic worth a unit test on its own — verification is `tsc` + `expo export` at the end of the task.

**Files:**
- Create: `native/components/Button.tsx`
- Create: `native/components/Card.tsx`
- Create: `native/components/Chip.tsx`
- Create: `native/components/IconTile.tsx`
- Create: `native/components/Header.tsx`
- Create: `native/components/ScreenContainer.tsx`
- Create: `native/components/StubScreen.tsx`

- [ ] **Step 6.1: `Button.tsx`**

`/root/app/native/components/Button.tsx`:

```tsx
import { Pressable, Text, StyleSheet, type PressableProps } from "react-native";
import { colors, elevation, fontSize, radius, weight } from "../lib/theme";
import { tapLight } from "../lib/haptics";

interface Props extends Omit<PressableProps, "children" | "style"> {
  children: string;
}

export function Button({ children, onPress, ...rest }: Props) {
  return (
    <Pressable
      {...rest}
      onPress={(e) => {
        tapLight();
        onPress?.(e);
      }}
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
    >
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand,
    borderRadius: radius.card,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    ...elevation.button,
  },
  label: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: weight.semibold,
  },
});
```

- [ ] **Step 6.2: `Card.tsx`**

`/root/app/native/components/Card.tsx`:

```tsx
import { View, StyleSheet, type ViewProps } from "react-native";
import { colors, elevation, radius } from "../lib/theme";

export function Card({ style, children, ...rest }: ViewProps) {
  return (
    <View {...rest} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.beige,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: 16,
    ...elevation.card,
  },
});
```

- [ ] **Step 6.3: `Chip.tsx`**

`/root/app/native/components/Chip.tsx`:

```tsx
import { View, Text, StyleSheet } from "react-native";
import { colors, fontSize, radius, weight } from "../lib/theme";

export function Chip({ children }: { children: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginRight: 6,
    marginBottom: 6,
  },
  label: {
    color: colors.brand,
    fontSize: fontSize.sm,
    fontWeight: weight.medium,
  },
});
```

- [ ] **Step 6.4: `IconTile.tsx`**

`/root/app/native/components/IconTile.tsx`:

```tsx
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, radius } from "../lib/theme";
import { mci } from "../lib/icons";

export function IconTile({ icon, size = 42 }: { icon: string; size?: 38 | 42 }) {
  return (
    <View style={[styles.tile, { width: size, height: size }]}>
      <MaterialCommunityIcons name={mci(icon)} size={22} color={colors.brand} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.beige,
    borderRadius: radius.iconTile,
    alignItems: "center",
    justifyContent: "center",
  },
});
```

- [ ] **Step 6.5: `Header.tsx`**

`/root/app/native/components/Header.tsx`:

```tsx
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontSize, weight } from "../lib/theme";

interface Props {
  title?: string;
  showGear?: boolean;
}

export function Header({ title, showGear = true }: Props) {
  return (
    <View style={styles.bar}>
      <Text style={styles.title}>{title ?? ""}</Text>
      {showGear && (
        <Pressable
          onPress={() => Alert.alert("Налаштування", "Цей екран — у повній версії.")}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="cog-outline" size={22} color={colors.brand} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.beigeSoft,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: weight.semibold,
    color: colors.brand,
  },
});
```

- [ ] **Step 6.6: `ScreenContainer.tsx`**

`/root/app/native/components/ScreenContainer.tsx`:

```tsx
import { ScrollView, StyleSheet, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../lib/theme";

export function ScreenContainer({ children, style, ...rest }: ScrollViewProps) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        {...rest}
        style={styles.scroll}
        contentContainerStyle={[styles.content, style]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.beigeSoft },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
});
```

- [ ] **Step 6.7: `StubScreen.tsx`**

`/root/app/native/components/StubScreen.tsx`:

```tsx
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontSize, weight } from "../lib/theme";
import { mci } from "../lib/icons";

export function StubScreen({ title, icon }: { title: string; icon: string }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <MaterialCommunityIcons name={mci(icon)} size={56} color={colors.brand} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>Цей розділ — у повній версії.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.beigeSoft },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand },
  body: { fontSize: fontSize.base, color: colors.muted, textAlign: "center" },
});
```

- [ ] **Step 6.8: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 6.9: Commit**

```bash
cd /root/app
git add native/components/
git commit -m "feat(native): UI components (Button, Card, Chip, IconTile, Header, ScreenContainer, StubScreen)"
```

---

## Task 7: Root layout and routing gate

**Files:**
- Create: `native/app/_layout.tsx`
- Create: `native/app/index.tsx`

- [ ] **Step 7.1: Root layout (`app/_layout.tsx`)**

`/root/app/native/app/_layout.tsx`:

```tsx
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
```

- [ ] **Step 7.2: Routing gate (`app/index.tsx`)**

`/root/app/native/app/index.tsx`:

```tsx
import { Redirect } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useStore, useHasHydrated } from "../lib/store";
import { colors } from "../lib/theme";

export default function Index() {
  const hydrated = useHasHydrated();
  const didOnboard = useStore((s) => s.profile.didOnboard);

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  return <Redirect href={didOnboard ? "/(tabs)" : "/onboarding/login"} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.beigeSoft },
});
```

- [ ] **Step 7.3: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS. (May emit warnings about not-yet-existing routes `onboarding/*` and `(tabs)/*` — those routes are added in subsequent tasks. `typedRoutes` codegen will only succeed once they exist; if tsc errors specifically about route names, postpone the strict check to Task 14.)

- [ ] **Step 7.4: Commit**

```bash
cd /root/app
git add native/app/_layout.tsx native/app/index.tsx
git commit -m "feat(native): root layout + hydration-gated routing"
```

---

## Task 8: Onboarding — Login

**Files:**
- Create: `native/app/onboarding/_layout.tsx`
- Create: `native/app/onboarding/login.tsx`

- [ ] **Step 8.1: Onboarding stack layout**

`/root/app/native/app/onboarding/_layout.tsx`:

```tsx
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
```

- [ ] **Step 8.2: Login screen**

`/root/app/native/app/onboarding/login.tsx`:

```tsx
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { useStore } from "../../lib/store";
import { colors, fontSize, weight } from "../../lib/theme";

export default function LoginScreen() {
  const router = useRouter();
  const markMockLoggedIn = useStore((s) => s.markMockLoggedIn);

  const continueWithDiia = () => {
    markMockLoggedIn();
    router.push("/onboarding/status");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.tagline}>Державні послуги для ветеранів та ветеранок</Text>
        <View style={styles.actions}>
          <Button onPress={continueWithDiia}>Увійти через Дія</Button>
          <Pressable onPress={() => router.push("/onboarding/status")}>
            <Text style={styles.skip}>Продовжити без входу</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 16 },
  logo: { width: 96, height: 96, marginBottom: 8, resizeMode: "contain" },
  tagline: { fontSize: fontSize.base, color: colors.muted, textAlign: "center" },
  actions: { width: "100%", marginTop: 16, gap: 12, alignItems: "center" },
  skip: { color: colors.muted, fontSize: fontSize.sm, textDecorationLine: "underline" },
});
```

- [ ] **Step 8.3: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS (or route warnings — see Task 7.3 note).

- [ ] **Step 8.4: Commit**

```bash
cd /root/app
git add native/app/onboarding/
git commit -m "feat(native): onboarding stack + Login screen"
```

---

## Task 9: Onboarding — Status

**Files:**
- Create: `native/app/onboarding/status.tsx`

- [ ] **Step 9.1: Status screen**

`/root/app/native/app/onboarding/status.tsx`:

```tsx
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Card } from "../../components/Card";
import { statuses } from "../../content/statuses";
import { useStore } from "../../lib/store";
import { colors, fontSize, weight, space } from "../../lib/theme";

export default function StatusScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Оберіть свій статус</Text>
        <Text style={styles.subtitle}>Послуги та програми різняться залежно від статусу.</Text>

        <View style={{ gap: space(3) }}>
          {statuses.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => {
                setProfile({ status: s.id });
                router.push("/onboarding/region");
              }}
            >
              <Card>
                <Text style={styles.cardTitle}>{s.short} — {s.full}</Text>
                <Text style={styles.cardBody}>{s.description}</Text>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.beigeSoft },
  content: { padding: 20, paddingTop: 32, gap: 4 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand },
  subtitle: { fontSize: fontSize.sm, color: colors.muted, marginBottom: 16 },
  cardTitle: { fontSize: fontSize.lg, fontWeight: weight.semibold, color: colors.brand },
  cardBody: { fontSize: fontSize.sm, color: colors.muted, marginTop: 4 },
});
```

- [ ] **Step 9.2: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS (or route warnings).

- [ ] **Step 9.3: Commit**

```bash
cd /root/app
git add native/app/onboarding/status.tsx
git commit -m "feat(native): Status onboarding screen"
```

---

## Task 10: Onboarding — Region

**Files:**
- Create: `native/app/onboarding/region.tsx`

- [ ] **Step 10.1: Region screen**

`/root/app/native/app/onboarding/region.tsx`:

```tsx
import { useState, useMemo } from "react";
import { View, Text, Pressable, TextInput, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { regions } from "../../content/regions";
import { useStore } from "../../lib/store";
import { colors, fontSize, weight, radius } from "../../lib/theme";

export default function RegionScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => regions.filter((r) => r.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  const pick = (r: string) => {
    setProfile({ region: r });
    router.push("/onboarding/interests");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>Ваш регіон</Text>
        <Text style={styles.subtitle}>Допоможе показати регіональні програми та послуги.</Text>

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Пошук області"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <FlatList
          data={filtered}
          keyExtractor={(r) => r}
          contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => pick(item)}>
              <Text style={styles.rowLabel}>{item}</Text>
            </Pressable>
          )}
        />

        <Pressable
          onPress={() => {
            setProfile({});
            router.push("/onboarding/interests");
          }}
        >
          <Text style={styles.skip}>Пропустити</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.beigeSoft },
  content: { flex: 1, padding: 20, paddingTop: 32 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand, marginBottom: 4 },
  subtitle: { fontSize: fontSize.sm, color: colors.muted, marginBottom: 12 },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: fontSize.sm,
    color: colors.brand,
    marginBottom: 12,
  },
  row: {
    backgroundColor: colors.white,
    borderColor: colors.beige,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: { fontSize: fontSize.base, color: colors.brand },
  skip: { color: colors.muted, fontSize: fontSize.sm, textDecorationLine: "underline", marginTop: 12, alignSelf: "flex-start" },
});
```

- [ ] **Step 10.2: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS (or route warnings).

- [ ] **Step 10.3: Commit**

```bash
cd /root/app
git add native/app/onboarding/region.tsx
git commit -m "feat(native): Region onboarding screen (searchable list)"
```

---

## Task 11: Onboarding — Interests

**Files:**
- Create: `native/app/onboarding/interests.tsx`

- [ ] **Step 11.1: Interests screen (word-cloud pills, multi-select)**

`/root/app/native/app/onboarding/interests.tsx`:

```tsx
import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { interests } from "../../content/interests";
import { useStore } from "../../lib/store";
import { colors, fontSize, weight, radius, elevation } from "../../lib/theme";

// Matches the rotation used by the web app's InterestsScreen to read as a word cloud.
const SIZES = [
  fontSize["3xl"], fontSize["2xl"], fontSize["4xl"], fontSize["2xl"],
  fontSize.xl,     fontSize["3xl"], fontSize["2xl"], fontSize.xl,
];

export default function InterestsScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const existing = useStore((s) => s.profile.interests ?? []);
  const [selected, setSelected] = useState<string[]>(existing);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const done = () => {
    setProfile({ interests: selected });
    router.replace("/(tabs)");
  };
  const skip = () => {
    setProfile({});
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Що вас найбільше цікавить?</Text>
        <Text style={styles.subtitle}>Можна обрати декілька. Це допоможе підібрати релевантні послуги.</Text>

        <View style={styles.cloud}>
          {interests.map((it, i) => {
            const on = selected.includes(it.id);
            return (
              <Pressable
                key={it.id}
                onPress={() => toggle(it.id)}
                style={[
                  styles.pill,
                  on ? styles.pillOn : styles.pillOff,
                  on && elevation.card,
                ]}
              >
                <Text
                  style={[
                    styles.pillLabel,
                    { fontSize: SIZES[i] },
                    on ? { color: colors.white } : { color: colors.brand },
                  ]}
                >
                  {it.nameUa}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button onPress={done}>Готово</Button>
          <Pressable onPress={skip}>
            <Text style={styles.skip}>Пропустити</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.beigeSoft },
  content: { padding: 20, paddingTop: 32, paddingBottom: 24, flexGrow: 1 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand, marginBottom: 4 },
  subtitle: { fontSize: fontSize.sm, color: colors.muted, marginBottom: 24 },
  cloud: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
    flex: 1,
  },
  pill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  pillOn:  { backgroundColor: colors.oliveSoft, borderColor: colors.oliveSoft },
  pillOff: { backgroundColor: colors.white,     borderColor: colors.border },
  pillLabel: { fontWeight: weight.semibold },
  actions: { marginTop: 24, gap: 12, alignItems: "center" },
  skip: { color: colors.muted, fontSize: fontSize.sm, textDecorationLine: "underline" },
});
```

- [ ] **Step 11.2: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS (or route warnings).

- [ ] **Step 11.3: Commit**

```bash
cd /root/app
git add native/app/onboarding/interests.tsx
git commit -m "feat(native): Interests onboarding screen (word-cloud multi-select)"
```

---

## Task 12: Tabs layout with custom active indicator

**Files:**
- Create: `native/app/(tabs)/_layout.tsx`

- [ ] **Step 12.1: Tab bar with brand-style active indicator**

`/root/app/native/app/(tabs)/_layout.tsx`:

```tsx
import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontSize, weight } from "../../lib/theme";
import { mci } from "../../lib/icons";

interface TabIcon {
  inactive: string;   // ri:* name (line variant)
  active:   string;   // ri:* name (fill variant)
}

const TAB_ICONS: Record<string, TabIcon> = {
  catalog:      { inactive: "ri:apps-2-line",        active: "ri:apps-2-fill" },
  index:        { inactive: "ri:home-5-line",        active: "ri:home-5-fill" },
  ai:           { inactive: "ri:sparkling-2-line",   active: "ri:sparkling-2-fill" },
  applications: { inactive: "ri:file-list-3-line",   active: "ri:file-list-3-fill" },
};

function renderTabIcon(routeName: string, focused: boolean) {
  const set = TAB_ICONS[routeName];
  if (!set) return null;
  const name = focused ? set.active : set.inactive;
  return (
    <View style={styles.iconWrap}>
      {focused && <View style={styles.activeBar} />}
      <MaterialCommunityIcons
        name={mci(name)}
        size={25}
        color={focused ? colors.brand : colors.inactive}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => renderTabIcon(route.name, focused),
      })}
    >
      <Tabs.Screen name="catalog"      options={{ title: "Каталог" }} />
      <Tabs.Screen name="index"        options={{ title: "Головна" }} />
      <Tabs.Screen name="ai"           options={{ title: "AI" }} />
      <Tabs.Screen name="applications" options={{ title: "Мої послуги" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.beige,
    borderTopWidth: 1,
    height: 64,
    paddingTop: 4,
    paddingBottom: 4,
  },
  tabLabel: {
    fontSize: fontSize.xs,
    fontWeight: weight.medium,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeBar: {
    position: "absolute",
    top: -8,
    height: 3,
    width: 32,
    backgroundColor: colors.olive,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
});
```

- [ ] **Step 12.2: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 12.3: Commit**

```bash
cd /root/app
git add native/app/\(tabs\)/_layout.tsx
git commit -m "feat(native): bottom tab bar with brand active indicator"
```

---

## Task 13: Home tab (Головна)

**Files:**
- Create: `native/app/(tabs)/index.tsx`

- [ ] **Step 13.1: Home screen**

`/root/app/native/app/(tabs)/index.tsx`:

```tsx
import { View, Text, Pressable, Image, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header } from "../../components/Header";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Chip } from "../../components/Chip";
import { IconTile } from "../../components/IconTile";
import { categories } from "../../content/categories";
import { statuses } from "../../content/statuses";
import { articles } from "../../content/articles.generated";
import { useStore } from "../../lib/store";
import { recommend } from "../../lib/recommendations";
import { stepsLabel } from "../../lib/plurals";
import { mci } from "../../lib/icons";
import { colors, fontSize, weight, radius, elevation } from "../../lib/theme";

export default function HomeScreen() {
  const profile = useStore((s) => s.profile);
  const statusLabel = statuses.find((s) => s.id === profile.status)?.short;
  const recommended = recommend(articles, profile);

  return (
    <View style={styles.root}>
      <Header />
      <ScreenContainer>
        <Text style={styles.greeting}>Доброго дня 👋</Text>
        <Text style={styles.h1}>Ваші послуги</Text>

        <View style={styles.chipRow}>
          {statusLabel && <Chip>{statusLabel}</Chip>}
          {profile.region && <Chip>{profile.region}</Chip>}
        </View>

        <Pressable
          style={styles.aiTile}
          onPress={() => Alert.alert("AI асистент", "Цей розділ — у повній версії.")}
        >
          <MaterialCommunityIcons name={mci("ri:sparkling-2-line")} size={20} color={colors.white} />
          <Text style={styles.aiText}>Запитати в AI — напишіть питання…</Text>
        </Pressable>

        <Text style={styles.section}>Рекомендовано вам</Text>
        {recommended.length === 0 && (
          <Text style={styles.empty}>Ми ще додаємо послуги для вашого статусу.</Text>
        )}
        {recommended.map((a) => {
          const cat = categories.find((c) => c.id === a.category);
          return (
            <Pressable
              key={a.id}
              style={styles.recRow}
              onPress={() => Alert.alert(a.title, "Цей екран — у повній версії.")}
            >
              <IconTile icon={cat?.icon ?? "ri:bookmark-line"} size={42} />
              <View style={styles.recBody}>
                <Text style={styles.recTitle}>{a.title}</Text>
                <Text style={styles.recMeta}>
                  {cat?.nameUa}
                  {a.steps ? ` · ${stepsLabel(a.steps.length)}` : ""}
                </Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          );
        })}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
  greeting: { fontSize: fontSize.sm, color: colors.muted },
  h1: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand, marginBottom: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap" },
  aiTile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.brand,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 4,
  },
  aiText: { color: colors.white, fontSize: fontSize.sm, fontWeight: weight.medium },
  section: { fontSize: fontSize.sm, fontWeight: weight.semibold, color: colors.muted, marginTop: 12, marginBottom: 4 },
  empty: { fontSize: fontSize.sm, color: colors.muted },
  recRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderColor: colors.beige,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: 16,
    ...elevation.card,
  },
  recBody: { flex: 1 },
  recTitle: { fontSize: fontSize.sm, fontWeight: weight.semibold, color: colors.brand },
  recMeta:  { fontSize: fontSize.xs, color: colors.muted, marginTop: 2 },
  chev: { color: colors.border, fontSize: fontSize.xl },
});
```

- [ ] **Step 13.2: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 13.3: Commit**

```bash
cd /root/app
git add native/app/\(tabs\)/index.tsx
git commit -m "feat(native): Home tab (greeting, chips, AI tile, recommended list)"
```

---

## Task 14: Catalog tab

**Files:**
- Create: `native/app/(tabs)/catalog.tsx`

- [ ] **Step 14.1: Catalog grid (2 columns × 5 rows)**

`/root/app/native/app/(tabs)/catalog.tsx`:

```tsx
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from "react-native";
import { Header } from "../../components/Header";
import { IconTile } from "../../components/IconTile";
import { categories } from "../../content/categories";
import { colors, fontSize, weight, radius, elevation } from "../../lib/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CatalogScreen() {
  return (
    <View style={styles.root}>
      <Header title="Каталог послуг" />
      <SafeAreaView style={styles.body} edges={["bottom"]}>
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(c) => c.id}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.tile}
              onPress={() => Alert.alert(item.nameUa, "Список послуг цієї категорії — у повній версії.")}
            >
              <IconTile icon={item.icon} size={38} />
              <Text style={styles.label}>{item.nameUa}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
  body: { flex: 1 },
  tile: {
    flex: 1,
    minHeight: 112,
    backgroundColor: colors.white,
    borderColor: colors.beige,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: 16,
    justifyContent: "space-between",
    ...elevation.card,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: weight.semibold,
    color: colors.brand,
    marginTop: 8,
  },
});
```

- [ ] **Step 14.2: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 14.3: Commit**

```bash
cd /root/app
git add native/app/\(tabs\)/catalog.tsx
git commit -m "feat(native): Catalog tab (2-col grid of 10 categories)"
```

---

## Task 15: AI and Мої послуги stub tabs

**Files:**
- Create: `native/app/(tabs)/ai.tsx`
- Create: `native/app/(tabs)/applications.tsx`

- [ ] **Step 15.1: AI stub**

`/root/app/native/app/(tabs)/ai.tsx`:

```tsx
import { StubScreen } from "../../components/StubScreen";

export default function AiScreen() {
  return <StubScreen title="AI асистент" icon="ri:sparkling-2-fill" />;
}
```

- [ ] **Step 15.2: Applications stub**

`/root/app/native/app/(tabs)/applications.tsx`:

```tsx
import { StubScreen } from "../../components/StubScreen";

export default function ApplicationsScreen() {
  return <StubScreen title="Мої послуги" icon="ri:file-list-3-fill" />;
}
```

- [ ] **Step 15.3: Verify tsc**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 15.4: Commit**

```bash
cd /root/app
git add native/app/\(tabs\)/ai.tsx native/app/\(tabs\)/applications.tsx
git commit -m "feat(native): AI and Мої послуги stub tabs"
```

---

## Task 16: Final verification — bundle + push

**Files:** None (verification only)

- [ ] **Step 16.1: TypeScript strict pass**

```bash
cd /root/app/native
npx tsc --noEmit
```

Expected: PASS (no errors).

- [ ] **Step 16.2: Unit tests pass**

```bash
cd /root/app/native
npm test
```

Expected: 5 recommendation tests pass.

- [ ] **Step 16.3: `expo-doctor` sanity check**

```bash
cd /root/app/native
npx expo-doctor
```

Expected: no fatal errors. Warnings about icon dimensions or missing splash variants are acceptable for the slice.

- [ ] **Step 16.4: Full production bundle**

```bash
cd /root/app/native
npx expo export --platform ios
```

Expected: bundle succeeds, writes to `dist/`. Every import must resolve. If this fails, fix the reported error and re-run.

- [ ] **Step 16.5: Add native/dist to .gitignore (defensive — should already be there)**

Verify `/root/app/native/.gitignore` already excludes `dist/`. If not, add it.

- [ ] **Step 16.6: Push**

```bash
cd /root/app
git push
```

Expected: push succeeds.

- [ ] **Step 16.7: Report to the user**

Tell the user verbatim:

> The native slice is ready. To test on your iPhone:
>
> 1. **One time:** install **Expo Go** from the App Store on your iPhone.
> 2. Pull and start (on your Mac or any machine with Node):
>    ```bash
>    git pull
>    cd native
>    npm install
>    npx expo start --tunnel
>    ```
> 3. Wait ~30 seconds for the tunnel to come up. A QR code appears in the terminal.
> 4. On the iPhone, open the **Camera** app and point it at the QR code → tap the notification → Expo Go opens and loads the slice.
>
> What to try:
> - Complete the onboarding (Login → Status → Region → Interests).
> - Switch between all 4 bottom tabs.
> - Browse the catalog grid.
> - Force-quit and reopen — should land on Home, not onboarding.
>
> Then tell me whether it feels meaningfully more native than the Capacitor build. That answer decides whether we expand the slice into a full rewrite, or keep the Capacitor build as the demo.

---

## Self-review

**Spec coverage check** — every numbered section in the spec has at least one task:

| Spec section | Implementing tasks |
|---|---|
| §1 Scope (onboarding, tabs, catalog, home, AI/Apps stubs, persisted profile, brand styling) | Tasks 7–15 |
| §2 Repo layout (`native/`) | Task 1 |
| §3 Run via Expo Go | Task 16.7 |
| §4 Tech stack | Task 1 (Steps 1.3–1.4) |
| §5 Navigation structure | Tasks 7, 8, 12 |
| §6 Tokens & components | Tasks 3, 6 |
| §7 State & persistence | Tasks 4–5 |
| §8 Content + icon mapping | Tasks 2–3 |
| §9 Screen behavior | Tasks 8–15 |
| §10 Verification strategy | Tasks 4 (TDD), 16 (bundle) |
| §11 Known limits | Out-of-scope explicit |
| §13 What comes after | Out-of-scope; user verdict drives the next plan |

**Placeholder scan** — no "TBD", "TODO", "implement later", "fill in details". All code blocks are complete and copy-pasteable.

**Type consistency** — `Profile` shape defined identically in Tasks 4.5 (stub) and 5.1 (full). All component prop shapes match their usages. Icon-name strings used in screens (`"ri:..."`) are all keys in `lib/icons.ts` mciFor table.

**One known soft spot** (already flagged in Task 7.3): `experiments.typedRoutes: true` runs route-type codegen against `app/` files. While the `(tabs)` and `onboarding/*` routes don't yet exist, `tsc` may emit warnings on Tasks 7–11. These resolve by Task 12. If they appear, do not treat them as blocking — they go away as soon as the missing routes are created.
