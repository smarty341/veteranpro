import { render, screen } from "@testing-library/react";
import { Chip } from "./Chip";
test("Chip renders white text on olive-soft bg", () => {
  render(<Chip>УБД</Chip>);
  const el = screen.getByText("УБД");
  expect(el).toHaveClass("bg-olive-soft");
  expect(el).toHaveClass("text-white");
});
