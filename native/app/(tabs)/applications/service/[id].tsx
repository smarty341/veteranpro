import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontSize, weight, radius, space } from "../../../../lib/theme";
import { Card } from "../../../../components/Card";
import { services } from "../../../../content/services";
import { statuses as STATUS_LIST } from "../../../../content/statuses";
import { categories } from "../../../../content/categories";
import type { Status } from "../../../../content/types";
import { tapMedium } from "../../../../lib/haptics";

const STATUS = Object.fromEntries(STATUS_LIST.map((s) => [s.id, s])) as Record<
  Status,
  (typeof STATUS_LIST)[number]
>;

const HOTLINE = "0 800 505 217";

/** Render a free-text body into paragraphs + bullet rows. */
function Body({ text }: { text: string }) {
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paras.map((para, i) => {
        const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
        const allBullets = lines.every((l) => l.startsWith("•"));
        if (allBullets) {
          return (
            <View key={i} style={styles.bulletGroup}>
              {lines.map((l, j) => (
                <View key={j} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{l.replace(/^•\s*/, "")}</Text>
                </View>
              ))}
            </View>
          );
        }
        return (
          <Text key={i} style={styles.bodyText}>
            {para.replace(/\n/g, " ")}
          </Text>
        );
      })}
    </>
  );
}

export default function ServiceDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const article = services.find((a) => a.id === id);
  const cat = article && categories.find((c) => c.id === article.category);

  const call = () => {
    tapMedium();
    Linking.openURL(`tel:${HOTLINE.replace(/\s+/g, "")}`).catch(() => {});
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Назад"
        >
          <MaterialCommunityIcons name="chevron-left" size={26} color={colors.text} />
        </Pressable>
      </View>

      {!article ? (
        <Text style={styles.notFound}>Послугу не знайдено.</Text>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
        >
          {!!cat && <Text style={styles.eyebrow}>{cat.nameUa}</Text>}
          <Text style={styles.title}>{article.title}</Text>

          {/* Status badges */}
          {!!article.statuses?.length && (
            <View style={styles.badges}>
              {article.statuses.map((s) => (
                <View key={s} style={styles.badge}>
                  <Text style={styles.badgeText}>{STATUS[s]?.short ?? s}</Text>
                </View>
              ))}
            </View>
          )}

          {/* For whom */}
          {!!article.statuses?.length && (
            <Text style={styles.forWhom}>
              {article.statuses.map((s) => STATUS[s]?.full ?? s).join(" · ")}
            </Text>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Body text={article.body} />
          </View>

          {/* Documents */}
          {!!article.documents?.length && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Що потрібно</Text>
              <Card style={styles.listCard}>
                {article.documents.map((d, i) => (
                  <View key={i} style={[styles.docRow, i > 0 && styles.docRowDivider]}>
                    <MaterialCommunityIcons
                      name="file-document-outline"
                      size={20}
                      color={colors.accent}
                    />
                    <Text style={styles.docText}>{d}</Text>
                  </View>
                ))}
              </Card>
            </View>
          )}

          {/* Steps */}
          {!!article.steps?.length && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Як отримати</Text>
              {article.steps.map((s, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{s}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Contacts callout */}
          <Pressable
            onPress={call}
            style={({ pressed }) => [styles.callout, pressed && { opacity: 0.85 }]}
          >
            <MaterialCommunityIcons name="phone-outline" size={22} color={colors.accent} />
            <View style={styles.calloutBody}>
              <Text style={styles.calloutTitle}>Єдина ветеранська лінія</Text>
              <Text style={styles.calloutSub}>
                {article.contacts ? article.contacts : `${HOTLINE} · безкоштовно`}
              </Text>
            </View>
          </Pressable>

          {/* Source */}
          {!!article.source && (
            <Pressable
              onPress={() => Linking.openURL(article.source!).catch(() => {})}
              style={({ pressed }) => [styles.sourceRow, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.sourceText}>Детальніше на veteranpro.gov.ua</Text>
              <MaterialCommunityIcons name="arrow-top-right" size={18} color={colors.accent} />
            </Pressable>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    backgroundColor: colors.surface,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.iconTile,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -6,
  },
  backBtnPressed: { backgroundColor: colors.surfaceCard2 },

  notFound: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 40,
  },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8 },

  eyebrow: {
    fontSize: fontSize.xs,
    fontWeight: weight.semibold,
    color: colors.tintEdu,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  title: {
    fontSize: fontSize["2xl"],
    fontWeight: weight.bold,
    color: colors.text,
    lineHeight: fontSize["2xl"] * 1.2,
  },

  badges: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 14 },
  badge: {
    backgroundColor: colors.surfaceCard2,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: weight.semibold,
    color: colors.accent,
  },
  forWhom: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 10,
    lineHeight: fontSize.sm * 1.35,
  },

  section: { marginTop: 22 },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: weight.semibold,
    color: colors.textFaint,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  bodyText: {
    fontSize: fontSize.base,
    color: colors.text,
    lineHeight: fontSize.base * 1.45,
    marginBottom: 12,
  },
  bulletGroup: { marginBottom: 12, gap: 7 },
  bulletRow: { flexDirection: "row", gap: 9 },
  bulletDot: { fontSize: fontSize.base, color: colors.accent, lineHeight: fontSize.base * 1.45 },
  bulletText: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text,
    lineHeight: fontSize.base * 1.45,
  },

  listCard: { padding: 0, overflow: "hidden" },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  docRowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  docText: { flex: 1, fontSize: fontSize.sm, color: colors.text, lineHeight: fontSize.sm * 1.3 },

  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceCard2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepNumText: { fontSize: fontSize.sm, fontWeight: weight.bold, color: colors.accent },
  stepText: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text,
    lineHeight: fontSize.base * 1.35,
    paddingTop: 3,
  },

  callout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 26,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  calloutBody: { flex: 1 },
  calloutTitle: { fontSize: fontSize.sm, fontWeight: weight.semibold, color: colors.text },
  calloutSub: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },

  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 18,
    alignSelf: "flex-start",
  },
  sourceText: { fontSize: fontSize.sm, fontWeight: weight.semibold, color: colors.accent },
});
