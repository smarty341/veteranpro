import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, weight, fontSize, radius } from "../lib/theme";
import { Avatar } from "./Avatar";
import { Card } from "./Card";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Specialist } from "../content/specialists";

export interface SpecialistCardProps {
  specialist: Specialist;
  compact?: boolean;
  /** Prominent home-screen card: avatar + name + role + blurb + CTA. */
  prominent?: boolean;
  onContact?: () => void;
}

export function SpecialistCard({ specialist, compact = false, prominent = false, onContact }: SpecialistCardProps) {
  const tintColor = colors[specialist.tint];

  if (prominent) {
    return (
      <Card style={styles.homeCard}>
        <View style={styles.homeTop}>
          <Avatar initials={specialist.initials} size={54} tint={tintColor} />
          <View style={styles.homeHead}>
            <Text style={styles.homeName} numberOfLines={1}>{specialist.name}</Text>
            <Text style={styles.homeRole} numberOfLines={2}>{specialist.role}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textFaint} />
        </View>
        <Text style={styles.homeBlurb} numberOfLines={2}>«{specialist.blurb}»</Text>
        <View style={styles.homeCta}>
          <MaterialCommunityIcons name="chat-outline" size={18} color={colors.accent} />
          <Text style={styles.homeCtaText}>Написати</Text>
        </View>
      </Card>
    );
  }

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
  // ── prominent home card ──────────────────────────────────────────
  homeCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  homeTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  homeHead: {
    flex: 1,
  },
  homeName: {
    fontSize: fontSize.lg,
    fontWeight: weight.semibold,
    color: colors.text,
  },
  homeRole: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  homeBlurb: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: fontSize.sm * 1.35,
  },
  homeCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  homeCtaText: {
    fontSize: fontSize.sm,
    fontWeight: weight.semibold,
    color: colors.accent,
  },

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
