import { View, Text, StyleSheet } from "react-native";
import { colors, fontSize, radius, weight } from "../lib/theme";

export function Chip({ children }: { children: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginRight: 6,
    marginBottom: 6,
  },
  label: {
    color: colors.brand,
    fontSize: fontSize.sm,
    fontWeight: weight.medium,
  },
});
