import Svg, { Circle } from "react-native-svg";
import { View, Text, StyleSheet } from "react-native";
import { colors, weight } from "../lib/theme";
export function LevelRing({ level, pct, size = 56 }: { level: number; pct: number; size?: number }) {
  const r = (size - 6) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(1, pct / 100)));
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size/2} cy={size/2} r={r} stroke={colors.surfaceCard2} strokeWidth={4} fill="none" />
        <Circle cx={size/2} cy={size/2} r={r} stroke={colors.accent} strokeWidth={4} fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
      </Svg>
      <View style={StyleSheet.absoluteFill as any}>
        <View style={styles.center}><Text style={styles.lvl}>{level}</Text><Text style={styles.cap}>рівень</Text></View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  lvl: { color: colors.accent, fontWeight: weight.bold, fontSize: 15 },
  cap: { color: colors.textMuted, fontSize: 8 },
});
