import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontSize, weight } from "../../../lib/theme";
import { mci } from "../../../lib/icons";

export default function ApplicationsScreen() {
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <StatusBar style="dark" />
      <View style={styles.center}>
        <MaterialCommunityIcons name={mci("ri:file-list-3-fill")} size={56} color={colors.brand} />
        <Text style={styles.title}>Мої послуги</Text>
        <Text style={styles.body}>Цей розділ — у повній версії.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.beigeSoft },
  content: { flexGrow: 1, paddingHorizontal: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand },
  body: { fontSize: fontSize.base, color: colors.muted, textAlign: "center" },
});
