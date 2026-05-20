import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { fixtureArticles } from "@/content/articles.fixture";
import { AiScreen } from "./AiScreen";

vi.mock("@/content/articles.generated", () => ({ articles: fixtureArticles }));

test("sending a question shows an answer with a cited source", async () => {
  render(<MemoryRouter initialEntries={["/ai"]}><AiScreen /></MemoryRouter>);
  await userEvent.type(screen.getByPlaceholderText(/напишіть/i), "лікування");
  await userEvent.click(screen.getByRole("button", { name: /надіслати/i }));
  expect(await screen.findByText(/Безоплатне лікування/i)).toBeInTheDocument();
});
