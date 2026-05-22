import { View, Text, Pressable, FlatList, StyleSheet, Alert } from "react-native";
import { Header } from "../../components/Header";
import { IconTile } from "../../components/IconTile";
import { categories } from "../../content/categories";
import { colors, fontSize, weight, radius, elevation } from "../../lib/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CatalogScreen() {
  return (
    <View style={styles.root}>
      <Header title="Каталог послуг" />
      <SafeAreaView style={styles.body} edges={["bottom"]}>
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(c) => c.id}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.tile}
              onPress={() => Alert.alert(item.nameUa, "Список послуг цієї категорії — у повній версії.")}
            >
              <IconTile icon={item.icon} size={38} />
              <Text style={styles.label}>{item.nameUa}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
  body: { flex: 1 },
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
  label: {
    fontSize: fontSize.sm,
    fontWeight: weight.semibold,
    color: colors.brand,
    marginTop: 8,
  },
});
