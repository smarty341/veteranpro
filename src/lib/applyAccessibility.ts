import type { Settings } from "@/lib/store";

const SPACING: Record<1 | 2 | 3, string> = { 1: "normal", 2: "0.02em", 3: "0.05em" };

export function applyAccessibility(settings: Settings) {
  const root = document.documentElement;
  root.classList.toggle("text-base", settings.fontLevel === 1);
  root.classList.toggle("text-[17px]", settings.fontLevel === 2);
  root.classList.toggle("text-[19px]", settings.fontLevel === 3);
  root.style.letterSpacing = SPACING[settings.spacingLevel];
  root.classList.toggle("contrast-high", settings.contrastMode === "high");
}
