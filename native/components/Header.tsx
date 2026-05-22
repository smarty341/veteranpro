import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontSize, weight } from "../lib/theme";

interface Props {
  title?: string;
  showGear?: boolean;
}

export function Header({ title, showGear = true }: Props) {
  return (
    <View style={styles.bar}>
      <Text style={styles.title}>{title ?? ""}</Text>
      {showGear && (
        <Pressable
          onPress={() => Alert.alert("Налаштування", "Цей екран — у повній версії.")}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="cog-outline" size={22} color={colors.brand} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.beigeSoft,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: weight.semibold,
    color: colors.brand,
  },
});
