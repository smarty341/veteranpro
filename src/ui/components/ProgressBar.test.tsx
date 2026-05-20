import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

test("ProgressBar reports completion ratio and fills proportionally", () => {
  render(<ProgressBar value={2} max={3} />);
  const bar = screen.getByRole("progressbar");
  expect(bar).toHaveAttribute("aria-valuenow", "2");
  // 2/3 rounds to 67% — the fill div is the bar's first child.
  expect(bar.firstChild).toHaveStyle({ width: "67%" });
});

test("ProgressBar guards against division-by-zero", () => {
  render(<ProgressBar value={0} max={0} />);
  const bar = screen.getByRole("progressbar");
  expect(bar.firstChild).toHaveStyle({ width: "0%" });
});
