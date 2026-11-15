import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminShowroomService } from '../services/admin-showroom.service';
import type {
  AdminShowroomItem,
  AdminShowroomDetail,
  AdminShowroomStats,
  ProvinceOption,
  CreateShowroomPayload,
  UpdateShowroomPayload,
  CreateDemoCarPayload,
} from '@/types/showroom.types';

export const useAdminShowrooms = () => {
  const [showrooms, setShowrooms] = useState<AdminShowroomItem[]>([]);
  const [stats, setStats] = useState<AdminShowroomStats>({
    totalShowrooms: 0,
    activeShowrooms: 0,
    inactiveShowrooms: 0,
    totalDemoFleet: 0,
    readyDemoFleet: 0,
    totalPhysicalInventory: 0,
    totalReservedInventory: 0,
    totalStaff: 0,
    regionDistribution: {},
  });
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals & details
  const [isCreateOrEditModalOpen, setIsCreateOrEditModalOpen] = useState<boolean>(false);
  const [editingShowroom, setEditingShowroom] = useState<AdminShowroomItem | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedShowroomDetail, setSelectedShowroomDetail] = useState<AdminShowroomDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);

  const fetchShowrooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminShowroomService.getShowrooms();
      setShowrooms(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ';
      setError(msg);
      showToast('Lỗi tải danh sách showroom: ' + msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const data = await adminShowroomService.getShowroomStats();
      setStats(data);
    } catch (err: unknown) {
      console.warn('Could not fetch showroom stats:', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const fetchProvinces = useCallback(async () => {
    try {
      const data = await adminShowroomService.getProvinces();
      setProvinces(data);
    } catch (err: unknown) {
      console.warn('Could not fetch provinces:', err);
    }
  }, []);

  useEffect(() => {
    fetchShowrooms();
    fetchStats();
    fetchProvinces();
  }, [fetchShowrooms, fetchStats, fetchProvinces]);

  // Filtered showrooms list on client
  const filteredShowrooms = useMemo(() => {
    return showrooms.filter((sr) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchName = sr.name.toLowerCase().includes(q);
        const matchCode = sr.code.toLowerCase().includes(q);
        const matchAddress = sr.address.toLowerCase().includes(q);
        const matchHotline = sr.hotline.toLowerCase().includes(q);
        const matchProvince = sr.provinceName.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchAddress && !matchHotline && !matchProvince) return false;
      }
      if (selectedRegion !== 'ALL') {
        if (sr.region !== selectedRegion) return false;
      }
      if (selectedStatus !== 'ALL') {
        const isAct = selectedStatus === 'ACTIVE';
        if (sr.active !== isAct) return false;
      }
      return true;
    });
  }, [showrooms, search, selectedRegion, selectedStatus]);

  // Open Detail
  const openDetail = async (id: number) => {
    setIsDetailModalOpen(true);
    setIsLoadingDetail(true);
    try {
      const detail = await adminShowroomService.getShowroomDetail(id);
      setSelectedShowroomDetail(detail);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải chi tiết showroom';
      showToast(msg, 'error');
      setIsDetailModalOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const closeDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedShowroomDetail(null);
  };

  // Create / Edit modal
  const openCreateModal = () => {
    setEditingShowroom(null);
    setIsCreateOrEditModalOpen(true);
  };

  const openEditModal = (showroom: AdminShowroomItem) => {
    setEditingShowroom(showroom);
    setIsCreateOrEditModalOpen(true);
  };

  const closeCreateOrEditModal = () => {
    setIsCreateOrEditModalOpen(false);
    setEditingShowroom(null);
  };

  const handleSaveShowroom = async (payload: CreateShowroomPayload | UpdateShowroomPayload) => {
    setIsSubmitting(true);
    try {
      if (editingShowroom) {
        await adminShowroomService.updateShowroom(editingShowroom.id, payload);
        showToast(`Đã cập nhật showroom "${payload.name || editingShowroom.name}" thành công`);
      } else {
        await adminShowroomService.createShowroom(payload as CreateShowroomPayload);
        showToast(`Đã thêm showroom mới "${payload.name}" vào mạng lưới thành công`);
      }
      closeCreateOrEditModal();
      await fetchShowrooms();
      await fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi xử lý dữ liệu showroom';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: number, currentActive: boolean) => {
    try {
      const updated = await adminShowroomService.toggleStatus(id, !currentActive);
      showToast(
        `Đã ${updated.active ? 'kích hoạt hoạt động' : 'tạm dừng hoạt động'} showroom ${updated.name}`
      );
      await fetchShowrooms();
      await fetchStats();
      if (selectedShowroomDetail && selectedShowroomDetail.showroom.id === id) {
        setSelectedShowroomDetail((prev) =>
          prev ? { ...prev, showroom: { ...prev.showroom, active: updated.active } } : null
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái';
      showToast(msg, 'error');
    }
  };

  const handleDeleteShowroom = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa showroom "${name}" khỏi hệ thống?`)) {
      return;
    }
    try {
      await adminShowroomService.deleteShowroom(id);
      showToast(`Đã xóa showroom "${name}" thành công`);
      await fetchShowrooms();
      await fetchStats();
      if (selectedShowroomDetail && selectedShowroomDetail.showroom.id === id) {
        closeDetail();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể xóa showroom';
      showToast(msg, 'error');
    }
  };

  const handleAddDemoCar = async (showroomId: number, payload: CreateDemoCarPayload) => {
    setIsSubmitting(true);
    try {
      const newCar = await adminShowroomService.addDemoCar(showroomId, payload);
      showToast(`Đã gán xe demo biển số ${newCar.licensePlate} vào showroom thành công`);
      // Refresh detail and stats
      if (selectedShowroomDetail && selectedShowroomDetail.showroom.id === showroomId) {
        setSelectedShowroomDetail((prev) =>
          prev
            ? {
                ...prev,
                demoCars: [newCar, ...prev.demoCars],
                showroom: {
                  ...prev.showroom,
                  demoFleet: prev.showroom.demoFleet + 1,
                  demoFleetReady:
                    newCar.status === 'SAN_SANG'
                      ? prev.showroom.demoFleetReady + 1
                      : prev.showroom.demoFleetReady,
                },
              }
            : null
        );
      }
      await fetchShowrooms();
      await fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi thêm xe demo';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDemoCarStatus = async (
    showroomId: number,
    demoCarId: number,
    newStatus: string,
    odo?: number
  ) => {
    try {
      await adminShowroomService.updateDemoCarStatus(showroomId, demoCarId, newStatus, odo);
      showToast('Đã cập nhật trạng thái xe demo thành công');
      // Update local detail state
      if (selectedShowroomDetail && selectedShowroomDetail.showroom.id === showroomId) {
        setSelectedShowroomDetail((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            demoCars: prev.demoCars.map((dc) =>
              dc.id === demoCarId
                ? { ...dc, status: newStatus, currentOdo: odo !== undefined ? odo : dc.currentOdo }
                : dc
            ),
          };
        });
      }
      await fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái xe demo';
      showToast(msg, 'error');
    }
  };

  return {
    showrooms,
    filteredShowrooms,
    stats,
    provinces,
    isLoading,
    isStatsLoading,
    error,
    search,
    setSearch,
    selectedRegion,
    setSelectedRegion,
    selectedStatus,
    setSelectedStatus,
    isCreateOrEditModalOpen,
    editingShowroom,
    isDetailModalOpen,
    selectedShowroomDetail,
    isLoadingDetail,
    isSubmitting,
    toastMessage,
    toastType,
    showToast,
    fetchShowrooms,
    fetchStats,
    openDetail,
    closeDetail,
    openCreateModal,
    openEditModal,
    closeCreateOrEditModal,
    handleSaveShowroom,
    handleToggleStatus,
    handleDeleteShowroom,
    handleAddDemoCar,
    handleUpdateDemoCarStatus,
  };
};
