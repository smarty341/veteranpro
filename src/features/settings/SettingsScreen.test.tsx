import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SettingsScreen } from "./SettingsScreen";
import { useStore } from "@/lib/store";

beforeEach(() => useStore.getState().resetDemo());

test("changing font level updates store and root class", async () => {
  render(<MemoryRouter><SettingsScreen /></MemoryRouter>);
  await userEvent.click(screen.getByRole("button", { name: "A+" }));
  expect(useStore.getState().settings.fontLevel).toBe(2);
});

test("'Скинути демо' clears everything", async () => {
  useStore.getState().setProfile({ status: "UBD" });
  render(<MemoryRouter><SettingsScreen /></MemoryRouter>);
  await userEvent.click(screen.getByRole("button", { name: /скинути демо/i }));
  expect(useStore.getState().profile.status).toBeNull();
});
