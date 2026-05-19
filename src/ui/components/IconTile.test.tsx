import { render } from "@testing-library/react";
import { IconTile } from "./IconTile";
test("IconTile renders an iconify icon inside a beige square", () => {
  const { container } = render(<IconTile icon="ri:heart-add-line" />);
  expect(container.firstChild).toHaveClass("bg-beige");
});
