import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse, PageResponse } from '@/types/api.types';
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

export interface GetCarMasterParams {
  keyword?: string;
  brandId?: number;
  page?: number;
  size?: number;
}

export const adminCarService = {
  async getCarMasterList(params?: GetCarMasterParams): Promise<PageResponse<AdminCarMasterItem>> {
    const queryParams: Record<string, string | number> = {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    };
    if (params?.keyword && params.keyword.trim()) {
      queryParams.keyword = params.keyword.trim();
    }
    if (params?.brandId) {
      queryParams.brandId = params.brandId;
    }
    const res = await axiosClient.get<unknown, ApiResponse<PageResponse<AdminCarMasterItem>>>(
      API_CONFIG.ENDPOINTS.ADMIN.CARS,
      { params: queryParams }
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
