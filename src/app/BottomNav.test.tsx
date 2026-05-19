import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BottomNav } from "./BottomNav";
test("BottomNav exposes four labelled links", () => {
  render(<MemoryRouter><BottomNav /></MemoryRouter>);
  for (const label of ["Каталог", "Головна", "AI", "Мої послуги"]) {
    expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
  }
});
