import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "./store";
import { STORAGE_PREFIX } from "./storage";

describe("store", () => {
  beforeEach(() => { localStorage.clear(); useStore.getState().resetDemo(); });

  it("sets profile", () => {
    useStore.getState().setProfile({ status: "UBD", region: "Полтавська область" });
    const p = useStore.getState().profile;
    expect(p.status).toBe("UBD");
    expect(p.region).toBe("Полтавська область");
    expect(p.didOnboard).toBe(true);
  });

  it("addApplication initialises empty progress", () => {
    useStore.getState().addApplication("ubd-money-help");
    expect(useStore.getState().applications["ubd-money-help"].stepsCompleted).toEqual([]);
  });

  it("toggleStep adds and removes step indices", () => {
    const s = useStore.getState();
    s.addApplication("ubd-money-help");
    s.toggleStep("ubd-money-help", 0);
    s.toggleStep("ubd-money-help", 1);
    expect(useStore.getState().applications["ubd-money-help"].stepsCompleted).toEqual([0, 1]);
    s.toggleStep("ubd-money-help", 0);
    expect(useStore.getState().applications["ubd-money-help"].stepsCompleted).toEqual([1]);
  });

  it("resetDemo clears applications and profile", () => {
    const s = useStore.getState();
    s.setProfile({ status: "UBD" });
    s.addApplication("free-medical-treatment");
    s.resetDemo();
    expect(useStore.getState().profile.status).toBeNull();
    expect(useStore.getState().applications).toEqual({});
    expect(localStorage.getItem(`${STORAGE_PREFIX}profile`)).toBeNull();
  });
});
