export type Status = "UBD" | "OIVV" | "CHSZ";

export interface Article {
  id: string;
  title: string;
  category: CategoryId;
  statuses: Status[];
  region?: string;
  documents?: string[];
  steps?: string[];
  contacts?: string;
  source?: string;
  body: string;
}

export type CategoryId =
  | "health" | "social-protection" | "housing" | "transport" | "documents"
  | "education" | "tax" | "sport" | "grants" | "regional";

export interface Category { id: CategoryId; nameUa: string; icon: string; }
