import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

export interface AdminVoucherItem {
  id: number;
  code: string;
  title: string;
  discountPercentage?: number;
  maxDiscount?: number;
  formattedDiscount: string;
  minOrderFormatted: string;
  usageCount: number;
  maxUsage: number;
  usagePercent: number;
  expiryDate?: string;
  isActive: boolean;
  status: string;
}

export interface VoucherListResponse {
  vouchers: AdminVoucherItem[];
  activeCount: number;
  totalVouchers: number;
  totalBudgetDisbursed: string;
  totalAppliedCount: number;
}

export interface CreateVoucherPayload {
  maVoucher: string;
  phanTramGiam?: number;
  giamToiDa?: number;
  ngayHetHan: string;
  dangHoatDong?: boolean;
}

export const adminVoucherService = {
  getVouchers: async () => {
    const res = await axiosClient.get<{ success: boolean; data: VoucherListResponse }>(
      API_CONFIG.ENDPOINTS.ADMIN.VOUCHERS
    );
    return (res as unknown as { data: VoucherListResponse }).data;
  },

  createVoucher: async (payload: CreateVoucherPayload) => {
    const res = await axiosClient.post<{ success: boolean; data: AdminVoucherItem }>(
      API_CONFIG.ENDPOINTS.ADMIN.VOUCHERS,
      payload
    );
    return (res as unknown as { data: AdminVoucherItem }).data;
  },

  updateVoucher: async (id: number, payload: Partial<CreateVoucherPayload>) => {
    const res = await axiosClient.put<{ success: boolean; data: AdminVoucherItem }>(
      `${API_CONFIG.ENDPOINTS.ADMIN.VOUCHERS}/${id}`,
      payload
    );
    return (res as unknown as { data: AdminVoucherItem }).data;
  },

  toggleStatus: async (id: number) => {
    const res = await axiosClient.patch<{ success: boolean; data: boolean }>(
      `${API_CONFIG.ENDPOINTS.ADMIN.VOUCHERS}/${id}/toggle-status`
    );
    return (res as unknown as { data: boolean }).data;
  },
};
