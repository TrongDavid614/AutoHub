import type { RegisterRequest, User, LoginResponse } from '@/types/auth.types';

export const authService = {
  async register(data: RegisterRequest): Promise<User> {
    // Simulate real network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newUser: User = {
      id: Math.floor(1000 + Math.random() * 9000),
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      role: 'ROLE_CUSTOMER',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    return newUser;
  },

  async login(email: string): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      accessToken: `jwt_mock_token_${Date.now()}`,
      user: {
        id: 1,
        email,
        fullName: 'Nguyễn Văn An',
        phoneNumber: '0912345678',
        role: 'ROLE_CUSTOMER',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    };
  },
};
