export type MarketResearchBriefRequest = {
  question: string;
  focus_area: string;
  include_recent_sources: boolean;
};

export type MarketResearchBriefResponse = {
  brief_id: string;
  executive_summary: string;
  recommendation: string;
  evidence_used: string[];
  risks_and_assumptions: string[];
  suggested_next_actions: string[];
  confidence_level: string;
  missing_data: string[];
  created_at: string;
};
