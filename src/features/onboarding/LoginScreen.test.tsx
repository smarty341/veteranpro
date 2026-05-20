import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LoginScreen } from "./LoginScreen";
import { useStore } from "@/lib/store";

function renderWith() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/onboarding/status" element={<div>NEXT</div>} />
        <Route path="/home" element={<div>HOME</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => useStore.getState().resetDemo());

test("Diia button advances to status screen and flags mock-login", async () => {
  renderWith();
  await userEvent.click(screen.getByRole("button", { name: /увійти через Дія/i }));
  expect(screen.getByText("NEXT")).toBeInTheDocument();
  expect(useStore.getState().profile.didMockLogin).toBe(true);
});

test("'Продовжити без входу' link also advances", async () => {
  renderWith();
  await userEvent.click(screen.getByRole("link", { name: /продовжити без входу/i }));
  expect(screen.getByText("NEXT")).toBeInTheDocument();
});

test("already-onboarded user skips straight to /home", async () => {
  useStore.getState().setProfile({ status: "UBD" });
  renderWith();
  expect(screen.getByText("HOME")).toBeInTheDocument();
});
