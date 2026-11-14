import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type {
  AdminCarMasterItem,
  CreateCarMasterPayload,
  UpdateCarMasterPayload,
  VectorSyncResult,
} from '@/types/car.types';

export interface BrandModelOption {
  brands: Array<{ id: number; tenHangXe: string }>;
  models: Array<{ id: number; tenDongXe: string; phanKhuc: string; hangXe?: { id: number } }>;
}

export const adminCarService = {
  async getCarMasterList(keyword?: string, brandId?: number): Promise<AdminCarMasterItem[]> {
    const params: Record<string, string | number> = {};
    if (keyword && keyword.trim()) {
      params.keyword = keyword.trim();
    }
    if (brandId) {
      params.brandId = brandId;
    }
    const res = await axiosClient.get<unknown, ApiResponse<AdminCarMasterItem[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.CARS,
      { params }
    );
    return res.data || [];
  },

  async getCarMasterById(id: number): Promise<AdminCarMasterItem> {
    const res = await axiosClient.get<unknown, ApiResponse<AdminCarMasterItem>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.CARS}/${id}`
    );
    return res.data;
  },

  async createCarMaster(payload: CreateCarMasterPayload): Promise<AdminCarMasterItem> {
    const res = await axiosClient.post<unknown, ApiResponse<AdminCarMasterItem>>(
      API_CONFIG.ENDPOINTS.ADMIN.CARS,
      payload
    );
    return res.data;
  },

  async updateCarMaster(id: number, payload: UpdateCarMasterPayload): Promise<AdminCarMasterItem> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminCarMasterItem>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.CARS}/${id}`,
      payload
    );
    return res.data;
  },

  async toggleCarStatus(id: number): Promise<AdminCarMasterItem> {
    const res = await axiosClient.patch<unknown, ApiResponse<AdminCarMasterItem>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.CARS}/${id}/toggle-status`
    );
    return res.data;
  },

  async deleteCarMaster(id: number): Promise<void> {
    await axiosClient.delete<unknown, ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.CARS}/${id}`
    );
  },

  async syncVectorDb(): Promise<VectorSyncResult> {
    const res = await axiosClient.post<unknown, ApiResponse<VectorSyncResult>>(
      API_CONFIG.ENDPOINTS.ADMIN.VECTOR_SYNC
    );
    return res.data;
  },

  async getBrandsAndModels(): Promise<BrandModelOption> {
    const res = await axiosClient.get<unknown, ApiResponse<BrandModelOption>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.CARS}/brands-and-models`
    );
    return res.data;
  },
};
