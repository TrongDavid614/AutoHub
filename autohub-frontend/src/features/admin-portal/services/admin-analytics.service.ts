import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type { AnalyticsOverviewData } from '@/types/admin-analytics.types';

export const adminAnalyticsService = {
  getOverview: async (signal?: AbortSignal): Promise<AnalyticsOverviewData> => {
    const res = await axiosClient.get<unknown, ApiResponse<AnalyticsOverviewData>>(
      API_CONFIG.ENDPOINTS.ADMIN.ANALYTICS,
      { signal }
    );
    return res.data;
  },
};
