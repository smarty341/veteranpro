import { useMemo } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Card } from "../../components/Card";
import { LevelRing } from "../../components/LevelRing";
import { ProgressBar } from "../../components/ProgressBar";
import { StreakStrip } from "../../components/StreakStrip";
import { MissionCard } from "../../components/MissionCard";
import { SpecialistCard } from "../../components/SpecialistCard";

import { useStore } from "../../lib/store";
import { buildPath } from "../../lib/buildPath";
import { XP_PER_LEVEL, xpIntoLevel, levelForXp } from "../../lib/leveling";
import { stepsLabel } from "../../lib/plurals";
import { tapSuccess } from "../../lib/haptics";
import { specialists } from "../../content/specialists";
import type { PathStep } from "../../content/pathBase";
import { colors, fontSize, weight } from "../../lib/theme";

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

// Emoji per active mission step so cards read like the mockup.
const STEP_EMOJI: Record<string, string> = {
  "vet-box": "🎁",
  "utility-75": "🏠",
  "transport": "🚌",
  "pension": "💰",
  "family-doc": "🩺",
  "x-biz": "💼",
  "x-career": "🧭",
  "x-study": "🎓",
  "x-oselya": "🔑",
  "x-vidnov": "🏚️",
  "x-kids": "📚",
  "x-utility": "🏠",
  "x-oivv": "♿",
  "x-chsz": "🤝",
  "x-disab": "♿",
};

export default function HomeScreen() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const completeMission = useStore((s) => s.completeMission);

  const completedMissionIds = profile.completedMissionIds ?? [];
  const xp = profile.xp ?? 0;
  const level = profile.level ?? levelForXp(xp);
  const streak = profile.streak ?? 0;

  const built = useMemo(() => buildPath(profile), [profile]);

  const doneCount =
    built.steps.filter((s) => s.done).length + completedMissionIds.length;
  const total = built.total;
  const pct = total > 0 ? (doneCount / total) * 100 : 0;

  const activeMissions: PathStep[] = built.steps
    .filter((s) => !s.done && s.xp && !completedMissionIds.includes(s.id))
    .slice(0, 2);

  const specialist = specialists.find((s) => s.id === profile.assignedSpecialistId);

  const handleComplete = (step: PathStep) => {
    completeMission(step.id, step.xp ?? 0);
    tapSuccess();
    Alert.alert("Місію виконано 🎉", `${step.title} · +${step.xp} XP`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: single greeting + level ring */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Привіт, Андрію 👋</Text>
          </View>
          <LevelRing level={level} pct={(xpIntoLevel(xp) / XP_PER_LEVEL) * 100} />
        </View>

        {/* HERO: the adaptation path */}
        <Pressable
          onPress={() => router.push("/path" as any)}
          style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
        >
          <Card style={styles.hero}>
            <View style={styles.heroAccent} />
            <View style={styles.heroTop}>
              <View style={styles.heroTitleCol}>
                <Text style={styles.eyebrow}>Твій шлях</Text>
                <Text style={styles.heroTitle}>УБД</Text>
              </View>
              <Text style={styles.heroCount}>
                <Text style={styles.heroCountNum}>{doneCount}</Text>
                {" / "}
                {stepsLabel(total)}
              </Text>
            </View>

            <View style={styles.heroBar}>
              <ProgressBar pct={pct} />
            </View>

            <StreakStrip filled={clamp(streak, 0, 7)} />

            <View style={styles.heroLink}>
              <Text style={styles.heroLinkText}>Весь шлях</Text>
              <MaterialCommunityIcons name="arrow-right" size={16} color={colors.accent} />
            </View>
          </Card>
        </Pressable>

        {/* Active missions */}
        <Text style={styles.section}>Активні місії</Text>
        {activeMissions.length === 0 ? (
          <Text style={styles.empty}>Усі активні місії виконано 🎉</Text>
        ) : (
          activeMissions.map((step) => (
            <MissionCard
              key={step.id}
              emoji={STEP_EMOJI[step.id] ?? "🎯"}
              title={step.title}
              meta={step.note}
              xp={step.xp ?? 0}
              onPress={() => handleComplete(step)}
            />
          ))
        )}

        {/* Specialist */}
        {specialist && (
          <>
            <Text style={styles.section}>Твій супровід</Text>
            <SpecialistCard
              specialist={specialist}
              compact
              onContact={() =>
                Alert.alert(specialist.name, "Чат із фахівцем — у повній версії.")
              }
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 12, gap: 14 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  headerText: { flex: 1 },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: weight.bold,
    color: colors.text,
    letterSpacing: -0.3,
  },

  hero: {
    paddingHorizontal: 17,
    paddingVertical: 18,
    overflow: "hidden",
  },
  heroAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.accent,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  heroTitleCol: { flex: 1 },
  eyebrow: {
    fontSize: 10,
    fontWeight: weight.semibold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.tintEdu,
  },
  heroTitle: {
    fontSize: fontSize["2xl"],
    fontWeight: weight.bold,
    color: colors.text,
    marginTop: 4,
    letterSpacing: -0.2,
  },
  heroCount: { fontSize: fontSize.xs, color: colors.textMuted },
  heroCountNum: { color: colors.accent, fontWeight: weight.bold },
  heroBar: { marginTop: 14, marginBottom: 2 },
  heroLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },
  heroLinkText: {
    fontSize: 13,
    fontWeight: weight.semibold,
    color: colors.accent,
  },

  section: {
    fontSize: fontSize.sm,
    fontWeight: weight.semibold,
    color: colors.textMuted,
    marginTop: 4,
  },
  empty: { fontSize: fontSize.sm, color: colors.textMuted },
});
