# Onboarding Polish — Native Slice

**Date:** 2026-05-23
**Scope:** `/root/app/native/app/onboarding/` (login, status, region, interests)
**Goal:** Bring the native onboarding flow to a "crisp" finish — fix the wrong logo asset, add wizard affordances (progress, back, shared chrome), tighten interaction feedback, and layer in tasteful mount animations.

## Context

The native rewrite already has a working four-screen onboarding flow:

- `login.tsx` — splash + "Увійти через Дія" + "Continue without login" skip link
- `status.tsx` — pick one of N status cards
- `region.tsx` — searchable region list + skip
- `interests.tsx` — multi-select pill cloud (word-cloud-style sizes) + Done/Skip

Everything routes via `expo-router` Stack with `slide_from_right`. Profile state persists in the Zustand store. Functionally complete.

What's missing for a polished feel:
1. The login screen renders `assets/logo.png` (the dark-square app icon), not the wordmark SVG that we wired into the rest of the app last session.
2. No sense of progress — no "step 2 of 3" affordance.
3. No visible back affordance during the wizard steps (gesture-back works but is invisible).
4. No shared chrome — every screen rolls its own padding/title pattern, so spacing drifts between steps.
5. `Pressable`s have no visual press feedback.
6. No mount animation; content snaps in.

## Conventions to preserve

- The conceptual flow stays: `login → status → region → interests → /(tabs)`. Login is a welcome/auth splash, not a data-collection step.
- The three configuration steps are Status, Region, Interests — those get progress affordance. Login does not.
- Step 1 (Status) has no back chevron — back from there would land in the login screen mid-flow, which is the wrong UX.
- `slide_from_right` route-level transition stays. New animations layer on top, not replace.

## Components & changes

### 1. Login splash — asset fix

`app/onboarding/login.tsx`:

- Remove the `<Image source={require("../../assets/logo.png")}>` line.
- Render `<Logo height={72} />` (the existing component in `components/Logo.tsx`).
- Keep white background, tagline, "Увійти через Дія" primary button, "Продовжити без входу" skip link.
- Apply the new press-feedback pattern (see §5) to the skip link Pressable.

### 2. New `OnboardingScaffold` component

New file: `components/OnboardingScaffold.tsx`.

Props:
```ts
interface Props {
  step: 1 | 2 | 3;
  title: string;
  subtitle?: string;
  onSkip?: () => void;     // when present, "Skip" appears top-right
  children: ReactNode;
}
```

Layout (top to bottom):

- `paddingTop: insets.top + 8` from `useSafeAreaInsets()`.
- Chrome row (44pt tall, `flexDirection: row, justifyContent: space-between, alignItems: center`):
  - Left slot: back chevron `<MaterialCommunityIcons name="chevron-left" size={28} color={colors.brand} />` inside a Pressable that calls `router.back()`. Only rendered when `step > 1`. On step 1, render an empty View of the same size to preserve the centered dots.
  - Center slot: progress dots (see below).
  - Right slot: "Пропустити" text-button when `onSkip` is provided. Otherwise an empty View matching the chevron's footprint to keep the dots centered.
