# Native Polish Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the native rewrite to a premium iOS-native feel: onboarding polish + app-wide haptics/animations/large-titles + Catalog→Category shared element.

**Architecture:** Three groups of changes layered on top of the existing Expo SDK 54 / expo-router / Reanimated stack. Reusable primitives (FadeUp, expanded haptics helpers, GearButton) built first; onboarding screens converted to a shared OnboardingScaffold; each non-Home tab refactored into a nested Stack so we can use iOS native large-title headers; CategoryScreen stub wired with `sharedTransitionTag`.

**Tech Stack:** React Native 0.81, Expo SDK 54, expo-router 6, react-native-reanimated 3 (transitive via expo-router), expo-haptics, expo-splash-screen, expo-status-bar, react-native-safe-area-context.

**Working directory:** All commands assume `cd /root/app/native` unless explicitly noted.

---

## File Structure

**New files (created in tasks):**
- `native/components/FadeUp.tsx` — Reanimated mount-entrance wrapper (Task 3)
- `native/components/GearButton.tsx` — settings cog used in three headers (Task 4)
- `native/components/OnboardingScaffold.tsx` — shared chrome for onboarding step screens (Task 6)
- `native/app/(tabs)/catalog/_layout.tsx` — Stack for the Catalog tab (Task 13)
- `native/app/(tabs)/catalog/index.tsx` — moved from `(tabs)/catalog.tsx` (Task 13)
- `native/app/(tabs)/catalog/[id].tsx` — CategoryScreen stub (Task 16)
- `native/app/(tabs)/ai/_layout.tsx` — Stack for AI tab (Task 14)
- `native/app/(tabs)/ai/index.tsx` — moved from `(tabs)/ai.tsx` (Task 14)
- `native/app/(tabs)/applications/_layout.tsx` — Stack for Applications tab (Task 15)
- `native/app/(tabs)/applications/index.tsx` — moved from `(tabs)/applications.tsx` (Task 15)
- `native/__tests__/haptics.test.ts` — unit test for `tapSelection` (Task 2)

**Modified files:**
- `native/lib/haptics.ts` — add `tapSelection` (Task 2)
- `native/components/Header.tsx` — extract gear into `GearButton` (Task 4)
- `native/components/IconTile.tsx` — widen `size` type so hero variant works (Task 16)
- `native/app/onboarding/login.tsx` — use Logo SVG + press feedback (Task 5)
- `native/app/onboarding/status.tsx` — scaffold + haptics + accent + FadeUp (Task 7)
- `native/app/onboarding/region.tsx` — scaffold + disclosure + haptics + FadeUp (Task 8)
- `native/app/onboarding/interests.tsx` — scaffold + haptics + FadeUp (Task 9)
- `native/app/(tabs)/_layout.tsx` — tab haptics + cross-fade (Task 10)
- `native/app/_layout.tsx` — splash-screen wiring (Task 11)
- `native/app/index.tsx` — drop ActivityIndicator (Task 11)
- All screen JSX files — per-route `<StatusBar />` (Task 12)

**Deleted files (replaced by folder routes):**
- `native/app/(tabs)/catalog.tsx` (during Task 13)
- `native/app/(tabs)/ai.tsx` (during Task 14)
- `native/app/(tabs)/applications.tsx` (during Task 15)

---

## Task 1: Verify dependencies

**Files:** none modified — diagnostic only.

- [ ] **Step 1: Check Reanimated and Splash Screen installation**

Run: `ls node_modules/react-native-reanimated node_modules/expo-splash-screen 2>&1`

Expected: both directories exist (Reanimated is transitive via expo-router; expo-splash-screen is bundled with Expo SDK 54).

- [ ] **Step 2: If either is missing, install with the SDK-compatible version**

Run only if Step 1 shows "No such file":

```
npx expo install react-native-reanimated expo-splash-screen
```

- [ ] **Step 3: Verify Reanimated Babel plugin is configured**

Run: `cat babel.config.js 2>/dev/null || cat babel.config.json 2>/dev/null`

Expected: either Expo's default `babel-preset-expo` (which includes Reanimated's plugin in SDK 54) or an explicit `'react-native-reanimated/plugin'` entry. If neither config file exists, create `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

- [ ] **Step 4: No commit** — this task is verification only.

---

## Task 2: Add `tapSelection` helper to lib/haptics.ts

The existing helpers cover impact and notification haptics, but the spec uses the iOS "selection" haptic (a small tick used when moving through choices) on tab switches and onboarding picks.

**Files:**
- Modify: `native/lib/haptics.ts`
- Create: `native/__tests__/haptics.test.ts`

- [ ] **Step 1: Write the failing test**

Create `native/__tests__/haptics.test.ts`:

```ts
import * as Haptics from "expo-haptics";

jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success" },
}));

