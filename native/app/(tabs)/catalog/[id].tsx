import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Stack, useLocalSearchParams } from "expo-router";
import { IconTile } from "../../../components/IconTile";
import { categories } from "../../../content/categories";
import { colors, fontSize } from "../../../lib/theme";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = categories.find((c) => c.id === id);

  if (!category) {
    return (
      <View style={styles.root}>
        <Stack.Screen options={{ title: "" }} />
        <Text style={styles.body}>Категорію не знайдено.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: category.nameUa }} />
      <View style={styles.hero}>
        <IconTile icon={category.icon} size={96} />
      </View>
      <Text style={styles.body}>Список послуг цієї категорії — у повній версії.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  hero: { alignItems: "center", marginTop: 8, marginBottom: 24 },
  body: { fontSize: fontSize.base, color: colors.muted, textAlign: "center" },
});
