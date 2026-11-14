import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type {
  AdminUser,
  AdminUserStats,
  UpdateUserRolePayload,
  CreateStaffUserPayload,
  VaiTroNguoiDung,
  TrangThaiTaiKhoan,
} from '@/types/admin-user.types';

export interface GetUsersParams {
  keyword?: string;
  role?: VaiTroNguoiDung;
  status?: TrangThaiTaiKhoan;
}

export const adminUserService = {
  async getUsers(params?: GetUsersParams, signal?: AbortSignal): Promise<AdminUser[]> {
    const queryParams: Record<string, string> = {};
    if (params?.keyword && params.keyword.trim()) {
      queryParams.keyword = params.keyword.trim();
    }
    if (params?.role) {
      queryParams.role = params.role;
    }
    if (params?.status) {
      queryParams.status = params.status;
    }

    const res = await axiosClient.get<unknown, ApiResponse<AdminUser[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.USERS,
      {
        params: queryParams,
        signal,
      }
    );
    return res.data || [];
  },

  async getUserStats(signal?: AbortSignal): Promise<AdminUserStats> {
    const res = await axiosClient.get<unknown, ApiResponse<AdminUserStats>>(
      API_CONFIG.ENDPOINTS.ADMIN.USERS_STATS,
      { signal }
    );
    return res.data;
  },

  async getUserById(id: number, signal?: AbortSignal): Promise<AdminUser> {
    const res = await axiosClient.get<unknown, ApiResponse<AdminUser>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.USERS}/${id}`,
      { signal }
    );
    return res.data;
  },

  async toggleUserStatus(id: number): Promise<AdminUser> {
    const res = await axiosClient.patch<unknown, ApiResponse<AdminUser>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.USERS}/${id}/toggle-status`
    );
    return res.data;
  },

  async updateUserRole(id: number, payload: UpdateUserRolePayload): Promise<AdminUser> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminUser>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.USERS}/${id}/role`,
      payload
    );
    return res.data;
  },

  async createStaffUser(payload: CreateStaffUserPayload): Promise<AdminUser> {
    const res = await axiosClient.post<unknown, ApiResponse<AdminUser>>(
      API_CONFIG.ENDPOINTS.ADMIN.USERS,
      payload
    );
    return res.data;
  },
};
