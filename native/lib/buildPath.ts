import { basePath, type PathStep } from "../content/pathBase";
import type { Profile } from "./store";

export type PathLineKind = "base" | "add" | "mod" | "rem";
export interface PathLine { kind: PathLineKind; marker: string; text: string; }

export interface BuiltPath { lines: PathLine[]; steps: PathStep[]; total: number; }

export function buildPath(p: Profile): BuiltPath {
  const lines: PathLine[] = [{ kind: "base", marker: "📋", text: "Базовий шлях УБД — 18 кроків (Ветеран PRO)" }];
  const steps: PathStep[] = [...basePath];
  const add = (text: string, step?: Partial<PathStep>) => {
    lines.push({ kind: "add", marker: "＋", text });
    if (step) steps.push({ id: step.id!, etap: step.etap ?? "Етап 5 · Розвиток", title: step.title ?? text, note: step.note ?? "", xp: step.xp });
  };
  const mod = (text: string) => lines.push({ kind: "mod", marker: "↑", text });

  // ── Stage (Етап) ──
  if (p.stage === "serving") add("Режим «90 днів до виходу»: підготовка ще на службі", { id: "x-90days", etap: "Етап 1 · Ще на службі", title: "Підготовка за 90 днів", note: "Документи й рапорт заздалегідь", xp: 100 });
  if (p.stage === "leaving") add("Першими йдуть: рапорт, ОГД, військовий облік", { id: "x-leaving", etap: "Етап 1 · Ще на службі", title: "Пакет звільнення", note: "Рапорт, ОГД, ТЦК", xp: 100 });
  if (p.stage === "family")  add("Режим родини: кроки, які можна зробити за близьку людину", { id: "x-family", etap: "Етап 2 · Перші 30 днів", title: "Супровід родини", note: "Дії за дорученням", xp: 100 });

  // ── Status (наш) ──
  if (p.status === "OIVV") add("Статус ОІВВ → МСЕК, протезування, авто, податкові пільги", { id: "x-oivv", etap: "Етап 4 · Здоров'я та відновлення", title: "МСЕК, протезування, авто", note: "Пакет ОІВВ", xp: 300 });
  if (p.status === "CHSZ") add("Статус ЧСЗ → одноразова допомога, житло, психологічна підтримка", { id: "x-chsz", etap: "Етап 3 · Фінанси та пільги", title: "Допомога членам сім'ї", note: "Виплати та пільги ЧСЗ", xp: 300 });

  // ── Health ──
  if (p.health === "treat")      mod("Реабілітація та лікарі підняті на початок шляху");
  if (p.health === "disability") add("Додано: МСЕК, протезування, авто, податкові пільги", { id: "x-disab", etap: "Етап 4 · Здоров'я та відновлення", title: "Інвалідність: пакет послуг", note: "МСЕК, протез, авто", xp: 250 });

  // ── Housing (multi) ──
  const h = new Set(p.housing ?? []);
  if (h.has("kids"))    add("Грант на освіту дітей — держава платить закладу напряму", { id: "x-kids", etap: "Етап 5 · Розвиток", title: "Грант на освіту дітей", note: "Оплата закладу напряму", xp: 200 });
  if (h.has("ownhome")) add("Комуналка −75% через ПФУ", { id: "x-utility", etap: "Етап 3 · Фінанси та пільги", title: "Комуналка −75%", note: "Монетизація через ПФУ", xp: 150 });
  if (h.has("rent"))    add("єОселя: іпотека під 7% річних", { id: "x-oselya", etap: "Етап 5 · Розвиток", title: "єОселя 7%", note: "Пільгова іпотека", xp: 300 });
  if (h.has("damaged")) add("єВідновлення: компенсація за пошкоджене житло", { id: "x-vidnov", etap: "Етап 5 · Розвиток", title: "єВідновлення", note: "Компенсація / сертифікат", xp: 300 });

  // ── Work ──
  if (p.work === "biz")    add("Бізнес-трек: грант УВФ, статус ветеранського бізнесу", { id: "x-biz", etap: "Етап 5 · Розвиток", title: "Бізнес-трек", note: "Грант УВФ, статус бізнесу", xp: 300 });
  if (p.work === "new")    add("«Кар'єра ветерана» + резюме з ментором", { id: "x-career", etap: "Етап 5 · Розвиток", title: "Кар'єра ветерана", note: "Резюме з ментором", xp: 300 });
  if (p.work === "study")  add("Безоплатне навчання: бюджет поза конкурсом, стипендія", { id: "x-study", etap: "Етап 5 · Розвиток", title: "Безоплатне навчання", note: "Бюджет поза конкурсом", xp: 250 });
  if (p.work === "return") mod("Нагадаємо: робоче місце зберігається за тобою за законом");

  return { lines, steps, total: steps.length };
}
