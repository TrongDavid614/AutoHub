import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';

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

export const adminRefundService = {
  getRefundRequests: async (status?: string): Promise<RefundItem[]> => {
    const params = status ? `?status=${status}` : '';
    const res = await axiosClient.get<ApiResponse<RefundItem[]>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.REFUNDS}${params}`
    );
    return (res as unknown as ApiResponse<RefundItem[]>).data || [];
  },

  approveRefund: async (id: number): Promise<void> => {
    await axiosClient.post(`${API_CONFIG.ENDPOINTS.ADMIN.REFUNDS}/${id}/approve`);
  },

  rejectRefund: async (id: number, reason: string): Promise<void> => {
    const params = `?reason=${encodeURIComponent(reason.trim())}`;
    await axiosClient.post(`${API_CONFIG.ENDPOINTS.ADMIN.REFUNDS}/${id}/reject${params}`);
  },
};
