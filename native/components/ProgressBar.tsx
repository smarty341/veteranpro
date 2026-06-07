import { View, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
export function ProgressBar({ pct }: { pct: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, pct))}%` }]} />
    </View>
  );
}
const styles = StyleSheet.create({
  track: { height: 7, backgroundColor: colors.surfaceCard2, borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.accent, borderRadius: 999 },
});
