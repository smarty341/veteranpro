import { useState, useMemo } from "react";
import { Text, Pressable, TextInput, FlatList, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FadeUp } from "../../components/FadeUp";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { regions } from "../../content/regions";
import { useStore } from "../../lib/store";
import { tapSelection } from "../../lib/haptics";
import { colors, fontSize, radius } from "../../lib/theme";

const INITIAL_STAGGER_LIMIT = 8;

export default function RegionScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => regions.filter((r) => r.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  const pick = (r: string) => {
    tapSelection();
    setProfile({ region: r });
    router.push("/onboarding/interests");
  };

  const skip = () => {
    setProfile({});
    router.push("/onboarding/interests");
  };

  return (
    <OnboardingScaffold
      step={2}
      title="Ваш регіон"
      subtitle="Допоможе показати регіональні програми та послуги."
      onSkip={skip}
    >
      <FadeUp delay={120}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Пошук області"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </FadeUp>

      <FlatList
        data={filtered}
        keyExtractor={(r) => r}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const animate = index < INITIAL_STAGGER_LIMIT && q === "";
          return (
            <FadeUp delay={animate ? 160 + Math.min(index, 5) * 40 : 0} enabled={animate}>
              <Pressable
                onPress={() => pick(item)}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <Text style={styles.rowLabel}>{item}</Text>
                <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
              </Pressable>
            </FadeUp>
          );
        }}
      />
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    fontSize: fontSize.sm,
    color: colors.brand,
    marginBottom: 12,
  },
  listContent: { gap: 8, paddingBottom: 24 },
  row: {
    backgroundColor: colors.white,
    borderColor: colors.beige,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowPressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  rowLabel: { fontSize: fontSize.base, color: colors.brand, flex: 1 },
});
