import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";
test("ProgressBar reports completion ratio", () => {
  render(<ProgressBar value={2} max={3} />);
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
});
