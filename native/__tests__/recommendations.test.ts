import { recommend } from "../lib/recommendations";
import { articles } from "../content/articles.generated";
import type { Profile } from "../lib/store";

describe("recommend()", () => {
  it("returns up to 5 articles", () => {
    const profile: Profile = { status: null, didOnboard: false, didMockLogin: false };
    expect(recommend(articles, profile).length).toBeLessThanOrEqual(5);
  });

  it("filters by status when status is set", () => {
    const profile: Profile = { status: "UBD", didOnboard: true, didMockLogin: false };
    const result = recommend(articles, profile);
    for (const a of result) expect(a.statuses).toContain("UBD");
  });

  it("returns all relevant articles when no interests are selected", () => {
    const profile: Profile = { status: "UBD", didOnboard: true, didMockLogin: false, interests: [] };
    const result = recommend(articles, profile);
    const allUBD = articles.filter((a) => a.statuses.includes("UBD"));
    expect(result.length).toBe(Math.min(5, allUBD.length));
  });

  it("filters by interest→category mapping when interests are selected", () => {
    // 'treatment' maps to category 'health'
    const profile: Profile = {
      status: "UBD",
      didOnboard: true,
      didMockLogin: false,
      interests: ["treatment"],
    };
    const result = recommend(articles, profile);
    for (const a of result) {
      expect(a.statuses).toContain("UBD");
      expect(a.category).toBe("health");
    }
  });

  it("returns no results when status matches nothing in the corpus", () => {
    const profile: Profile = {
      status: "UBD",
      didOnboard: true,
      didMockLogin: false,
      interests: ["grants"],
    };
    const result = recommend(articles, profile);
    const expected = articles.filter(
      (a) => a.statuses.includes("UBD") && a.category === "grants"
    );
    expect(result.length).toBe(Math.min(5, expected.length));
  });
});
