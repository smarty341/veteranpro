export interface Specialist {
  id: string; name: string; initials: string; role: string;
  oblast: string; blurb: string; phone: string; tint: "tintHealth" | "tintEdu" | "tintSport";
}
export const specialists: Specialist[] = [
  { id: "okravets",  name: "Оксана Кравець",   initials: "ОК", role: "Фахівчиня із супроводу ветеранів",
    oblast: "Київська область", blurb: "Я поруч на кожному кроці — від документів до роботи. Пишіть без вагань.",
    phone: "0 800 505 217", tint: "tintHealth" },
  { id: "ploginov",  name: "Павло Логінов",    initials: "ПЛ", role: "Фахівець із супроводу ветеранів",
    oblast: "Львівська область", blurb: "Розберемо ваші пільги та подамо заявки разом. Без зайвої бюрократії.",
    phone: "0 800 505 217", tint: "tintEdu" },
  { id: "imelnyk",   name: "Ірина Мельник",    initials: "ІМ", role: "Фахівчиня із супроводу родин",
    oblast: "Дніпропетровська область", blurb: "Супроводжую родини Захисників. Допоможу з виплатами та підтримкою.",
    phone: "0 800 505 217", tint: "tintSport" },
];
export const validSpecialistIds = new Set(specialists.map(s => s.id));
