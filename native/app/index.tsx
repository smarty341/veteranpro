import { Redirect } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useStore, useHasHydrated } from "../lib/store";
import { colors } from "../lib/theme";

export default function Index() {
  const hydrated = useHasHydrated();
  const didOnboard = useStore((s) => s.profile.didOnboard);

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  return <Redirect href={didOnboard ? "/(tabs)" : "/onboarding/login"} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.beigeSoft },
});
