import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { colors, weight, fontSize, radius } from "../lib/theme";
import { Card } from "./Card";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Offer } from "../content/offers";
import { logoSources } from "../assets/logos";

export interface OfferCardProps {
  offer: Offer;
  /** Pre-resolved image source (e.g. require("../assets/logos/wog.png")). Task 23 passes this in. */
  logoSource?: any;
  onShowQr?: () => void;
}

export function OfferCard({ offer, logoSource, onShowQr }: OfferCardProps) {
  // Prefer an explicitly-passed source, else resolve from the bundled require-map by offer.logo key.
  const resolvedLogo =
    logoSource ?? (offer.logo != null ? logoSources[offer.logo] : undefined);

  return (
    <Card style={styles.card}>
      {/* Row: logo chip · name+meta · discount */}
      <View style={styles.row}>
        {/* Logo chip — white background when logo present, else plain emoji tile */}
        {resolvedLogo != null ? (
          <View style={styles.logoChip}>
            <Image source={resolvedLogo} style={styles.logoImg} resizeMode="contain" />
          </View>
        ) : (
          <View style={styles.emojiTile}>
            <Text style={styles.emojiText}>{offer.emoji ?? "🏷️"}</Text>
          </View>
        )}

        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>{offer.name}</Text>
          <Text style={styles.meta} numberOfLines={1}>{offer.meta}</Text>
        </View>

        <Text style={styles.discount}>{offer.discount}</Text>
      </View>

      {/* "Показати QR" action */}
      <Pressable
        onPress={onShowQr}
        style={({ pressed }) => [styles.qrBtn, pressed && { opacity: 0.7 }]}
        hitSlop={8}
      >
        <MaterialCommunityIcons name="qrcode" size={15} color={colors.accent} />
        <Text style={styles.qrLabel}>Показати QR</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  // White chip for partner logos
  logoChip: {
    width: 46,
    height: 46,
    borderRadius: radius.iconTile,
    backgroundColor: colors.white,
    padding: 5,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoImg: {
    width: "100%",
    height: "100%",
  },
  // Dark tile with emoji for non-logo partners
  emojiTile: {
    width: 46,
    height: 46,
    borderRadius: radius.iconTile,
    backgroundColor: colors.surfaceCard2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  emojiText: {
    fontSize: 21,
    lineHeight: 26,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: weight.semibold,
    color: colors.text,
    lineHeight: 20,
  },
  meta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    lineHeight: 16,
  },
  discount: {
    fontSize: 17,
    fontWeight: weight.bold,
    color: colors.accent,
    textAlign: "right",
    lineHeight: 20,
  },
  qrBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
    alignSelf: "flex-start",
  },
  qrLabel: {
    fontSize: 13,
    fontWeight: weight.medium,
    color: colors.textMuted,
  },
});
