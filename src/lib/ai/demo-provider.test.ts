import { describe, expect, it } from "vitest";
import { fixtureArticles } from "@/content/articles.fixture";
import { DemoAiProvider } from "./demo-provider";

describe("DemoAiProvider", () => {
  it("returns a templated answer citing the top article", async () => {
    const p = new DemoAiProvider(fixtureArticles);
    const { tokens, sources } = p.ask("Я ОІВВ — яке є лікування?", { status: "OIVV" });
    let acc = "";
    for await (const t of tokens) acc += t;
    expect(sources[0].id).toBe("a2");
    expect(acc).toContain("Безоплатне лікування");
  });
  it("returns a graceful fallback when nothing matches", async () => {
    const p = new DemoAiProvider(fixtureArticles);
    const { tokens, sources } = p.ask("квантова фізика", {});
    let acc = "";
    for await (const t of tokens) acc += t;
    expect(sources).toEqual([]);
    expect(acc).toMatch(/не знайшов/i);
  });
});
