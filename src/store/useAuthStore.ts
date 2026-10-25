import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, User } from '@/types/auth.types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const defaultDemoUser: User = {
  id: 8899,
  email: 'nguyenvana@gmail.com',
  fullName: 'Nguyễn Văn A',
  phoneNumber: '0912 345 678',
  identityCardNumber: '079090001234',
  role: 'ROLE_CUSTOMER',
  isActive: true,
  createdAt: '2026-01-15T08:00:00Z',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: defaultDemoUser,
      accessToken: 'demo-jwt-autohub-vip8899',
      role: 'ROLE_CUSTOMER',
      isAuthenticated: true,

      login: (token: string, user: User) =>
        set({
          accessToken: token,
          user,
          role: user.role,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
          role: null,
          isAuthenticated: false,
        }),

      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),
    }),
    {
      name: 'autohub_auth_session_v3',
    }
  )
);
