import { TAB_ORDER, adjacentTab } from "../lib/tabOrder";

describe("TAB_ORDER", () => {
  it("matches the visual tab-bar order", () => {
    expect(TAB_ORDER.map((t) => t.name)).toEqual([
      "index",
      "opportunities",
      "ai",
      "applications",
    ]);
  });
});

describe("adjacentTab", () => {
  it("moves right (swipe left) through the bar order", () => {
    expect(adjacentTab("index", 1)?.name).toBe("opportunities");
    expect(adjacentTab("opportunities", 1)?.name).toBe("ai");
    expect(adjacentTab("ai", 1)?.name).toBe("applications");
  });

  it("moves left (swipe right) through the bar order", () => {
    expect(adjacentTab("applications", -1)?.name).toBe("ai");
    expect(adjacentTab("ai", -1)?.name).toBe("opportunities");
    expect(adjacentTab("opportunities", -1)?.name).toBe("index");
  });

  it("clamps at both ends instead of wrapping", () => {
    expect(adjacentTab("index", -1)).toBeNull();
    expect(adjacentTab("applications", 1)).toBeNull();
  });

  it("returns null for unknown tabs", () => {
    expect(adjacentTab("nope", 1)).toBeNull();
  });
});
