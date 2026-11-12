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
    await new Promise((resolve) => setTimeout(resolve, 400));
    const lower = emailOrUsername.toLowerCase().trim();

    let role: 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER' = 'ROLE_CUSTOMER';
    let id = 5;
    let fullName = 'Nguyễn Văn A';
    let phoneNumber = '0912345678';

    if (lower.includes('admin') || lower === 'admin@autohub.vn') {
      role = 'ROLE_ADMIN';
      id = 1;
      fullName = 'Trần Đức Nam (Admin)';
      phoneNumber = '0988888888';
    } else if (lower.includes('staff') || lower === 'tuan.nguyen@autohub.vn') {
      role = 'ROLE_STAFF';
      id = 2;
      fullName = 'Nguyễn Văn Tuấn';
      phoneNumber = '0977112233';
    } else if (lower === 'long.le@fpt.com') {
      role = 'ROLE_CUSTOMER';
      id = 8;
      fullName = 'Lê Hoàng Long';
      phoneNumber = '0977441223';
    } else if (lower === 'nam.tran@gmail.com') {
      role = 'ROLE_CUSTOMER';
      id = 6;
      fullName = 'Trần Hoàng Nam';
      phoneNumber = '0988123456';
    } else if (lower === 'thuy.nguyen@company.vn') {
      role = 'ROLE_CUSTOMER';
      id = 7;
      fullName = 'Nguyễn Bích Thủy';
      phoneNumber = '0903882119';
    } else if (lower === 'vana@gmail.com') {
      role = 'ROLE_CUSTOMER';
      id = 5;
      fullName = 'Nguyễn Văn A';
      phoneNumber = '0912345678';
    }

    return {
      accessToken: `jwt_mock_token_${role}_${Date.now()}`,
      user: {
        id,
        email: lower.includes('@') ? lower : `${lower}@autohub.vn`,
        fullName,
        phoneNumber,
        role,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    };
  },
};
