import type { Status } from "../content/types";

export interface Profile {
  status: Status | null;
  region?: string;
  interests?: string[];
  didOnboard: boolean;
  didMockLogin: boolean;
}
