import { useEffect } from "react";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useStore } from "../../lib/store";
import { assignSpecialist } from "../../lib/assignSpecialist";
import { specialists } from "../../content/specialists";
import { colors, fontSize, weight, radius, space } from "../../lib/theme";
import { Avatar } from "../../components/Avatar";
import { SpecialistCard } from "../../components/SpecialistCard";
import { Button } from "../../components/Button";
import { tapSuccess } from "../../lib/haptics";

export default function AssignmentScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);

  const specialistId = assignSpecialist(profile);
  const specialist = specialists.find((s) => s.id === specialistId) ?? specialists[0];
  const tintColor = colors[specialist.tint];

  // Reanimated spring values for avatar
  const avatarScale = useSharedValue(0.82);
  const avatarOpacity = useSharedValue(0);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
    opacity: avatarOpacity.value,
  }));

  useEffect(() => {
    // Persist the specialist assignment to the store
    setProfile({ assignedSpecialistId: specialistId });

    // Fire success haptic on mount
    tapSuccess();

    // Animate the avatar in with a spring + fade
    avatarScale.value = withDelay(
      200,
      withSpring(1, { damping: 14, stiffness: 160, mass: 0.8 })
    );
    avatarOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) })
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleWrite = () => {
    Alert.alert(
      "Написати фахівцю",
      `${specialist.name} буде доступна у повній версії застосунку. Лінія підтримки: ${specialist.phone}`,
      [{ text: "Зрозуміло" }]
    );
  };

  return (
    <View style={[styles.root, { paddingTop: top || 16 }]}>
      {/* Header */}
      <View style={styles.headerBlock}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>СУПРОВІД АКТИВОВАНО</Text>
        </View>
        <Text style={styles.title}>
          Вам призначено персонального фахівця супроводу
        </Text>
      </View>

      {/* Animated Avatar */}
      <Animated.View style={[styles.avatarWrap, avatarStyle]}>
        <Avatar initials={specialist.initials} size={96} tint={tintColor} />
      </Animated.View>

      {/* Specialist Card (full mode) */}
      <View style={styles.cardWrap}>
        <SpecialistCard specialist={specialist} compact={false} onContact={handleWrite} />
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Actions */}
      <View style={[styles.actions, { paddingBottom: Math.max(bottom, 24) }]}>
        <Pressable
          onPress={handleWrite}
          style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.ghostLabel}>Написати</Text>
        </Pressable>
        <View style={styles.primaryBtn}>
          <Button onPress={() => router.replace("/(tabs)")}>Почати</Button>
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

  // Header
  headerBlock: {
    alignItems: "center",
    paddingTop: space(4),
    paddingBottom: space(2),
  },
  pill: {
    backgroundColor: colors.surfaceCard2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: space(4),
  },
  pillText: {
    fontSize: 11,
    fontWeight: weight.semibold,
    color: colors.accent,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: weight.semibold,
    color: colors.text,
    letterSpacing: -0.01 * fontSize.xl,
    textAlign: "center",
    lineHeight: 28,
    paddingHorizontal: space(1),
  },

  // Avatar
  avatarWrap: {
    alignItems: "center",
    marginTop: space(6),
    marginBottom: space(5),
  },

  // Card
  cardWrap: {
    flex: 0,
  },

  // Spacer
  spacer: {
    flex: 1,
    minHeight: 14,
  },

  // Actions
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingTop: space(3),
  },
  ghostBtn: {
    flex: 1,
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
