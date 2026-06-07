import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Status } from "../content/types";
import type { StageId } from "../content/stages";
import type { HealthId } from "../content/health";
import type { HousingId } from "../content/housing";
import type { WorkId } from "../content/work";

export interface Profile {
  // identity / onboarding
  stage?: StageId | null;
  health?: HealthId | null;
  housing?: HousingId[];
  work?: WorkId | null;
  status: Status | null;
  region?: string;
  interests?: string[];
  // concierge
  assignedSpecialistId?: string;
  // gamification
  level?: number;
  xp?: number;
  streak?: number;
  completedMissionIds?: string[];
  // flags
  didOnboard: boolean;
  didMockLogin: boolean;
}

interface State {
  profile: Profile;
  setProfile: (p: Partial<Profile>) => void;
  completeMission: (id: string, xp: number) => void;
  markMockLoggedIn: () => void;
  resetDemo: () => void;
  _hasHydrated: boolean;
}

const defaultProfile: Profile = {
  stage: null,
  health: null,
  housing: [],
  work: null,
  status: null,
  region: undefined,
  interests: undefined,
  assignedSpecialistId: undefined,
  level: undefined,
  xp: undefined,
  streak: undefined,
  completedMissionIds: undefined,
  didOnboard: false,
  didMockLogin: false,
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      _hasHydrated: false,
      setProfile: (p) => {
        const prev = get().profile;
        const next: Profile = { ...prev, ...p, didOnboard: true };
        if (next.level === undefined) {        // first onboard → seed
          next.level = 1; next.xp = 0; next.streak = 1; next.completedMissionIds = [];
        }
        set({ profile: next });
      },
      completeMission: (id, xp) => {
        const prev = get().profile;
        const done = prev.completedMissionIds ?? [];
        if (done.includes(id)) return;
        set({ profile: { ...prev, completedMissionIds: [...done, id], xp: (prev.xp ?? 0) + xp } });
      },
      markMockLoggedIn: () => {
        set({ profile: { ...get().profile, didMockLogin: true } });
      },
      resetDemo: () => {
        set({ profile: defaultProfile });
      },
    }),
    {
      name: "vp-companion-native",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ profile: s.profile }),
      onRehydrateStorage: () => (state) => {
        if (state) state._hasHydrated = true;
      },
    }
  )
);

/** Convenience selector for components that should wait for hydration. */
export const useHasHydrated = () => useStore((s) => s._hasHydrated);
