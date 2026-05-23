import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { FadeUp } from "../../components/FadeUp";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { interests } from "../../content/interests";
import { useStore } from "../../lib/store";
import { tapSelection } from "../../lib/haptics";
import { colors, fontSize, weight, radius, elevation } from "../../lib/theme";

// VARIANT A — equal-size pills, flowing wrap.
export default function InterestsScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    tapSelection();
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const next = () => router.push("/onboarding/interests-grid");

  const skip = () => {
    setProfile({});
    router.replace("/(tabs)");
  };

  return (
    <OnboardingScaffold
      step={3}
      title="Що вас найбільше цікавить?"
      subtitle="Можна обрати декілька. (1/3 — pills)"
      onSkip={skip}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cloud}>
          {interests.map((it, i) => {
            const on = selected.includes(it.id);
            return (
              <FadeUp key={it.id} delay={80 + Math.min(i, 5) * 40}>
                <Pressable
                  onPress={() => toggle(it.id)}
                  style={({ pressed }) => [
                    styles.pill,
                    on ? styles.pillOn : styles.pillOff,
                    on && elevation.card,
                    pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <Text style={[styles.pillLabel, on ? { color: colors.white } : { color: colors.brand }]}>
                    {it.nameUa}
                  </Text>
                </Pressable>
              </FadeUp>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button onPress={next}>Далі</Button>
        </View>
      </ScrollView>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
  cloud: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    flex: 1,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  pillOn:  { backgroundColor: colors.oliveSoft, borderColor: colors.oliveSoft },
  pillOff: { backgroundColor: colors.white,     borderColor: colors.border },
  pillLabel: { fontSize: fontSize.base, fontWeight: weight.semibold },
  actions: { marginTop: 24, gap: 12, alignItems: "center" },
});
