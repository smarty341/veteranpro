// Thin wrapper around @capacitor/haptics. On iOS/Android (Capacitor runtime) this
// triggers the platform's native Taptic Engine. On web it's a no-op — so safe to call
// from any UI handler without runtime checks.
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export function tapLight() {
  void Haptics.impact({ style: ImpactStyle.Light }).catch(() => { /* web no-op */ });
}

export function tapMedium() {
  void Haptics.impact({ style: ImpactStyle.Medium }).catch(() => { /* web no-op */ });
}

export function tapSuccess() {
  void Haptics.notification({ type: "SUCCESS" as never }).catch(() => { /* web no-op */ });
}
