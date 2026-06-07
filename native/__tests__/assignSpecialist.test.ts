import { assignSpecialist } from "../lib/assignSpecialist";
import type { Profile } from "../lib/store";
const base: Profile = { status: "UBD", didOnboard: true, didMockLogin: false };
describe("assignSpecialist", () => {
  it("is deterministic", () => {
    const p = { ...base, region: "Львівська область" };
    expect(assignSpecialist(p)).toBe(assignSpecialist(p));
  });
  it("matches region when a specialist serves it", () => {
    expect(assignSpecialist({ ...base, region: "Львівська область" })).toBe("ploginov");
  });
  it("routes ЧСЗ to the family specialist when no region match", () => {
    expect(assignSpecialist({ ...base, status: "CHSZ", region: "Сумська область" })).toBe("imelnyk");
  });
  it("always returns a valid id", () => {
    const id = assignSpecialist({ ...base, region: undefined });
    expect(["okravets","ploginov","imelnyk"]).toContain(id);
  });
});
