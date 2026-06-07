import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { colors, weight, fontSize, radius } from "../lib/theme";

export interface QrSheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
}

/**
 * QR bottom sheet modal.
 * Shows a faked QR (CSS-style nested View squares) plus a veteran-status pill and a close button.
 */
export function QrSheet({ visible, title, onClose }: QrSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Dim overlay — tapping closes the sheet */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Title */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>Покажіть на касі</Text>

        {/* Faked QR code */}
        <View style={styles.qrBox}>
          {/* Grid pattern simulated with alternating rows */}
          {Array.from({ length: 9 }).map((_, rowIdx) => (
            <View key={rowIdx} style={styles.qrRow}>
              {Array.from({ length: 9 }).map((__, colIdx) => {
                const dark =
                  (rowIdx + colIdx) % 2 === 0 ||
                  (rowIdx < 3 && colIdx < 3) ||
                  (rowIdx < 3 && colIdx > 5) ||
                  (rowIdx > 5 && colIdx < 3);
                return (
                  <View
                    key={colIdx}
                    style={[styles.qrCell, dark ? styles.qrCellDark : styles.qrCellLight]}
                  />
                );
              })}
            </View>
          ))}

          {/* Three finder squares in the corners */}
          <View style={[styles.finder, styles.finderTL]}>
            <View style={styles.finderInner} />
          </View>
          <View style={[styles.finder, styles.finderTR]}>
            <View style={styles.finderInner} />
          </View>
          <View style={[styles.finder, styles.finderBL]}>
            <View style={styles.finderInner} />
          </View>
        </View>

        <Text style={styles.refresh}>Оновлюється щохвилини</Text>

        {/* Verification pill */}
        <View style={styles.pill}>
          <Text style={styles.pillText}>✓ Статус ветерана верифіковано</Text>
        </View>

        {/* Close ghost button */}
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.closeBtnText}>Закрити</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ── overlay dim ───────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10,9,6,0.66)",
  },

  // ── sheet ─────────────────────────────────────────────────────
  sheet: {
    backgroundColor: colors.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 10,
    paddingHorizontal: 22,
    paddingBottom: 32,
    alignItems: "center",
  },

  // ── drag handle ───────────────────────────────────────────────
  handle: {
    width: 38,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: 16,
  },

  // ── texts ─────────────────────────────────────────────────────
  title: {
    fontSize: fontSize.base,
    fontWeight: weight.semibold,
    color: colors.text,
    textAlign: "center",
  },
  sub: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
  refresh: {
    fontSize: 12.5,
    color: colors.textFaint,
    marginTop: 6,
    textAlign: "center",
  },

  // ── faked QR grid ─────────────────────────────────────────────
  qrBox: {
    width: 170,
    height: 170,
    marginTop: 18,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.text,
    overflow: "hidden",
    position: "relative",
  },
  qrRow: {
    flexDirection: "row",
    flex: 1,
  },
  qrCell: {
    flex: 1,
  },
  qrCellDark: {
    backgroundColor: colors.surface,
  },
  qrCellLight: {
    backgroundColor: colors.text,
  },

  // Finder squares (top-left, top-right, bottom-left)
  finder: {
    position: "absolute",
    width: 42,
    height: 42,
    backgroundColor: colors.surface,
    borderWidth: 8,
    borderColor: colors.text,
  },
  finderInner: {
    position: "absolute",
    inset: 0,
    margin: 6,
    backgroundColor: colors.surface,
  },
  finderTL: {
    top: 10,
    left: 10,
  },
  finderTR: {
    top: 10,
    right: 10,
  },
  finderBL: {
    bottom: 10,
    left: 10,
  },

  // ── verification pill ─────────────────────────────────────────
  pill: {
    marginTop: 14,
    backgroundColor: colors.surfaceCard2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  pillText: {
    fontSize: fontSize.xs,
    color: colors.text,
    fontWeight: weight.medium,
  },

  // ── close button (ghost) ──────────────────────────────────────
  closeBtn: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: "stretch",
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: fontSize.sm,
    fontWeight: weight.semibold,
    color: colors.text,
  },
});
