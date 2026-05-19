import type { Article } from "./types";
export const fixtureArticles: Article[] = [
  { id: "a1", title: "Грошова допомога УБД", category: "social-protection", statuses: ["UBD"], documents: ["IBAN"], steps: ["Зібрати","Подати","Отримати"], body: "Тіло УБД" },
  { id: "a2", title: "Безоплатне лікування", category: "health",            statuses: ["UBD","OIVV"], steps: ["Лікар","Направлення","Лікування","Звіт"], body: "Тіло лікування" },
  { id: "a3", title: "Освітні ваучери",       category: "education",         statuses: ["UBD","OIVV","CHSZ"], body: "Тіло освіти" }
];
