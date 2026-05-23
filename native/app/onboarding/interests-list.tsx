import { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { FadeUp } from "../../components/FadeUp";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { interests } from "../../content/interests";
import { useStore } from "../../lib/store";
import { tapSelection, tapMedium } from "../../lib/haptics";
import { colors, fontSize, weight, radius } from "../../lib/theme";

// VARIANT C — iOS-style checklist (final screen — Готово saves to store).
export default function InterestsListScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const [selected, setSelected] = useState<string[]>([]);

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
      subtitle="Можна обрати декілька. (3/3 — checklist)"
      onSkip={skip}
    >
      <StatusBar style="dark" />
      <View style={styles.card}>
        <FlatList
          data={interests}
          keyExtractor={(it) => it.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const on = selected.includes(item.id);
            return (
              <FadeUp delay={80 + Math.min(index, 5) * 40}>
                <Pressable
                  onPress={() => toggle(item.id)}
                  style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                >
                  <Text style={styles.rowLabel}>{item.nameUa}</Text>
                  {on ? (
                    <MaterialCommunityIcons name="check" size={22} color={colors.olive} />
                  ) : (
                    <View style={{ width: 22 }} />
                  )}
                </Pressable>
              </FadeUp>
            );
          }}
        />
      </View>

      <View style={styles.actions}>
        <Button onPress={done}>Готово</Button>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderColor: colors.beige,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
    backgroundColor: colors.white,
  },
  rowPressed: { backgroundColor: colors.beigeSoft },
  rowLabel: { fontSize: fontSize.base, fontWeight: weight.medium, color: colors.brand },
  separator: { height: 1, backgroundColor: colors.beige, marginLeft: 16 },
  actions: {
    marginTop: 16,
    paddingBottom: 24,
    gap: 12,
    alignItems: "center",
  },
});
