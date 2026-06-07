export type StageId = "serving" | "leaving" | "out" | "family";
export const stages: { id: StageId; emoji: string; title: string; hint: string }[] = [
  { id: "serving", emoji: "🪖", title: "Ще служу",                    hint: "Підготовка до переходу за 90 днів до виходу" },
  { id: "leaving", emoji: "📋", title: "Звільняюсь найближчим часом", hint: "Рапорт, ОГД, документи" },
  { id: "out",     emoji: "🏠", title: "Вже звільнився / звільнилась", hint: "Адаптація, пільги, робота, ком'юніті" },
  { id: "family",  emoji: "👪", title: "Я з родини ветерана",         hint: "Допомога близькій людині" },
];
export const validStageIds = new Set(stages.map(s => s.id));
