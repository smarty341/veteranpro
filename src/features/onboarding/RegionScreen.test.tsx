import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { RegionScreen } from "./RegionScreen";
import { useStore } from "@/lib/store";

beforeEach(() => useStore.getState().resetDemo());

test("selecting a region persists and routes to home", async () => {
  render(<MemoryRouter initialEntries={["/onboarding/region"]}>
    <Routes>
      <Route path="/onboarding/region" element={<RegionScreen />} />
      <Route path="/home" element={<div>HOME</div>} />
    </Routes>
  </MemoryRouter>);
  await userEvent.type(screen.getByPlaceholderText(/пошук/i), "Полтав");
  await userEvent.click(screen.getByRole("button", { name: /Полтавська область/ }));
  expect(screen.getByText("HOME")).toBeInTheDocument();
  expect(useStore.getState().profile.region).toBe("Полтавська область");
});

test("'Пропустити' routes to home without setting region", async () => {
  render(<MemoryRouter initialEntries={["/onboarding/region"]}>
    <Routes>
      <Route path="/onboarding/region" element={<RegionScreen />} />
      <Route path="/home" element={<div>HOME</div>} />
    </Routes>
  </MemoryRouter>);
  await userEvent.click(screen.getByRole("button", { name: /пропустити/i }));
  expect(screen.getByText("HOME")).toBeInTheDocument();
  expect(useStore.getState().profile.region).toBeUndefined();
});
