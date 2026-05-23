import * as Haptics from "expo-haptics";

jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success" },
}));

describe("tapSelection", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls Haptics.selectionAsync", async () => {
    const { tapSelection } = await import("../lib/haptics");
    tapSelection();
    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
  });

  it("swallows rejections silently", async () => {
    (Haptics.selectionAsync as jest.Mock).mockRejectedValueOnce(new Error("no haptic engine"));
    const { tapSelection } = await import("../lib/haptics");
    expect(() => tapSelection()).not.toThrow();
  });
});
