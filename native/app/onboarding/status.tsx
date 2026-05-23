import { Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Card } from "../../components/Card";
import { FadeUp } from "../../components/FadeUp";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { statuses } from "../../content/statuses";
import { useStore } from "../../lib/store";
import { tapSelection } from "../../lib/haptics";
import { colors, fontSize, weight } from "../../lib/theme";

export default function StatusScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);

  return (
    <OnboardingScaffold
      step={1}
      title="Оберіть свій статус"
      subtitle="Послуги та програми різняться залежно від статусу."
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {statuses.map((s, i) => (
          <FadeUp key={s.id} delay={80 + Math.min(i, 5) * 40}>
            <Pressable
              onPress={() => {
                tapSelection();
                setProfile({ status: s.id });
                router.push("/onboarding/region");
              }}
              style={({ pressed }) => [pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
            >
              <Card style={styles.card}>
                <Text style={styles.cardTitle}>{s.short} — {s.full}</Text>
                <Text style={styles.cardBody}>{s.description}</Text>
              </Card>
            </Pressable>
          </FadeUp>
        ))}
      </ScrollView>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12, paddingBottom: 24 },
  card: { borderLeftWidth: 3, borderLeftColor: colors.olive },
  cardTitle: { fontSize: fontSize.lg, fontWeight: weight.semibold, color: colors.brand },
  cardBody: { fontSize: fontSize.sm, color: colors.muted, marginTop: 4 },
});
