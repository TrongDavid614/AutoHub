import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, User } from '../types/auth.types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      role: null,
      isAuthenticated: false,

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
      name: 'autohub_auth_state',
    }
  )
);
