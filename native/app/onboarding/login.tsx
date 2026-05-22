import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { useStore } from "../../lib/store";
import { colors, fontSize, weight } from "../../lib/theme";

export default function LoginScreen() {
  const router = useRouter();
  const markMockLoggedIn = useStore((s) => s.markMockLoggedIn);

  const continueWithDiia = () => {
    markMockLoggedIn();
    router.push("/onboarding/status");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.tagline}>Державні послуги для ветеранів та ветеранок</Text>
        <View style={styles.actions}>
          <Button onPress={continueWithDiia}>Увійти через Дія</Button>
          <Pressable onPress={() => router.push("/onboarding/status")}>
            <Text style={styles.skip}>Продовжити без входу</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 16 },
  logo: { width: 96, height: 96, marginBottom: 8, resizeMode: "contain" },
  tagline: { fontSize: fontSize.base, color: colors.muted, textAlign: "center" },
  actions: { width: "100%", marginTop: 16, gap: 12, alignItems: "center" },
  skip: { color: colors.muted, fontSize: fontSize.sm, textDecorationLine: "underline" },
});
