import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
test("Header shows the brand wordmark by default", () => {
  render(<Header />);
  expect(screen.getByAltText("Ветеран PRO")).toBeInTheDocument();
});
test("Header shows a back button when onBack provided", () => {
  render(<Header onBack={() => {}} />);
  expect(screen.getByRole("button", { name: /назад/i })).toBeInTheDocument();
});
