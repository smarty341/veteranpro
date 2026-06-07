import type { CategoryId } from "./types";
export interface Interest { id: string; nameUa: string; emoji: string; categories: CategoryId[]; }
export const interests: Interest[] = [
  { id: "sport",     nameUa: "Спорт",              emoji: "🏃", categories: ["sport"] },
  { id: "hobby",     nameUa: "Творчість і хобі",   emoji: "🎸", categories: ["regional"] },
  { id: "community", nameUa: "Ком'юніті та події", emoji: "🤝", categories: ["regional", "sport"] },
  { id: "volunteer", nameUa: "Волонтерство",       emoji: "🚒", categories: ["regional"] },
];
export const validInterestIds = new Set(interests.map(i => i.id));
