import type { CategoryId } from "./types";

// User-selectable interests shown in onboarding. Each maps to one or more
// content categories so the Home "Recommended for you" list can filter by it.
export interface Interest {
  id: string;
  nameUa: string;
  categories: CategoryId[];
}

export const interests: Interest[] = [
  { id: "courses",   nameUa: "Курси",      categories: ["education"] },
  { id: "discounts", nameUa: "Знижки",     categories: ["tax", "transport"] },
  { id: "treatment", nameUa: "Лікування",  categories: ["health"] },
  { id: "housing",   nameUa: "Житло",      categories: ["housing"] }
];

export const validInterestIds = new Set(interests.map(i => i.id));