describe("tapSelection", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls Haptics.selectionAsync", async () => {
    const { tapSelection } = await import("../lib/haptics");
    tapSelection();
    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
  });

  it("swallows rejections silently", async () => {
    (Haptics.selectionAsync as jest.Mock).mockRejectedValueOnce(new Error("no haptic engine"));
    const { tapSelection } = await import("../lib/haptics");
    expect(() => tapSelection()).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest __tests__/haptics.test.ts`

Expected: FAIL with "Cannot find module" or "tapSelection is not exported".

- [ ] **Step 3: Add `tapSelection` to lib/haptics.ts**

Append to `native/lib/haptics.ts`:

```ts
export const tapSelection = () => Haptics.selectionAsync().catch(() => {});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest __tests__/haptics.test.ts`

Expected: PASS, 2/2 tests.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 6: Commit**

```
git add native/lib/haptics.ts native/__tests__/haptics.test.ts
git commit -m "feat(native): add tapSelection helper for selection-style haptic"
```

---

## Task 3: Create FadeUp animation component

Reusable wrapper that fades children up from a small Y offset on mount. Used by `OnboardingScaffold` (title, subtitle) and per-step content stagger.

**Files:**
- Create: `native/components/FadeUp.tsx`

- [ ] **Step 1: Write the component**

Create `native/components/FadeUp.tsx`:

```tsx
import { useEffect } from "react";
import { type ViewStyle, type StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface Props {
  delay?: number;
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function FadeUp({ delay = 0, enabled = true, style, children }: Props) {
  const opacity = useSharedValue(enabled ? 0 : 1);
  const translateY = useSharedValue(enabled ? 12 : 0);

  useEffect(() => {
    if (!enabled) return;
    const config = { duration: 280, easing: Easing.out(Easing.cubic) };
    opacity.value = withDelay(delay, withTiming(1, config));
    translateY.value = withDelay(delay, withTiming(0, config));
  }, [delay, enabled, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 3: Commit**

```
git add native/components/FadeUp.tsx
git commit -m "feat(native): add FadeUp Reanimated mount-entrance wrapper"
```

---

## Task 4: Extract GearButton component

The settings cog appears in `Header.tsx` and will also appear in the three large-title nav-bar `headerRight` slots. DRY it now to avoid duplicating the Alert handler and styling.

**Files:**
- Create: `native/components/GearButton.tsx`
- Modify: `native/components/Header.tsx`

- [ ] **Step 1: Create the component**

Create `native/components/GearButton.tsx`:

```tsx
import { Pressable, Alert, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../lib/theme";

export function GearButton({ size = 24 }: { size?: number }) {
  return (
    <Pressable
      onPress={() => Alert.alert("Налаштування", "Цей екран — у повній версії.")}
      hitSlop={8}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityLabel="Налаштування"
      accessibilityRole="button"
    >
      <MaterialCommunityIcons name="cog-outline" size={size} color={colors.brand} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 4 },
  pressed: { opacity: 0.6, transform: [{ scale: 0.95 }] },
});
```

- [ ] **Step 2: Update Header.tsx to use GearButton**

Edit `native/components/Header.tsx` — replace the inline gear `Pressable` with `<GearButton />`. Final content:

```tsx
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Logo } from "./Logo";
import { GearButton } from "./GearButton";
import { colors, fontSize, weight } from "../lib/theme";

interface Props {
  title?: string;
  showGear?: boolean;
}

export function Header({ title, showGear = true }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 12 }]}>
      <View style={styles.brandRow}>
        <Logo height={34} />
        {showGear && <GearButton />}
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.beigeSoft,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: fontSize["2xl"],
    fontWeight: weight.semibold,
    color: colors.brand,
    marginTop: 14,
  },
});
```

(Note: also drops the now-unused `Pressable`, `Alert`, `MaterialCommunityIcons` imports.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 4: Visual check on device**

Reload Expo Go. Verify Home/Catalog/AI/Applications still show the gear at top-right; tapping it still shows the Alert. The gear should now visibly dip on press (the new opacity+scale).

- [ ] **Step 5: Commit**

```
git add native/components/GearButton.tsx native/components/Header.tsx
git commit -m "refactor(native): extract GearButton from Header for reuse"
```

---

## Task 5: Login splash uses the SVG wordmark

Fixes the wrong-asset bug (`assets/logo.png` is the dark-square app icon, not the wordmark).

**Files:**
- Modify: `native/app/onboarding/login.tsx`

- [ ] **Step 1: Update the file**

Replace the contents of `native/app/onboarding/login.tsx` with:

```tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/Button";
import { useStore } from "../../lib/store";
import { tapMedium } from "../../lib/haptics";
import { colors, fontSize } from "../../lib/theme";

export default function LoginScreen() {
  const router = useRouter();
  const markMockLoggedIn = useStore((s) => s.markMockLoggedIn);

  const continueWithDiia = () => {
    tapMedium();
    markMockLoggedIn();
    router.push("/onboarding/status");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Logo height={72} />
        <Text style={styles.tagline}>Державні послуги для ветеранів та ветеранок</Text>
        <View style={styles.actions}>
          <Button onPress={continueWithDiia}>Увійти через Дія</Button>
          <Pressable
            onPress={() => router.push("/onboarding/status")}
            style={({ pressed }) => [pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
          >
            <Text style={styles.skip}>Продовжити без входу</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 20 },
  tagline: { fontSize: fontSize.base, color: colors.muted, textAlign: "center", marginTop: 8 },
  actions: { width: "100%", marginTop: 16, gap: 12, alignItems: "center" },
  skip: { color: colors.muted, fontSize: fontSize.sm, textDecorationLine: "underline" },
});
```

(Note: also drops the now-unused `Image` import and the `weight` token.)

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 3: Visual check**

Reload Expo Go, log out (or clear AsyncStorage) so the Login screen shows. Confirm the wordmark renders instead of the dark-square icon, the tagline reads correctly, and the primary button still navigates.

- [ ] **Step 4: Commit**

```
git add native/app/onboarding/login.tsx
git commit -m "fix(native): use SVG wordmark on login splash instead of icon.png"
```

---

## Task 6: OnboardingScaffold component

Shared chrome (back chevron + 3 progress dots + skip slot) plus title/subtitle with FadeUp entrance. Used by Status, Region, Interests.

**Files:**
- Create: `native/components/OnboardingScaffold.tsx`

- [ ] **Step 1: Write the component**

Create `native/components/OnboardingScaffold.tsx`:

```tsx
import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { FadeUp } from "./FadeUp";
import { colors, fontSize, weight } from "../lib/theme";

interface Props {
  step: 1 | 2 | 3;
  title: string;
  subtitle?: string;
  onSkip?: () => void;
  children: React.ReactNode;
}

const DOT_INACTIVE = "rgba(45, 41, 38, 0.2)"; // colors.brand at 20% alpha

function Dot({ active, justActivated }: { active: boolean; justActivated: boolean }) {
  const color = useSharedValue(active ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    color.value = withTiming(active ? 1 : 0, { duration: 180, easing: Easing.out(Easing.cubic) });
    if (active && justActivated) {
      scale.value = withSequence(
        withTiming(1.25, { duration: 110, easing: Easing.bezier(0.34, 1.56, 0.64, 1.0) }),
        withTiming(1.0, { duration: 110, easing: Easing.out(Easing.cubic) })
      );
    }
  }, [active, justActivated, color, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(color.value, [0, 1], [DOT_INACTIVE, colors.olive]),
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function OnboardingScaffold({ step, title, subtitle, onSkip, children }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.chrome}>
        <View style={styles.side}>
          {step > 1 && (
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
              accessibilityLabel="Назад"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="chevron-left" size={28} color={colors.brand} />
            </Pressable>
          )}
        </View>

        <View style={styles.dots}>
          {[1, 2, 3].map((i) => (
            <Dot key={i} active={i === step} justActivated={i === step} />
          ))}
        </View>

        <View style={[styles.side, styles.sideRight]}>
          {onSkip && (
            <Pressable
              onPress={onSkip}
              hitSlop={8}
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
              accessibilityRole="button"
            >
              <Text style={styles.skip}>Пропустити</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.body}>
        <FadeUp delay={0}>
          <Text style={styles.title}>{title}</Text>
        </FadeUp>
        {subtitle && (
          <FadeUp delay={60}>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </FadeUp>
        )}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
  chrome: {
    height: 44,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  side: { width: 60, alignItems: "flex-start" },
  sideRight: { alignItems: "flex-end" },
  dots: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  skip: { color: colors.muted, fontSize: fontSize.sm, textDecorationLine: "underline" },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand },
  subtitle: { fontSize: fontSize.sm, color: colors.muted, marginTop: 4 },
  content: { flex: 1, marginTop: 20 },
});
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 3: Commit**

```
git add native/components/OnboardingScaffold.tsx
git commit -m "feat(native): add OnboardingScaffold with progress dots and chrome"
```

---

## Task 7: Convert Status screen to OnboardingScaffold

**Files:**
- Modify: `native/app/onboarding/status.tsx`

- [ ] **Step 1: Replace the file**

Overwrite `native/app/onboarding/status.tsx` with:

```tsx
import { Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "../../components/Card";
import { FadeUp } from "../../components/FadeUp";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { statuses } from "../../content/statuses";
import { useStore } from "../../lib/store";
import { tapSelection } from "../../lib/haptics";
import { colors, fontSize, weight } from "../../lib/theme";

export default function StatusScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);

  return (
    <OnboardingScaffold
      step={1}
      title="Оберіть свій статус"
      subtitle="Послуги та програми різняться залежно від статусу."
    >
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {statuses.map((s, i) => (
          <FadeUp key={s.id} delay={80 + Math.min(i, 5) * 40}>
            <Pressable
              onPress={() => {
                tapSelection();
                setProfile({ status: s.id });
                router.push("/onboarding/region");
              }}
              style={({ pressed }) => [pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
            >
              <Card style={styles.card}>
                <Text style={styles.cardTitle}>{s.short} — {s.full}</Text>
                <Text style={styles.cardBody}>{s.description}</Text>
              </Card>
            </Pressable>
          </FadeUp>
        ))}
      </ScrollView>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12, paddingBottom: 24 },
  card: { borderLeftWidth: 3, borderLeftColor: colors.olive },
  cardTitle: { fontSize: fontSize.lg, fontWeight: weight.semibold, color: colors.brand },
  cardBody: { fontSize: fontSize.sm, color: colors.muted, marginTop: 4 },
});
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 3: Visual check**

Reload, navigate to status step. Confirm: progress dots show "● ○ ○" with the first dot olive; no back chevron; title/subtitle fade up; cards fade-up stagger; each card shows an olive vertical bar on its left edge; tapping a card plays a selection haptic and advances.

- [ ] **Step 4: Commit**

```
git add native/app/onboarding/status.tsx
git commit -m "feat(native): convert Status step to OnboardingScaffold with haptics"
```

---

## Task 8: Convert Region screen

**Files:**
- Modify: `native/app/onboarding/region.tsx`

- [ ] **Step 1: Replace the file**

Overwrite `native/app/onboarding/region.tsx` with:

```tsx
import { useState, useMemo } from "react";
import { View, Text, Pressable, TextInput, FlatList, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FadeUp } from "../../components/FadeUp";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { regions } from "../../content/regions";
import { useStore } from "../../lib/store";
import { tapSelection } from "../../lib/haptics";
import { colors, fontSize, radius } from "../../lib/theme";

const INITIAL_STAGGER_LIMIT = 8;

export default function RegionScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => regions.filter((r) => r.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  const pick = (r: string) => {
    tapSelection();
    setProfile({ region: r });
    router.push("/onboarding/interests");
  };

  const skip = () => {
    setProfile({});
    router.push("/onboarding/interests");
  };

  return (
    <OnboardingScaffold
      step={2}
      title="Ваш регіон"
      subtitle="Допоможе показати регіональні програми та послуги."
      onSkip={skip}
    >
      <FadeUp delay={120}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Пошук області"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </FadeUp>

      <FlatList
        data={filtered}
        keyExtractor={(r) => r}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const animate = index < INITIAL_STAGGER_LIMIT && q === "";
          return (
            <FadeUp delay={animate ? 160 + Math.min(index, 5) * 40 : 0} enabled={animate}>
              <Pressable
                onPress={() => pick(item)}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <Text style={styles.rowLabel}>{item}</Text>
                <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
              </Pressable>
            </FadeUp>
          );
        }}
      />
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    fontSize: fontSize.sm,
    color: colors.brand,
    marginBottom: 12,
  },
  listContent: { gap: 8, paddingBottom: 24 },
  row: {
    backgroundColor: colors.white,
    borderColor: colors.beige,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowPressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  rowLabel: { fontSize: fontSize.base, color: colors.brand, flex: 1 },
});
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 3: Visual check**

Reload, walk past status into region. Confirm: dots "● ● ○"; back chevron present; Skip top-right; search input min-height 44pt; first ~8 rows fade-up stagger, later rows just appear instantly; each row has a chevron-right disclosure; tap plays haptic and advances.

- [ ] **Step 4: Commit**

```
git add native/app/onboarding/region.tsx
git commit -m "feat(native): convert Region step to OnboardingScaffold + disclosure rows"
```

---

## Task 9: Convert Interests screen

**Files:**
- Modify: `native/app/onboarding/interests.tsx`

- [ ] **Step 1: Replace the file**

Overwrite `native/app/onboarding/interests.tsx` with:

```tsx
import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { FadeUp } from "../../components/FadeUp";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { interests } from "../../content/interests";
import { useStore } from "../../lib/store";
import { tapSelection, tapMedium } from "../../lib/haptics";
import { colors, fontSize, weight, radius, elevation } from "../../lib/theme";

const SIZES = [
  fontSize["3xl"], fontSize["2xl"], fontSize["4xl"], fontSize["2xl"],
  fontSize.xl,     fontSize["3xl"], fontSize["2xl"], fontSize.xl,
];

export default function InterestsScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const [selected, setSelected] = useState<string[]>(
    () => useStore.getState().profile.interests ?? []
  );

  const toggle = (id: string) => {
    tapSelection();
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const done = () => {
    tapMedium();
    setProfile({ interests: selected });
    router.replace("/(tabs)");
  };

  const skip = () => {
    setProfile({});
    router.replace("/(tabs)");
  };

  return (
    <OnboardingScaffold
      step={3}
      title="Що вас найбільше цікавить?"
      subtitle="Можна обрати декілька. Це допоможе підібрати релевантні послуги."
      onSkip={skip}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cloud}>
          {interests.map((it, i) => {
            const on = selected.includes(it.id);
            return (
              <FadeUp key={it.id} delay={80 + Math.min(i, 5) * 40}>
                <Pressable
                  onPress={() => toggle(it.id)}
                  style={({ pressed }) => [
                    styles.pill,
                    on ? styles.pillOn : styles.pillOff,
                    on && elevation.card,
                    pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
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
              </FadeUp>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button onPress={done}>Готово</Button>
        </View>
      </ScrollView>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
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
});
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 3: Visual check**

Reload, walk into interests. Confirm: dots "● ● ●"; back chevron + Skip; pill cloud stagger-fades in; tapping a pill plays selection haptic + visual press feedback + toggles olive state; "Готово" plays medium haptic and advances to tabs.

- [ ] **Step 4: Commit**

```
git add native/app/onboarding/interests.tsx
git commit -m "feat(native): convert Interests step to OnboardingScaffold with stagger"
```

---

## Task 10: Tab switch haptics + cross-fade transition

**Files:**
- Modify: `native/app/(tabs)/_layout.tsx`

- [ ] **Step 1: Read the current file**

Run: `cat native/app/\(tabs\)/_layout.tsx`

Note the existing `<Tabs screenOptions={...}>` structure.

- [ ] **Step 2: Add the haptic listener and animation option**

Edit the Tabs JSX in `native/app/(tabs)/_layout.tsx`. Add to imports:

```tsx
import { tapSelection } from "../../lib/haptics";
```

Change the `<Tabs ...>` opening tag from:

```tsx
<Tabs
  screenOptions={({ route }) => ({
    headerShown: false,
    ...
  })}
>
```

to:

```tsx
<Tabs
  screenListeners={{
    tabPress: () => tapSelection(),
  }}
  screenOptions={({ route }) => ({
    headerShown: false,
    animation: "shift",
    ...
  })}
>
```

(Add only the two new keys — `screenListeners` and `animation: "shift"`. Everything else inside `screenOptions` stays as it was.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0. If TypeScript complains that `animation` is not a valid key on `BottomTabNavigationOptions`, your installed `@react-navigation/bottom-tabs` version doesn't support cross-fade animations. In that case, remove the `animation` line and skip the animation portion of this task — the haptics still get the user 80% of the way.

- [ ] **Step 4: Visual check**

Reload. Tap each tab in turn. Confirm: every tap plays a tick haptic; content cross-fades (or shifts) instead of snapping. If your RN version didn't support animation, accept the snap behavior; the haptic alone improves the feel meaningfully.

- [ ] **Step 5: Commit**

```
git add native/app/\(tabs\)/_layout.tsx
git commit -m "feat(native): selection haptic + cross-fade on bottom tab switches"
```

---

## Task 11: Splash screen wiring

**Files:**
- Modify: `native/app/_layout.tsx`
- Modify: `native/app/index.tsx`

- [ ] **Step 1: Update root layout**

Replace `native/app/_layout.tsx` with:

```tsx
import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useHasHydrated } from "../lib/store";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const hydrated = useHasHydrated();

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated]);

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

- [ ] **Step 2: Simplify the index file**

Replace `native/app/index.tsx` with:

```tsx
import { Redirect } from "expo-router";
import { useStore, useHasHydrated } from "../lib/store";

export default function Index() {
  const hydrated = useHasHydrated();
  const didOnboard = useStore((s) => s.profile.didOnboard);

  if (!hydrated) return null;

  return <Redirect href={didOnboard ? "/(tabs)" : "/onboarding/login"} />;
}
```

(No more `ActivityIndicator` — the system splash covers the unhydrated window.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 4: Visual check**

Force-quit Expo Go on the phone. Relaunch the app. Confirm: the system splash holds visibly until JS bundle + store hydrate, then crossfades into the first screen with no white flash in between.

- [ ] **Step 5: Commit**

```
git add native/app/_layout.tsx native/app/index.tsx
git commit -m "feat(native): hold system splash until store hydrates, drop activity spinner"
```

---

## Task 12: Per-route status bar style

`expo-status-bar` reconciles the latest mounted `<StatusBar>`, so each screen can declare its own. All current backgrounds are light (white or beige), so they all want `style="dark"`. Adding per-screen `<StatusBar>` instances now means future dark-bg screens can flip the icon color without touching root.

**Files:**
- Modify: `native/app/onboarding/login.tsx`
- Modify: `native/app/onboarding/status.tsx`
- Modify: `native/app/onboarding/region.tsx`
- Modify: `native/app/onboarding/interests.tsx`
- Modify: `native/app/(tabs)/index.tsx`
- Modify: `native/app/_layout.tsx` (remove the root one)

- [ ] **Step 1: Add `<StatusBar style="dark" />` to each screen**

In each of the five screen files listed above, add the import at the top:

```tsx
import { StatusBar } from "expo-status-bar";
```

And render `<StatusBar style="dark" />` as the first child of the returned tree's root view.

Example for `login.tsx` — inside the `<SafeAreaView style={styles.safe}>`, add as first child:

```tsx
<StatusBar style="dark" />
```

Repeat for each onboarding step (inside the `<OnboardingScaffold>`'s root — actually inside the children area is fine, status bar is render-order-based not tree-position-based) and inside Home's `<View style={styles.root}>`.

For the AI and Applications stubs and Catalog screen, hold off — those get refactored in Tasks 13–15 and the `<StatusBar>` will go into their new layouts.

- [ ] **Step 2: Remove root-level StatusBar**

Edit `native/app/_layout.tsx` — remove the `<StatusBar style="dark" />` line. (Per-route declarations now provide it.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 4: Visual check**

Reload. Walk through every screen. Confirm: status bar icons stay dark (visible) on every screen. No flash to light icons during transitions.

- [ ] **Step 5: Commit**

```
git add native/app/onboarding/ native/app/\(tabs\)/index.tsx native/app/_layout.tsx
git commit -m "feat(native): per-route status bar style declarations"
```

---

## Task 13: Refactor Catalog into nested Stack with large title

Moves `(tabs)/catalog.tsx` into a folder + adds a Stack layout with `headerLargeTitle: true`, `headerLeft: Logo`, `headerRight: GearButton`.

**Files:**
- Create: `native/app/(tabs)/catalog/_layout.tsx`
- Create: `native/app/(tabs)/catalog/index.tsx` (moved content)
- Delete: `native/app/(tabs)/catalog.tsx`

- [ ] **Step 1: Create the folder and Stack layout**

Run: `mkdir -p native/app/\(tabs\)/catalog`

Create `native/app/(tabs)/catalog/_layout.tsx`:

```tsx
import { Stack } from "expo-router";
import { Logo } from "../../../components/Logo";
import { GearButton } from "../../../components/GearButton";
import { colors } from "../../../lib/theme";

export default function CatalogStack() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeTitleStyle: { color: colors.brand },
        headerStyle: { backgroundColor: colors.beigeSoft },
        headerTitleStyle: { color: colors.brand },
        headerShadowVisible: false,
        headerLeft: () => <Logo height={20} />,
        headerRight: () => <GearButton size={22} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Каталог послуг" }} />
    </Stack>
  );
}
```

- [ ] **Step 2: Move the catalog screen content into the new index.tsx**

Create `native/app/(tabs)/catalog/index.tsx` with the previous catalog screen minus the custom `<Header>` (the Stack header replaces it) plus a `<StatusBar>`:

```tsx
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { IconTile } from "../../../components/IconTile";
import { categories } from "../../../content/categories";
import { colors, fontSize, weight, radius, elevation } from "../../../lib/theme";

export default function CatalogScreen() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(c) => c.id}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
            onPress={() => Alert.alert(item.nameUa, "Список послуг цієї категорії — у повній версії.")}
          >
            <IconTile icon={item.icon} size={38} />
            <Text style={styles.label}>{item.nameUa}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
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
  tilePressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  label: {
    fontSize: fontSize.sm,
    fontWeight: weight.semibold,
    color: colors.brand,
    marginTop: 8,
  },
});
```

(Note `contentInsetAdjustmentBehavior="automatic"` — this is what makes the large title shrink correctly when the FlatList scrolls. Without it the title won't animate.)

The `Alert.alert` stub stays for this task; Task 17 will replace it with router.push for the shared-element transition.

- [ ] **Step 3: Delete the old file**

Run: `rm native/app/\(tabs\)/catalog.tsx`

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 5: Visual check**

Reload, tap the Catalog tab. Confirm: nav bar shows tiny logo on the left, gear on the right, "Каталог послуг" as a large title that's visible at the top. Scroll up — the large title shrinks into the compact nav bar position. No regression in the tile grid.

If `headerLeft` clips the logo on a small device, set `Logo height={16}` in `_layout.tsx`. If even that clips, accept and add a Risks note for next pass.

- [ ] **Step 6: Commit**

```
git add native/app/\(tabs\)/catalog
git rm native/app/\(tabs\)/catalog.tsx
git commit -m "refactor(native): Catalog tab uses native iOS large-title header via nested Stack"
```

---

## Task 14: Refactor AI tab into nested Stack

Same pattern as Task 13, but the content is just `<StubScreen>` so simpler.

**Files:**
- Create: `native/app/(tabs)/ai/_layout.tsx`
- Create: `native/app/(tabs)/ai/index.tsx`
- Delete: `native/app/(tabs)/ai.tsx`

- [ ] **Step 1: Create folder + Stack layout**

Run: `mkdir -p native/app/\(tabs\)/ai`

Create `native/app/(tabs)/ai/_layout.tsx`:

```tsx
import { Stack } from "expo-router";
import { Logo } from "../../../components/Logo";
import { GearButton } from "../../../components/GearButton";
import { colors } from "../../../lib/theme";

export default function AiStack() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeTitleStyle: { color: colors.brand },
        headerStyle: { backgroundColor: colors.beigeSoft },
        headerTitleStyle: { color: colors.brand },
        headerShadowVisible: false,
        headerLeft: () => <Logo height={20} />,
        headerRight: () => <GearButton size={22} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "AI асистент" }} />
    </Stack>
  );
}
```

- [ ] **Step 2: Create the index screen**

Because StubScreen renders its own internal `Header`, we should NOT use it under a large-title Stack (we'd get two headers). Render the stub content directly:

Create `native/app/(tabs)/ai/index.tsx`:

```tsx
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontSize, weight } from "../../../lib/theme";
import { mci } from "../../../lib/icons";

export default function AiScreen() {
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <StatusBar style="dark" />
      <View style={styles.center}>
        <MaterialCommunityIcons name={mci("ri:sparkling-2-fill")} size={56} color={colors.brand} />
        <Text style={styles.title}>AI асистент</Text>
        <Text style={styles.body}>Цей розділ — у повній версії.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
  content: { flexGrow: 1, paddingHorizontal: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand },
  body: { fontSize: fontSize.base, color: colors.muted, textAlign: "center" },
});
```

- [ ] **Step 3: Delete the old file**

Run: `rm native/app/\(tabs\)/ai.tsx`

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 5: Visual check**

Reload, tap AI tab. Confirm large-title "AI асистент" with logo + gear in nav bar, stub icon+text centered.

- [ ] **Step 6: Commit**

```
git add native/app/\(tabs\)/ai
git rm native/app/\(tabs\)/ai.tsx
git commit -m "refactor(native): AI tab uses native iOS large-title header"
```

---

## Task 15: Refactor Applications tab into nested Stack

Same pattern as Task 14.

**Files:**
- Create: `native/app/(tabs)/applications/_layout.tsx`
- Create: `native/app/(tabs)/applications/index.tsx`
- Delete: `native/app/(tabs)/applications.tsx`

- [ ] **Step 1: Create folder + Stack layout**

Run: `mkdir -p native/app/\(tabs\)/applications`

Create `native/app/(tabs)/applications/_layout.tsx`:

```tsx
import { Stack } from "expo-router";
import { Logo } from "../../../components/Logo";
import { GearButton } from "../../../components/GearButton";
import { colors } from "../../../lib/theme";

export default function ApplicationsStack() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeTitleStyle: { color: colors.brand },
        headerStyle: { backgroundColor: colors.beigeSoft },
        headerTitleStyle: { color: colors.brand },
        headerShadowVisible: false,
        headerLeft: () => <Logo height={20} />,
        headerRight: () => <GearButton size={22} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Мої послуги" }} />
    </Stack>
  );
}
```

- [ ] **Step 2: Create the index screen**

Create `native/app/(tabs)/applications/index.tsx`:

```tsx
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontSize, weight } from "../../../lib/theme";
import { mci } from "../../../lib/icons";

