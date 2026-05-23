import { Pressable, Alert, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../lib/theme";

export function GearButton({ size = 24 }: { size?: number }) {
  return (
    <Pressable
      onPress={() => Alert.alert("Налаштування", "Цей екран — у повній версії.")}
      hitSlop={8}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityLabel="Налаштування"
      accessibilityRole="button"
    >
      <MaterialCommunityIcons name="cog-outline" size={size} color={colors.brand} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 4 },
  pressed: { opacity: 0.6, transform: [{ scale: 0.95 }] },
});
