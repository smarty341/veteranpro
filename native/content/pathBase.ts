export interface PathStep { id: string; etap: string; title: string; note: string; xp?: number; done?: boolean; }
export const ETAPY = [
  "Етап 1 · Ще на службі",
  "Етап 2 · Перші 30 днів",
  "Етап 3 · Фінанси та пільги",
  "Етап 4 · Здоров'я та відновлення",
  "Етап 5 · Розвиток",
] as const;
export const basePath: PathStep[] = [
  { id: "ubd-status",   etap: ETAPY[0], title: "Статус УБД",                 note: "Вноситься в ЄДРВВ автоматично протягом 5 днів", done: true },
  { id: "report",       etap: ETAPY[0], title: "Рапорт і наказ про звільнення", note: "Обхідний лист, здача майна", done: true },
  { id: "ogd",          etap: ETAPY[0], title: "Одноразова грошова допомога (ОГД)", note: "50% / 25% за кожен рік служби", done: true },
  { id: "tck",          etap: ETAPY[1], title: "Військовий облік у ТЦК",     note: "Статус оновлюється в «Резерв+»", done: true },
  { id: "support",      etap: ETAPY[1], title: "Фахівець із супроводу",      note: "Ветеранський простір або Ветеран PRO у Дії", done: true },
  { id: "vet-box",      etap: ETAPY[1], title: "Ветеран-бокс",               note: "Вітальний набір ветерана · активна місія", xp: 150 },
  { id: "indep-help",   etap: ETAPY[2], title: "Щорічна допомога до Дня Незалежності", note: "Через ПФУ онлайн", done: true },
  { id: "utility-75",   etap: ETAPY[2], title: "Знижка 75% на комуналку",   note: "Монетизована — ПФУ компенсує на картку", xp: 150 },
  { id: "transport",    etap: ETAPY[2], title: "Пільговий проїзд",          note: "Міський транспорт і приміські поїзди — 0 грн", xp: 50 },
  { id: "pension",      etap: ETAPY[2], title: "Пенсійні переваги",         note: "Рік бойових = 1,5 року стажу, +25% ПМ", xp: 100 },
  { id: "family-doc",   etap: ETAPY[3], title: "Сімейний лікар і направлення", note: "Стоматологія, протезування, зір — безоплатно", xp: 100 },
  { id: "rehab",        etap: ETAPY[3], title: "Реабілітація",              note: "Медична, фізична, психологічна — безоплатно", xp: 200 },
  { id: "psych",        etap: ETAPY[3], title: "Психологічна допомога",     note: "Направлення не потрібне · реєстр надавачів", xp: 200 },
  { id: "vet-sport",    etap: ETAPY[3], title: "«Ветеранський спорт» у Дії", note: "1 500 грн щокварталу · активна місія", xp: 200 },
  { id: "career",       etap: ETAPY[4], title: "«Кар'єра ветерана»",        note: "Повернення на робоче місце або нова робота", xp: 300 },
  { id: "education",    etap: ETAPY[4], title: "Безоплатне навчання",       note: "Бюджет поза конкурсом + стипендія + гуртожиток", xp: 250 },
  { id: "housing",      etap: ETAPY[4], title: "Житло: єОселя 7% / єВідновлення", note: "Іпотека 7% або компенсація за зруйноване", xp: 300 },
  { id: "kids-grant",   etap: ETAPY[4], title: "Грант на освіту дітей",     note: "Держава платить закладу освіти напряму", xp: 200 },
];