export default function ApplicationsScreen() {
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <StatusBar style="dark" />
      <View style={styles.center}>
        <MaterialCommunityIcons name={mci("ri:file-list-3-fill")} size={56} color={colors.brand} />
        <Text style={styles.title}>Мої послуги</Text>
        <Text style={styles.body}>Цей розділ — у повній версії.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
  content: { flexGrow: 1, paddingHorizontal: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand },
  body: { fontSize: fontSize.base, color: colors.muted, textAlign: "center" },
});
```

- [ ] **Step 3: Delete the old file**

Run: `rm native/app/\(tabs\)/applications.tsx`

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 5: Visual check**

Reload, tap Applications tab. Confirm large-title "Мої послуги" works the same way.

- [ ] **Step 6: Commit**

```
git add native/app/\(tabs\)/applications
git rm native/app/\(tabs\)/applications.tsx
git commit -m "refactor(native): Applications tab uses native iOS large-title header"
```

---

## Task 16: Create stub CategoryScreen

**Files:**
- Modify: `native/components/IconTile.tsx` (widen size type)
- Create: `native/app/(tabs)/catalog/[id].tsx`

- [ ] **Step 1: Widen IconTile size type and scale inner icon**

The hero variant needs `size={96}` and a proportional inner icon. Replace `native/components/IconTile.tsx` with:

```tsx
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, radius } from "../lib/theme";
import { mci } from "../lib/icons";

