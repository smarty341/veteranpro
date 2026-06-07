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
