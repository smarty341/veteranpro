import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { fixtureArticles } from "@/content/articles.fixture";
import { ServiceDetailScreen } from "./ServiceDetailScreen";
import { useStore } from "@/lib/store";

vi.mock("@/content/articles.generated", () => ({ articles: fixtureArticles }));
beforeEach(() => useStore.getState().resetDemo());

test("Service detail shows title, documents, and adds to applications", async () => {
  render(<MemoryRouter initialEntries={["/catalog/service/a1"]}>
    <Routes><Route path="/catalog/service/:articleId" element={<ServiceDetailScreen />} /></Routes>
  </MemoryRouter>);
  expect(screen.getByText("Грошова допомога УБД")).toBeInTheDocument();
  expect(screen.getByText("IBAN")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /додати в «мої послуги»/i }));
  expect(useStore.getState().applications["a1"]).toBeDefined();
});
