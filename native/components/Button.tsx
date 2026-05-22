import { Pressable, Text, StyleSheet, type PressableProps } from "react-native";
import { colors, elevation, fontSize, radius, weight } from "../lib/theme";
import { tapLight } from "../lib/haptics";

interface Props extends Omit<PressableProps, "children" | "style"> {
  children: string;
}

export function Button({ children, onPress, ...rest }: Props) {
  return (
    <Pressable
      {...rest}
      onPress={(e) => {
        tapLight();
        onPress?.(e);
      }}
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
    >
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand,
    borderRadius: radius.card,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    ...elevation.button,
  },
  label: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: weight.semibold,
  },
});
