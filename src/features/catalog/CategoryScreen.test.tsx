import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { fixtureArticles } from "@/content/articles.fixture";
import { CategoryScreen } from "./CategoryScreen";

vi.mock("@/content/articles.generated", () => ({ articles: fixtureArticles }));

test("CategoryScreen lists only articles for the route's category", () => {
  render(<MemoryRouter initialEntries={["/catalog/health"]}>
    <Routes><Route path="/catalog/:categoryId" element={<CategoryScreen />} /></Routes>
  </MemoryRouter>);
  expect(screen.getByText("Безоплатне лікування")).toBeInTheDocument();
  expect(screen.queryByText("Грошова допомога УБД")).not.toBeInTheDocument();
});

test("shows empty-state copy when no articles match", () => {
  render(<MemoryRouter initialEntries={["/catalog/grants"]}>
    <Routes><Route path="/catalog/:categoryId" element={<CategoryScreen />} /></Routes>
  </MemoryRouter>);
  expect(screen.getByText(/поки що немає послуг/i)).toBeInTheDocument();
});
