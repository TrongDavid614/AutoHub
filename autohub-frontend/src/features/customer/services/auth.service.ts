import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type {
  RegisterRequest,
  User,
  LoginResponse,
  VerifyOtpResponse,
  ResetPasswordRequest,
} from '@/types/auth.types';

export const authService = {
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const res = await axiosClient.post<unknown, ApiResponse<LoginResponse>>(
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

  async forgotPassword(email: string): Promise<string> {
    const res = await axiosClient.post<unknown, ApiResponse<string>>(
      API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email: email.trim().toLowerCase() }
    );
    return res.data || res.message;
  },

  async verifyOtp(email: string, otp: string): Promise<VerifyOtpResponse> {
    const res = await axiosClient.post<unknown, ApiResponse<VerifyOtpResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP,
      {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      }
    );
    return res.data;
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<string> {
    const res = await axiosClient.post<unknown, ApiResponse<string>>(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      payload
    );
    return res.data || res.message;
  },
};
