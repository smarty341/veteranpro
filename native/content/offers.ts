export interface Offer {
  id: string; name: string; meta: string; discount: string;
  logo: string | null;   // require()-able asset key resolved in the screen; null → use emoji
  emoji?: string; category: "fuel" | "clothing" | "health" | "food";
}
export const offers: Offer[] = [
  { id: "wog",    name: "WOG",             meta: "Мережа АЗК",            discount: "−5 ₴/л",          logo: "wog",          category: "fuel" },
  { id: "riot",   name: "Riot Division",   meta: "Одяг та екіпірування",  discount: "−50%",            logo: "riotdivision", category: "clothing" },
  { id: "mindly", name: "Mindly",          meta: "Психотерапія онлайн",   discount: "5 год безкоштовно", logo: "mindly",      category: "health" },
  { id: "tyl",    name: "Кав'ярня «Тил»",  meta: "350 м · ветеранський бізнес", discount: "−20%",      logo: null, emoji: "☕", category: "food" },
];
