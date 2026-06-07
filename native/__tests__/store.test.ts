import { useStore } from "../lib/store";

const reset = () => useStore.getState().resetDemo();

describe("store", () => {
  beforeEach(reset);

  it("setProfile merges and marks didOnboard", () => {
    useStore.getState().setProfile({ stage: "out", status: "UBD" });
    const p = useStore.getState().profile;
    expect(p.stage).toBe("out");
    expect(p.status).toBe("UBD");
    expect(p.didOnboard).toBe(true);
  });

  it("seeds gamification on first onboard", () => {
    useStore.getState().setProfile({ stage: "out" });
    const p = useStore.getState().profile;
    expect(p.level).toBe(1);
    expect(p.xp).toBe(0);
    expect(p.streak).toBeGreaterThanOrEqual(1);
    expect(p.completedMissionIds).toEqual([]);
  });

  it("completeMission adds xp and records the id once", () => {
    useStore.getState().setProfile({ stage: "out" });
    useStore.getState().completeMission("vet-box", 150);
    useStore.getState().completeMission("vet-box", 150); // idempotent
    const p = useStore.getState().profile;
    expect(p.completedMissionIds).toEqual(["vet-box"]);
    expect(p.xp).toBe(150);
  });

  it("resetDemo clears everything", () => {
    useStore.getState().setProfile({ stage: "out", status: "UBD" });
    reset();
    expect(useStore.getState().profile.didOnboard).toBe(false);
    expect(useStore.getState().profile.assignedSpecialistId).toBeUndefined();
  });
});