export function IconTile({ icon, size = 42 }: { icon: string; size?: number }) {
  const inner = Math.round(size * 0.52);
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: size >= 64 ? 16 : radius.iconTile }]}>
      <MaterialCommunityIcons name={mci(icon)} size={inner} color={colors.brand} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.beige,
    alignItems: "center",
    justifyContent: "center",
  },
});
```

- [ ] **Step 2: Create CategoryScreen**

Create `native/app/(tabs)/catalog/[id].tsx`:

```tsx
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Stack, useLocalSearchParams } from "expo-router";
import { IconTile } from "../../../components/IconTile";
import { categories } from "../../../content/categories";
import { colors, fontSize, weight } from "../../../lib/theme";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = categories.find((c) => c.id === id);

  if (!category) {
    return (
      <View style={styles.root}>
        <Stack.Screen options={{ title: "" }} />
        <Text style={styles.body}>Категорію не знайдено.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: category.nameUa }} />
      <View style={styles.hero}>
        <IconTile icon={category.icon} size={96} />
      </View>
      <Text style={styles.body}>Список послуг цієї категорії — у повній версії.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  hero: { alignItems: "center", marginTop: 8, marginBottom: 24 },
  body: { fontSize: fontSize.base, color: colors.muted, textAlign: "center" },
});
```

- [ ] **Step 3: Change Catalog tile onPress to push to the new route**

Edit `native/app/(tabs)/catalog/index.tsx`. Add to imports:

```tsx
import { useRouter } from "expo-router";
```

Inside `CatalogScreen`, replace the `Alert.alert(...)` line. Add a `const router = useRouter();` at the top of the component, then change the Pressable's `onPress`:

```tsx
onPress={() => router.push(`/(tabs)/catalog/${item.id}` as const)}
```

(If TypeScript complains about route literal typing under `typedRoutes`, cast with `as any` or remove the `as const`. expo-router's typed routes generate from the file tree, so `[id].tsx` should be recognized after the next type-check round.)

Also remove the unused `Alert` import.

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0. If it fails on the route literal, see Step 3's note above.

- [ ] **Step 5: Visual check**

Reload, go to Catalog, tap any category tile. Confirm: a new screen pushes in showing the category name as a (large) title with a 96pt icon centered and the placeholder text below. Back chevron in nav bar returns to grid.

- [ ] **Step 6: Commit**

```
git add native/components/IconTile.tsx native/app/\(tabs\)/catalog
git commit -m "feat(native): add stub CategoryScreen behind catalog/[id] route"
```

---

## Task 17: Wire shared-element transition for catalog icons

**Files:**
- Modify: `native/app/(tabs)/catalog/index.tsx`
- Modify: `native/app/(tabs)/catalog/[id].tsx`

- [ ] **Step 1: Wrap the grid tile's IconTile in Animated.View with sharedTransitionTag**

Edit `native/app/(tabs)/catalog/index.tsx`. Add to imports:

```tsx
import Animated from "react-native-reanimated";
```

Change the renderItem's IconTile from:

```tsx
<IconTile icon={item.icon} size={38} />
```

to:

```tsx
<Animated.View sharedTransitionTag={`category-icon-${item.id}`}>
  <IconTile icon={item.icon} size={38} />
