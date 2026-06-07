import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, radius } from "../lib/theme";
import { mci } from "../lib/icons";

export function IconTile({ icon, size = 42 }: { icon: string; size?: number }) {
  const inner = Math.round(size * 0.52);
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: size >= 64 ? 16 : radius.iconTile }]}>
      <MaterialCommunityIcons name={mci(icon)} size={inner} color={colors.tintEdu} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.surfaceCard2,
    alignItems: "center",
    justifyContent: "center",
  },
});
