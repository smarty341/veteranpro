export type HealthId = "ok" | "treat" | "disability" | "skip";
export const healthOptions: { id: HealthId; emoji: string; title: string; hint: string }[] = [
  { id: "ok",         emoji: "💪", title: "Все гаразд",            hint: "Базовий медичний блок" },
  { id: "treat",      emoji: "🩺", title: "Є поранення / лікуюсь", hint: "Реабілітація та лікарі — на початок шляху" },
  { id: "disability", emoji: "♿", title: "Оформлена інвалідність", hint: "+ кроки МСЕК, протезування, авто, податкові пільги" },
  { id: "skip",       emoji: "🤐", title: "Не хочу відповідати",   hint: "Ок. Медичний блок буде стандартним" },
];
export const validHealthIds = new Set(healthOptions.map(h => h.id));
