import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse, PageResponse } from '@/types/api.types';

export interface AdminVoucher {
  id: number;
  code: string;
  discountPercent?: number;
  maxDiscountAmount?: number;
  expiryDate?: string;
  active: boolean;
  statusText: 'Đang chạy' | 'Tạm dừng' | 'Đã hết hạn';
  expired: boolean;
}

export interface CreateVoucherPayload {
  code: string;
  discountPercent?: number;
  maxDiscountAmount?: number;
  expiryDate?: string;
  active?: boolean;
}

export interface UpdateVoucherPayload {
  discountPercent?: number;
  maxDiscountAmount?: number;
  expiryDate?: string;
  active?: boolean;
}

export interface GetVouchersParams {
  keyword?: string;
  page?: number;
  size?: number;
}

export const adminVoucherService = {
  async getVouchers(params?: GetVouchersParams, signal?: AbortSignal): Promise<PageResponse<AdminVoucher>> {
    const queryParams: Record<string, string | number> = {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    };
    if (params?.keyword && params.keyword.trim()) {
      queryParams.keyword = params.keyword.trim();
    }
    const res = await axiosClient.get<unknown, ApiResponse<PageResponse<AdminVoucher>>>(
      API_CONFIG.ENDPOINTS.ADMIN.VOUCHERS,
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

  async createVoucher(payload: CreateVoucherPayload): Promise<AdminVoucher> {
    const res = await axiosClient.post<unknown, ApiResponse<AdminVoucher>>(
      API_CONFIG.ENDPOINTS.ADMIN.VOUCHERS,
      payload
    );
    return res.data;
  },

  async updateVoucher(id: number, payload: UpdateVoucherPayload): Promise<AdminVoucher> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminVoucher>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.VOUCHERS}/${id}`,
      payload
    );
    return res.data;
  },

  async toggleStatus(id: number, active: boolean): Promise<AdminVoucher> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminVoucher>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.VOUCHERS}/${id}/status`,
      null,
      { params: { active } }
    );
    return res.data;
  },

  async deleteVoucher(id: number): Promise<void> {
    await axiosClient.delete<unknown, ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.VOUCHERS}/${id}`
    );
  },
};
