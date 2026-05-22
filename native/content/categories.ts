import type { Category } from "./types";

export const categories: Category[] = [
  { id: "health",            nameUa: "Здоров'я та відновлення",       icon: "ri:heart-add-line" },
  { id: "social-protection", nameUa: "Соцзахист і фінанси",            icon: "ri:shield-user-line" },
  { id: "housing",           nameUa: "Житло та інфраструктура",        icon: "ri:building-line" },
  { id: "transport",         nameUa: "Транспорт і пільги",             icon: "ri:bus-line" },
  { id: "documents",         nameUa: "Документи та статус",            icon: "ri:file-copy-2-line" },
  { id: "education",         nameUa: "Освіта та робота",               icon: "ri:graduation-cap-line" },
  { id: "tax",               nameUa: "Податкові пільги",               icon: "ri:refund-2-line" },
  { id: "sport",             nameUa: "Спорт та змагання",              icon: "ri:basketball-line" },
  { id: "grants",            nameUa: "Гранти та підтримка бізнесу",    icon: "ri:hand-coin-line" },
  { id: "regional",          nameUa: "Послуги по регіону",             icon: "ri:map-pin-2-line" }
];

export const validCategoryIds = new Set(categories.map(c => c.id));
