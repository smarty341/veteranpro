// Design tokens carried over from the web app's tokens.css.
// See: src/ui/tokens.css

export const colors = {
  brand:      "#2D2926",
  beige:      "#E9E4E3",
  beigeSoft:  "#EFE9E5",
  border:     "#D1CBCB",
  muted:      "#6B6664",
  olive:      "#757341",
  oliveSoft:  "#B0AB75",
  white:      "#FFFFFF",
  inactive:   "#A39E9B",
} as const;

export const radius = { card: 16, pill: 999, iconTile: 10 } as const;

export const elevation = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  button: {
    shadowColor: "#2D2926",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
} as const;

export const fontSize = {
  xs:   12,
  sm:   14,
  base: 16,
  lg:   18,
  xl:   20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const weight = {
  regular:  "400",
  medium:   "500",
  semibold: "600",
  bold:     "700",
} as const;

export const space = (n: number) => n * 4;
