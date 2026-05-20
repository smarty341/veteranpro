import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { fixtureArticles } from "@/content/articles.fixture";
import { ApplicationsScreen } from "./ApplicationsScreen";
import { useStore } from "@/lib/store";

vi.mock("@/content/articles.generated", () => ({ articles: fixtureArticles }));
beforeEach(() => useStore.getState().resetDemo());

test("empty state nudges to catalog", () => {
  render(<MemoryRouter><ApplicationsScreen /></MemoryRouter>);
  expect(screen.getByText(/ще немає заяв/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /до каталогу/i })).toBeInTheDocument();
});

test("ticking a step updates progress and persists", async () => {
  useStore.getState().addApplication("a1");
  render(<MemoryRouter><ApplicationsScreen /></MemoryRouter>);
  await userEvent.click(screen.getByRole("checkbox", { name: "Зібрати" }));
  expect(screen.getByText(/виконано 1 з 3/i)).toBeInTheDocument();
  expect(useStore.getState().applications["a1"].stepsCompleted).toEqual([0]);
});

test("missing article id is silently skipped (data drift safety)", () => {
  useStore.setState({ applications: { ghost: { addedAt: 0, stepsCompleted: [] } } });
  render(<MemoryRouter><ApplicationsScreen /></MemoryRouter>);
  expect(screen.getByText(/ще немає заяв/i)).toBeInTheDocument();
});
