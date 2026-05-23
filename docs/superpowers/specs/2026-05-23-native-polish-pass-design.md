# Native Polish Pass

**Date:** 2026-05-23
**Scope:** `/root/app/native/` — onboarding flow + app-wide native-feel polish + catalog→category shared-element transition
**Goal:** Bring the native rewrite from "functional vertical slice" to a premium, modern-iOS-feeling app.

## Why this exists

The native rewrite is feature-complete enough that the next bottleneck for the "should we expand into a full rewrite" decision is *how it feels*, not what it does. This spec defines a coherent polish pass across three surface areas:

- **A. Onboarding flow** — fix the wrong logo asset, add shared chrome with progress dots, layer in mount animations and press feedback.
- **B. App-wide native feel** — haptics, tab cross-fade, iOS large titles on tab screens, native splash transition, per-screen status-bar style.
- **C. Catalog → Category shared element** — build a stub CategoryScreen and animate the category icon between Catalog tile and Category header.

All three groups share underlying infrastructure (`react-native-reanimated`, `expo-haptics`, the new `OnboardingScaffold`/`FadeUp` components) and benefit from being implemented together.

## Conventions to preserve

- The conceptual onboarding flow stays: `login → status → region → interests → /(tabs)`. Login is a welcome/auth splash, not a data-collection step.
- The three configuration steps are Status, Region, Interests — those get progress affordance. Login does not.
- Step 1 (Status) has no back chevron — back from there would land in the login screen mid-flow.
- `slide_from_right` route-level transition stays for the onboarding stack.
- Existing logo + gear pattern on Home stays; large titles apply to Catalog/AI/Applications instead.

---

## Group A — Onboarding polish

### A.1 Login splash — asset fix

`app/onboarding/login.tsx`:

- Remove `<Image source={require("../../assets/logo.png")}>`.
- Render `<Logo height={72} />` (the existing component in `components/Logo.tsx`).
- Keep white background, tagline, "Увійти через Дія" primary button, "Продовжити без входу" skip link.
- Skip link Pressable uses the §A.5 press-feedback pattern.

### A.2 `OnboardingScaffold` component

New file: `components/OnboardingScaffold.tsx`.

```ts
interface Props {
  step: 1 | 2 | 3;
  title: string;
  subtitle?: string;
  onSkip?: () => void;
  children: ReactNode;
}
```

Layout (top to bottom):

- `paddingTop: insets.top + 8` from `useSafeAreaInsets()`.
- Chrome row (44pt tall, `flexDirection: row, justifyContent: space-between, alignItems: center`):
  - Left slot: back chevron `<MaterialCommunityIcons name="chevron-left" size={28} color={colors.brand} />` inside a Pressable that calls `router.back()`. Only rendered when `step > 1`. On step 1, render an empty `<View>` of the same size to preserve dot centering.
  - Center slot: three progress dots.
  - Right slot: "Пропустити" text-button when `onSkip` is provided. Otherwise an empty equally-sized `<View>` to keep dots centered.
- 24pt vertical gap.
- Title — `fontSize["2xl"]`, `weight.semibold`, `colors.brand`, wrapped in `<FadeUp delay={0}>`.
- 4pt gap.
- Subtitle (if any) — `fontSize.sm`, `colors.muted`, wrapped in `<FadeUp delay={60}>`.
- 20pt gap.
- Children flex-grow to fill the remaining vertical space.

Progress dots:

- Three circles, 8pt diameter, 10pt gap.
- Current step: `colors.olive` fill.
- Other steps: `colors.brand` at 20% alpha fill.
- Reanimated shared-value-driven `backgroundColor` crossfade between brand-alpha and olive over 180ms on prop change.
- Newly-filled dot pulses scale 1.0 → 1.25 → 1.0 over 220ms with `Easing.bezier(0.34, 1.56, 0.64, 1.0)` for a slight overshoot.

Scaffold wraps content in a plain `<View>` (not `SafeAreaView`) — top inset handled inline; bottom inset is each step's responsibility since the wizard steps don't have a sticky bottom bar.

### A.3 Per-step refinements

**`app/onboarding/status.tsx`** — wrap in `<OnboardingScaffold step={1} title="Оберіть свій статус" subtitle="…">`. Each Card gains a 3pt-wide olive vertical accent on its left edge. Implementation: prefer `borderLeftWidth: 3, borderLeftColor: colors.olive` on the Card if it accepts style; else wrap in a flex-row with a sibling `<View style={{ width: 3, backgroundColor: colors.olive }} />`.

**`app/onboarding/region.tsx`** — wrap in `<OnboardingScaffold step={2} title="Ваш регіон" subtitle="…" onSkip={…}>`. Search input min-height 44pt. Each row gets a trailing `<MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />` disclosure. Remove the inline bottom skip button.

**`app/onboarding/interests.tsx`** — wrap in `<OnboardingScaffold step={3} title="Що вас найбільше цікавить?" subtitle="…" onSkip={…}>`. Pills use animated Pressable with §A.5 press feedback. Keep the variable `SIZES` rotation. Remove the inline bottom skip link. Keep the "Готово" button.

