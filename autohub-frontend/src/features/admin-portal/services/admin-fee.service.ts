import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse, PageResponse } from '@/types/api.types';
import type {
  AdminRegistrationFee,
  AdminBankLoan,
  CreateRegistrationFeePayload,
  UpdateRegistrationFeePayload,
  CreateBankLoanPayload,
  UpdateBankLoanPayload,
  FeeStats,
} from '@/types/fee.types';
import type { ProvinceOption } from '@/types/showroom.types';

export interface GetFeesParams {
  keyword?: string;
  page?: number;
  size?: number;
}

export const adminFeeService = {
  async getFees(params?: GetFeesParams, signal?: AbortSignal): Promise<PageResponse<AdminRegistrationFee>> {
    const queryParams: Record<string, string | number> = {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    };
    if (params?.keyword && params.keyword.trim()) {
      queryParams.keyword = params.keyword.trim();
    }
    const res = await axiosClient.get<unknown, ApiResponse<PageResponse<AdminRegistrationFee>>>(
      API_CONFIG.ENDPOINTS.ADMIN.FEE_TABLE,
      { params: queryParams, signal }
    );
    return res.data || {
      items: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 1,
      first: true,
      last: true,
    };
  },

  async createFee(payload: CreateRegistrationFeePayload): Promise<AdminRegistrationFee> {
    const res = await axiosClient.post<unknown, ApiResponse<AdminRegistrationFee>>(
      API_CONFIG.ENDPOINTS.ADMIN.FEE_TABLE,
      payload
    );
    return res.data;
  },

  async updateFee(id: number, payload: UpdateRegistrationFeePayload): Promise<AdminRegistrationFee> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminRegistrationFee>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.FEE_TABLE}/${id}`,
      payload
    );
    return res.data;
  },

  async deleteFee(id: number): Promise<void> {
    await axiosClient.delete<unknown, ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.FEE_TABLE}/${id}`
    );
  },

  async getLoans(signal?: AbortSignal): Promise<AdminBankLoan[]> {
    const res = await axiosClient.get<unknown, ApiResponse<AdminBankLoan[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.FEES_LOANS,
      { signal }
    );
    return res.data || [];
  },

  async createLoan(payload: CreateBankLoanPayload): Promise<AdminBankLoan> {
    const res = await axiosClient.post<unknown, ApiResponse<AdminBankLoan>>(
      API_CONFIG.ENDPOINTS.ADMIN.FEES_LOANS,
      payload
    );
    return res.data;
  },

  async updateLoan(id: number, payload: UpdateBankLoanPayload): Promise<AdminBankLoan> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminBankLoan>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.FEES_LOANS}/${id}`,
      payload
    );
    return res.data;
  },

  async toggleLoanStatus(id: number, active: boolean): Promise<AdminBankLoan> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminBankLoan>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.FEES_LOANS}/${id}/status`,
      null,
      { params: { active } }
    );
    return res.data;
  },

  async deleteLoan(id: number): Promise<void> {
    await axiosClient.delete<unknown, ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.FEES_LOANS}/${id}`
    );
  },

  async getStats(signal?: AbortSignal): Promise<FeeStats> {
    const res = await axiosClient.get<unknown, ApiResponse<FeeStats>>(
      API_CONFIG.ENDPOINTS.ADMIN.FEES_STATS,
      { signal }
    );
    return (
      res.data || {
        totalProvinces: 0,
        configuredProvinces: 0,
        avgRegistrationTaxRate: 10.0,
        evTaxRate: 0.0,
        totalBankPartners: 0,
        lowestInterestRate: 6.8,
        maxLtv: 85,
      }
    );
  },

  async getProvinces(signal?: AbortSignal): Promise<ProvinceOption[]> {
    const res = await axiosClient.get<unknown, ApiResponse<ProvinceOption[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS_PROVINCES,
      { signal }
    );
    return res.data || [];
  },
};
