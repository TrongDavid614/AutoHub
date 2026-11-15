import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';

export interface AdminAccessory {
  id: number;
  sku: string;
  name: string;
  categoryId: number;
  categoryName: string;
  brand: string;
  price: number;
  stock: number;
  minThreshold: number;
  installationSpec?: string;
  imageUrl?: string;
  universal: boolean;
  active: boolean;
  stockStatus: 'Còn hàng' | 'Sắp hết hàng' | 'Hết hàng';
}

export interface AccessoryCategory {
  id: number;
  tenDanhMuc: string;
  dangHoatDong: boolean;
}

export interface CreateAccessoryPayload {
  name: string;
  categoryId: number;
  brand?: string;
  price: number;
  stock: number;
  installationSpec?: string;
  imageUrl?: string;
  universal?: boolean;
}

export interface UpdateAccessoryPayload {
  name?: string;
  categoryId?: number;
  brand?: string;
  price?: number;
  stock?: number;
  installationSpec?: string;
  imageUrl?: string;
  universal?: boolean;
  active?: boolean;
}

export const adminAccessoryService = {
  async getAccessories(params?: { keyword?: string; categoryId?: number; active?: boolean }, signal?: AbortSignal): Promise<AdminAccessory[]> {
    const res = await axiosClient.get<unknown, ApiResponse<AdminAccessory[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES,
      { params, signal }
    );
    return res.data || [];
  },

  async getCategories(signal?: AbortSignal): Promise<AccessoryCategory[]> {
    const res = await axiosClient.get<unknown, ApiResponse<AccessoryCategory[]>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES}/categories`,
      { signal }
    );
    return res.data || [];
  },

  async createAccessory(payload: CreateAccessoryPayload): Promise<AdminAccessory> {
    const res = await axiosClient.post<unknown, ApiResponse<AdminAccessory>>(
      API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES,
      payload
    );
    return res.data;
  },

  async updateAccessory(id: number, payload: UpdateAccessoryPayload): Promise<AdminAccessory> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminAccessory>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES}/${id}`,
      payload
    );
    return res.data;
  },

  async updateStock(id: number, stock: number): Promise<AdminAccessory> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminAccessory>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES}/${id}/stock`,
      null,
      { params: { stock } }
    );
    return res.data;
  },

  async updatePrice(id: number, price: number): Promise<AdminAccessory> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminAccessory>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES}/${id}/price`,
      null,
      { params: { price } }
    );
    return res.data;
  },

  async toggleStatus(id: number, active: boolean): Promise<AdminAccessory> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminAccessory>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES}/${id}/status`,
      null,
      { params: { active } }
    );
    return res.data;
  },
};
