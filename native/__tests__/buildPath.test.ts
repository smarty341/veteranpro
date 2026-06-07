import { buildPath } from "../lib/buildPath";
import type { Profile } from "../lib/store";
const base: Profile = { status: "UBD", didOnboard: true, didMockLogin: false, housing: [] };

describe("buildPath", () => {
  it("always includes the 18 base steps", () => {
    const { steps } = buildPath(base);
    expect(steps.length).toBeGreaterThanOrEqual(18);
  });
  it("adds a serving-mode line for stage=serving", () => {
    const { lines } = buildPath({ ...base, stage: "serving" });
    expect(lines.some(l => l.kind === "add" && /90 днів/.test(l.text))).toBe(true);
  });
  it("adds МСЕК/protез block for status=OIVV", () => {
    const { lines } = buildPath({ ...base, status: "OIVV" });
    expect(lines.some(l => /МСЕК|протез/i.test(l.text))).toBe(true);
  });
  it("adds єОселя for rent housing", () => {
    const { lines } = buildPath({ ...base, housing: ["rent"] });
    expect(lines.some(l => /єОселя/.test(l.text))).toBe(true);
  });
  it("total equals base + added steps", () => {
    const r = buildPath({ ...base, status: "OIVV", housing: ["kids","rent"], work: "biz" });
    expect(r.total).toBe(r.steps.length);
  });
  it("is deterministic", () => {
    const p = { ...base, stage: "out" as const, work: "new" as const };
    expect(buildPath(p)).toEqual(buildPath(p));
  });
});
