import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BottomNav } from "./BottomNav";

test("BottomNav exposes four labelled links", () => {
  render(<MemoryRouter><BottomNav /></MemoryRouter>);
  for (const label of ["Каталог", "Головна", "AI", "Мої послуги"]) {
    expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
  }
});

test("BottomNav marks the active route and applies active styling", () => {
  render(<MemoryRouter initialEntries={["/home"]}><BottomNav /></MemoryRouter>);
  const homeLink = screen.getByRole("link", { name: "Головна" });
  expect(homeLink).toHaveAttribute("aria-current", "page");
  expect(homeLink).toHaveClass("text-brand");
  expect(homeLink).toHaveClass("font-semibold");
  // sibling tab must not be active
  expect(screen.getByRole("link", { name: "Каталог" })).not.toHaveAttribute("aria-current");
});
