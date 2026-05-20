import { render, screen } from "@testing-library/react";
import { ScreenContainer } from "./ScreenContainer";
test("ScreenContainer renders children inside a main element", () => {
  render(<ScreenContainer>Вміст</ScreenContainer>);
  expect(screen.getByRole("main")).toBeInTheDocument();
  expect(screen.getByText("Вміст")).toBeInTheDocument();
});
