import { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Linking, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../lib/store";
import { buildPath } from "../lib/buildPath";
import { ETAPY, type PathStep } from "../content/pathBase";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { FadeUp } from "../components/FadeUp";
import { colors, fontSize, weight, radius, space } from "../lib/theme";

const HOTLINE = "0 800 505 217";
const HOTLINE_TEL = "0800505217";

export default function PathScreen() {
  const insets = useSafeAreaInsets();
  const profile = useStore((s) => s.profile);

  const { sections, doneCount, total } = useMemo(() => {
    const built = buildPath(profile);
    const byEtap = new Map<string, PathStep[]>();
    for (const step of built.steps) {
      const list = byEtap.get(step.etap) ?? [];
      list.push(step);
      byEtap.set(step.etap, list);
    }
    // Order known etapy first (by ETAPY), then any unexpected ones at the end.
    const ordered: string[] = [
      ...ETAPY.filter((e) => byEtap.has(e)),
      ...[...byEtap.keys()].filter((e) => !ETAPY.includes(e as (typeof ETAPY)[number])),
    ];
    const sections = ordered.map((etap) => ({ etap, steps: byEtap.get(etap)! }));
    const doneCount = built.steps.filter((s) => s.done).length;
    return { sections, doneCount, total: built.total };
  }, [profile]);

  const pct = total > 0 ? (doneCount / total) * 100 : 0;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Назад"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Мій шлях</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall progress */}
        <FadeUp>
          <Card style={styles.progressCard}>
            <View style={styles.progressTop}>
              <Text style={styles.progressLabel}>Пройдено кроків</Text>
              <Text style={styles.progressCount}>
                {doneCount} / {total}
              </Text>
            </View>
            <ProgressBar pct={pct} />
            <Text style={styles.progressNote}>
              Шлях оновлюється автоматично, якщо зміняться обставини
            </Text>
          </Card>
        </FadeUp>

        {/* Etap sections */}
        {sections.map((section, si) => (
          <FadeUp key={section.etap} delay={80 + si * 60}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{section.etap}</Text>
              <Card style={styles.sectionCard}>
                {section.steps.map((step, idx) => (
                  <View
                    key={step.id}
                    style={[styles.row, idx > 0 && styles.rowDivider]}
                  >
                    {step.done ? (
                      <View style={[styles.bullet, styles.bulletDone]}>
                        <Ionicons name="checkmark" size={14} color={colors.onAccent} />
                      </View>
                    ) : (
                      <View style={[styles.bullet, styles.bulletEmpty]} />
                    )}
                    <View style={styles.rowBody}>
                      <Text
                        style={[styles.rowTitle, step.done && styles.rowTitleDone]}
                      >
                        {step.title}
                      </Text>
                      {!!step.note && <Text style={styles.rowNote}>{step.note}</Text>}
                    </View>
                    {step.xp != null && (
                      <View style={styles.xpPill}>
                        <Text style={styles.xpText}>+{step.xp} XP</Text>
                      </View>
                    )}
                  </View>
                ))}
              </Card>
            </View>
          </FadeUp>
        ))}

        {/* Hotline callout */}
        <FadeUp delay={120 + sections.length * 60}>
          <Pressable
            onPress={() => Linking.openURL(`tel:${HOTLINE_TEL}`)}
            style={({ pressed }) => [styles.hotline, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`Зателефонувати на єдину ветеранську лінію ${HOTLINE}`}
          >
            <Ionicons name="call" size={20} color={colors.accent} />
            <View style={styles.hotlineBody}>
              <Text style={styles.hotlineLabel}>Єдина ветеранська лінія</Text>
              <Text style={styles.hotlineNumber}>{HOTLINE}</Text>
            </View>
          </Pressable>
        </FadeUp>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.surface,
  },
  backBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: weight.semibold,
    color: colors.text,
  },
  pressed: { opacity: 0.6 },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32, gap: 16 },

  progressCard: { gap: 10 },
  progressTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressLabel: { fontSize: fontSize.sm, color: colors.textMuted },
  progressCount: {
    fontSize: fontSize.lg,
    fontWeight: weight.bold,
    color: colors.accent,
  },
  progressNote: { fontSize: fontSize.xs, color: colors.textFaint, lineHeight: 16 },

  section: { gap: 8 },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: weight.semibold,
    color: colors.textMuted,
    paddingHorizontal: space(1),
  },
  sectionCard: { padding: 0 },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
  },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  bullet: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  bulletDone: { backgroundColor: colors.accent },
  bulletEmpty: { borderWidth: 2, borderColor: colors.border },
  rowBody: { flex: 1, gap: 2 },
  rowTitle: {
    fontSize: fontSize.base,
    fontWeight: weight.medium,
    color: colors.text,
  },
  rowTitleDone: { color: colors.textMuted },
  rowNote: { fontSize: fontSize.xs, color: colors.textFaint, lineHeight: 16 },
  xpPill: {
    backgroundColor: colors.surfaceCard2,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 1,
  },
  xpText: { fontSize: fontSize.xs, fontWeight: weight.semibold, color: colors.accent },

  hotline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 16,
  },
  hotlineBody: { flex: 1 },
  hotlineLabel: { fontSize: fontSize.xs, color: colors.textMuted },
  hotlineNumber: {
    fontSize: fontSize.lg,
    fontWeight: weight.bold,
    color: colors.text,
    marginTop: 2,
  },
});
