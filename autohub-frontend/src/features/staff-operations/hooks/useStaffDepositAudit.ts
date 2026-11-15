import { useState, useEffect, useCallback, useRef } from 'react';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { AvailableVinOption, StaffDepositRecord } from '@/types/staff.types';

export interface UseStaffDepositAuditReturn {
  deposits: StaffDepositRecord[];
  availableVins: AvailableVinOption[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchAvailableVins: (depositId?: string) => Promise<AvailableVinOption[]>;
  assignVin: (depositId: string, vinNumber: string) => Promise<string>;
  signContract: (depositId: string) => Promise<string>;
}

export const useStaffDepositAudit = (): UseStaffDepositAuditReturn => {
  const [deposits, setDeposits] = useState<StaffDepositRecord[]>([]);
  const [availableVins, setAvailableVins] = useState<AvailableVinOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const [depositsData, vinsData] = await Promise.all([
        staffService.getStaffDeposits(signal),
        staffService.getAvailableVins(undefined, signal),
      ]);
      setDeposits(depositsData);
      setAvailableVins(vinsData);
    } catch (err) {
      if (err instanceof Error && err.name === 'CanceledError') {
        return;
      }
      console.error('Lỗi nạp dữ liệu phiếu cọc hoặc VIN kho từ database:', err);
      setError('Không thể nạp dữ liệu phiếu cọc và số khung VIN từ SQL Server. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    Promise.all([
      staffService.getStaffDeposits(controller.signal),
      staffService.getAvailableVins(undefined, controller.signal),
    ])
      .then(([depositsData, vinsData]) => {
        if (isMounted) {
          setDeposits(depositsData);
          setAvailableVins(vinsData);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'CanceledError') {
          return;
        }
        if (isMounted) {
          console.error('Lỗi nạp dữ liệu phiếu cọc hoặc VIN kho từ database:', err);
          setError('Không thể nạp dữ liệu phiếu cọc và số khung VIN từ SQL Server. Vui lòng thử lại!');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const refetch = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const fetchAvailableVins = useCallback(async (depositId?: string): Promise<AvailableVinOption[]> => {
    try {
      const vins = await staffService.getAvailableVins(depositId);
      setAvailableVins(vins);
      return vins;
    } catch (err) {
      console.error('Lỗi nạp danh sách VIN khả dụng:', err);
      return [];
    }
  }, []);

  const assignVin = useCallback(async (depositId: string, vinNumber: string): Promise<string> => {
    const result = await staffService.assignVinToDeposit(depositId, vinNumber);
    // Update local state smoothly without full reload
    setDeposits((prev) =>
      prev.map((d) => (d.id === depositId ? { ...d, assignedVin: vinNumber, status: 'PAID' } : d))
    );
    // Refresh available VINs
    const updatedVins = await staffService.getAvailableVins();
    setAvailableVins(updatedVins);
    return result;
  }, []);

  const signContract = useCallback(async (depositId: string): Promise<string> => {
    const result = await staffService.signContract(depositId);
    setDeposits((prev) =>
      prev.map((d) => (d.id === depositId ? { ...d, status: 'COMPLETED' } : d))
    );
    return result;
  }, []);

  return {
    deposits,
    availableVins,
    isLoading,
    error,
    refetch,
    fetchAvailableVins,
    assignVin,
    signContract,
  };
};
