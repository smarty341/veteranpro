// Ukrainian plural forms via Intl.PluralRules.
// "1 крок", "2 кроки", "5 кроків" — the language has three forms (one / few / many).
const stepRules = new Intl.PluralRules("uk");

export function stepsLabel(n: number): string {
  const form = stepRules.select(n);
  const word = form === "one" ? "крок" : form === "few" ? "кроки" : "кроків";
  return `${n} ${word}`;
}
