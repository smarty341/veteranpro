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

test("ticking the service marks it as received and persists", async () => {
  useStore.getState().addApplication("a1");
  render(<MemoryRouter><ApplicationsScreen /></MemoryRouter>);
  const cb = screen.getByRole("checkbox", { name: /Грошова допомога УБД/i });
  expect(cb).toHaveAttribute("aria-checked", "false");
  await userEvent.click(cb);
  expect(cb).toHaveAttribute("aria-checked", "true");
  expect(useStore.getState().applications["a1"].received).toBe(true);
});

test("ticking again unmarks the service", async () => {
  useStore.getState().addApplication("a1");
  useStore.getState().toggleReceived("a1");
  render(<MemoryRouter><ApplicationsScreen /></MemoryRouter>);
  await userEvent.click(screen.getByRole("checkbox", { name: /Грошова допомога УБД/i }));
  expect(useStore.getState().applications["a1"].received).toBe(false);
});

test("missing article id is silently skipped (data drift safety)", () => {
  useStore.setState({ applications: { ghost: { addedAt: 0, received: false } } });
  render(<MemoryRouter><ApplicationsScreen /></MemoryRouter>);
  expect(screen.getByText(/ще немає заяв/i)).toBeInTheDocument();
});
