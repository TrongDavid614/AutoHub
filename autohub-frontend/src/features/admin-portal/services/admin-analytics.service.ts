import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

export interface CarDwellItem {
  car: string;
  time: string;
  pct: string;
  color: string;
  favColor: string;
}

export interface AiTrendItem {
  topic: string;
  queries: number;
  pct: string;
}

export interface AnalyticsOverviewData {
  avgDwellTimeSeconds: number;
  interact360Percentage: string;
  calculatorLoanPercentage: string;
  aiConsultantQueries: number;
  aiAverageLatencyMs: number;
  dwellByCar: CarDwellItem[];
  aiTrends: AiTrendItem[];
}

export const adminAnalyticsService = {
  getOverview: async (): Promise<AnalyticsOverviewData> => {
    const res = await axiosClient.get<{ success: boolean; data: AnalyticsOverviewData }>(
      API_CONFIG.ENDPOINTS.ADMIN.ANALYTICS
    );
    return (res as unknown as { data: AnalyticsOverviewData }).data;
  },
};
