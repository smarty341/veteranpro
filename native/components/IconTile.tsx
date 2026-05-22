import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, radius } from "../lib/theme";
import { mci } from "../lib/icons";

export function IconTile({ icon, size = 42 }: { icon: string; size?: 38 | 42 }) {
  return (
    <View style={[styles.tile, { width: size, height: size }]}>
      <MaterialCommunityIcons name={mci(icon)} size={22} color={colors.brand} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.beige,
    borderRadius: radius.iconTile,
    alignItems: "center",
    justifyContent: "center",
  },
});
