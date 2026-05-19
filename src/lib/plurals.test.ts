import { stepsLabel } from "./plurals";

test("Ukrainian step plural forms", () => {
  expect(stepsLabel(1)).toBe("1 крок");
  expect(stepsLabel(2)).toBe("2 кроки");
  expect(stepsLabel(3)).toBe("3 кроки");
  expect(stepsLabel(4)).toBe("4 кроки");
  expect(stepsLabel(5)).toBe("5 кроків");
  expect(stepsLabel(11)).toBe("11 кроків");
  expect(stepsLabel(21)).toBe("21 крок");
  expect(stepsLabel(0)).toBe("0 кроків");
});
