import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';

// DTO matching Spring Boot CustomerProfileController
export interface UpdateProfileRequest {
  customerId?: number;
  fullName: string;
  phoneNumber: string;
  identityCardNumber?: string;
}

export interface ChangePasswordRequest {
  customerId?: number;
  currentPassword: string;
  newPassword: string;
}

export interface ProfileResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  identityCardNumber?: string;
  avatarUrl?: string;
  role: string;
}

export const profileService = {
  /**
   * Lấy thông tin hồ sơ người dùng hiện tại
   */
  async getProfile(customerId?: number): Promise<ProfileResponse | null> {
    try {
      const url = customerId
        ? `${API_CONFIG.ENDPOINTS.PROFILE.BASE}?customerId=${customerId}`
        : API_CONFIG.ENDPOINTS.PROFILE.BASE;
      const res = await axiosClient.get<unknown, ApiResponse<ProfileResponse>>(url);
      return res?.data ?? null;
    } catch (err) {
      console.warn('[ProfileService] Lỗi khi lấy hồ sơ:', err);
      return null;
    }
  },

  /**
   * Cập nhật thông tin hồ sơ cá nhân
   */
  async updateProfile(payload: UpdateProfileRequest): Promise<boolean> {
    try {
      await axiosClient.put<unknown, ApiResponse<unknown>>(
        API_CONFIG.ENDPOINTS.PROFILE.BASE,
        payload
      );
      return true;
    } catch (err) {
      console.error('[ProfileService] Lỗi khi cập nhật hồ sơ:', err);
      return false;
    }
  },

  /**
   * Đổi mật khẩu tài khoản
   */
  async changePassword(payload: ChangePasswordRequest): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await axiosClient.put<unknown, ApiResponse<{ message?: string }>>(
        API_CONFIG.ENDPOINTS.PROFILE.PASSWORD,
        payload
      );
      return { success: true, message: res?.data?.message };
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message = axiosErr?.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.';
      console.error('[ProfileService] Lỗi khi đổi mật khẩu:', err);
      return { success: false, message };
    }
  },
};