</Animated.View>
```

- [ ] **Step 2: Wrap the destination IconTile with the matching tag**

Edit `native/app/(tabs)/catalog/[id].tsx`. Add to imports:

```tsx
import Animated from "react-native-reanimated";
```

Change the hero from:

```tsx
<View style={styles.hero}>
  <IconTile icon={category.icon} size={96} />
</View>
```

to:

```tsx
<Animated.View sharedTransitionTag={`category-icon-${category.id}`} style={styles.hero}>
  <IconTile icon={category.icon} size={96} />
</Animated.View>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`

Expected: exit 0. (`sharedTransitionTag` is a string prop on `Animated.View` in Reanimated 3+; TypeScript should accept it directly.)

- [ ] **Step 4: Visual check on a real device**

Reload, go to Catalog, tap a tile. Confirm: instead of the screen pushing in over the tile, the tile's icon visually animates from its grid position into the hero position on the destination screen as the screen transition plays.

If the transition stutters or the icon snaps instead of animating, that's the Risks-section fallback case: remove the `sharedTransitionTag` props (revert this task only — keep the routing). Type-check still passes; visual is just less premium.

- [ ] **Step 5: Commit**

```
git add native/app/\(tabs\)/catalog
git commit -m "feat(native): shared-element transition on catalog -> category icon"
```

---

## Final verification

- [ ] **Step 1: Full type-check**

Run: `npx tsc --noEmit`

Expected: exit 0.

- [ ] **Step 2: Tests**

Run: `npx jest`

Expected: all tests pass (including the new `haptics.test.ts` and existing `recommendations.test.ts`).

- [ ] **Step 3: Manual walk-through on device**

Force-quit Expo Go, relaunch. Walk through:

1. Splash holds until first paint, fades into login.
2. Login shows wordmark, button + skip both have press feedback; button taps play medium haptic.
3. Status step: dots `● ○ ○`, content fades up, cards have olive left accent, picking one plays selection haptic + advances.
4. Region step: dots `● ● ○`, back chevron, skip top-right, search input 44pt, rows have chevron disclosure, first ~8 fade-stagger.
5. Interests step: dots `● ● ●`, pill cloud fade-stagger, toggling plays haptic, "Готово" plays medium haptic and advances.
6. Tab switches play selection haptic + cross-fade content.
7. Catalog/AI/Applications show iOS large titles with logo headerLeft + gear headerRight.
8. Tapping a Catalog tile glides the icon into the CategoryScreen hero.
9. Status bar icons stay readable on every screen.

If anything regressed, fix and amend the relevant task's commit.
