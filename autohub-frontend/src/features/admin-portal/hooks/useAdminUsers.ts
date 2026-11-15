import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  AdminUser,
  AdminUserStats,
  UpdateUserRolePayload,
  CreateStaffUserPayload,
  VaiTroNguoiDung,
  TrangThaiTaiKhoan,
} from '@/types/admin-user.types';
import { adminUserService } from '../services/admin-user.service';

export interface UseAdminUsersReturn {
  users: AdminUser[];
  stats: AdminUserStats | null;
  isLoading: boolean;
  error: string | null;
  keyword: string;
  roleFilter: VaiTroNguoiDung | 'ALL';
  statusFilter: TrangThaiTaiKhoan | 'ALL';
  toastMessage: string | null;
  setKeyword: (kw: string) => void;
  setRoleFilter: (role: VaiTroNguoiDung | 'ALL') => void;
  setStatusFilter: (st: TrangThaiTaiKhoan | 'ALL') => void;
  refetch: () => Promise<void>;
  toggleStatus: (id: number) => Promise<boolean>;
  updateRole: (id: number, payload: UpdateUserRolePayload) => Promise<boolean>;
  createUser: (payload: CreateStaffUserPayload) => Promise<boolean>;
  clearToast: () => void;
}

export const useAdminUsers = (): UseAdminUsersReturn => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminUserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<VaiTroNguoiDung | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<TrangThaiTaiKhoan | 'ALL'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      const params = {
        keyword: keyword.trim() || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      };

      const [userList, userStats] = await Promise.all([
        adminUserService.getUsers(params, controller.signal),
        adminUserService.getUserStats(controller.signal),
      ]);

      setUsers(userList);
      setStats(userStats);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'CanceledError') {
        return;
      }
      const message =
        err instanceof Error
          ? err.message
          : 'Không thể tải danh sách tài khoản người dùng. Vui lòng thử lại.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [keyword, roleFilter, statusFilter]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const toggleStatus = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        const updated = await adminUserService.toggleUserStatus(id);
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        setToastMessage(
          updated.dangHoatDong
            ? `Đã kích hoạt lại tài khoản ${updated.hoTen} (${updated.email})`
            : `Đã khóa tài khoản ${updated.hoTen} (${updated.email})`
        );
        // Refresh stats
        const newStats = await adminUserService.getUserStats();
        setStats(newStats);
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Thao tác khóa/mở tài khoản thất bại';
        setError(msg);
        return false;
      }
    },
    []
  );

  const updateRole = useCallback(
    async (id: number, payload: UpdateUserRolePayload): Promise<boolean> => {
      try {
        const updated = await adminUserService.updateUserRole(id, payload);
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        setToastMessage(`Đã cập nhật vai trò của ${updated.hoTen} thành: ${updated.vaiTroLabel}`);
        // Refresh stats
        const newStats = await adminUserService.getUserStats();
        setStats(newStats);
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Cập nhật vai trò phân quyền thất bại';
        setError(msg);
        return false;
      }
    },
    []
  );

  const createUser = useCallback(
    async (payload: CreateStaffUserPayload): Promise<boolean> => {
      try {
        const created = await adminUserService.createStaffUser(payload);
        setToastMessage(`Tạo tài khoản thành công cho nhân sự: ${created.hoTen} (${created.email})`);
        await fetchData();
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Tạo tài khoản người dùng thất bại';
        setError(msg);
        return false;
      }
    },
    [fetchData]
  );

  return {
    users,
    stats,
    isLoading,
    error,
    keyword,
    roleFilter,
    statusFilter,
    toastMessage,
    setKeyword,
    setRoleFilter,
    setStatusFilter,
    refetch: fetchData,
    toggleStatus,
    updateRole,
    createUser,
    clearToast,
  };
};
