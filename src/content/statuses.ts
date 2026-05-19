import type { Status } from "./types";
export const statuses: { id: Status; short: string; full: string; description: string }[] = [
  { id: "UBD",  short: "УБД",  full: "Учасник бойових дій",                              description: "Документи, пільги, державні та регіональні програми." },
  { id: "OIVV", short: "ОІВВ", full: "Особа з інвалідністю внаслідок війни",             description: "Лікування, протезування, соціальні гарантії, фінансова допомога." },
  { id: "CHSZ", short: "ЧСЗ",  full: "Член сім'ї загиблого Захисника України",          description: "Одноразова допомога, пільги, житлові програми, психологічна підтримка." }
];
export const validStatusIds = new Set(statuses.map(s => s.id));
