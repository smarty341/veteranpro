// Ukrainian plural rules. Same logic as the web app's src/lib/plurals.ts —
// no DOM dependencies, no React imports.

/** Returns "1 крок", "2 кроки", "5 кроків". */
export function stepsLabel(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} крок`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} кроки`;
  return `${n} кроків`;
}
