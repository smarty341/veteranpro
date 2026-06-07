import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { FadeUp } from "../../components/FadeUp";
import { Button } from "../../components/Button";
import { OnboardingScaffold } from "../../components/OnboardingScaffold";
import { regions } from "../../content/regions";
import { statuses } from "../../content/statuses";
import type { Status } from "../../content/types";
import { useStore } from "../../lib/store";
import { tapSelection } from "../../lib/haptics";
import { colors, fontSize, radius, weight } from "../../lib/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);

  const [region, setRegion] = useState("м. Київ");
  const [status, setStatus] = useState<Status>("UBD");
  const [regionModalVisible, setRegionModalVisible] = useState(false);

  const pickRegion = (r: string) => {
    tapSelection();
    setRegion(r);
    setRegionModalVisible(false);
  };

  const finish = () => {
    setProfile({ region, status });
    router.replace("/onboarding/building");
  };

  return (
    <OnboardingScaffold
      step={6}
      total={6}
      title="Останній крок"
      subtitle="Локація та статус — щоб підібрати саме ваші послуги."
    >
      <StatusBar style="light" />

      <FadeUp delay={80}>
        <Text style={styles.flbl}>Регіон</Text>
        <Pressable
          onPress={() => {
            tapSelection();
            setRegionModalVisible(true);
          }}
          style={({ pressed }) => [styles.field, pressed && styles.fieldPressed]}
        >
          <Text style={styles.fval}>{region}</Text>
          <MaterialCommunityIcons name="chevron-down" size={22} color={colors.textMuted} />
        </Pressable>
      </FadeUp>

      <FadeUp delay={140}>
        <Text style={[styles.flbl, { marginTop: 20 }]}>Статус</Text>
        <View style={styles.seg}>
          {statuses.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => {
                tapSelection();
                setStatus(s.id);
              }}
              style={({ pressed }) => [
                styles.segBtn,
                status === s.id && styles.segBtnOn,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[styles.segTxt, status === s.id && styles.segTxtOn]}>
                {s.short}
              </Text>
            </Pressable>
          ))}
        </View>
      </FadeUp>

      <View style={styles.pushdown}>
        <Button onPress={finish}>Завершити</Button>
      </View>

      <Modal
        visible={regionModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setRegionModalVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Оберіть регіон</Text>
            <Pressable
              onPress={() => setRegionModalVisible(false)}
              hitSlop={8}
            >
              <MaterialCommunityIcons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          <FlatList
            data={regions}
            keyExtractor={(r) => r}
            contentContainerStyle={styles.modalList}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => pickRegion(item)}
                style={({ pressed }) => [
                  styles.modalRow,
                  item === region && styles.modalRowOn,
                  pressed && styles.modalRowPressed,
                ]}
              >
                <Text style={[styles.modalRowTxt, item === region && styles.modalRowTxtOn]}>
                  {item}
                </Text>
                {item === region && (
                  <MaterialCommunityIcons name="check" size={18} color={colors.accent} />
                )}
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  flbl: {
    fontSize: 11,
    fontWeight: weight.semibold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 13,
  },
  fieldPressed: { opacity: 0.8 },
  fval: { flex: 1, fontSize: fontSize.sm + 0.5, fontWeight: weight.medium, color: colors.text },
  seg: { flexDirection: "row", gap: 9 },
  segBtn: {
    flex: 1,
    backgroundColor: colors.surfaceCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingVertical: 13,
    alignItems: "center",
  },
  segBtnOn: { borderColor: colors.accent },
  segTxt: { fontSize: fontSize.sm, fontWeight: weight.semibold, color: colors.textMuted },
  segTxtOn: { color: colors.text },
  pushdown: { marginTop: "auto", paddingTop: 32 },
  // Modal
  modal: { flex: 1, backgroundColor: colors.surface },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: fontSize.lg, fontWeight: weight.semibold, color: colors.text },
  modalList: { paddingHorizontal: 20, paddingVertical: 8 },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalRowOn: {},
  modalRowPressed: { opacity: 0.7 },
  modalRowTxt: { flex: 1, fontSize: fontSize.base, color: colors.text },
  modalRowTxtOn: { color: colors.accent, fontWeight: weight.semibold },
});
