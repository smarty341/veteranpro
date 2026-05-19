import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";
test("Checkbox toggles on click", async () => {
  const onChange = vi.fn();
  render(<Checkbox label="Готово" checked={false} onChange={onChange} />);
  await userEvent.click(screen.getByRole("checkbox", { name: "Готово" }));
  expect(onChange).toHaveBeenCalledWith(true);
});
