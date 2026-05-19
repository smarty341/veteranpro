import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "var(--vp-brand)",
        beige: { DEFAULT: "var(--vp-beige)", soft: "var(--vp-beige-2)" },
        border: "var(--vp-border)",
        muted: "var(--vp-mut)",
        olive: { DEFAULT: "var(--vp-olive)", soft: "var(--vp-olive-soft)" }
      },
      borderRadius: { card: "var(--vp-radius)" },
      fontFamily: { sans: ['"e-Ukraine"', "ui-sans-serif", "system-ui", "sans-serif"] }
    }
  },
  plugins: []
} satisfies Config;
