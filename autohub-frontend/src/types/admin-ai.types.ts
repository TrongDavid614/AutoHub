export interface AdminAiCopilotRequest {
  query: string;
}

export interface AdminAiCopilotResponse {
  answer: string;
  sources: string[];
  responseTimeMs: number;
}

export interface ReviewSentimentAnalysisRequest {
  content: string;
}

export interface ReviewSentimentAnalysisResponse {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  isToxic: boolean;
  confidenceScore: number;
  recommendation: 'APPROVE' | 'REJECT' | 'FLAG_REVIEW';
}
