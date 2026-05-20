import type { Article, Status } from "@/content/types";

const STOP = new Set([
  "я","ви","ми","він","вона","воно","вони","їх","їм","його","її",
  "на","в","у","і","й","та","для","з","із","до","що","як","це","той",
  "але","або","при","від","про","між","під","над","без","ще","вже",
  "ні","не","так","якщо","коли","де","чи","там","тут"
]);

function tokenize(s: string): string[] {
  return s.toLowerCase().normalize("NFC").split(/[^\p{L}\p{N}]+/u).filter(t => t.length > 2 && !STOP.has(t));
}

/** Returns true if query token matches article token (exact or prefix stem match) */
function matches(qToken: string, aToken: string): boolean {
  if (qToken === aToken) return true;
  const stem = qToken.length >= 4 ? qToken.slice(0, Math.max(4, qToken.length - 2)) : qToken;
  return aToken.startsWith(stem) || qToken.startsWith(aToken.slice(0, Math.max(4, aToken.length - 2)));
}

export function retrieve(corpus: Article[], query: string, ctx: { status?: Status; region?: string }): Article[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];
  return corpus
    .map(a => {
      const text = [a.title, a.category, ...(a.documents ?? []), ...(a.steps ?? []), a.body].join(" ");
      const tTokens = tokenize(text);
      const overlap = qTokens.filter(qt => tTokens.some(at => matches(qt, at))).length;
      const statusBoost = ctx.status && a.statuses.includes(ctx.status) ? 1 : 0;
      const regionBoost = ctx.region && a.region === ctx.region ? 1 : 0;
      return { a, score: overlap * 2 + statusBoost + regionBoost };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.a);
}
