import type { Article } from "./types";
import { articles as generated } from "./articles.generated";
import scrapedRaw from "./services.scraped.json";

const scraped = scrapedRaw as unknown as Article[];
// De-dupe by id (generated wins on collision).
const seen = new Set(generated.map(a => a.id));
export const services: Article[] = [
  ...generated,
  ...scraped.filter(a => !seen.has(a.id)),
];
export const servicesByCategory = (cat: string): Article[] =>
  services.filter(a => a.category === cat);
