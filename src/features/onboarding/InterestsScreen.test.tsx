import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { InterestsScreen } from "./InterestsScreen";
import { useStore } from "@/lib/store";

function wrap() {
  return render(
    <MemoryRouter initialEntries={["/onboarding/interests"]}>
      <Routes>
        <Route path="/onboarding/interests" element={<InterestsScreen />} />
        <Route path="/home" element={<div>HOME</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => useStore.getState().resetDemo());

test("tapping pills toggles selection and 'Готово' persists + routes to home", async () => {
  wrap();
  await userEvent.click(screen.getByRole("button", { name: "Курси" }));
  await userEvent.click(screen.getByRole("button", { name: "Лікування" }));
  expect(screen.getByRole("button", { name: "Курси" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: "Лікування" })).toHaveAttribute("aria-pressed", "true");
  await userEvent.click(screen.getByRole("button", { name: /Готово/i }));
  expect(screen.getByText("HOME")).toBeInTheDocument();
  expect(useStore.getState().profile.interests).toEqual(["courses", "treatment"]);
});

test("tapping a selected pill deselects it", async () => {
  wrap();
  const courses = screen.getByRole("button", { name: "Курси" });
  await userEvent.click(courses);
  await userEvent.click(courses);
  expect(courses).toHaveAttribute("aria-pressed", "false");
});

test("'Пропустити' completes onboarding without saving interests", async () => {
  wrap();
  await userEvent.click(screen.getByRole("button", { name: "Знижки" }));
  await userEvent.click(screen.getByRole("button", { name: /Пропустити/i }));
  expect(screen.getByText("HOME")).toBeInTheDocument();
  // setProfile({}) was called → didOnboard true, interests untouched (undefined)
  expect(useStore.getState().profile.didOnboard).toBe(true);
  expect(useStore.getState().profile.interests).toBeUndefined();
});
