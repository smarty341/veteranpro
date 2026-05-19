import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { StatusScreen } from "./StatusScreen";
import { useStore } from "@/lib/store";

beforeEach(() => useStore.getState().resetDemo());

test("picking a status advances to region and persists", async () => {
  render(<MemoryRouter initialEntries={["/onboarding/status"]}>
    <Routes>
      <Route path="/onboarding/status" element={<StatusScreen />} />
      <Route path="/onboarding/region" element={<div>REGION</div>} />
    </Routes>
  </MemoryRouter>);
  await userEvent.click(screen.getByRole("button", { name: /УБД/ }));
  expect(screen.getByText("REGION")).toBeInTheDocument();
  expect(useStore.getState().profile.status).toBe("UBD");
});