### A.4 `FadeUp` component

New file: `components/FadeUp.tsx`. Props: `{ delay?: number; enabled?: boolean; children: ReactNode }`.

- On mount: animates `opacity 0 → 1` and `translateY 12 → 0` over 280ms with `Easing.out(Easing.cubic)`, after `delay` ms.
- If `enabled === false`: renders children with no animation (used by virtualized list rows that scroll into view later — see Risks).

Apply within each onboarding step:

- Scaffold title (delay 0), subtitle (delay 60) — handled inside the scaffold.
- Status cards: per-item delay `80 + index * 40`, capped at `index ≤ 5`.
- Region rows: first 8 visible rows get staggered delays; subsequent rows pass `enabled={false}`. Track via a render counter inside the FlatList renderItem.
- Interests pills: per-item delay `80 + index * 40`, capped at `index ≤ 5`.

### A.5 Press feedback

Every `Pressable` inside the four onboarding screens uses the render-prop style form:

```tsx
<Pressable style={({ pressed }) => [styles.base, pressed && styles.pressed]}>
```

`styles.pressed = { opacity: 0.7, transform: [{ scale: 0.98 }] }`.

Check `components/Button.tsx` first; if it already implements press feedback, leave it. Apply the pattern to all ad-hoc Pressables: login skip link, status cards, region rows, interests pills, scaffold back chevron, scaffold skip button.

---

## Group B — App-wide native feel

### B.1 Haptics

`expo-haptics` is already in `package.json`. Wire it to:

- **Tab switches** (all four tabs) → `Haptics.selectionAsync()`. Hook into `tabPress` listener via `screenListeners` in `(tabs)/_layout.tsx`.
- **Onboarding card/pill selection** (status, region, interests) → `Haptics.selectionAsync()` fired in the `onPress` handler before `router.push`.
- **Primary buttons** ("Увійти через Дія" login, "Готово" interests) → `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)` in the button's onPress.
- **Future reservation** (out of scope for this spec): catalog card long-press for context menus → `Haptics.impactAsync(Heavy)`.

Centralize calls behind tiny helpers in `lib/haptics.ts` (the file already exists per the project structure read) so call-sites stay readable: `tapSelection()`, `tapPrimary()`.

### B.2 Tab cross-fade

`(tabs)/_layout.tsx`:

- Add `screenOptions={{ animation: 'shift' }}` so the active tab content cross-shifts instead of instant-swapping.
- The tab bar itself stays static; only the content area animates.
- Fallback if `'shift'` isn't supported in our exact React Navigation version (see Risks): use `sceneStyleInterpolator` for a manual fade, or revert to default.

### B.3 iOS large titles on tab screens

Refactor Catalog, AI, and Applications from single-file tabs into nested Stacks so each can use native iOS large-title headers:

- `app/(tabs)/catalog/_layout.tsx` — Stack with screenOptions:
  ```ts
  {
    headerLargeTitle: true,
    headerLargeTitleStyle: { color: colors.brand },
    headerStyle: { backgroundColor: colors.beigeSoft },
    headerLeft: () => <Logo height={20} />,
    headerRight: () => <GearButton />,
    headerShadowVisible: false,
  }
  ```
- `app/(tabs)/catalog/index.tsx` — the current `catalog.tsx` content, minus the `<Header>` wrapper. Title comes from `Stack.Screen` options: `title: "Каталог послуг"`.
- Same nested structure for `ai/` and `applications/`. AI and Applications still use `StubScreen` body but the outer chrome comes from the Stack.

Result: small nav bar with logo (left) + gear (right) + small title, plus the large screen title below that on initial scroll position, shrinking as the user scrolls — native iOS large-title behavior provided by `react-native-screens`.

Home keeps its current custom `Header.tsx` — Home greets the user instead of having a "title", so a large title there would feel out of place.

