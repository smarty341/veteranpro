import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/Button";
import { useStore } from "../../lib/store";
import { tapMedium } from "../../lib/haptics";
import { colors, fontSize } from "../../lib/theme";

export default function LoginScreen() {
  const router = useRouter();
  const markMockLoggedIn = useStore((s) => s.markMockLoggedIn);

  const continueWithDiia = () => {
    tapMedium();
    markMockLoggedIn();
    router.push("/onboarding/status");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.center}>
        <Logo height={40} />
        <Text style={styles.tagline}>Державні послуги для ветеранів та ветеранок</Text>
        <View style={styles.actions}>
          <Button onPress={continueWithDiia}>Увійти через Дія</Button>
          <Pressable
            onPress={() => router.push("/onboarding/status")}
            style={({ pressed }) => [pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
          >
            <Text style={styles.skip}>Продовжити без входу</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 20 },
  tagline: { fontSize: fontSize.base, color: colors.muted, textAlign: "center", marginTop: 8 },
  actions: { width: "100%", marginTop: 16, gap: 12, alignItems: "center" },
  skip: { color: colors.muted, fontSize: fontSize.sm, textDecorationLine: "underline" },
});
