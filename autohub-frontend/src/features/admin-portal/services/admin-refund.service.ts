import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse, PageResponse } from '@/types/api.types';

export interface RefundItem {
  id: number;
  docketCode: string;
  depositCode: string;
  customerName: string;
  identityCardNumber?: string;
  car: string;
  amount: string;
  reason: string;
  deadlineStatus: string;
  staffVerifier: string;
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REFUNDED' | 'REJECTED';
  rejectionReason?: string;
  minhChungUrl?: string;
  submittedAt?: string;
  processedAt?: string;
}

export interface GetRefundParams {
  status?: string;
  page?: number;
  size?: number;
}

export interface RefundRiskAnalysisDto {
  refundId: number;
  docketCode: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number;
  hoursElapsed: number;
  within72Hours: boolean;
  priorRefundsCount: number;
  vinStatus: string;
  summary: string;
  recommendation: 'APPROVE' | 'REJECT' | 'MANUAL_AUDIT';
  latencyMs: number;
}

export const adminRefundService = {
  getRefundRequests: async (params?: GetRefundParams): Promise<PageResponse<RefundItem>> => {
    const queryParams: Record<string, string | number> = {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    };
    if (params?.status && params.status.trim()) {
      queryParams.status = params.status.trim();
    }
    const res = await axiosClient.get<ApiResponse<PageResponse<RefundItem>>>(
      API_CONFIG.ENDPOINTS.ADMIN.REFUNDS,
      { params: queryParams }
    );
    return (res as unknown as ApiResponse<PageResponse<RefundItem>>).data || {
      items: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 1,
      first: true,
      last: true,
    };
  },

  approveRefund: async (id: number): Promise<void> => {
    await axiosClient.post(`${API_CONFIG.ENDPOINTS.ADMIN.REFUNDS}/${id}/approve`);
  },

  rejectRefund: async (id: number, reason: string): Promise<void> => {
    const params = `?reason=${encodeURIComponent(reason.trim())}`;
    await axiosClient.post(`${API_CONFIG.ENDPOINTS.ADMIN.REFUNDS}/${id}/reject${params}`);
  },

  analyzeRisk: async (id: number): Promise<RefundRiskAnalysisDto> => {
    const res = await axiosClient.post<ApiResponse<RefundRiskAnalysisDto>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.REFUNDS}/${id}/ai-risk-analysis`
    );
    return (res as unknown as ApiResponse<RefundRiskAnalysisDto>).data;
  },
};
