import { create } from "zustand";
import type { Status } from "@/content/types";
import { clearAll, loadSlice, saveSlice } from "./storage";

export interface Profile { status: Status | null; region?: string; interests?: string[]; didOnboard: boolean; didMockLogin: boolean }
export interface AppEntry { addedAt: number; received: boolean }
export interface Settings { fontLevel: 1 | 2 | 3; spacingLevel: 1 | 2 | 3; contrastMode: "standard" | "high" }

interface State {
  profile: Profile;
  applications: Record<string, AppEntry>;
  settings: Settings;
  setProfile: (p: Partial<Profile>) => void;
  addApplication: (articleId: string) => void;
  removeApplication: (articleId: string) => void;
  toggleReceived: (articleId: string) => void;
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
    const apps = { ...get().applications, [id]: get().applications[id] ?? { addedAt: Date.now(), received: false } };
    set({ applications: apps }); saveSlice("applications", apps);
  },
  removeApplication: (id) => {
    const apps = { ...get().applications };
    delete apps[id];
    set({ applications: apps }); saveSlice("applications", apps);
  },
  toggleReceived: (id) => {
    const cur = get().applications[id]; if (!cur) return;
    const apps = { ...get().applications, [id]: { ...cur, received: !cur.received } };
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
