import { View, Text, Pressable, FlatList, StyleSheet, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { IconTile } from "../../../components/IconTile";
import { categories } from "../../../content/categories";
import { colors, fontSize, weight, radius, elevation } from "../../../lib/theme";

export default function CatalogScreen() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(c) => c.id}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
            onPress={() => Alert.alert(item.nameUa, "Список послуг цієї категорії — у повній версії.")}
          >
            <IconTile icon={item.icon} size={38} />
            <Text style={styles.label}>{item.nameUa}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
  tile: {
    flex: 1,
    minHeight: 112,
    backgroundColor: colors.white,
    borderColor: colors.beige,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: 16,
    justifyContent: "space-between",
    ...elevation.card,
  },
  tilePressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  label: {
    fontSize: fontSize.sm,
    fontWeight: weight.semibold,
    color: colors.brand,
    marginTop: 8,
  },
});
