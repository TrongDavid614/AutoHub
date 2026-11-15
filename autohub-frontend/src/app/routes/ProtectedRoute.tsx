import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Role } from '@/types/auth.types';
import { useAuthStore } from '@/store/useAuthStore';

export interface ProtectedRouteProps {
  allowedRoles: Role[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, redirectTo }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);
  const location = useLocation();

  if (!isAuthenticated) {
    const targetRedirect =
      redirectTo ||
      (location.pathname.startsWith('/admin')
        ? '/admin/login'
        : location.pathname.startsWith('/staff')
        ? '/staff/login'
        : '/auth/login');

    return <Navigate to={targetRedirect} replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
