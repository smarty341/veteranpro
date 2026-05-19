import { describe, it, expect, beforeEach } from "vitest";
import { loadSlice, saveSlice, STORAGE_PREFIX, clearAll } from "./storage";

describe("storage", () => {
  beforeEach(() => localStorage.clear());

  it("persists and reloads a slice with schema versioning", () => {
    saveSlice("profile", { status: "UBD" });
    expect(loadSlice("profile", { status: null })).toEqual({ status: "UBD" });
  });

  it("returns default when slice missing", () => {
    expect(loadSlice("settings", { fontLevel: 1 })).toEqual({ fontLevel: 1 });
  });

  it("returns default when stored schema version differs", () => {
    localStorage.setItem(`${STORAGE_PREFIX}profile`, JSON.stringify({ schema: 0, data: { status: "OIVV" } }));
    expect(loadSlice("profile", { status: null })).toEqual({ status: null });
  });

  it("clearAll removes only namespaced keys", () => {
    saveSlice("profile", { status: "UBD" });
    localStorage.setItem("unrelated", "x");
    clearAll();
    expect(localStorage.getItem(`${STORAGE_PREFIX}profile`)).toBeNull();
    expect(localStorage.getItem("unrelated")).toBe("x");
  });
});
