import { View, Text, Pressable, Image, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header } from "../../components/Header";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Chip } from "../../components/Chip";
import { IconTile } from "../../components/IconTile";
import { categories } from "../../content/categories";
import { statuses } from "../../content/statuses";
import { articles } from "../../content/articles.generated";
import { useStore } from "../../lib/store";
import { recommend } from "../../lib/recommendations";
import { stepsLabel } from "../../lib/plurals";
import { mci } from "../../lib/icons";
import { colors, fontSize, weight, radius, elevation } from "../../lib/theme";

export default function HomeScreen() {
  const profile = useStore((s) => s.profile);
  const statusLabel = statuses.find((s) => s.id === profile.status)?.short;
  const recommended = recommend(articles, profile);

  return (
    <View style={styles.root}>
      <Header />
      <ScreenContainer>
        <Text style={styles.greeting}>Доброго дня 👋</Text>
        <Text style={styles.h1}>Ваші послуги</Text>

        <View style={styles.chipRow}>
          {statusLabel && <Chip>{statusLabel}</Chip>}
          {profile.region && <Chip>{profile.region}</Chip>}
        </View>

        <Pressable
          style={styles.aiTile}
          onPress={() => Alert.alert("AI асистент", "Цей розділ — у повній версії.")}
        >
          <MaterialCommunityIcons name={mci("ri:sparkling-2-line")} size={20} color={colors.white} />
          <Text style={styles.aiText}>Запитати в AI — напишіть питання…</Text>
        </Pressable>

        <Text style={styles.section}>Рекомендовано вам</Text>
        {recommended.length === 0 && (
          <Text style={styles.empty}>Ми ще додаємо послуги для вашого статусу.</Text>
        )}
        {recommended.map((a) => {
          const cat = categories.find((c) => c.id === a.category);
          return (
            <Pressable
              key={a.id}
              style={styles.recRow}
              onPress={() => Alert.alert(a.title, "Цей екран — у повній версії.")}
            >
              <IconTile icon={cat?.icon ?? "ri:bookmark-line"} size={42} />
              <View style={styles.recBody}>
                <Text style={styles.recTitle}>{a.title}</Text>
                <Text style={styles.recMeta}>
                  {cat?.nameUa}
                  {a.steps ? ` · ${stepsLabel(a.steps.length)}` : ""}
                </Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          );
        })}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
  greeting: { fontSize: fontSize.sm, color: colors.muted },
  h1: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand, marginBottom: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap" },
  aiTile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.brand,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 4,
  },
  aiText: { color: colors.white, fontSize: fontSize.sm, fontWeight: weight.medium },
  section: { fontSize: fontSize.sm, fontWeight: weight.semibold, color: colors.muted, marginTop: 12, marginBottom: 4 },
  empty: { fontSize: fontSize.sm, color: colors.muted },
  recRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderColor: colors.beige,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: 16,
    ...elevation.card,
  },
  recBody: { flex: 1 },
  recTitle: { fontSize: fontSize.sm, fontWeight: weight.semibold, color: colors.brand },
  recMeta:  { fontSize: fontSize.xs, color: colors.muted, marginTop: 2 },
  chev: { color: colors.border, fontSize: fontSize.xl },
});
