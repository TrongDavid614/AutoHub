import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { RegisterRequest, User, LoginResponse } from '@/types/auth.types';

export const authService = {
  async register(data: RegisterRequest): Promise<User> {
    const res = await axiosClient.post<unknown, User>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
    return res;
  },

  async login(emailOrUsername: string, password?: string): Promise<LoginResponse> {
    // 100% dữ liệu thực từ CSDL SQL Server qua Spring Boot API /auth/login (không dùng Mock)
    const res = await axiosClient.post<unknown, LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      email: emailOrUsername,
      password: password || '',
    });
    return res;
  },
};
