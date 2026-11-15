import { useState, useEffect, useCallback, useRef } from 'react';
import type { AdminDashboardOverview } from '@/types/admin-dashboard.types';
import { adminDashboardService } from '../services/admin-dashboard.service';

export interface UseAdminDashboardReturn {
  overview: AdminDashboardOverview | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAdminDashboard = (): UseAdminDashboardReturn => {
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Abort previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);
      const data = await adminDashboardService.getDashboardOverview(controller.signal);
      setOverview(data);
    } catch (err: unknown) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'CanceledError') {
        return;
      }
      const message =
        err instanceof Error
          ? err.message
          : 'Không thể tải dữ liệu Bảng Điều Khiển Admin. Vui lòng kiểm tra kết nối máy chủ.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return {
    overview,
    isLoading,
    error,
    refetch: fetchData,
  };
};
