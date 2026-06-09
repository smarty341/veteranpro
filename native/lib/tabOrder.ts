// Single source of truth for the left-to-right tab order, shared by the
// tab bar and the swipe-between-tabs gesture.
export type TabEntry = { name: string; href: string };

export const TAB_ORDER: TabEntry[] = [
  { name: "index",         href: "/(tabs)" },
  { name: "opportunities", href: "/(tabs)/opportunities" },
  { name: "ai",            href: "/(tabs)/ai" },
  { name: "applications",  href: "/(tabs)/applications" },
];

/**
 * The tab `direction` steps away from `current` in bar order
 * (+1 = swipe left / go right, -1 = swipe right / go left).
 * Clamps at the ends — no wrap-around — and returns null when
 * there is nowhere to go.
 */
export function adjacentTab(current: string, direction: 1 | -1): TabEntry | null {
  const i = TAB_ORDER.findIndex((t) => t.name === current);
  if (i === -1) return null;
  return TAB_ORDER[i + direction] ?? null;
}
