import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { interests } from "../../content/interests";
import { useStore } from "../../lib/store";
import { colors, fontSize, weight, radius, elevation } from "../../lib/theme";

// Matches the rotation used by the web app's InterestsScreen to read as a word cloud.
const SIZES = [
  fontSize["3xl"], fontSize["2xl"], fontSize["4xl"], fontSize["2xl"],
  fontSize.xl,     fontSize["3xl"], fontSize["2xl"], fontSize.xl,
];

export default function InterestsScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  // Read once via getState — avoids a Zustand selector that returns a fresh `[]`
  // when `interests` is undefined (would cause "getSnapshot should be cached"
  // infinite-loop errors via React 19's stricter snapshot checks).
  const [selected, setSelected] = useState<string[]>(
    () => useStore.getState().profile.interests ?? []
  );

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const done = () => {
    setProfile({ interests: selected });
    router.replace("/(tabs)");
  };
  const skip = () => {
    setProfile({});
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Що вас найбільше цікавить?</Text>
        <Text style={styles.subtitle}>Можна обрати декілька. Це допоможе підібрати релевантні послуги.</Text>

        <View style={styles.cloud}>
          {interests.map((it, i) => {
            const on = selected.includes(it.id);
            return (
              <Pressable
                key={it.id}
                onPress={() => toggle(it.id)}
                style={[
                  styles.pill,
                  on ? styles.pillOn : styles.pillOff,
                  on && elevation.card,
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
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button onPress={done}>Готово</Button>
          <Pressable onPress={skip}>
            <Text style={styles.skip}>Пропустити</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.beigeSoft },
  content: { padding: 20, paddingTop: 32, paddingBottom: 24, flexGrow: 1 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand, marginBottom: 4 },
  subtitle: { fontSize: fontSize.sm, color: colors.muted, marginBottom: 24 },
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
  skip: { color: colors.muted, fontSize: fontSize.sm, textDecorationLine: "underline" },
});
