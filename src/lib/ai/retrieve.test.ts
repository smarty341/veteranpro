import { describe, expect, it } from "vitest";
import { fixtureArticles } from "@/content/articles.fixture";
import { retrieve } from "./retrieve";

describe("retrieve", () => {
  it("ranks articles by keyword overlap", () => {
    const r = retrieve(fixtureArticles, "лікування", {});
    expect(r[0].id).toBe("a2");
  });
  it("boosts articles matching status", () => {
    const r1 = retrieve(fixtureArticles, "освіта", { status: "UBD" });
    expect(r1[0].id).toBe("a3");
  });
  it("returns at most 3 articles", () => {
    expect(retrieve(fixtureArticles, "тіло", {}).length).toBeLessThanOrEqual(3);
  });
  it("returns empty when nothing matches", () => {
    expect(retrieve(fixtureArticles, "квантова фізика", {})).toEqual([]);
  });
});
