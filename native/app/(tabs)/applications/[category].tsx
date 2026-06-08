import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontSize, weight, radius } from "../../../lib/theme";
import { mci } from "../../../lib/icons";
import { Card } from "../../../components/Card";
import { categories } from "../../../content/categories";
import { servicesByCategory } from "../../../content/services";
import type { Article } from "../../../content/types";

function metaFor(a: Article): string {
  const parts: string[] = [];
  if (a.region) parts.push(a.region);
  if (a.statuses?.length) parts.push(a.statuses.join(" · "));
  return parts.join("  •  ");
}

export default function CategoryDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams<{ category: string }>();

  const cat = categories.find((c) => c.id === category);
  const items = category ? servicesByCategory(category) : [];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
        >
          <MaterialCommunityIcons name="chevron-left" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {cat?.nameUa ?? "Категорія"}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <Text style={styles.empty}>
            Для цієї категорії послуги зʼявляться найближчим часом.
          </Text>
        ) : (
          items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() =>
                router.push(`/(tabs)/applications/service/${item.id}` as any)
              }
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
            >
              <Card style={styles.rowCard}>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  {!!metaFor(item) && (
                    <Text style={styles.rowMeta}>{metaFor(item)}</Text>
                  )}
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={colors.textFaint}
                />
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.iconTile,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -6,
    marginTop: -2,
  },
  backBtnPressed: {
    backgroundColor: colors.surfaceCard2,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.xl,
    fontWeight: weight.semibold,
    color: colors.text,
    lineHeight: 26,
  },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 4 },

  empty: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 32,
    lineHeight: 20,
  },

  row: { marginBottom: 10 },
  rowPressed: { transform: [{ scale: 0.985 }] },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  rowBody: { flex: 1 },
  rowTitle: {
    fontSize: fontSize.base,
    fontWeight: weight.medium,
    color: colors.text,
    lineHeight: 21,
  },
  rowMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 4,
  },
});
