import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Status } from "../content/types";

export interface Profile {
  status: Status | null;
  region?: string;
  interests?: string[];
  didOnboard: boolean;
  didMockLogin: boolean;
}

interface State {
  profile: Profile;
  setProfile: (p: Partial<Profile>) => void;
  markMockLoggedIn: () => void;
  resetDemo: () => void;
  _hasHydrated: boolean;
}

const defaultProfile: Profile = {
  status: null,
  region: undefined,
  interests: undefined,
  didOnboard: false,
  didMockLogin: false,
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      _hasHydrated: false,
      setProfile: (p) => {
        const next: Profile = { ...get().profile, ...p, didOnboard: true };
        set({ profile: next });
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
