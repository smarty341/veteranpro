import { recommend } from "../lib/recommendations";
import { services } from "../content/services";
import type { Profile } from "../lib/store";

describe("recommend()", () => {
  it("returns up to 5 articles", () => {
    const profile: Profile = { status: null, didOnboard: false, didMockLogin: false };
    expect(recommend(services, profile).length).toBeLessThanOrEqual(5);
  });

  it("filters by status when status is set", () => {
    const profile: Profile = { status: "UBD", didOnboard: true, didMockLogin: false };
    const result = recommend(services, profile);
    for (const a of result) expect(a.statuses).toContain("UBD");
  });

  it("returns all relevant articles when no interests are selected", () => {
    const profile: Profile = { status: "UBD", didOnboard: true, didMockLogin: false, interests: [] };
    const result = recommend(services, profile);
    const allUBD = services.filter((a) => a.statuses.includes("UBD"));
    expect(result.length).toBe(Math.min(5, allUBD.length));
  });

  it("filters by interest→category mapping when interests are selected", () => {
    const profile: Profile = { status: "UBD", didOnboard: true, didMockLogin: false, interests: ["sport"] };
    const result = recommend(services, profile);
    for (const a of result) {
      expect(a.statuses).toContain("UBD");
      expect(a.category).toBe("sport");
    }
  });

  it("returns only mapped categories for the chosen interest", () => {
    const profile: Profile = { status: "UBD", didOnboard: true, didMockLogin: false, interests: ["community"] };
    const result = recommend(services, profile);
    for (const a of result) expect(["regional","sport"]).toContain(a.category);
  });
});
