import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ua.gov.veteranpro.companion",
  appName: "Ветеран PRO",
  // Capacitor packages the built dist/ folder inside the native app and serves it
  // from the WKWebView via `capacitor://localhost/` (iOS) or `http://localhost/` (Android).
  // Build with `BASE_PATH` unset so paths resolve to root ("/").
  webDir: "dist",
  ios: {
    // Match the brand background so the white flash between splash and app is minimal.
    backgroundColor: "#EFE9E5",
    // Inset the WKWebView from the iPhone safe area; our CSS env() padding still applies on top.
    contentInset: "always",
    // Use the brand-black status bar style to match the app's top header.
    preferredContentMode: "mobile"
  },
  android: {
    backgroundColor: "#EFE9E5"
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#2D2926",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      // 'dark' content (black icons) on light backgrounds; we set this at runtime too.
      style: "DARK",
      backgroundColor: "#FFFFFF"
    }
  }
};

export default config;
