import { useState, useEffect, useCallback } from 'react';
import { adminFeeService } from '../services/admin-fee.service';
import type {
  AdminRegistrationFee,
  AdminBankLoan,
  CreateRegistrationFeePayload,
  UpdateRegistrationFeePayload,
  CreateBankLoanPayload,
  UpdateBankLoanPayload,
  FeeStats,
} from '@/types/fee.types';
import type { ProvinceOption } from '@/types/showroom.types';

export const useAdminFees = () => {
  const [activeTab, setActiveTab] = useState<'fees' | 'loans'>('fees');
  const [fees, setFees] = useState<AdminRegistrationFee[]>([]);
  const [loans, setLoans] = useState<AdminBankLoan[]>([]);
  const [stats, setStats] = useState<FeeStats>({
    totalProvinces: 0,
    configuredProvinces: 0,
    avgRegistrationTaxRate: 10.0,
    evTaxRate: 0.0,
    totalBankPartners: 0,
    lowestInterestRate: 6.8,
    maxLtv: 85,
  });
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modals
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<AdminRegistrationFee | null>(null);

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<AdminBankLoan | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);

  const fetchFees = useCallback(
    async (currentPage = page, currentSize = pageSize, kw = keyword) => {
      try {
        const pagedData = await adminFeeService.getFees({
          page: currentPage,
          size: currentSize,
          keyword: kw,
        });
        setFees(pagedData.items ?? []);
        setPage(pagedData.page ?? 0);
        setPageSize(pagedData.size ?? 10);
        setTotalElements(pagedData.totalElements ?? 0);
        setTotalPages(pagedData.totalPages ?? 1);
      } catch (err: unknown) {
        console.warn('Could not fetch registration fees:', err);
      }
    },
    [page, pageSize, keyword]
  );

  const fetchLoans = useCallback(async () => {
    try {
      const data = await adminFeeService.getLoans();
      setLoans(data);
    } catch (err: unknown) {
      console.warn('Could not fetch bank loans:', err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminFeeService.getStats();
      setStats(data);
    } catch (err: unknown) {
      console.warn('Could not fetch fee stats:', err);
    }
  }, []);

  const fetchProvinces = useCallback(async () => {
    try {
      const data = await adminFeeService.getProvinces();
      setProvinces(data);
    } catch (err: unknown) {
      console.warn('Could not fetch provinces:', err);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchFees(page, pageSize, keyword), fetchLoans(), fetchStats(), fetchProvinces()]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi tải dữ liệu biểu phí';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFees, fetchLoans, fetchStats, fetchProvinces, page, pageSize, keyword, showToast]);

  useEffect(() => {
    loadAll();
  }, [keyword]); // Refetch on search change

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchFees(newPage, pageSize, keyword);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
    fetchFees(0, newSize, keyword);
  };

  // Fee modal actions
  const openCreateFeeModal = () => {
    setEditingFee(null);
    setIsFeeModalOpen(true);
  };

  const openEditFeeModal = (fee: AdminRegistrationFee) => {
    setEditingFee(fee);
    setIsFeeModalOpen(true);
  };

  const closeFeeModal = () => {
    setIsFeeModalOpen(false);
    setEditingFee(null);
  };

  const handleSaveFee = async (
    payload: CreateRegistrationFeePayload | UpdateRegistrationFeePayload,
    isEdit: boolean = Boolean(editingFee)
  ) => {
    setIsSubmitting(true);
    try {
      if (isEdit && editingFee) {
        await adminFeeService.updateFee(editingFee.id, payload as UpdateRegistrationFeePayload);
        showToast('Cập nhật biểu phí lăn bánh thành công');
      } else {
        await adminFeeService.createFee(payload as CreateRegistrationFeePayload);
        showToast('Thêm mới biểu phí lăn bánh thành công');
      }
      closeFeeModal();
      await fetchFees(page, pageSize, keyword);
      await fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lưu biểu phí';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFee = async (id: number, provinceName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa biểu phí lăn bánh của ${provinceName}?`)) {
      return;
    }
    try {
      await adminFeeService.deleteFee(id);
      showToast(`Đã xóa biểu phí của ${provinceName} thành công`);
      await fetchFees(page, pageSize, keyword);
      await fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể xóa biểu phí';
      showToast(msg, 'error');
    }
  };

  // Loan modal actions
  const openCreateLoanModal = () => {
    setEditingLoan(null);
    setIsLoanModalOpen(true);
  };

  const openEditLoanModal = (loan: AdminBankLoan) => {
    setEditingLoan(loan);
    setIsLoanModalOpen(true);
  };

  const closeLoanModal = () => {
    setIsLoanModalOpen(false);
    setEditingLoan(null);
  };

  const handleSaveLoan = async (
    payload: CreateBankLoanPayload | UpdateBankLoanPayload,
    isEdit: boolean = Boolean(editingLoan)
  ) => {
    setIsSubmitting(true);
    try {
      if (isEdit && editingLoan) {
        await adminFeeService.updateLoan(editingLoan.id, payload as UpdateBankLoanPayload);
        showToast(`Cập nhật gói vay ${editingLoan.bankName} thành công`);
      } else {
        await adminFeeService.createLoan(payload as CreateBankLoanPayload);
        showToast('Thêm mới đối tác gói vay thành công');
      }
      closeLoanModal();
      await fetchLoans();
      await fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lưu gói vay';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLoanStatus = async (id: number, currentActive: boolean) => {
    try {
      const updated = await adminFeeService.toggleLoanStatus(id, !currentActive);
      showToast(`Đã ${updated.active ? 'kích hoạt' : 'tạm dừng'} gói vay ${updated.bankName}`);
      await fetchLoans();
      await fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái';
      showToast(msg, 'error');
    }
  };

  const handleDeleteLoan = async (id: number, bankName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa gói vay liên kết với ${bankName}?`)) {
      return;
    }
    try {
      await adminFeeService.deleteLoan(id);
      showToast(`Đã xóa gói vay ${bankName} thành công`);
      await fetchLoans();
      await fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể xóa gói vay';
      showToast(msg, 'error');
    }
  };

  return {
    activeTab,
    setActiveTab,
    fees,
    loans,
    stats,
    provinces,
    isLoading,
    error,
    keyword,
    setKeyword,
    page,
    pageSize,
    totalElements,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    toastMessage,
    toastType,
    isSubmitting,
    isFeeModalOpen,
    editingFee,
    isLoanModalOpen,
    editingLoan,
    loadAll,
    openCreateFeeModal,
    openEditFeeModal,
    closeFeeModal,
    handleSaveFee,
    handleDeleteFee,
    openCreateLoanModal,
    openEditLoanModal,
    closeLoanModal,
    handleSaveLoan,
    handleToggleLoanStatus,
    handleDeleteLoan,
  };
};
