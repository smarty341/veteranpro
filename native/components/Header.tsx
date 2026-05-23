import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Logo } from "./Logo";
import { colors, fontSize, weight } from "../lib/theme";

interface Props {
  title?: string;
  showGear?: boolean;
}

export function Header({ title, showGear = true }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 12 }]}>
      <View style={styles.brandRow}>
        <Logo height={34} />
        {showGear && (
          <Pressable
            onPress={() => Alert.alert("Налаштування", "Цей екран — у повній версії.")}
            hitSlop={8}
          >
            <MaterialCommunityIcons name="cog-outline" size={24} color={colors.brand} />
          </Pressable>
        )}
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.beigeSoft,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: fontSize["2xl"],
    fontWeight: weight.semibold,
    color: colors.brand,
    marginTop: 14,
  },
});
