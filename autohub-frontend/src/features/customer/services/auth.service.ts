import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type { RegisterRequest, User, LoginResponse } from '@/types/auth.types';

export const authService = {
  async register(data: RegisterRequest): Promise<User> {
    const res = await axiosClient.post<unknown, ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      data
    );
    return res.data;
  },

  async login(emailOrUsername: string, password?: string): Promise<LoginResponse> {
    const res = await axiosClient.post<unknown, ApiResponse<LoginResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      {
        emailOrUsername: emailOrUsername.trim(),
        password: password || '',
      }
    );
    return res.data;
  },

  async getCurrentUser(signal?: AbortSignal): Promise<User> {
    const res = await axiosClient.get<unknown, ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.AUTH.ME,
      { signal }
    );
    return res.data;
  },
};
