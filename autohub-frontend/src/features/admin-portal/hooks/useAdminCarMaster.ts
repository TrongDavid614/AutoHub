import { useState, useEffect, useCallback } from 'react';
import { adminCarService } from '../services/admin-car.service';
import type {
  AdminCarMasterItem,
  CreateCarMasterPayload,
  UpdateCarMasterPayload,
  VectorSyncResult,
} from '@/types/car.types';

export const useAdminCarMaster = () => {
  const [cars, setCars] = useState<AdminCarMasterItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<VectorSyncResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const fetchCars = useCallback(
    async (currentPage = page, currentSize = pageSize, keyword = search, brandId = selectedBrandId) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await adminCarService.getCarMasterList({
          keyword,
          brandId,
          page: currentPage,
          size: currentSize,
        });
        setCars(data.items ?? []);
        setPage(data.page ?? 0);
        setPageSize(data.size ?? 10);
        setTotalElements(data.totalElements ?? 0);
        setTotalPages(data.totalPages ?? 1);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ backend';
        setError(msg);
        showToast('Lỗi tải danh mục xe: ' + msg, 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, search, selectedBrandId, showToast]
  );

  useEffect(() => {
    fetchCars(0, pageSize, search, selectedBrandId);
  }, [search, selectedBrandId]); // Reset to page 0 on search/filter change

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchCars(newPage, pageSize, search, selectedBrandId);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
    fetchCars(0, newSize, search, selectedBrandId);
  };

  const handleSyncVector = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    try {
      const res = await adminCarService.syncVectorDb();
      setSyncResult(res);
      setSyncSuccess(true);
      showToast(res.message || 'Đã đồng bộ vector database cho AI thành công', 'success');
      await fetchCars(page, pageSize, search, selectedBrandId);
      setTimeout(() => setSyncSuccess(false), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi đồng bộ vector database';
      showToast(msg, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleStatus = async (variantId: number) => {
    try {
      const updated = await adminCarService.toggleCarStatus(variantId);
      setCars((prev) =>
        prev.map((c) => (c.variantId === variantId ? updated : c))
      );
      showToast(
        updated.active
          ? `Đã mở bán lại phiên bản: ${updated.version}`
          : `Đã tạm ngừng mở bán phiên bản: ${updated.version}`,
        'success'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi chuyển trạng thái xe';
      showToast(msg, 'error');
    }
  };

  const handleDeleteCar = async (variantId: number, carName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa phiên bản "${carName}" khỏi danh mục?`)) {
      return;
    }
    try {
      await adminCarService.deleteCarMaster(variantId);
      showToast(`Đã xóa thành công phiên bản "${carName}"`, 'success');
      await fetchCars(page, pageSize, search, selectedBrandId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi xóa cấu hình xe';
      showToast(msg, 'error');
    }
  };

  const handleCreateCar = async (payload: CreateCarMasterPayload): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const created = await adminCarService.createCarMaster(payload);
      showToast(`Đã thêm mới thành công: ${created.name} - ${created.version}`, 'success');
      await fetchCars(0, pageSize, search, selectedBrandId);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi thêm mới dòng xe';
      showToast(msg, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCar = async (id: number, payload: UpdateCarMasterPayload): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const updated = await adminCarService.updateCarMaster(id, payload);
      setCars((prev) => prev.map((c) => (c.variantId === id ? updated : c)));
      showToast(`Đã cập nhật thành công: ${updated.name} - ${updated.version}`, 'success');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi cập nhật cấu hình xe';
      showToast(msg, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    cars,
    filteredCars: cars,
    isLoading,
    error,
    search,
    setSearch,
    selectedBrandId,
    setSelectedBrandId,
    page,
    pageSize,
    totalElements,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    isSyncing,
    syncSuccess,
    syncResult,
    toastMessage,
    toastType,
    isSubmitting,
    fetchCars,
    handleSyncVector,
    handleToggleStatus,
    handleDeleteCar,
    handleCreateCar,
    handleUpdateCar,
    setToastMessage,
  };
};
