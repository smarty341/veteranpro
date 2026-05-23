import Svg, { Path } from "react-native-svg";
import { LOGO_PATHS } from "./_logoPaths";

interface Props {
  height?: number;
}

// Tight bbox of the artwork inside the source SVG's 1700×425 viewBox.
// Computed from path coordinates — see git history for the extraction script.
// Cropping here removes the ~10% horizontal and ~28% vertical padding the
// original SVG carries, so the wordmark fills its rendered box edge to edge.
const TIGHT_VIEWBOX = "175 120 1350 185";
const ASPECT = 1350 / 185;

export function Logo({ height = 32 }: Props) {
  const width = Math.round(height * ASPECT);
  return (
    <Svg
      width={width}
      height={height}
      viewBox={TIGHT_VIEWBOX}
      accessibilityLabel="Ветеран PRO"
    >
      {LOGO_PATHS.map((p, i) => (
        <Path key={i} d={p.d} fill={p.fill} />
      ))}
    </Svg>
  );
}
