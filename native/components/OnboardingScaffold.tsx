import { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { FadeUp } from "./FadeUp";
import { colors, fontSize, weight } from "../lib/theme";

interface Props {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  onSkip?: () => void;
  children: React.ReactNode;
}

function Dot({ active }: { active: boolean }) {
  const color = useSharedValue(active ? 1 : 0);
  const scale = useSharedValue(1);
  const wasActive = useRef(active);

  useEffect(() => {
    color.value = withTiming(active ? 1 : 0, { duration: 180, easing: Easing.out(Easing.cubic) });
    if (active && !wasActive.current) {
      scale.value = withSequence(
        withTiming(1.25, { duration: 110, easing: Easing.bezier(0.34, 1.56, 0.64, 1.0) }),
        withTiming(1.0, { duration: 110, easing: Easing.out(Easing.cubic) })
      );
    }
    wasActive.current = active;
  }, [active, color, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(color.value, [0, 1], [colors.border, colors.accent]),
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function OnboardingScaffold({ step, total, title, subtitle, onSkip, children }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.chrome}>
        <View style={styles.side}>
          {step > 1 && (
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
              accessibilityLabel="Назад"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text} />
            </Pressable>
          )}
        </View>

        <View style={styles.dots}>
          {Array.from({ length: total }, (_, i) => (
            <Dot key={i + 1} active={i + 1 === step} />
          ))}
        </View>

        <View style={[styles.side, styles.sideRight]}>
          {onSkip && (
            <Pressable
              onPress={onSkip}
              hitSlop={8}
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
              accessibilityRole="button"
            >
              <Text style={styles.skip} numberOfLines={1}>Пропустити</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.body}>
        <FadeUp delay={0}>
          <Text style={styles.title}>{title}</Text>
        </FadeUp>
        {subtitle && (
          <FadeUp delay={60}>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </FadeUp>
        )}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  chrome: {
    height: 44,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  side: { width: 96, alignItems: "flex-start" },
  sideRight: { alignItems: "flex-end" },
  dots: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  skip: { color: colors.textMuted, fontSize: fontSize.sm, textDecorationLine: "underline" },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 4 },
  content: { flex: 1, marginTop: 20 },
});
