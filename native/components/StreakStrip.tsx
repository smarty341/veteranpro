import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
const DAYS = ["пн","вт","ср","чт","пт","сб","нд"];
export function StreakStrip({ filled }: { filled: number }) {
  return (
    <View style={styles.row}>
      {DAYS.map((d, i) => (
        <View key={d} style={[styles.cell, i < filled && styles.on]}>
          <Text style={[styles.txt, i < filled && styles.txtOn]}>{d}</Text>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 5, marginTop: 10 },
  cell: { flex: 1, height: 30, borderRadius: 7, backgroundColor: colors.surfaceCard2, alignItems: "center", justifyContent: "center" },
  on: { backgroundColor: "#3a2a20" },
  txt: { fontSize: 12.5, color: colors.textFaint },
  txtOn: { color: colors.accent },
});
