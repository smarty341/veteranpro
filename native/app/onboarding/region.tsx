import { useState, useMemo } from "react";
import { View, Text, Pressable, TextInput, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { regions } from "../../content/regions";
import { useStore } from "../../lib/store";
import { colors, fontSize, weight, radius } from "../../lib/theme";

export default function RegionScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => regions.filter((r) => r.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  const pick = (r: string) => {
    setProfile({ region: r });
    router.push("/onboarding/interests");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>Ваш регіон</Text>
        <Text style={styles.subtitle}>Допоможе показати регіональні програми та послуги.</Text>

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Пошук області"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <FlatList
          data={filtered}
          keyExtractor={(r) => r}
          contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => pick(item)}>
              <Text style={styles.rowLabel}>{item}</Text>
            </Pressable>
          )}
        />

        <Pressable
          onPress={() => {
            setProfile({});
            router.push("/onboarding/interests");
          }}
        >
          <Text style={styles.skip}>Пропустити</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.beigeSoft },
  content: { flex: 1, padding: 20, paddingTop: 32 },
  title: { fontSize: fontSize["2xl"], fontWeight: weight.semibold, color: colors.brand, marginBottom: 4 },
  subtitle: { fontSize: fontSize.sm, color: colors.muted, marginBottom: 12 },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: fontSize.sm,
    color: colors.brand,
    marginBottom: 12,
  },
  row: {
    backgroundColor: colors.white,
    borderColor: colors.beige,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: { fontSize: fontSize.base, color: colors.brand },
  skip: { color: colors.muted, fontSize: fontSize.sm, textDecorationLine: "underline", marginTop: 12, alignSelf: "flex-start" },
});
