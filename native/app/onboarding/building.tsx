import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useStore } from "../../lib/store";
import { buildPath } from "../../lib/buildPath";
import type { PathLineKind } from "../../lib/buildPath";
import { colors, fontSize, weight, radius, space } from "../../lib/theme";
import { Button } from "../../components/Button";
import { FadeUp } from "../../components/FadeUp";

const STAGGER_MS = 420;
const START_DELAY_MS = 300;

function markerColor(kind: PathLineKind): string {
  switch (kind) {
    case "add": return colors.tintEdu;
    case "mod": return colors.accent;
    case "rem": return colors.textFaint;
    default:    return colors.textMuted;
  }
}

export default function BuildingScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const profile = useStore((s) => s.profile);
  const built = buildPath(profile);

  const [visibleCount, setVisibleCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    built.lines.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), START_DELAY_MS + i * STAGGER_MS)
      );
    });

    const afterLines = START_DELAY_MS + built.lines.length * STAGGER_MS;
    timers.push(setTimeout(() => setShowSummary(true), afterLines));
    timers.push(setTimeout(() => setShowButton(true), afterLines + 280));

    return () => timers.forEach(clearTimeout);
  }, [built.lines.length]);

  return (
    <View style={[styles.root, { paddingTop: top || 16 }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(bottom, 24) + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.emoji}>🛠️</Text>
          <Text style={styles.title}>Будуємо твій шлях</Text>
          <Text style={styles.sub}>Нічого не приховуємо — ось логіка:</Text>
        </View>

        {/* Line-by-line reveal */}
        <View style={styles.linesCard}>
          {built.lines.map((line, i) => (
            <FadeUp key={i} delay={START_DELAY_MS + i * STAGGER_MS} enabled={true}>
              <View style={[styles.lineRow, i > 0 && styles.lineBorder]}>
                <Text style={[styles.marker, { color: markerColor(line.kind) }]}>
                  {line.marker}
                </Text>
                <Text style={styles.lineText}>{line.text}</Text>
              </View>
            </FadeUp>
          ))}
        </View>

        {/* Summary */}
        {showSummary && (
          <FadeUp delay={0} enabled={true}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryText}>
                Ваш шлях готовий:{" "}
                <Text style={styles.summaryAccent}>{built.total} кроків</Text>{" "}
                у 5 етапах
              </Text>
              <Text style={styles.summaryNote}>
                Зміниться автоматично, якщо зміняться обставини
              </Text>
            </View>
          </FadeUp>
        )}
      </ScrollView>

      {/* Sticky footer button */}
      {showButton && (
        <View style={[styles.footer, { paddingBottom: Math.max(bottom, 16) }]}>
          <Button onPress={() => router.replace("/onboarding/assignment")}>
            Далі →
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingHorizontal: space(5),
    gap: space(4),
  },

  // Header
  headerBlock: {
    alignItems: "center",
    paddingTop: space(4),
    paddingBottom: space(2),
  },
  emoji: {
    fontSize: 40,
    lineHeight: 36,
    marginTop: space(6),
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: weight.semibold,
    color: colors.text,
    letterSpacing: -0.01 * fontSize.xl,
    marginTop: space(3),
    textAlign: "center",
  },
  sub: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: space(2),
    textAlign: "center",
  },

  // Lines card
  linesCard: {
    backgroundColor: colors.surfaceCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: space(3),
    paddingVertical: space(1),
  },
  lineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    paddingVertical: 9,
  },
  lineBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  marker: {
    width: 18,
    textAlign: "center",
    fontSize: 19,
    fontWeight: weight.bold,
    lineHeight: 20,
    flexShrink: 0,
  },
  lineText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 19,
    color: colors.text,
  },

  // Summary
  summaryCard: {
    backgroundColor: colors.surfaceCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: space(2),
  },
  summaryText: {
    fontSize: fontSize.base - 1,
    fontWeight: weight.semibold,
    color: colors.text,
    lineHeight: 22,
  },
  summaryAccent: {
    color: colors.accent,
  },
  summaryNote: {
    fontSize: fontSize.xs - 0.5,
    color: colors.textMuted,
    lineHeight: 17,
    marginTop: space(1),
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: space(5),
    paddingTop: space(3),
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
