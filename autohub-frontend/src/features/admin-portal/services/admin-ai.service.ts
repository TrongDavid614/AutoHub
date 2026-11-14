import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';

export interface AdminAiCopilotResponse {
  answer: string;
  sources: string[];
  responseTimeMs: number;
}

export interface ReviewSentimentAnalysisResponse {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  isToxic: boolean;
  confidenceScore: number;
  recommendation: 'APPROVE' | 'REJECT' | 'FLAG_REVIEW';
}

export const adminAiService = {
  async askCopilot(query: string, signal?: AbortSignal): Promise<AdminAiCopilotResponse> {
    const res = await axiosClient.post<unknown, ApiResponse<AdminAiCopilotResponse>>(
      API_CONFIG.ENDPOINTS.ADMIN.AI_COPILOT,
      { query },
      { signal }
    );
    return res.data;
  },

  async analyzeReview(content: string, signal?: AbortSignal): Promise<ReviewSentimentAnalysisResponse> {
    const res = await axiosClient.post<unknown, ApiResponse<ReviewSentimentAnalysisResponse>>(
      API_CONFIG.ENDPOINTS.ADMIN.AI_ANALYZE_REVIEW,
      { content },
      { signal }
    );
    return res.data;
  },
};
