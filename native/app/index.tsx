import { Redirect } from "expo-router";
import { useStore, useHasHydrated } from "../lib/store";

export default function Index() {
  const hydrated = useHasHydrated();
  const didOnboard = useStore((s) => s.profile.didOnboard);

  if (!hydrated) return null;

  return <Redirect href={didOnboard ? "/(tabs)" : "/onboarding/login"} />;
}