`GearButton` extracted as `components/GearButton.tsx` (DRY across Home's custom Header and the three large-title nav bars).

### B.4 Splash screen with logo fade-in

`app/_layout.tsx`:

- `import * as SplashScreen from "expo-splash-screen"` (already a transitive dep of expo-router; `npx expo install` if absent).
- Call `SplashScreen.preventAutoHideAsync()` at module load (top-level statement, not inside a component).
- Once `useHasHydrated()` returns `true`, call `SplashScreen.hideAsync()` (iOS handles the fade-out automatically).
- Remove the `ActivityIndicator` fallback from `app/index.tsx` — the system splash covers the unhydrated window.

The splash image is already configured in `app.json` (`./assets/splash.png` on `#EFE9E5`) — no asset change.

### B.5 Status bar adapts to screen

Replace the single `<StatusBar style="dark" />` at the root with per-route declarations:

- Login screen: `<StatusBar style="dark" />` (white background).
- Onboarding step screens, all tab screens: `<StatusBar style="dark" />` (beige background).
- Reserved for future dark-bg screens: `<StatusBar style="light" />`.

Implementation: each screen renders its own `<StatusBar>` near the top of its JSX. `expo-status-bar` reconciles the latest mounted instance.

---

## Group C — Catalog → Category shared-element transition

### C.1 New CategoryScreen (stub)

Overlaps with §B.3's routing refactor:

- `app/(tabs)/catalog/[id].tsx` — new route. Receives `id` via `useLocalSearchParams<{ id: string }>()`, looks up the category from `content/categories`.
- Renders a large `<IconTile size={96} icon={category.icon} />` centered near the top, body text: "Список послуг цієї категорії — у повній версії." (mirrors the existing Alert stub copy).
- Wires `Stack.Screen options={{ title: category.nameUa }}`.

`app/(tabs)/catalog/index.tsx`: the tile's `onPress` changes from `Alert.alert(...)` to `router.push("/(tabs)/catalog/" + item.id)`.

### C.2 Shared element transition

Reanimated 3+ supports `sharedTransitionTag` on `Animated.View` / `Animated.Image`. Expo SDK 54 ships Reanimated 3+ via expo-router's deps.

- In `catalog/index.tsx`: wrap each tile's `IconTile` in `Animated.View` with `sharedTransitionTag={"category-icon-" + item.id}`.
- In `catalog/[id].tsx`: wrap the large hero `IconTile` in `Animated.View` with the matching tag `sharedTransitionTag={"category-icon-" + id}`.
- Stack screen options: `animation: 'default'` (iOS push), which triggers the shared transition.

Test: tapping any catalog tile, the icon should glide from its tile position into the category screen's hero position rather than the screen pushing in on top of it.

---

## Out of scope

- No flow restructure (login → 3 steps → tabs stays).
- No hero illustration on login.
- No alphabet/group sidebar on the region list (27 oblasts isn't long enough).
- No back gesture customization.
- No new design tokens — work within the existing palette/typography.
- No localization changes; copy stays as is.
- **No Settings sheet** (item 4 from the brainstorm — deferred to a later pass).
- **No context menus on cards** (item 7 — deferred).
- **No pull-to-refresh** on home recommendations (item 9 — deferred).
- **No dark mode**.
- **No real category content** in CategoryScreen — it's a stub solely to host the shared-element target.

## Risks & open questions

- **Card border-accent on status screen**: depends on whether `components/Card.tsx` accepts a `style` prop that passes `borderLeftWidth/Color` through. If not, wrap the card in a flex-row with a sibling 3pt-wide colored `<View>`. Resolve at implementation time.
- **Reanimated presence**: assumed transitive via expo-router. If absent, `npx expo install react-native-reanimated`. Expo SDK 54's default Babel preset includes the Reanimated plugin — verify in `babel.config.js`.
- **Region list stagger inside FlatList**: virtualization can re-trigger animations on scroll. `FadeUp` accepts `enabled={false}` for non-initial rows. RenderItem will check `info.index` against a stored "max initially visible index" (e.g., 8) and disable animation past that.
- **Tab `animation: 'shift'` support**: may not exist in the exact React Navigation version pulled in by expo-router 6. If absent, fall back to a manual `sceneStyleInterpolator` cross-fade or accept default behavior.
- **Large titles + custom `headerLeft`**: iOS native nav bars can clip wide `headerLeft` content. Our `<Logo height={28} />` at the tight viewBox is ~204pt wide; the nav-bar variant uses `<Logo height={20} />` (~146pt) to fit comfortably. Test on iPhone SE to confirm.
- **Shared element timing**: requires the destination IconTile to be ready before iOS hands off the transition. If it stutters, the fallback is removing `sharedTransitionTag` and accepting a plain push.
- **GearButton extraction**: changes `Header.tsx` (Home's header). Keep diff minimal to avoid regressing the existing custom-header sizing work.
- **Splash hide race**: `SplashScreen.hideAsync()` must be called after the first paint of the post-splash content, otherwise the system shows a brief blank frame. Trigger from a `useEffect` inside the screen that mounts on first paint, not directly inside the hydration callback.

## Acceptance criteria

On a real iPhone via Expo Go after this pass:

1. Login shows the SVG wordmark, not the dark-square icon.
2. Every interactive element gives a press-down feedback (scale + opacity dip) or a small impact haptic where appropriate.
3. The three onboarding step screens have uniform top chrome: back chevron (steps 2–3 only), three dots showing current step in olive, "Пропустити" top-right on Region & Interests.
4. Advancing an onboarding step causes the next dot to pulse-and-fill smoothly.
5. On each onboarding step mount, content fades up — title first, then subtitle, then content items stagger in.
6. Tapping a tab plays a selection haptic; the new tab's content cross-fades in instead of swapping instantly.
7. Catalog, AI, and Applications show iOS-native large titles that shrink as content scrolls.
8. Logo appears in the nav bar's `headerLeft` slot on Catalog / AI / Applications; gear in `headerRight`.
9. App launch shows the system splash, holds until store hydration, then crossfades into the first screen with no white blink.
10. Status bar style matches each screen's background.
11. Tapping any catalog category pushes a stub CategoryScreen; the category icon visually flies from its grid position into the screen's hero area.
12. No regression in existing routing, store updates, or other tab behaviors.
13. Type-check passes.
