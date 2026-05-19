import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

test("primary button renders label and fires onClick", async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Зберегти</Button>);
  const btn = screen.getByRole("button", { name: "Зберегти" });
  expect(btn).toHaveClass("bg-brand");
  await userEvent.click(btn);
  expect(onClick).toHaveBeenCalledOnce();
});

test("outline variant has brand border", () => {
  render(<Button variant="outline">Скасувати</Button>);
  expect(screen.getByRole("button")).toHaveClass("border-brand");
});
