import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

// BASE_PATH is set by the GitHub Pages workflow (or any subpath host).
// Defaults to "/" so Netlify, Cloudflare, and `npm run dev` keep working.
const BASE = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "assets/**/*", "icons/*.png"],
      manifest: {
        name: "Ветеран PRO — Компаньйон",
        short_name: "Ветеран PRO",
        description: "Персональний помічник з державних послуг для ветеранів",
        lang: "uk",
        start_url: BASE,
        scope: BASE,
        display: "standalone",
        background_color: "#F4F0EE",
        theme_color: "#2D2926",
        icons: [
          { src: `${BASE}icons/icon-192.png`, sizes: "192x192", type: "image/png" },
          { src: `${BASE}icons/icon-512.png`, sizes: "512x512", type: "image/png" },
          { src: `${BASE}icons/icon-512-maskable.png`, sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: { globPatterns: ["**/*.{js,css,html,svg,otf,png,ico,webmanifest}"] }
    })
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: { environment: "jsdom", globals: true, setupFiles: ["./src/test-setup.ts"] }
});
