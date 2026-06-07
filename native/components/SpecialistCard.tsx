import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, weight, fontSize, radius } from "../lib/theme";
import { Avatar } from "./Avatar";
import { Card } from "./Card";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Specialist } from "../content/specialists";

export interface SpecialistCardProps {
  specialist: Specialist;
  compact?: boolean;
  onContact?: () => void;
}

export function SpecialistCard({ specialist, compact = false, onContact }: SpecialistCardProps) {
  const tintColor = colors[specialist.tint];

  if (compact) {
    return (
      <View style={styles.compactRow}>
        <Avatar initials={specialist.initials} size={38} tint={tintColor} />
        <View style={styles.compactBody}>
          <Text style={styles.compactName} numberOfLines={1}>
            {specialist.name} — {specialist.role}
          </Text>
        </View>
        <Pressable
          onPress={onContact}
          hitSlop={8}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <MaterialCommunityIcons
            name="chat-outline"
            size={20}
            color={colors.accent}
          />
        </Pressable>
      </View>
    );
  }

  // Full card mode (used in assignment screen)
  return (
    <Card style={styles.fullCard}>
      <Text style={styles.fullName}>{specialist.name}</Text>
      <Text style={styles.fullMeta}>
        {specialist.role} · {specialist.oblast}
      </Text>
      <Text style={styles.blurb}>«{specialist.blurb}»</Text>

      {onContact && (
        <Pressable
          onPress={onContact}
          style={({ pressed }) => [styles.contactBtn, pressed && styles.contactBtnPressed]}
        >
          <MaterialCommunityIcons name="chat-outline" size={16} color={colors.accent} />
          <Text style={styles.contactLabel}>Написати</Text>
        </Pressable>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  // ── compact row ──────────────────────────────────────────────────
  compactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  compactBody: {
    flex: 1,
  },
  compactName: {
    fontSize: 15,
    fontWeight: weight.semibold,
    color: colors.text,
    lineHeight: 18,
  },

  // ── full card ────────────────────────────────────────────────────
  fullCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  fullName: {
    fontSize: fontSize.lg,
    fontWeight: weight.semibold,
    color: colors.text,
    letterSpacing: -0.01 * fontSize.lg,
  },
  fullMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  blurb: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 21,
    marginTop: 12,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  contactBtnPressed: {
    opacity: 0.7,
  },
  contactLabel: {
    fontSize: fontSize.sm,
    fontWeight: weight.semibold,
    color: colors.accent,
  },
});
