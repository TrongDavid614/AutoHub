import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type {
  FeeOverviewData,
  RegistrationFee,
  UpdateRegistrationFeePayload,
  BatchUpdateFeePayload,
} from '@/types/admin-fee.types';

export const adminFeeService = {
  async getOverview(signal?: AbortSignal): Promise<FeeOverviewData> {
    const res = await axiosClient.get<unknown, ApiResponse<FeeOverviewData>>(
      API_CONFIG.ENDPOINTS.ADMIN.FEE_TABLE,
      { signal }
    );
    return (
      res.data || {
        provincialFees: [],
        bankLoans: [],
      }
    );
  },

  async updateFee(
    id: number,
    payload: UpdateRegistrationFeePayload
  ): Promise<RegistrationFee> {
    const res = await axiosClient.put<unknown, ApiResponse<RegistrationFee>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.FEE_TABLE}/${id}`,
      payload
    );
    return res.data;
  },

  async batchUpdateFees(
    payload: BatchUpdateFeePayload
  ): Promise<FeeOverviewData> {
    const res = await axiosClient.post<unknown, ApiResponse<FeeOverviewData>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.FEE_TABLE}/batch-update`,
      payload
    );
    return (
      res.data || {
        provincialFees: [],
        bankLoans: [],
      }
    );
  },
};
