import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

export interface AdminAccessoryItem {
  id: number;
  sku: string;
  name: string;
  categoryId: number | null;
  categoryName: string;
  brand: string;
  price: number;
  stock: number;
  minThreshold: number;
  status: string;
  imageUrl?: string;
  installationGuide?: string;
  isUniversal: boolean;
  isActive: boolean;
}

export interface AccessoryCategoryItem {
  id: number;
  tenDanhMuc: string;
  dangHoatDong: boolean;
}

export interface CreateAccessoryPayload {
  tenPhuKien: string;
  danhMucId: number;
  thuongHieu?: string;
  giaBan: number;
  soLuongTon: number;
  quyCachLapDat?: string;
  hinhAnh?: string;
  dungChung?: boolean;
}

export interface UpdateAccessoryPayload {
  tenPhuKien?: string;
  danhMucId?: number;
  thuongHieu?: string;
  giaBan?: number;
  soLuongTon?: number;
  quyCachLapDat?: string;
  hinhAnh?: string;
  dungChung?: boolean;
  dangHoatDong?: boolean;
}

export const adminAccessoryService = {
  getAccessories: async (params?: { search?: string; categoryId?: number; lowStock?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.categoryId) query.append('categoryId', params.categoryId.toString());
    if (params?.lowStock) query.append('lowStock', 'true');

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await axiosClient.get<{ success: boolean; data: AdminAccessoryItem[] }>(
      `${API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES}${qs}`
    );
    return (res as unknown as { data: AdminAccessoryItem[] }).data;
  },

  getCategories: async () => {
    const res = await axiosClient.get<{ success: boolean; data: AccessoryCategoryItem[] }>(
      `${API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES}/categories`
    );
    return (res as unknown as { data: AccessoryCategoryItem[] }).data;
  },

  createAccessory: async (payload: CreateAccessoryPayload) => {
    const res = await axiosClient.post<{ success: boolean; data: AdminAccessoryItem }>(
      API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES,
      payload
    );
    return (res as unknown as { data: AdminAccessoryItem }).data;
  },

  updateAccessory: async (id: number, payload: UpdateAccessoryPayload) => {
    const res = await axiosClient.put<{ success: boolean; data: AdminAccessoryItem }>(
      `${API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES}/${id}`,
      payload
    );
    return (res as unknown as { data: AdminAccessoryItem }).data;
  },

  toggleStatus: async (id: number) => {
    const res = await axiosClient.patch<{ success: boolean; data: boolean }>(
      `${API_CONFIG.ENDPOINTS.ADMIN.ACCESSORIES}/${id}/toggle-status`
    );
    return (res as unknown as { data: boolean }).data;
  },
};