- 24pt vertical gap.
- Title — `fontSize["2xl"]`, `weight.semibold`, `colors.brand`.
- 4pt gap.
- Subtitle (if any) — `fontSize.sm`, `colors.muted`.
- 20pt gap.
- Children (each step's content) flex-grows to fill the rest of the screen.

Progress dots:
- Three circles, 8pt diameter, 10pt gap.
- Current step (`i === step - 1`): `colors.olive` fill.
- Other steps: `colors.brand` at 20% alpha fill.
- The dots themselves use Reanimated shared-value-driven `backgroundColor` to crossfade between brand-alpha and olive over 180ms on prop change.
- The newly-filled dot (the one matching `step` on this mount) pulses scale 1.0 → 1.25 → 1.0 over 220ms with `Easing.bezier(0.34, 1.56, 0.64, 1.0)` for a slight overshoot.

The scaffold itself wraps content in a `View` (not SafeAreaView) — top inset handled inline, bottom inset is left to each step's content since the wizard steps don't have a sticky bottom bar.

### 3. Per-step refinements

**`app/onboarding/status.tsx`**

- Replace the bespoke header/scroll wrapper with `<OnboardingScaffold step={1} title="Оберіть свій статус" subtitle="Послуги та програми різняться залежно від статусу.">`.
- Each `Card` gets a 3pt-wide, full-height olive vertical accent bar on its left edge (inside the card, before the text content). Achieve via a `borderLeftWidth: 3, borderLeftColor: colors.olive` on the Card wrapper — or a flex-row with a colored sliver `<View>` first if `Card` doesn't expose border styling. Investigate during implementation.
- Tapping a card still calls `setProfile({ status: s.id })` + `router.push("/onboarding/region")`.

**`app/onboarding/region.tsx`**

- Wrap in `<OnboardingScaffold step={2} title="Ваш регіон" subtitle="Допоможе показати регіональні програми та послуги." onSkip={…}>`.
- Search input min-height 44pt for tap target.
- Each row gains a trailing `<MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />` disclosure indicator inside a flex-row with the label.
- Remove the now-redundant inline skip button at the bottom (the scaffold's top-right Skip slot replaces it).

**`app/onboarding/interests.tsx`**

- Wrap in `<OnboardingScaffold step={3} title="Що вас найбільше цікавить?" subtitle="Можна обрати декілька. Це допоможе підібрати релевантні послуги." onSkip={…}>`.
- Pills become animated Pressables with the press-feedback pattern.
- Keep the variable `SIZES` rotation.
- Keep the inline "Готово" Button and remove the inline skip link (now in the chrome).

### 4. Press feedback

Every `Pressable` inside the four onboarding screens uses the render-prop style form:

```tsx
<Pressable style={({ pressed }) => [styles.base, pressed && styles.pressed]}>
```

`styles.pressed = { opacity: 0.7, transform: [{ scale: 0.98 }] }`.

Applied to: login primary button (already a `<Button>` component — only change if Button doesn't already do this), login skip link, status cards, region rows, region search clear (if any), interests pills, scaffold back chevron, scaffold skip button.

Check `components/Button.tsx` during implementation — if it already implements press feedback, no change needed there; just apply the pattern to ad-hoc Pressables.

### 5. Mount animations

Library: `react-native-reanimated`. Confirm it's already a transitive dep of `expo-router`. If not present in `node_modules/react-native-reanimated`, install via `npx expo install react-native-reanimated` and add the Babel plugin per Reanimated docs (Expo SDK 54 may already include this in its default Babel preset — verify during implementation).

Pattern: a small `<FadeUp delay={n}>` wrapper component (new file `components/FadeUp.tsx`) that takes children and an optional `delay` (ms). On mount it animates `opacity 0 → 1` and `translateY 12 → 0` over 280ms with `Easing.out(Easing.cubic)`, after the given delay.

Apply:
- Scaffold title: `<FadeUp delay={0}>`
- Scaffold subtitle: `<FadeUp delay={60}>`
- Step children: each step wraps its primary list/grid items in FadeUp with a per-item stagger.
  - Status cards: 80ms + index × 40ms, capped at index ≤ 5 (so 6th+ card uses the same delay as 6th)
  - Region list (FlatList): stagger only the first 8 visible items; rows that scroll in later don't re-animate
  - Interests pills: 80ms + index × 40ms, capped at 5

Progress dots: see §2 — handled inside the scaffold via Reanimated shared values driven by the `step` prop.

## Out of scope

- No flow restructure (login → 3 steps → tabs stays).
- No hero illustration on login.
- No alphabet/group sidebar on the region list (27 oblasts isn't long enough to need it).
- No back gesture customization or interactive transition.
- No new design tokens — work within the existing palette/typography.
- No localization changes; copy stays as it is.

## Risks & open questions

- **Card border-accent**: depends on whether `components/Card.tsx` exposes a `style` prop or wraps in a way that lets a left border render. If it doesn't, the implementation step needs to either extend `Card` or render the accent as a sibling `<View>` inside a flex-row outside the Card. Resolve at implementation time, not now.
- **Reanimated presence**: assumed transitive via expo-router. If absent, install adds ~5min and a babel.config change. The plan accommodates this branch.
- **Region list stagger**: FlatList virtualizes — naively wrapping each row in `<FadeUp>` would re-trigger the animation on scroll. Solution: only animate the initial mount window (the first N rows visible on first paint); subsequent rows render with `delay={0}` and `enabled={false}` which skips animation. The `FadeUp` component will accept an `enabled` prop.

## Acceptance criteria

After this pass, on a real iPhone via Expo Go:

1. Login shows the SVG wordmark, not the dark-square icon.
2. Tapping the primary button on each step gives a visible press-down (scale + opacity dip).
3. The three step screens have a uniform top chrome: back chevron (steps 2–3 only), three dots showing current step in olive, "Пропустити" top-right on Region & Interests.
4. Advancing a step causes the next dot to pulse-and-fill.
5. On each step screen mount, content fades up — title first, then subtitle, then content items stagger in.
6. No regression in existing routing behavior or store updates.
7. Type-check passes.
