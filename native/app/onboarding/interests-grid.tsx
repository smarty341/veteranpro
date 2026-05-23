import { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { FadeUp } from "../../components/FadeUp";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { interests } from "../../content/interests";
import { categories } from "../../content/categories";
import { useStore } from "../../lib/store";
import { tapSelection } from "../../lib/haptics";
import { mci } from "../../lib/icons";
import { colors, fontSize, weight, radius, elevation } from "../../lib/theme";

// VARIANT B — 2-column grid of icon tiles.
const iconFor = (interestId: string): string => {
  const it = interests.find((i) => i.id === interestId);
  if (!it) return "ri:bookmark-line";
  const cat = categories.find((c) => c.id === it.categories[0]);
  return cat?.icon ?? "ri:bookmark-line";
};

export default function InterestsGridScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    tapSelection();
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const next = () => router.push("/onboarding/interests-list");

  const skip = () => {
    setProfile({});
    router.replace("/(tabs)");
  };

  return (
    <OnboardingScaffold
      step={3}
      title="Що вас найбільше цікавить?"
      subtitle="Можна обрати декілька. (2/3 — grid)"
      onSkip={skip}
    >
      <StatusBar style="dark" />
      <FlatList
        data={interests}
        numColumns={2}
        keyExtractor={(it) => it.id}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const on = selected.includes(item.id);
          return (
            <FadeUp delay={80 + Math.min(index, 5) * 40} style={styles.tileWrap}>
              <Pressable
                onPress={() => toggle(item.id)}
                style={({ pressed }) => [
                  styles.tile,
                  on ? styles.tileOn : styles.tileOff,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                ]}
              >
                <MaterialCommunityIcons
                  name={mci(iconFor(item.id))}
                  size={28}
                  color={on ? colors.white : colors.brand}
                />
                <Text style={[styles.label, on ? { color: colors.white } : { color: colors.brand }]}>
                  {item.nameUa}
                </Text>
              </Pressable>
            </FadeUp>
          );
        }}
        ListFooterComponent={
          <View style={styles.actions}>
            <Button onPress={next}>Далі</Button>
          </View>
        }
      />
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  listContent: { gap: 12, paddingBottom: 24 },
  tileWrap: { flex: 1 },
  tile: {
    flex: 1,
    minHeight: 104,
    borderRadius: radius.card,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...elevation.card,
  },
  tileOn:  { backgroundColor: colors.oliveSoft, borderColor: colors.oliveSoft },
  tileOff: { backgroundColor: colors.white,     borderColor: colors.beige },
  label: { fontSize: fontSize.sm, fontWeight: weight.semibold, textAlign: "center" },
  actions: { marginTop: 24, gap: 12, alignItems: "center" },
});
