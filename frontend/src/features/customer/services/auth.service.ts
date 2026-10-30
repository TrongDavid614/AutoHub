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

  async login(emailOrUsername: string, _password?: string): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const lower = emailOrUsername.toLowerCase().trim();

    let role: 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER' = 'ROLE_CUSTOMER';
    let fullName = 'Khách Hàng Thân Thiết';

    if (lower.includes('admin')) {
      role = 'ROLE_ADMIN';
      fullName = 'Trần Quản Trị (Admin Master)';
    } else if (lower.includes('staff')) {
      role = 'ROLE_STAFF';
      fullName = 'Lê Văn Vận Hành (Staff Ops)';
    } else {
      fullName = 'Nguyễn Văn An';
    }

    return {
      accessToken: `jwt_mock_token_${role}_${Date.now()}`,
      user: {
        id: role === 'ROLE_ADMIN' ? 999 : role === 'ROLE_STAFF' ? 888 : 1,
        email: lower.includes('@') ? lower : `${lower}@autohub.vn`,
        fullName,
        phoneNumber: '0912345678',
        role,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    };
  },
};
