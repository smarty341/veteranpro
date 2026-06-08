import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { FadeUp } from "../../components/FadeUp";
import { Button } from "../../components/Button";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { housingOptions } from "../../content/housing";
import type { HousingId } from "../../content/housing";
import { useStore } from "../../lib/store";
import { tapSelection } from "../../lib/haptics";
import { colors, fontSize, radius, weight } from "../../lib/theme";

export default function HousingScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const [selected, setSelected] = useState<HousingId[]>([]);

  const toggle = (id: HousingId) => {
    tapSelection();
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  const advance = (housing: HousingId[]) => {
    setProfile({ housing });
    router.push("/onboarding/work");
  };

  const skip = () => advance([]);

  return (
    <OnboardingScaffold
      step={3}
      total={6}
      title="Сім'я і житло"
      subtitle="Можна обрати декілька."
      onSkip={skip}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {housingOptions.map((h, i) => {
            const on = selected.includes(h.id);
            return (
              <FadeUp key={h.id} delay={80 + Math.min(i, 5) * 40}>
                <Pressable
                  onPress={() => toggle(h.id)}
                  style={({ pressed }) => [
                    styles.opt,
                    on && styles.optOn,
                    pressed && styles.optPressed,
                  ]}
                >
                  <Text style={styles.oem}>{h.emoji}</Text>
                  <View style={styles.otxt}>
                    <Text style={styles.olbl}>{h.title}</Text>
                    <Text style={styles.osub}>{h.hint}</Text>
                  </View>
                  <View style={[styles.cbox, on && styles.cboxOn]}>
                    {on && (
                      <MaterialCommunityIcons name="check" size={14} color={colors.onAccent} />
                    )}
                  </View>
                </Pressable>
              </FadeUp>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button onPress={() => advance(selected)}>Далі</Button>
          <Pressable
            onPress={skip}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.skipTxt}>Пропустити</Text>
          </Pressable>
        </View>
      </ScrollView>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
  list: { gap: 11 },
  opt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: colors.surfaceCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 13,
  },
  optOn: { borderColor: colors.accent },
  optPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  oem: { fontSize: 23, lineHeight: 28, flexShrink: 0 },
  otxt: { flex: 1, minWidth: 0 },
  olbl: { fontSize: fontSize.sm + 0.5, fontWeight: weight.semibold, color: colors.text, lineHeight: 18 },
  osub: { fontSize: 16, color: colors.textMuted, marginTop: 3, lineHeight: 22 },
  cbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  cboxOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  actions: { marginTop: 24, gap: 12, alignItems: "center" },
  skipTxt: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textDecorationLine: "underline",
  },
});
