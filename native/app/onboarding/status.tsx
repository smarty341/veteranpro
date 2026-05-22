import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Card } from "../../components/Card";
import { statuses } from "../../content/statuses";
import { useStore } from "../../lib/store";
import { colors, fontSize, weight, space } from "../../lib/theme";

export default function StatusScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Оберіть свій статус</Text>
        <Text style={styles.subtitle}>Послуги та програми різняться залежно від статусу.</Text>

        <View style={{ gap: space(3) }}>
          {statuses.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => {
                setProfile({ status: s.id });
                router.push("/onboarding/region");
              }}
            >
              <Card>
                <Text style={styles.cardTitle}>{s.short} — {s.full}</Text>
                <Text style={styles.cardBody}>{s.description}</Text>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.beigeSoft },
  content: { padding: 20, paddingTop: 32, gap: 4 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand },
  subtitle: { fontSize: fontSize.sm, color: colors.muted, marginBottom: 16 },
  cardTitle: { fontSize: fontSize.lg, fontWeight: weight.semibold, color: colors.brand },
  cardBody: { fontSize: fontSize.sm, color: colors.muted, marginTop: 4 },
});
