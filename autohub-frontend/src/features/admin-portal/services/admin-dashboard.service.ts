import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type {
  AdminDashboardOverview,
  KpiMetric,
  RevenueDataPoint,
  RegionalRevenue,
  UrgentDeposit,
} from '@/types/admin-dashboard.types';
import {
  MOCK_DASHBOARD_KPIS,
  MOCK_REVENUE_CHART_30_DAYS,
  MOCK_REGIONAL_REVENUES,
  MOCK_URGENT_DEPOSITS,
} from '../mocks/dashboard.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const adminDashboardService = {
  async getDashboardOverview(signal?: AbortSignal): Promise<AdminDashboardOverview> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return {
        kpis: MOCK_DASHBOARD_KPIS,
        revenueChart: MOCK_REVENUE_CHART_30_DAYS,
        regionalRevenues: MOCK_REGIONAL_REVENUES,
        urgentDeposits: MOCK_URGENT_DEPOSITS,
      };
    }

    const res = await axiosClient.get<unknown, ApiResponse<AdminDashboardOverview>>(
      API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_OVERVIEW,
      { signal }
    );
    return res.data;
  },

  async getKpiMetrics(signal?: AbortSignal): Promise<KpiMetric[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_DASHBOARD_KPIS;
    }

    const res = await axiosClient.get<unknown, ApiResponse<KpiMetric[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_KPIS,
      { signal }
    );
    return res.data;
  },

  async getRevenueChart(range = '90D', signal?: AbortSignal): Promise<RevenueDataPoint[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_REVENUE_CHART_30_DAYS;
    }

    const res = await axiosClient.get<unknown, ApiResponse<RevenueDataPoint[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_REVENUE_CHART,
      {
        params: { range },
        signal,
      }
    );
    return res.data;
  },

  async getRegionalRevenues(signal?: AbortSignal): Promise<RegionalRevenue[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_REGIONAL_REVENUES;
    }

    const res = await axiosClient.get<unknown, ApiResponse<RegionalRevenue[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_REGIONAL,
      { signal }
    );
    return res.data;
  },

  async getUrgentDeposits(signal?: AbortSignal): Promise<UrgentDeposit[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_URGENT_DEPOSITS;
    }

    const res = await axiosClient.get<unknown, ApiResponse<UrgentDeposit[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_URGENT_DEPOSITS,
      { signal }
    );
    return res.data;
  },
};
