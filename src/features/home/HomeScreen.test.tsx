import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { fixtureArticles } from "@/content/articles.fixture";
import { HomeScreen } from "./HomeScreen";
import { useStore } from "@/lib/store";

vi.mock("@/content/articles.generated", () => ({ articles: fixtureArticles }));
beforeEach(() => useStore.getState().resetDemo());

test("Home recommends articles matching the user's status", () => {
  useStore.getState().setProfile({ status: "OIVV" });
  render(<MemoryRouter><HomeScreen /></MemoryRouter>);
  expect(screen.getByText("Безоплатне лікування")).toBeInTheDocument();
  expect(screen.queryByText("Грошова допомога УБД")).not.toBeInTheDocument();
});

test("falls back to all articles when status not set", () => {
  render(<MemoryRouter><HomeScreen /></MemoryRouter>);
  expect(screen.getByText("Грошова допомога УБД")).toBeInTheDocument();
  expect(screen.getByText("Безоплатне лікування")).toBeInTheDocument();
});
