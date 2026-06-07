import { stages, validStageIds } from "../content/stages";
import { healthOptions, validHealthIds } from "../content/health";
import { housingOptions, validHousingIds } from "../content/housing";
import { workOptions, validWorkIds } from "../content/work";

describe("onboarding content", () => {
  it("has unique ids per set", () => {
    expect(validStageIds.size).toBe(stages.length);
    expect(validHealthIds.size).toBe(healthOptions.length);
    expect(validHousingIds.size).toBe(housingOptions.length);
    expect(validWorkIds.size).toBe(workOptions.length);
  });
});
