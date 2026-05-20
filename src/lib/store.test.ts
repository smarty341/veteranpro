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

  it("resetDemo clears profile, applications, and settings — in memory and in storage", () => {
    const s = useStore.getState();
    s.setProfile({ status: "UBD" });
    s.addApplication("free-medical-treatment");
    s.setSettings({ fontLevel: 3 });
    s.resetDemo();
    const state = useStore.getState();
    expect(state.profile.status).toBeNull();
    expect(state.profile.didOnboard).toBe(false);
    expect(state.applications).toEqual({});
    expect(state.settings.fontLevel).toBe(1);
    expect(localStorage.getItem(`${STORAGE_PREFIX}profile`)).toBeNull();
    expect(localStorage.getItem(`${STORAGE_PREFIX}applications`)).toBeNull();
    expect(localStorage.getItem(`${STORAGE_PREFIX}settings`)).toBeNull();
  });

  it("removeApplication removes the entry from state and storage", () => {
    const s = useStore.getState();
    s.addApplication("ubd-money-help");
    expect(useStore.getState().applications["ubd-money-help"]).toBeDefined();
    s.removeApplication("ubd-money-help");
    expect(useStore.getState().applications["ubd-money-help"]).toBeUndefined();
    // Persisted snapshot now reflects the removal
    const raw = localStorage.getItem(`${STORAGE_PREFIX}applications`);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).data["ubd-money-help"]).toBeUndefined();
  });

  it("setSettings merges partial updates without touching other fields", () => {
    useStore.getState().setSettings({ fontLevel: 3 });
    let s = useStore.getState().settings;
    expect(s.fontLevel).toBe(3);
    expect(s.spacingLevel).toBe(1);
    expect(s.contrastMode).toBe("standard");
    useStore.getState().setSettings({ contrastMode: "high" });
    s = useStore.getState().settings;
    expect(s.fontLevel).toBe(3);
    expect(s.contrastMode).toBe("high");
  });
});
