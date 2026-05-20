import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

test("Card renders children with surface styles", () => {
  render(<Card>Зміст</Card>);
  const el = screen.getByText("Зміст");
  expect(el).toHaveClass("bg-white");
  expect(el).toHaveClass("rounded-card");
});
