// Design tokens carried over from the web app's tokens.css.
// See: src/ui/tokens.css

// Dark MoVA "inverse/memorial" surface. Values mirror docs/mockups/_brand.css.
export const colors = {
  surface:     "#1A1714", // app background (warm near-black)
  surfaceCard: "#322D2A", // raised cards
  surfaceCard2:"#3C3633", // nested / pressed
  border:      "#473F3B", // hairline on dark
  text:        "#E9E4E3", // primary (paper)
  textMuted:   "#A89F98", // secondary
  textFaint:   "#7A736D", // tertiary
  accent:      "#EE754D", // orange
  accentPress: "#C9531F",
  onAccent:    "#241200", // text on orange
  tintHealth:  "#A19388", // warm gray
  tintSport:   "#E6E88F", // light
  tintEdu:     "#B0AB75", // khaki
  white:       "#FFFFFF", // logo chips only
} as const;

export const radius = { card: 14, pill: 999, iconTile: 10 } as const;

export const elevation = {
  card:   { shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  button: { shadowColor: "#000", shadowOpacity: 0.22, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
} as const;

export const fontSize = {
  xs:   13,
  sm:   16,
  base: 18,
  lg:   21,
  xl:   23,
  "2xl": 27,
  "3xl": 33,
  "4xl": 40,
} as const;

export const weight = {
  regular:  "400",
  medium:   "500",
  semibold: "600",
  bold:     "700",
} as const;

export const space = (n: number) => n * 4;
