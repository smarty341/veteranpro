export type HousingId = "kids" | "ownhome" | "rent" | "damaged";
export const housingOptions: { id: HousingId; emoji: string; title: string; hint: string }[] = [
  { id: "kids",    emoji: "🧒", title: "Є діти",                  hint: "+ грант на освіту дітей, дитячі табори" },
  { id: "ownhome", emoji: "🏡", title: "Є своє житло",           hint: "Пільги на комуналку −75%" },
  { id: "rent",    emoji: "🔑", title: "Орендую / шукаю житло",  hint: "+ єОселя: іпотека під 7%" },
  { id: "damaged", emoji: "🧱", title: "Житло пошкоджене / зруйноване", hint: "+ єВідновлення: компенсація або сертифікат" },
];
export const validHousingIds = new Set(housingOptions.map(h => h.id));
