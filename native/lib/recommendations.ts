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
