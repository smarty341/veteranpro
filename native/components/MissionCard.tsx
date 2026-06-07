import { Pressable, View, Text, StyleSheet } from "react-native";
import { colors, radius, weight, fontSize } from "../lib/theme";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";

export interface MissionCardProps {
  emoji: string;
  title: string;
  meta: string;
  xp: number;
  pct?: number;
  onPress: () => void;
}

export function MissionCard({ emoji, title, meta, xp, pct, onPress }: MissionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
    >
      <Card style={styles.card}>
        {/* Row: emoji tile · title+meta · +XP */}
        <View style={styles.row}>
          <Text style={styles.emoji}>{emoji}</Text>
          <View style={styles.body}>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.meta} numberOfLines={1}>{meta}</Text>
          </View>
          <Text style={styles.xp}>+{xp} XP</Text>
        </View>

        {/* Optional progress bar — shown only when pct is provided */}
        {pct != null && (
          <View style={styles.bar}>
            <ProgressBar pct={pct} />
          </View>
        )}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 13,
    paddingVertical: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  emoji: {
    fontSize: 24,
    lineHeight: 28,
    width: 32,
    textAlign: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: weight.semibold,
    color: colors.text,
    lineHeight: 18,
  },
  meta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    lineHeight: 16,
  },
  xp: {
    fontSize: 13,
    fontWeight: weight.bold,
    color: colors.accent,
    whiteSpace: "nowrap",
  } as any,
  bar: {
    marginTop: 10,
  },
});
