import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { FadeUp } from "../../components/FadeUp";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { interests } from "../../content/interests";
import { useStore } from "../../lib/store";
import { tapSelection, tapMedium } from "../../lib/haptics";
import { colors, fontSize, weight, radius, elevation } from "../../lib/theme";

const SIZES = [
  fontSize["3xl"], fontSize["2xl"], fontSize["4xl"], fontSize["2xl"],
  fontSize.xl,     fontSize["3xl"], fontSize["2xl"], fontSize.xl,
];

export default function InterestsScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const [selected, setSelected] = useState<string[]>(
    () => useStore.getState().profile.interests ?? []
  );

  const toggle = (id: string) => {
    tapSelection();
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const done = () => {
    tapMedium();
    setProfile({ interests: selected });
    router.replace("/(tabs)");
  };

  const skip = () => {
    setProfile({});
    router.replace("/(tabs)");
  };

  return (
    <OnboardingScaffold
      step={3}
      title="Що вас найбільше цікавить?"
      subtitle="Можна обрати декілька. Це допоможе підібрати релевантні послуги."
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
                  <Text
                    style={[
                      styles.pillLabel,
                      { fontSize: SIZES[i] },
                      on ? { color: colors.white } : { color: colors.brand },
                    ]}
                  >
                    {it.nameUa}
                  </Text>
                </Pressable>
              </FadeUp>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button onPress={done}>Готово</Button>
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
    gap: 12,
    paddingVertical: 16,
    flex: 1,
  },
  pill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  pillOn:  { backgroundColor: colors.oliveSoft, borderColor: colors.oliveSoft },
  pillOff: { backgroundColor: colors.white,     borderColor: colors.border },
  pillLabel: { fontWeight: weight.semibold },
  actions: { marginTop: 24, gap: 12, alignItems: "center" },
});
