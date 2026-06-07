import { ScrollView, Text, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { FadeUp } from "../../components/FadeUp";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { healthOptions } from "../../content/health";
import type { HealthId } from "../../content/health";
import { useStore } from "../../lib/store";
import { tapSelection } from "../../lib/haptics";
import { colors, fontSize, radius, weight } from "../../lib/theme";

function OptionRow({
  emoji,
  title,
  hint,
  onPress,
}: {
  emoji: string;
  title: string;
  hint: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={() => {
          scale.value = withTiming(0.97, { duration: 80 }, () => {
            scale.value = withTiming(1, { duration: 120 });
          });
          tapSelection();
          setTimeout(onPress, 280);
        }}
        style={({ pressed }) => [styles.opt, pressed && styles.optPressed]}
      >
        <Text style={styles.oem}>{emoji}</Text>
        <FadeUp delay={0} style={styles.otxt}>
          <Text style={styles.olbl}>{title}</Text>
          <Text style={styles.osub}>{hint}</Text>
        </FadeUp>
      </Pressable>
    </Animated.View>
  );
}

export default function HealthScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);

  const pick = (health: HealthId) => {
    setProfile({ health });
    router.push("/onboarding/housing");
  };

  return (
    <OnboardingScaffold
      step={2}
      total={6}
      title="Здоров'я"
      subtitle="Це допоможе підібрати медичні та реабілітаційні програми."
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {healthOptions.map((h, i) => (
          <FadeUp key={h.id} delay={80 + Math.min(i, 5) * 40}>
            <OptionRow
              emoji={h.emoji}
              title={h.title}
              hint={h.hint}
              onPress={() => pick(h.id)}
            />
          </FadeUp>
        ))}
      </ScrollView>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 11, paddingBottom: 24 },
  opt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: colors.surfaceCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 13,
  },
  optPressed: { borderColor: colors.accent },
  oem: { fontSize: 23, lineHeight: 28, flexShrink: 0 },
  otxt: { flex: 1, minWidth: 0 },
  olbl: { fontSize: fontSize.sm + 0.5, fontWeight: weight.semibold, color: colors.text, lineHeight: 18 },
  osub: { fontSize: 13, color: colors.textMuted, marginTop: 3, lineHeight: 18 },
});
