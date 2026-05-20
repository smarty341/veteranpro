import { create } from "zustand";
import type { Status } from "@/content/types";
import { clearAll, loadSlice, saveSlice } from "./storage";

export interface Profile { status: Status | null; region?: string; interests?: string[]; didOnboard: boolean; didMockLogin: boolean }
export interface AppEntry { addedAt: number; stepsCompleted: number[] }
export interface Settings { fontLevel: 1 | 2 | 3; spacingLevel: 1 | 2 | 3; contrastMode: "standard" | "high" }

interface State {
  profile: Profile;
  applications: Record<string, AppEntry>;
  settings: Settings;
  setProfile: (p: Partial<Profile>) => void;
  addApplication: (articleId: string) => void;
  removeApplication: (articleId: string) => void;
  toggleStep: (articleId: string, stepIdx: number) => void;
  setSettings: (s: Partial<Settings>) => void;
  markMockLoggedIn: () => void;
  resetDemo: () => void;
}

const defaultProfile: Profile = { status: null, region: undefined, didOnboard: false, didMockLogin: false };
const defaultSettings: Settings = { fontLevel: 1, spacingLevel: 1, contrastMode: "standard" };

export const useStore = create<State>((set, get) => ({
  profile: loadSlice("profile", defaultProfile),
  applications: loadSlice<Record<string, AppEntry>>("applications", {}),
  settings: loadSlice("settings", defaultSettings),

  setProfile: (p) => {
    const next: Profile = { ...get().profile, ...p, didOnboard: true };
    set({ profile: next }); saveSlice("profile", next);
  },
  addApplication: (id) => {
    const apps = { ...get().applications, [id]: get().applications[id] ?? { addedAt: Date.now(), stepsCompleted: [] } };
    set({ applications: apps }); saveSlice("applications", apps);
  },
  removeApplication: (id) => {
    const apps = { ...get().applications };
    delete apps[id];
    set({ applications: apps }); saveSlice("applications", apps);
  },
  toggleStep: (id, idx) => {
    const cur = get().applications[id]; if (!cur) return;
    const has = cur.stepsCompleted.includes(idx);
    const stepsCompleted = has ? cur.stepsCompleted.filter(i => i !== idx) : [...cur.stepsCompleted, idx].sort((a, b) => a - b);
    const apps = { ...get().applications, [id]: { ...cur, stepsCompleted } };
    set({ applications: apps }); saveSlice("applications", apps);
  },
  setSettings: (s) => {
    const next: Settings = { ...get().settings, ...s };
    set({ settings: next }); saveSlice("settings", next);
  },
  markMockLoggedIn: () => {
    const next: Profile = { ...get().profile, didMockLogin: true };
    set({ profile: next }); saveSlice("profile", next);
  },
  resetDemo: () => {
    clearAll();
    set({ profile: defaultProfile, applications: {}, settings: defaultSettings });
  }
}));
