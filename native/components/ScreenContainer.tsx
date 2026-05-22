import { ScrollView, StyleSheet, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../lib/theme";

export function ScreenContainer({ children, style, ...rest }: ScrollViewProps) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        {...rest}
        style={styles.scroll}
        contentContainerStyle={[styles.content, style]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.beigeSoft },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
});
