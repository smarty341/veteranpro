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

  // Tabs (new)
  "ri:price-tag-3-line":     "tag-outline",
  "ri:price-tag-3-fill":     "tag",
  // Actions / chrome
  "ri:qr-code-line":         "qrcode",
  "ri:chat-3-line":          "chat-outline",
  "ri:phone-line":           "phone-outline",
  "ri:arrow-left-s-line":    "chevron-left",
  "ri:arrow-right-s-line":   "chevron-right",
  "ri:arrow-down-s-line":    "chevron-down",
  "ri:arrow-up-line":        "arrow-up",
  "ri:id-card-line":         "card-account-details-outline",
  "ri:heart-pulse-line":     "heart-pulse",
  "ri:close-line":           "close",
  "ri:check-line":           "check",
};

/** Resolve a Remix icon name to its MCI counterpart, with a sensible fallback. */
export function mci(name: string): MciName {
  return mciFor[name] ?? "help-circle-outline";
}
