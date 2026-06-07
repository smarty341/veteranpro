import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fontSize, weight, radius, elevation } from "../../../lib/theme";
import { Card } from "../../../components/Card";
import { IconTile } from "../../../components/IconTile";
import { ProgressBar } from "../../../components/ProgressBar";
import { Header } from "../../../components/Header";
import { categories } from "../../../content/categories";

// ── mock in-progress items ────────────────────────────────────────────────────
const IN_PROGRESS = [
  {
    id: "veteran-box",
    title: "Отримання Ветеран-боксу",
    meta: "крок 2 з 3",
    pct: 66,
    icon: "ri:id-card-line",
    pill: null,
  },
  {
    id: "veteran-sport",
    title: "Заявка «Ветеранський спорт»",
    meta: "подано",
    pct: null,
    icon: "ri:basketball-line",
    pill: "в роботі",
  },
] as const;

export default function ApplicationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />

      <Header title="Мої послуги" showGear />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Sub */}
        <Text style={styles.sub}>
          Активні заявки та повний каталог послуг для ветеранів.
        </Text>

        {/* ── В роботі ── */}
        <Text style={styles.sectionLabel}>В роботі</Text>

        {IN_PROGRESS.map((item) => (
          <Card key={item.id} style={styles.workCard}>
            <View style={styles.workRow}>
              <IconTile icon={item.icon} size={40} />
              <View style={styles.workBody}>
                <Text style={styles.workTitle}>{item.title}</Text>
                <Text style={styles.workMeta}>{item.meta}</Text>
              </View>
              {item.pill && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{item.pill}</Text>
                </View>
              )}
            </View>
            {item.pct !== null && (
              <View style={styles.barWrap}>
                <ProgressBar pct={item.pct} />
              </View>
            )}
          </Card>
        ))}

        {/* ── Категорії ── */}
        <Text style={styles.sectionLabel}>Категорії</Text>

        <View style={styles.grid}>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [
                styles.catCard,
                pressed && styles.catCardPressed,
              ]}
              onPress={() =>
                router.push(`/(tabs)/applications/${cat.id}` as any)
              }
            >
              <IconTile icon={cat.icon} size={40} />
              <Text style={styles.catName}>{cat.nameUa}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 24 },

  sub: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: 20,
    lineHeight: 20,
  },

  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: weight.semibold,
    color: colors.textFaint,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },

  // ── В роботі ─────────────────────────────
  workCard: {
    marginBottom: 10,
    padding: 13,
  },
  workRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  workBody: {
    flex: 1,
  },
  workTitle: {
    fontSize: fontSize.sm,
    fontWeight: weight.semibold,
    color: colors.text,
    lineHeight: 18,
  },
  workMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  pill: {
    backgroundColor: colors.surfaceCard2,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: fontSize.xs,
    fontWeight: weight.medium,
    color: colors.accent,
  },
  barWrap: {
    marginTop: 10,
  },

  // ── Категорії ────────────────────────────
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  catCard: {
    width: "48%",
    backgroundColor: colors.surfaceCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: 14,
    minHeight: 96,
    justifyContent: "space-between",
    ...elevation.card,
  },
  catCardPressed: {
    backgroundColor: colors.surfaceCard2,
    transform: [{ scale: 0.97 }],
  },
  catName: {
    fontSize: 12.5,
    fontWeight: weight.medium,
    color: colors.text,
    lineHeight: 17,
    marginTop: 6,
  },
});
