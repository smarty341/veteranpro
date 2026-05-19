import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { validCategoryIds } from "../src/content/categories";
import { validStatusIds } from "../src/content/statuses";
import type { Article, Status, CategoryId } from "../src/content/types";

export function compileArticles(dir: string): Article[] {
  const files = readdirSync(dir).filter(f => f.endsWith(".md")).sort();
  return files.map(file => {
    const raw = readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const fail = (msg: string): never => { throw new Error(`${file}: ${msg}`); };

    const id = (typeof data.id === "string" && data.id) || fail("'id' is required and must be a string");
    const title = (typeof data.title === "string" && data.title) || fail("'title' is required");
    const category = (typeof data.category === "string" && data.category) || fail("'category' is required");
    if (!validCategoryIds.has(category as CategoryId)) fail(`'category' '${category}' is not a known category id`);

    const statuses = Array.isArray(data.statuses) ? data.statuses as unknown[] : null;
    if (!statuses || statuses.length === 0) fail("'statuses' must be a non-empty list");
    for (const s of statuses!) if (!validStatusIds.has(s as Status)) fail(`'statuses' contains unknown value '${s}'`);

    return {
      id, title, category: category as CategoryId, statuses: statuses as Status[],
      region: typeof data.region === "string" ? data.region : undefined,
      documents: Array.isArray(data.documents) ? (data.documents as unknown[]).map(String) : undefined,
      steps: Array.isArray(data.steps) ? (data.steps as unknown[]).map(String) : undefined,
      contacts: typeof data.contacts === "string" ? data.contacts : undefined,
      source: typeof data.source === "string" ? data.source : undefined,
      body: content.trim()
    };
  });
}

// CLI entry — invoked by `npm run build:articles`
if (import.meta.url === `file://${process.argv[1]}`) {
  const inputDir = path.resolve("content/articles");
  const outFile = path.resolve("src/content/articles.generated.ts");
  const articles = compileArticles(inputDir);
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, `// AUTO-GENERATED — run \`npm run build:articles\`.\nimport type { Article } from "./types";\nexport const articles: Article[] = ${JSON.stringify(articles, null, 2)};\n`);
  console.log(`build-articles: wrote ${articles.length} articles → ${outFile}`);
}
