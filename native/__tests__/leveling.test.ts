import { levelForXp, xpIntoLevel, XP_PER_LEVEL } from "../lib/leveling";
describe("leveling", () => {
  it("level 1 at 0 xp", () => expect(levelForXp(0)).toBe(1));
  it("levels up every XP_PER_LEVEL", () => {
    expect(levelForXp(XP_PER_LEVEL - 1)).toBe(1);
    expect(levelForXp(XP_PER_LEVEL)).toBe(2);
    expect(levelForXp(XP_PER_LEVEL * 3)).toBe(4);
  });
  it("xpIntoLevel is the remainder", () => {
    expect(xpIntoLevel(XP_PER_LEVEL + 150)).toBe(150);
  });
});
