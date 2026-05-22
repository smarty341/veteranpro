import { View, StyleSheet, type ViewProps } from "react-native";
import { colors, elevation, radius } from "../lib/theme";

export function Card({ style, children, ...rest }: ViewProps) {
  return (
    <View {...rest} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.beige,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: 16,
    ...elevation.card,
  },
});
