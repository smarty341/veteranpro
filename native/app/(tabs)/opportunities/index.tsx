import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, fontSize, weight } from "../../../lib/theme";
import { Header } from "../../../components/Header";
import { TabSwipe } from "../../../components/TabSwipe";
import { Chip } from "../../../components/Chip";
import { OfferCard } from "../../../components/OfferCard";
import { QrSheet } from "../../../components/QrSheet";
import { offers, type Offer } from "../../../content/offers";

// Decorative category chips (visual only — match the mockup's chip row).
const CHIPS = ["Усі", "Поруч", "Паливо", "Одяг", "Здоров'я"];

export default function OpportunitiesScreen() {
  const [qr, setQr] = useState<Offer | null>(null);

  return (
    <TabSwipe tab="opportunities">
    <View style={styles.root}>
      <StatusBar style="light" />

      <Header title="Можливості" showGear />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
      >
        {/* Sub */}
        <Text style={styles.sub}>Знижки та пропозиції для ветеранів.</Text>

        {/* Decorative category chip row */}
        <View style={styles.chipRow}>
          {CHIPS.map((label) => (
            <Chip key={label}>{label}</Chip>
          ))}
        </View>

        {/* Offers list */}
        <View style={styles.list}>
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onShowQr={() => setQr(offer)}
            />
          ))}
        </View>
      </ScrollView>

      <QrSheet
        visible={!!qr}
        title={qr ? `${qr.name} · ${qr.discount}` : ""}
        onClose={() => setQr(null)}
      />
    </View>
    </TabSwipe>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 24 },

  sub: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: 14,
    lineHeight: 20,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  list: {
    gap: 10,
  },
});
