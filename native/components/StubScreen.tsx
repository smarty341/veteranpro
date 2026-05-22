import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontSize, weight } from "../lib/theme";
import { mci } from "../lib/icons";

export function StubScreen({ title, icon }: { title: string; icon: string }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <MaterialCommunityIcons name={mci(icon)} size={56} color={colors.brand} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>Цей розділ — у повній версії.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.beigeSoft },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand },
  body: { fontSize: fontSize.base, color: colors.muted, textAlign: "center" },
});
