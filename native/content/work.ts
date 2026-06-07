export type WorkId = "return" | "new" | "biz" | "study";
export const workOptions: { id: WorkId; emoji: string; title: string; hint: string }[] = [
  { id: "return", emoji: "↩️", title: "Повернусь на старе місце", hint: "Воно зберігається за тобою за законом" },
  { id: "new",    emoji: "🔍", title: "Шукатиму нову роботу",     hint: "+ «Кар'єра ветерана», резюме з ментором" },
  { id: "biz",    emoji: "🏪", title: "Хочу свій бізнес",         hint: "+ бізнес-трек: грант УВФ, статус ветеранського бізнесу" },
  { id: "study",  emoji: "🎓", title: "Навчання / перекваліфікація", hint: "+ безоплатна освіта, ваучери на навчання" },
];
export const validWorkIds = new Set(workOptions.map(w => w.id));
