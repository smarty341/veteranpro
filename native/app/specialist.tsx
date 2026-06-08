import { useEffect } from "react";
import { View, Text, Pressable, Alert, Linking, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useStore } from "../lib/store";
import { specialists } from "../content/specialists";
import { colors, fontSize, weight, radius, space } from "../lib/theme";
import { Avatar } from "../components/Avatar";
import { SpecialistCard } from "../components/SpecialistCard";
import { Button } from "../components/Button";
import { tapMedium } from "../lib/haptics";

export default function SpecialistScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const profile = useStore((s) => s.profile);

  // Show the veteran's assigned specialist; fall back to the first if none yet.
  const specialist =
    specialists.find((s) => s.id === profile.assignedSpecialistId) ?? specialists[0];
  const tintColor = colors[specialist.tint];

  // Avatar springs in on mount (mirrors the onboarding assignment screen).
  const avatarScale = useSharedValue(0.82);
  const avatarOpacity = useSharedValue(0);
  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
    opacity: avatarOpacity.value,
  }));

  useEffect(() => {
    avatarScale.value = withDelay(
      120,
      withSpring(1, { damping: 14, stiffness: 160, mass: 0.8 })
    );
    avatarOpacity.value = withDelay(
      120,
      withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) })
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCall = () => {
    tapMedium();
    const tel = `tel:${specialist.phone.replace(/\s+/g, "")}`;
    Linking.openURL(tel).catch(() =>
      Alert.alert("Не вдалося відкрити дзвінок", specialist.phone)
    );
  };

  const handleWrite = () => {
    tapMedium();
    Alert.alert(
      "Написати фахівцю",
      `Чат із ${specialist.name} буде доступний у повній версії застосунку. Лінія підтримки: ${specialist.phone}`,
      [{ text: "Зрозуміло" }]
    );
  };

  return (
    <View style={[styles.root, { paddingTop: top || 16 }]}>
      {/* Back row */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Назад"
          style={({ pressed }) => [pressed && { opacity: 0.6 }]}
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color={colors.text} />
        </Pressable>
      </View>

      {/* Header */}
      <View style={styles.headerBlock}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>ВАШ ФАХІВЕЦЬ СУПРОВОДУ</Text>
        </View>
      </View>

      {/* Animated avatar */}
      <Animated.View style={[styles.avatarWrap, avatarStyle]}>
        <Avatar initials={specialist.initials} size={96} tint={tintColor} />
      </Animated.View>

      {/* Specialist card (full mode) */}
      <View style={styles.cardWrap}>
        <SpecialistCard specialist={specialist} compact={false} />
      </View>

      <View style={styles.spacer} />

      {/* Actions */}
      <View style={[styles.actions, { paddingBottom: Math.max(bottom, 24) }]}>
        <Pressable
          onPress={handleCall}
          style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.7 }]}
        >
          <MaterialCommunityIcons name="phone-outline" size={18} color={colors.text} />
          <Text style={styles.ghostLabel}>Подзвонити</Text>
        </Pressable>
        <View style={styles.primaryBtn}>
          <Button onPress={handleWrite}>Написати</Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: space(5),
  },
  topBar: {
    height: 36,
    justifyContent: "center",
    marginLeft: -6,
  },
  headerBlock: {
    alignItems: "center",
    paddingTop: space(2),
  },
  pill: {
    backgroundColor: colors.surfaceCard2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 15,
    fontWeight: weight.semibold,
    color: colors.accent,
    letterSpacing: 0.8,
  },
  avatarWrap: {
    alignItems: "center",
    marginTop: space(6),
    marginBottom: space(5),
  },
  cardWrap: {
    flex: 0,
  },
  spacer: {
    flex: 1,
    minHeight: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingTop: space(3),
  },
  ghostBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostLabel: {
    fontSize: fontSize.base,
    fontWeight: weight.semibold,
    color: colors.text,
  },
  primaryBtn: {
    flex: 1,
  },
});
