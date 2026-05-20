import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { RegionScreen } from "./RegionScreen";
import { useStore } from "@/lib/store";

beforeEach(() => useStore.getState().resetDemo());

function wrap() {
  return render(<MemoryRouter initialEntries={["/onboarding/region"]}>
    <Routes>
      <Route path="/onboarding/region" element={<RegionScreen />} />
      <Route path="/onboarding/interests" element={<div>INTERESTS</div>} />
    </Routes>
  </MemoryRouter>);
}

test("selecting a region persists and routes to interests step", async () => {
  wrap();
  await userEvent.type(screen.getByPlaceholderText(/пошук/i), "Полтав");
  await userEvent.click(screen.getByRole("button", { name: /Полтавська область/ }));
  expect(screen.getByText("INTERESTS")).toBeInTheDocument();
  expect(useStore.getState().profile.region).toBe("Полтавська область");
});

test("'Пропустити' routes to interests without setting region", async () => {
  wrap();
  await userEvent.click(screen.getByRole("button", { name: /пропустити/i }));
  expect(screen.getByText("INTERESTS")).toBeInTheDocument();
  expect(useStore.getState().profile.region).toBeUndefined();
});
