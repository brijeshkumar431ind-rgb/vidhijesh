export type PracticeType = "Criminal" | "Civil" | "Corporate" | "Tax" | "Family";
export type Language = "en" | "hi";
export type SuggestionLevel = "Low" | "Normal" | "High";

export interface StatuteSource {
  act: string;
  section: string;
  summary: string;
  url: string;
}

export interface JudgmentSource {
  id: string;
  title: string;
  court: string;
  year: number;
  judge: string;
  subject: string;
  holding: string;
  url: string;
}

export interface Suggestion {
  id: string;
  type: "Next Step" | "Gap Alert" | "Related Precedent" | "Strategy Tip";
  text: string;
  why: string;
  url: string;
}

export interface ResearchResult {
  query: string;
  issues: string[];
  statutes: StatuteSource[];
  judgments: JudgmentSource[];
  suggestions: Suggestion[];
  note: string;
}
