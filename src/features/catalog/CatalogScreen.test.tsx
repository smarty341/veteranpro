import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CatalogScreen } from "./CatalogScreen";

test("CatalogScreen lists all 10 thematic categories", () => {
  render(<MemoryRouter><CatalogScreen /></MemoryRouter>);
  expect(screen.getByText("Здоров'я та відновлення")).toBeInTheDocument();
  expect(screen.getByText("Послуги по регіону")).toBeInTheDocument();
  expect(screen.getAllByRole("link")).toHaveLength(10);
});
