import { View, Text, StyleSheet } from "react-native";
import { colors, weight } from "../lib/theme";
export function Avatar({ initials, size = 96, tint = colors.tintHealth }: { initials: string; size?: number; tint?: string }) {
  return (
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.fill, { width: size - 6, height: size - 6, borderRadius: (size - 6) / 2, backgroundColor: tint }]}>
        <Text style={[styles.txt, { fontSize: size * 0.34 }]}>{initials}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  ring: { borderWidth: 3, borderColor: colors.accent, alignItems: "center", justifyContent: "center" },
  fill: { alignItems: "center", justifyContent: "center" },
  txt: { color: colors.onAccent, fontWeight: weight.semibold },
});
