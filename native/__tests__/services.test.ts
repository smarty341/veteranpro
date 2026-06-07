import { services, servicesByCategory } from "../content/services";
const CATS = ["health","social-protection","housing","transport","documents","education","tax","sport","grants","regional"];
describe("services", () => {
  it("has unique ids", () => {
    expect(new Set(services.map(s => s.id)).size).toBe(services.length);
  });
  it("covers every category with at least 3 items", () => {
    for (const c of CATS) expect(servicesByCategory(c).length).toBeGreaterThanOrEqual(3);
  });
});
