// Thin wrapper around expo-haptics. Mirrors the web app's src/lib/haptics.ts
// API so screen code reads the same on both platforms.

import * as Haptics from "expo-haptics";

export const tapLight   = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)  .catch(() => {});
export const tapMedium  = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) .catch(() => {});
export const tapSuccess = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
