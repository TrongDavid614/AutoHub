import { useState, useEffect, useCallback } from 'react';
import {
  adminVoucherService,
  type AdminVoucherItem,
  type CreateVoucherPayload,
} from '../services/admin-voucher.service';

export function useAdminVoucher() {
  const [vouchers, setVouchers] = useState<AdminVoucherItem[]>([]);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState<string>('0 ₫');
  const [appliedCount, setAppliedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminVoucherService.getVouchers();
      setVouchers(data.vouchers || []);
      setActiveCount(data.activeCount || 0);
      setTotalBudget(data.totalBudgetDisbursed || '450.000.000 ₫');
      setAppliedCount(data.totalAppliedCount || 0);
    } catch (err) {
      console.error('Failed to fetch vouchers:', err);
      setError('Không thể tải danh sách voucher từ máy chủ.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const toggleStatus = async (id: number) => {
    try {
      const newStatus = await adminVoucherService.toggleStatus(id);
      setVouchers((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                isActive: newStatus,
                status: newStatus ? 'Đang chạy' : 'Đã tạm dừng',
              }
            : item
        )
      );
      setActiveCount((prev) => (newStatus ? prev + 1 : Math.max(0, prev - 1)));
    } catch (err) {
      console.error('Failed to toggle voucher status:', err);
      throw err;
    }
  };

  const createVoucher = async (payload: CreateVoucherPayload) => {
    const newItem = await adminVoucherService.createVoucher(payload);
    setVouchers((prev) => [newItem, ...prev]);
    if (newItem.isActive) {
      setActiveCount((prev) => prev + 1);
    }
    return newItem;
  };

  return {
    vouchers,
    activeCount,
    totalBudget,
    appliedCount,
    loading,
    error,
    fetchVouchers,
    toggleStatus,
    createVoucher,
  };
}
