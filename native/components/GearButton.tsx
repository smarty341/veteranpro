import { Pressable, Alert, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStore } from "../lib/store";
import { colors } from "../lib/theme";

export function GearButton({ size = 24 }: { size?: number }) {
  const router = useRouter();
  const resetDemo = useStore((s) => s.resetDemo);

  return (
    <Pressable
      onPress={() =>
        Alert.alert("Налаштування", "Цей екран — у повній версії.", [
          {
            text: "Скинути демо",
            style: "destructive",
            onPress: () => {
              resetDemo();
              router.replace("/onboarding/login");
            },
          },
          { text: "Закрити", style: "cancel" },
        ])
      }
      hitSlop={8}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityLabel="Налаштування"
      accessibilityRole="button"
    >
      <MaterialCommunityIcons name="cog-outline" size={size} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 4 },
  pressed: { opacity: 0.6, transform: [{ scale: 0.95 }] },
});
