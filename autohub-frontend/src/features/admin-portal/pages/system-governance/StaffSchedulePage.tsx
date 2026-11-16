import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  CalendarDays,
  Clock,
  Users,
  Plus,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Car,
  Package,
  ShieldAlert,
  ArrowRightLeft,
  FileSpreadsheet,
  X,
  Sparkles,
  Trash2,
  Phone,
  RefreshCw,
  AlertCircle,
  Sliders,
  Check,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import { adminStaffScheduleService } from '@/features/admin-portal/services/admin-staff-schedule.service';
import { adminShowroomService } from '@/features/admin-portal/services/admin-showroom.service';
import type {
  ShiftType,
  StaffMember,
  ShiftAssignment,
  SwapRequest,
  StaffScheduleStats,
  AutoScheduleResult,
} from '@/types/staff-schedule.types';

// ==================== DATE HELPER FUNCTIONS ====================
function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function formatDDMMYYYY(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatYYYYMMDD(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

const DAY_LABELS = [
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
  'Chủ Nhật',
];

// Fallback initial data if offline
const FALLBACK_SHOWROOMS = [
  { id: 'ALL', numericId: 0, name: 'Toàn Hệ Thống Showroom' },
  { id: 'SR-1', numericId: 1, name: 'AutoHub Mỹ Đình (Hà Nội)' },
  { id: 'SR-2', numericId: 2, name: 'AutoHub Sài Gòn Central (Q.7)' },
  { id: 'SR-3', numericId: 3, name: 'AutoHub Cẩm Lệ (Đà Nẵng)' },
];

const FALLBACK_STAFF: StaffMember[] = [
  {
    id: 'STF-001',
    numericId: 1,
    name: 'Nguyễn Quản Trị',
    phone: '0912.000.999',
    role: 'SUPERVISOR',
    roleLabel: 'Giám Sát Vận Hành',
    showroomId: 'SR-2',
    showroomName: 'AutoHub Sài Gòn Central (Q.7)',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'STF-002',
    numericId: 2,
    name: 'Lê Quốc Bảo',
    phone: '0908.112.233',
    role: 'SALES',
    roleLabel: 'Tư Vấn Bán Hàng',
    showroomId: 'SR-2',
    showroomName: 'AutoHub Sài Gòn Central (Q.7)',
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'STF-003',
    numericId: 3,
    name: 'Phạm Hoàng Nam',
    phone: '0933.445.566',
    role: 'TEST_DRIVE',
    roleLabel: 'Điều Phối Lái Thử',
    showroomId: 'SR-2',
    showroomName: 'AutoHub Sài Gòn Central (Q.7)',
    avatarColor: 'bg-cyan-600',
  },
  {
    id: 'STF-004',
    numericId: 4,
    name: 'Nguyễn Văn Tuấn',
    phone: '0988.123.456',
    role: 'SUPERVISOR',
    roleLabel: 'Trưởng Ca Showroom',
    showroomId: 'SR-1',
    showroomName: 'AutoHub Mỹ Đình (Hà Nội)',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'STF-005',
    numericId: 5,
    name: 'Đặng Minh Khôi',
    phone: '0977.334.455',
    role: 'WAREHOUSE',
    roleLabel: 'Kho & Đóng Gói Phụ Kiện',
    showroomId: 'SR-2',
    showroomName: 'AutoHub Sài Gòn Central (Q.7)',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'STF-006',
    numericId: 6,
    name: 'Trần Thị Thu Hà',
    phone: '0977.888.999',
    role: 'SALES',
    roleLabel: 'Tư Vấn Bán Hàng',
    showroomId: 'SR-1',
    showroomName: 'AutoHub Mỹ Đình (Hà Nội)',
    avatarColor: 'bg-rose-600',
  },
  {
    id: 'STF-007',
    numericId: 7,
    name: 'Vũ Hải Đăng',
    phone: '0966.777.888',
    role: 'TEST_DRIVE',
    roleLabel: 'Điều Phối Lái Thử',
    showroomId: 'SR-1',
    showroomName: 'AutoHub Mỹ Đình (Hà Nội)',
    avatarColor: 'bg-teal-600',
  },
  {
    id: 'STF-008',
    numericId: 8,
    name: 'Hoàng Gia Bảo',
    phone: '0919.223.344',
    role: 'SALES',
    roleLabel: 'Tư Vấn Bán Hàng',
    showroomId: 'SR-3',
    showroomName: 'AutoHub Cẩm Lệ (Đà Nẵng)',
    avatarColor: 'bg-violet-600',
  },
  {
    id: 'STF-009',
    numericId: 9,
    name: 'Bùi Phương Thảo',
    phone: '0944.556.677',
    role: 'WAREHOUSE',
    roleLabel: 'Kho & Bàn Giao Xe',
    showroomId: 'SR-3',
    showroomName: 'AutoHub Cẩm Lệ (Đà Nẵng)',
    avatarColor: 'bg-pink-600',
  },
];

export const StaffSchedulePage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  // Week Reference State (tracks actual Monday of the active week)
  const [currentMonday, setCurrentMonday] = useState<Date>(() => getMonday(new Date()));

  // Active dates in the week
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentMonday);
      d.setDate(currentMonday.getDate() + i);
      const isToday = formatYYYYMMDD(d) === formatYYYYMMDD(new Date());
      return {
        index: i,
        label: DAY_LABELS[i],
        dateStr: formatDDMMYYYY(d),
        isoDate: formatYYYYMMDD(d),
        isToday,
      };
    });
  }, [currentMonday]);

  const currentWeekNumber = useMemo(() => getWeekNumber(currentMonday), [currentMonday]);

  // Main Data States
  const [shifts, setShifts] = useState<ShiftAssignment[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>(FALLBACK_STAFF);
  const [showrooms, setShowrooms] = useState<{ id: string; numericId: number; name: string }[]>(FALLBACK_SHOWROOMS);
  const [stats, setStats] = useState<StaffScheduleStats>({
    totalShiftsThisWeek: 0,
    testDriveShifts: 0,
    warehouseShifts: 0,
    salesShifts: 0,
    supervisorShifts: 0,
    pendingSwapRequests: 0,
    coverageRate: '100% Đạt chỉ tiêu',
    activeStaffCount: 0,
  });

  // Loading & Filter States
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedShowroom, setSelectedShowroom] = useState<string>('ALL');
  const [selectedShiftTypeFilter, setSelectedShiftTypeFilter] = useState<string>('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'WEEK_MATRIX' | 'SWAP_REQUESTS'>('WEEK_MATRIX');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'SUCCESS' | 'ERROR'>('SUCCESS');

  const showToast = (msg: string, type: 'SUCCESS' | 'ERROR' = 'SUCCESS') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Modals
  const [selectedShiftDetail, setSelectedShiftDetail] = useState<ShiftAssignment | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [modalTargetDay, setModalTargetDay] = useState<number>(0);
  const [selectedStaffForAssign, setSelectedStaffForAssign] = useState<string>('');
  const [selectedShiftTypeForAssign, setSelectedShiftTypeForAssign] = useState<ShiftType>('MORNING');
  const [selectedShowroomForAssign, setSelectedShowroomForAssign] = useState<number>(1);
  const [taskNoteForAssign, setTaskNoteForAssign] = useState<string>('');

  // Auto Schedule Modal
  const [showAutoScheduleModal, setShowAutoScheduleModal] = useState<boolean>(false);
  const [autoScheduleTargetShowroom, setAutoScheduleTargetShowroom] = useState<number>(0); // 0 = all
  const [autoScheduleStrategy, setAutoScheduleStrategy] = useState<'BALANCED' | 'WEEKEND_HEAVY'>('BALANCED');
  const [autoScheduleMaxShifts, setAutoScheduleMaxShifts] = useState<number>(5);
  const [isExecutingAutoSchedule, setIsExecutingAutoSchedule] = useState<boolean>(false);
  const [lastAutoResult, setLastAutoResult] = useState<AutoScheduleResult | null>(null);

  // Load Showrooms & Staff Roster on Mount
  useEffect(() => {
    let isMounted = true;

    async function loadMeta() {
      try {
        const [srList, stList] = await Promise.allSettled([
          adminShowroomService.getShowrooms(),
          adminStaffScheduleService.getStaffOptions(),
        ]);

        if (!isMounted) return;

        if (srList.status === 'fulfilled' && srList.value.length > 0) {
          const mapped = [
            { id: 'ALL', numericId: 0, name: 'Toàn Hệ Thống Showroom' },
            ...srList.value.map((s) => ({
              id: `SR-${s.id}`,
              numericId: s.id,
              name: s.name,
            })),
          ];
          setShowrooms(mapped);
        }

        if (stList.status === 'fulfilled' && stList.value.length > 0) {
          setStaffList(stList.value);
          setSelectedStaffForAssign(stList.value[0]?.id || '');
        } else {
          setSelectedStaffForAssign(FALLBACK_STAFF[0]?.id || '');
        }
      } catch (err) {
        console.warn('Using fallback showroom and staff metadata:', err);
      }
    }

    loadMeta();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Schedules, Stats & Swap Requests for Current Week
  const loadWeekData = useCallback(async () => {
    setLoading(true);
    const startDateStr = formatYYYYMMDD(currentMonday);
    const endDateStr = formatYYYYMMDD(new Date(currentMonday.getTime() + 6 * 86400000));

    const selectedShowroomObj = showrooms.find((s) => s.id === selectedShowroom);
    const showroomIdParam = selectedShowroomObj && selectedShowroomObj.numericId > 0 ? selectedShowroomObj.numericId : null;

    try {
      const [schedRes, statsRes, swapsRes] = await Promise.allSettled([
        adminStaffScheduleService.getSchedules({
          showroomId: showroomIdParam,
          startDate: startDateStr,
          endDate: endDateStr,
          shiftType: selectedShiftTypeFilter !== 'ALL' ? selectedShiftTypeFilter : undefined,
          role: selectedRoleFilter !== 'ALL' ? selectedRoleFilter : undefined,
          keyword: searchKeyword.trim() || undefined,
        }),
        adminStaffScheduleService.getStats({
          showroomId: showroomIdParam,
          startDate: startDateStr,
          endDate: endDateStr,
        }),
        adminStaffScheduleService.getSwapRequests(),
      ]);

      if (schedRes.status === 'fulfilled') {
        setShifts(schedRes.value);
      }
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value);
      }
      if (swapsRes.status === 'fulfilled') {
        setSwapRequests(swapsRes.value);
      }
    } catch (err) {
      console.error('Error fetching weekly staff schedule:', err);
      showToast('Không thể kết nối đến máy chủ. Đang hiển thị bản nháp tạm.', 'ERROR');
    } finally {
      setLoading(false);
    }
  }, [currentMonday, selectedShowroom, selectedShiftTypeFilter, selectedRoleFilter, searchKeyword, showrooms]);

  useEffect(() => {
    loadWeekData();
  }, [loadWeekData]);

  // Filtered shifts in UI
  const filteredShifts = useMemo(() => {
    return shifts.filter((item) => {
      if (selectedShowroom !== 'ALL' && item.showroomId !== selectedShowroom) {
        return false;
      }
      if (selectedShiftTypeFilter !== 'ALL' && item.shiftType !== selectedShiftTypeFilter) {
        return false;
      }
      if (selectedRoleFilter !== 'ALL' && item.role !== selectedRoleFilter) {
        return false;
      }
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchName = item.staffName.toLowerCase().includes(query);
        const matchCode = item.staffCode.toLowerCase().includes(query);
        const matchTask = item.specificTask.toLowerCase().includes(query);
        if (!matchName && !matchCode && !matchTask) return false;
      }
      return true;
    });
  }, [shifts, selectedShowroom, selectedShiftTypeFilter, selectedRoleFilter, searchKeyword]);

  // Shifts of staff in week for detail view
  const staffWeekShifts = useMemo(() => {
    if (!selectedShiftDetail) return [];
    return shifts.filter(
      (s) =>
        s.staffId === selectedShiftDetail.staffId ||
        (s.staffNumericId && s.staffNumericId === selectedShiftDetail.staffNumericId)
    );
  }, [shifts, selectedShiftDetail]);

  const staffInfo = useMemo(() => {
    if (!selectedShiftDetail) return null;
    return (
      staffList.find(
        (s) =>
          s.id === selectedShiftDetail.staffId ||
          (s.numericId && s.numericId === selectedShiftDetail.staffNumericId)
      ) || null
    );
  }, [selectedShiftDetail, staffList]);

  // Navigate Weeks
  const handlePrevWeek = () => {
    setCurrentMonday((prev) => new Date(prev.getTime() - 7 * 86400000));
  };

  const handleNextWeek = () => {
    setCurrentMonday((prev) => new Date(prev.getTime() + 7 * 86400000));
  };

  const handleResetToCurrentWeek = () => {
    setCurrentMonday(getMonday(new Date()));
  };

  // Open Quick Add Modal
  const handleOpenAssignModal = (dayIndex: number, defaultShift: ShiftType = 'MORNING') => {
    setModalTargetDay(dayIndex);
    setSelectedShiftTypeForAssign(defaultShift);
    setTaskNoteForAssign('');
    setShowAssignModal(true);
  };

  // Submit Shift Assignment
  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const staff = staffList.find((s) => s.id === selectedStaffForAssign) || staffList[0];
    if (!staff) {
      showToast('Vui lòng chọn nhân viên!', 'ERROR');
      return;
    }

    const targetDayInfo = weekDays[modalTargetDay];
    const shiftCode =
      selectedShiftTypeForAssign === 'MORNING'
        ? 'CA_SANG'
        : selectedShiftTypeForAssign === 'AFTERNOON'
        ? 'CA_CHIEU'
        : 'CA_HANH_CHINH';

    try {
      const created = await adminStaffScheduleService.createSchedule({
        staffId: staff.numericId,
        showroomId: selectedShowroomForAssign,
        ngayTruc: targetDayInfo.isoDate,
        caTruc: shiftCode,
        ghiChu: taskNoteForAssign.trim() || undefined,
      });

      setShifts((prev) => [...prev, created]);
      setShowAssignModal(false);
      showToast(
        `Đã phân công thành công ${staff.name} (${staff.id}) vào ${targetDayInfo.label} (${targetDayInfo.dateStr})!`
      );
      loadWeekData();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể lưu ca trực. Vui lòng kiểm tra trùng ca.';
      showToast(errorMsg, 'ERROR');
    }
  };

  // Delete shift
  const handleDeleteShift = async (shiftId: string, staffName: string) => {
    if (!window.confirm(`Xác nhận xóa ca làm việc của ${staffName}?`)) return;

    const numericId = parseInt(shiftId.replace(/\D/g, ''), 10);
    try {
      if (numericId > 0) {
        await adminStaffScheduleService.deleteSchedule(numericId);
      }
      setShifts((prev) => prev.filter((s) => s.id !== shiftId));
      showToast(`Đã xóa ca trực của ${staffName}.`);
      loadWeekData();
    } catch (err) {
      console.error('Error deleting shift:', err);
      showToast('Lỗi khi xóa ca trực trên hệ thống.', 'ERROR');
    }
  };

  // Execute Auto Scheduling Algorithm
  const handleRunAutoSchedule = async () => {
    setIsExecutingAutoSchedule(true);
    try {
      const result = await adminStaffScheduleService.autoSchedule({
        showroomId: autoScheduleTargetShowroom > 0 ? autoScheduleTargetShowroom : null,
        startDate: formatYYYYMMDD(currentMonday),
        maxShiftsPerStaff: autoScheduleMaxShifts,
        strategy: autoScheduleStrategy,
        replaceExisting: true,
      });

      setLastAutoResult(result);
      setShowAutoScheduleModal(false);
      showToast(result.message || 'Thuật toán đã tối ưu hóa phân ca làm việc thành công!');
      loadWeekData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Thuật toán xếp ca gặp lỗi khi phân bổ nhân sự.';
      showToast(msg, 'ERROR');
    } finally {
      setIsExecutingAutoSchedule(false);
    }
  };

  // Handle Swap Request Approval
  const handleApproveSwap = async (id: string, req: SwapRequest) => {
    try {
      await adminStaffScheduleService.approveSwapRequest(id);
      setSwapRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
      );
      showToast(`Đã phê duyệt đổi ca giữa ${req.requesterName} và ${req.targetStaffName}!`);
      loadWeekData();
    } catch (err) {
      console.error('Error approving swap request:', err);
      showToast('Phê duyệt đổi ca thất bại.', 'ERROR');
    }
  };

  const handleRejectSwap = async (id: string, req: SwapRequest) => {
    try {
      await adminStaffScheduleService.rejectSwapRequest(id);
      setSwapRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
      );
      showToast(`Đã từ chối yêu cầu đổi ca của ${req.requesterName}.`);
    } catch (err) {
      console.error('Error rejecting swap request:', err);
      showToast('Từ chối đổi ca thất bại.', 'ERROR');
    }
  };

  // Export CSV/Excel
  const handleExportCsv = async () => {
    try {
      showToast('Đang tạo và tải về bảng lịch trực tuần (.csv UTF-8 cho Excel)...');
      const selectedShowroomObj = showrooms.find((s) => s.id === selectedShowroom);
      const showroomIdParam = selectedShowroomObj && selectedShowroomObj.numericId > 0 ? selectedShowroomObj.numericId : null;

      const blob = await adminStaffScheduleService.exportCsv({
        showroomId: showroomIdParam,
        startDate: formatYYYYMMDD(currentMonday),
        endDate: formatYYYYMMDD(new Date(currentMonday.getTime() + 6 * 86400000)),
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lich_truc_showroom_tuan_${currentWeekNumber}_${formatYYYYMMDD(currentMonday)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Fallback frontend CSV export:', err);
      // Fallback frontend CSV generation
      let csvContent = '\uFEFFMã Ca,Chi Nhánh Showroom,Thứ,Ngày Trực,Ca Làm Việc,Khung Giờ,Mã NV,Họ Và Tên,Vị Trí Phụ Trách,Nhiệm Vụ Phân Công,Trạng Thái\n';
      filteredShifts.forEach((s) => {
        csvContent += `"${s.id}","${s.showroomName}","${DAY_LABELS[s.dayOfWeek]}","${s.dateString}","${s.shiftType}","${s.shiftHours}","${s.staffCode}","${s.staffName}","${s.roleLabel}","${s.specificTask.replace(/"/g, '""')}","${s.status}"\n`;
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lich_truc_showroom_tuan_${currentWeekNumber}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={cn(
            'fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 text-white text-sm font-medium rounded-xl shadow-2xl border animate-fadeIn',
            toastType === 'SUCCESS'
              ? 'bg-emerald-600 border-emerald-500'
              : 'bg-rose-600 border-rose-500'
          )}
        >
          {toastType === 'SUCCESS' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div
        className={cn(
          'flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl border transition-colors shadow-sm',
          isDarkMode
            ? 'bg-gradient-to-r from-[#0B1326] via-[#111A2E] to-[#0E1726] border-[#3E4850]/50'
            : 'bg-gradient-to-r from-white via-sky-50/40 to-slate-50 border-slate-200'
        )}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 text-[10px] font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {stats.coverageRate || '100% ĐỘ PHỦ CA'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 text-[10px] font-mono font-bold">
              {stats.activeStaffCount || staffList.length} NHÂN SỰ VẬN HÀNH
            </span>
          </div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Phân Công Lịch Trực & Ca Làm Việc Nhân Viên
          </h1>
          <p className={cn('text-sm mt-0.5 max-w-2xl', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Thuật toán điều phối nhân sự tự động cân bằng số ca, đảm bảo định mức thời giờ làm việc theo luật lao động và duy trì 100% độ phủ dịch vụ showroom.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={loadWeekData}
            disabled={loading}
            className={cn(
              'h-[38px] flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer',
              isDarkMode
                ? 'bg-[#0B1326] text-slate-300 border-[#3E4850] hover:text-white'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            )}
            title="Tải lại dữ liệu tuần"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
            <span className="hidden sm:inline">Làm Mới</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAutoScheduleModal(true)}
            className={cn(
              'h-[38px] flex items-center gap-2 px-3.5 rounded-lg text-xs font-bold border transition-all cursor-pointer',
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF] border-[#89CEFF]/40 hover:border-[#89CEFF] shadow-sm'
                : 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100'
            )}
            title="Mở cấu hình thuật toán tự động xếp ca"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tự Động Xếp Ca</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className={cn(
              'h-[38px] flex items-center gap-2 px-3.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
              isDarkMode
                ? 'bg-[#0B1326] text-[#DAE2FD] hover:text-white border-[#3E4850]/70'
                : 'bg-white text-slate-700 hover:text-slate-900 border-slate-300'
            )}
            title="Xuất bảng phân công ra định dạng Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Xuất Excel (.csv)</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAssignModal(0, 'MORNING')}
            className="h-[38px] flex items-center gap-2 px-4 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Phân Công Ca Mới</span>
          </button>
        </div>
      </div>

      {/* Auto-Schedule Algorithm Summary Banner (if executed recently) */}
      {lastAutoResult && (
        <div
          className={cn(
            'p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn',
            isDarkMode ? 'bg-[#17233B] border-[#89CEFF]/40 text-[#DAE2FD]' : 'bg-sky-50 border-sky-200 text-sky-900'
          )}
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-bold">{lastAutoResult.message}</span>
              <div className="text-[11px] opacity-80 mt-0.5">
                Chiến lược: <strong>{lastAutoResult.strategy === 'BALANCED' ? 'Cân Bằng Phân Bổ' : 'Ưu Tiên Cuối Tuần'}</strong> • Tổng {lastAutoResult.totalShiftsCreated} ca trực • Bình quân {lastAutoResult.avgShiftsPerStaff} ca/nhân viên (~{lastAutoResult.avgHoursPerStaff} giờ làm/tuần)
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLastAutoResult(null)}
            className="text-slate-400 hover:text-white p-1 self-end sm:self-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          className={cn(
            'p-4 rounded-xl border flex flex-col justify-between transition-colors shadow-xs',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Tổng Ca Trực Tuần Này</span>
            <CalendarDays className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={cn('text-2xl font-black font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
              {stats.totalShiftsThisWeek || filteredShifts.length}
            </span>
            <span className="text-[11px] font-mono text-emerald-500 font-bold">{stats.coverageRate}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          className={cn(
            'p-4 rounded-xl border flex flex-col justify-between transition-colors shadow-xs',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Lái Thử & Xe Demo</span>
            <Car className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={cn('text-2xl font-black font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
              {stats.testDriveShifts || filteredShifts.filter((s) => s.role === 'TEST_DRIVE').length}
            </span>
            <span className="text-[11px] font-mono text-cyan-500 font-bold">Bảo đảm 100% xe</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div
          className={cn(
            'p-4 rounded-xl border flex flex-col justify-between transition-colors shadow-xs',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Kho & Soạn Phụ Kiện</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={cn('text-2xl font-black font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
              {stats.warehouseShifts || filteredShifts.filter((s) => s.role === 'WAREHOUSE').length}
            </span>
            <span className="text-[11px] font-mono text-amber-500 font-bold">Xuất kho liên tục</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div
          className={cn(
            'p-4 rounded-xl border flex flex-col justify-between transition-colors shadow-xs cursor-pointer hover:border-amber-500/50',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
          onClick={() => setActiveTab('SWAP_REQUESTS')}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Đổi Ca Chờ Duyệt</span>
            <ArrowRightLeft className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-rose-500">
              {swapRequests.filter((r) => r.status === 'PENDING').length}
            </span>
            <span className="text-[11px] font-mono text-rose-400 underline font-medium">Xem duyệt ngay</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div
        className={cn(
          'p-4 rounded-xl border space-y-3 transition-colors',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        )}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-surface-highlight/40">
          {/* Main Tab Switches */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('WEEK_MATRIX')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2',
                activeTab === 'WEEK_MATRIX'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDarkMode
                  ? 'bg-[#131B2E] text-slate-400 hover:text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              )}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Ma Trận Lịch Trực Tuần</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SWAP_REQUESTS')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 relative',
                activeTab === 'SWAP_REQUESTS'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDarkMode
                  ? 'bg-[#131B2E] text-slate-400 hover:text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              )}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Yêu Cầu Đổi Ca & Nghỉ Phép</span>
              {swapRequests.filter((r) => r.status === 'PENDING').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>
          </div>

          {/* Dynamic Week Navigator */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevWeek}
              className={cn(
                'p-1.5 rounded-md border text-xs cursor-pointer transition-colors',
                isDarkMode ? 'border-[#3E4850] hover:bg-[#171F33]' : 'border-slate-300 hover:bg-slate-100'
              )}
              title="Tuần trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              className={cn(
                'px-3 py-1.5 rounded-md border text-xs font-mono font-bold flex items-center gap-2',
                isDarkMode ? 'bg-[#131B2E] border-[#3E4850]' : 'bg-slate-100 border-slate-300 text-slate-800'
              )}
            >
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>
                Tuần {currentWeekNumber} ({weekDays[0]?.dateStr} - {weekDays[6]?.dateStr})
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextWeek}
              className={cn(
                'p-1.5 rounded-md border text-xs cursor-pointer transition-colors',
                isDarkMode ? 'border-[#3E4850] hover:bg-[#171F33]' : 'border-slate-300 hover:bg-slate-100'
              )}
              title="Tuần tới"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleResetToCurrentWeek}
              className={cn(
                'px-2.5 py-1.5 rounded-md text-[11px] font-semibold border cursor-pointer transition-colors',
                isDarkMode
                  ? 'border-[#3E4850] text-[#89CEFF] hover:bg-[#171F33]'
                  : 'border-slate-300 text-blue-600 hover:bg-slate-50'
              )}
            >
              Hôm nay
            </button>
          </div>
        </div>

        {/* Filters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Showroom filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Chi Nhánh Showroom:</label>
            <select
              value={selectedShowroom}
              onChange={(e) => setSelectedShowroom(e.target.value)}
              className={cn(
                'w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition-colors cursor-pointer',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850] text-white focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
              )}
            >
              {showrooms.map((sr) => (
                <option key={sr.id} value={sr.id}>
                  {sr.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shift Type filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Ca Làm Việc:</label>
            <select
              value={selectedShiftTypeFilter}
              onChange={(e) => setSelectedShiftTypeFilter(e.target.value)}
              className={cn(
                'w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition-colors cursor-pointer',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850] text-white focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
              )}
            >
              <option value="ALL">Tất Cả Các Ca</option>
              <option value="MORNING">Ca Sáng (08:00 - 15:00)</option>
              <option value="AFTERNOON">Ca Chiều (14:30 - 21:00)</option>
              <option value="FULL_DAY">Ca Hành Chính (08:30 - 17:30)</option>
            </select>
          </div>

          {/* Role filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Vị Trí Phụ Trách:</label>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className={cn(
                'w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition-colors cursor-pointer',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850] text-white focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
              )}
            >
              <option value="ALL">Tất Cả Vị Trí</option>
              <option value="SUPERVISOR">Trưởng Ca Showroom</option>
              <option value="SALES">Tư Vấn Bán Hàng</option>
              <option value="TEST_DRIVE">Điều Phối Lái Thử</option>
              <option value="WAREHOUSE">Kho & Đóng Gói Phụ Kiện</option>
            </select>
          </div>

          {/* Search box */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Tìm Nhân Viên / Nhiệm Vụ:</label>
            <div className="relative">
              <Search
                className={cn('w-4 h-4 absolute left-3 top-2.5', isDarkMode ? 'text-slate-400' : 'text-slate-500')}
              />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tên nhân viên, STF-001..."
                className={cn(
                  'w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none transition-colors',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850] text-white placeholder-slate-500 focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'WEEK_MATRIX' ? (
        /* 1. WEEKLY MATRIX BOARD */
        <div className="overflow-x-auto pb-4 -mx-2 px-2">
          <div className="min-w-[1200px] grid grid-cols-7 gap-3">
            {weekDays.map((day) => {
              const dayShifts = filteredShifts.filter(
                (s) => s.dayOfWeek === day.index || (s.isoDate && s.isoDate === day.isoDate)
              );

              return (
                <div
                  key={day.index}
                  className={cn(
                    'rounded-xl border flex flex-col transition-all duration-200',
                    isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-2xs',
                    day.isToday &&
                      (isDarkMode
                        ? 'ring-2 ring-[#89CEFF]/60 border-[#89CEFF]'
                        : 'ring-2 ring-blue-500/40 border-blue-400')
                  )}
                >
                  {/* Day Column Header */}
                  <div
                    className={cn(
                      'p-3 border-b flex items-center justify-between',
                      isDarkMode ? 'border-[#3E4850]/40 bg-[#131B2E]/60' : 'border-slate-100 bg-slate-50/80',
                      day.isToday &&
                        (isDarkMode ? 'bg-blue-950/40 text-[#89CEFF]' : 'bg-blue-50/80 text-blue-700')
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">{day.label}</span>
                        {day.isToday && (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase bg-blue-500 text-white rounded font-black">
                            Hôm nay
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{day.dateStr}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(day.index, 'MORNING')}
                      className={cn(
                        'w-6 h-6 rounded-md flex items-center justify-center text-xs transition-colors cursor-pointer',
                        isDarkMode
                          ? 'bg-[#171F33] text-[#89CEFF] hover:bg-[#89CEFF] hover:text-black'
                          : 'bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white'
                      )}
                      title={`Thêm ca trực cho ${day.label}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Shifts List for Day */}
                  <div className="p-2.5 space-y-2.5 flex-1 min-h-[360px] flex flex-col justify-start">
                    {dayShifts.length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center text-center text-slate-400 text-xs font-mono border border-dashed rounded-lg border-surface-highlight/40">
                        <span>Chưa xếp ca</span>
                        <button
                          type="button"
                          onClick={() => handleOpenAssignModal(day.index, 'MORNING')}
                          className="mt-1 text-[11px] text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Gán nhân viên</span>
                        </button>
                      </div>
                    ) : (
                      dayShifts.map((shift) => {
                        const shiftBadgeColor =
                          shift.shiftType === 'MORNING'
                            ? isDarkMode
                              ? 'bg-blue-500/15 text-[#89CEFF] border-blue-500/30'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                            : shift.shiftType === 'AFTERNOON'
                            ? isDarkMode
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                            : isDarkMode
                            ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                            : 'bg-purple-50 text-purple-700 border-purple-200';

                        const roleIcon =
                          shift.role === 'TEST_DRIVE' ? (
                            <Car className="w-3 h-3 text-cyan-400" />
                          ) : shift.role === 'WAREHOUSE' ? (
                            <Package className="w-3 h-3 text-amber-400" />
                          ) : shift.role === 'SUPERVISOR' ? (
                            <ShieldAlert className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Users className="w-3 h-3 text-blue-400" />
                          );

                        return (
                          <div
                            key={shift.id}
                            onClick={() => setSelectedShiftDetail(shift)}
                            className={cn(
                              'p-2.5 rounded-lg border text-xs space-y-2 transition-all hover:shadow-md relative group cursor-pointer',
                              isDarkMode
                                ? 'bg-[#131B2E] border-[#3E4850]/50 hover:border-[#89CEFF]/60'
                                : 'bg-slate-50 border-slate-200 hover:border-blue-400'
                            )}
                          >
                            {/* Shift Header & Delete Quick Action */}
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={cn(
                                  'px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border',
                                  shiftBadgeColor
                                )}
                              >
                                {shift.shiftType === 'MORNING'
                                  ? 'SÁNG (08-15h)'
                                  : shift.shiftType === 'AFTERNOON'
                                  ? 'CHIỀU (14h30-21h)'
                                  : 'HÀNH CHÍNH'}
                              </span>

                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteShift(shift.id, shift.staffName);
                                  }}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                                  title="Xóa ca này"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Staff Info */}
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                                {shift.staffName.split(' ').slice(-1)[0][0]}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div
                                  className={cn(
                                    'font-bold truncate text-[11px]',
                                    isDarkMode ? 'text-white' : 'text-slate-900'
                                  )}
                                >
                                  {shift.staffName}
                                </div>
                                <div className="text-[10px] font-mono text-slate-400">
                                  <span>{shift.staffCode}</span>
                                </div>
                              </div>
                            </div>

                            {/* Specific Task */}
                            <div
                              className={cn(
                                'p-1.5 rounded text-[10px] leading-tight flex items-start gap-1.5 border',
                                isDarkMode
                                  ? 'bg-[#0B1326]/70 border-[#3E4850]/40 text-slate-300'
                                  : 'bg-white border-slate-200 text-slate-700'
                              )}
                            >
                              <div className="mt-0.5 flex-shrink-0">{roleIcon}</div>
                              <p className="line-clamp-2">{shift.specificTask}</p>
                            </div>

                            {/* Shift Status */}
                            <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-surface-highlight/30">
                              <span className="text-slate-400">{shift.roleLabel}</span>
                              {shift.status === 'IN_PROGRESS' ? (
                                <span className="text-cyan-400 font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                  Đang trực
                                </span>
                              ) : shift.status === 'COMPLETED' ? (
                                <span className="text-slate-400 font-medium">Hoàn thành</span>
                              ) : (
                                <span className="text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Đã nhận
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. SWAP REQUESTS & LEAVE APPROVAL TAB */
        <div
          className={cn(
            'p-6 rounded-xl border space-y-4 transition-colors',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-sm'
          )}
        >
          <div className="flex items-center justify-between pb-3 border-b border-surface-highlight/40">
            <div>
              <h2 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Danh Sách Yêu Cầu Đổi Ca & Xin Nghỉ Phép Của Nhân Viên Showroom
              </h2>
              <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                Cán bộ quản trị xem xét lý do và phê duyệt điều chuyển ca trực, bảo đảm không gián đoạn dịch vụ lái thử và tiếp đón khách hàng.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
              {swapRequests.filter((r) => r.status === 'PENDING').length} ĐANG CHỜ DUYỆT
            </span>
          </div>

          <div className="space-y-3">
            {swapRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-mono">
                Hiện tại không có yêu cầu đổi ca nào đang chờ duyệt.
              </div>
            ) : (
              swapRequests.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    'p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all',
                    isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/60' : 'bg-slate-50 border-slate-200 shadow-2xs'
                  )}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {req.id}
                      </span>
                      <strong className={cn('text-sm', isDarkMode ? 'text-white' : 'text-slate-900')}>
                        {req.requesterName} ({req.requesterCode})
                      </strong>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                      <strong className={cn('text-sm', isDarkMode ? 'text-white' : 'text-slate-900')}>
                        {req.targetStaffName} ({req.targetStaffCode})
                      </strong>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>
                          Ca hiện tại: <strong>{req.currentDate} ({req.currentShift})</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          Đổi sang: <strong>{req.targetDate} ({req.targetShift})</strong>
                        </span>
                      </div>
                    </div>

                    <div
                      className={cn(
                        'p-2 rounded text-xs border leading-relaxed',
                        isDarkMode
                          ? 'bg-[#0B1326] border-[#3E4850]/40 text-slate-300'
                          : 'bg-white border-slate-200 text-slate-700'
                      )}
                    >
                      <strong>Lý do xin đổi:</strong> {req.reason}
                    </div>
                  </div>

                  {/* Approval actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {req.status === 'PENDING' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleRejectSwap(req.id, req)}
                          className={cn(
                            'px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer',
                            isDarkMode
                              ? 'border-rose-500/40 text-rose-400 hover:bg-rose-500/10'
                              : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                          )}
                        >
                          Từ Chối
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveSwap(req.id, req)}
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
                        >
                          Duyệt Đổi Ca
                        </button>
                      </>
                    ) : req.status === 'APPROVED' ? (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        ĐÃ PHÊ DUYỆT
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                        <X className="w-4 h-4" />
                        ĐÃ TỪ CHỐI
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================== MODAL: AUTO-SCHEDULE CONFIGURATION ==================== */}
      {showAutoScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={cn(
              'w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-5 relative',
              isDarkMode ? 'bg-[#131B2E] border-[#3E4850] text-white' : 'bg-white border-slate-200 text-slate-900'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-highlight/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold">Thuật Toán Tự Động Phân Bổ Ca Trực</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAutoScheduleModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanation box */}
            <div
              className={cn(
                'p-3.5 rounded-xl border text-xs space-y-2 leading-relaxed',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/50 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              )}
            >
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Sliders className="w-4 h-4" />
                <span>Tiêu chuẩn thuật toán tối ưu hóa đa mục tiêu:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] opacity-90">
                <li>Bảo đảm 100% độ phủ ca: Trưởng ca, Tư vấn khách, Lái thử xe demo và Kho phụ kiện.</li>
                <li>Ràng buộc cứng: Không double-booking nhân viên trong cùng 1 ngày.</li>
                <li>Tuân thủ luật lao động: Định mức tối đa {autoScheduleMaxShifts} ca (~35-40 giờ/tuần), bảo đảm ít nhất 1-2 ngày nghỉ hồi phục.</li>
                <li>Tránh ca liền kề: Tránh xếp ca Chiều hôm trước (21:00) rồi ca Sáng hôm sau (08:00) để đảm bảo tối thiểu 11 giờ nghỉ liên tục.</li>
              </ul>
            </div>

            {/* Form */}
            <div className="space-y-4 text-xs">
              {/* Showroom Target */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">
                  Phạm Vi Showroom Áp Dụng:
                </label>
                <select
                  value={autoScheduleTargetShowroom}
                  onChange={(e) => setAutoScheduleTargetShowroom(Number(e.target.value))}
                  className={cn(
                    'w-full px-3 py-2.5 text-xs border rounded-lg focus:outline-none transition-colors cursor-pointer',
                    isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850] text-white focus:border-[#89CEFF]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                  )}
                >
                  <option value={0}>Toàn Bộ Chi Nhánh Showroom (Tất cả)</option>
                  {showrooms
                    .filter((sr) => sr.numericId > 0)
                    .map((sr) => (
                      <option key={sr.id} value={sr.numericId}>
                        {sr.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Strategy Choice */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">
                  Chiến Lược Phân Bổ Thuật Toán:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAutoScheduleStrategy('BALANCED')}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all cursor-pointer',
                      autoScheduleStrategy === 'BALANCED'
                        ? 'bg-blue-600/15 border-blue-500 text-white font-bold ring-1 ring-blue-500/50'
                        : isDarkMode
                        ? 'bg-[#0B1326] border-[#3E4850] text-slate-400'
                        : 'bg-slate-50 border-slate-300 text-slate-700'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Cân Bằng Chuẩn Hóa</span>
                      {autoScheduleStrategy === 'BALANCED' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <p className="text-[10px] opacity-75 mt-1">
                      Phân bổ đều số ca giữa các nhân sự cùng vị trí. Tối thiểu hóa phương sai giờ làm.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAutoScheduleStrategy('WEEKEND_HEAVY')}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all cursor-pointer',
                      autoScheduleStrategy === 'WEEKEND_HEAVY'
                        ? 'bg-amber-600/15 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                        : isDarkMode
                        ? 'bg-[#0B1326] border-[#3E4850] text-slate-400'
                        : 'bg-slate-50 border-slate-300 text-slate-700'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Cao Điểm Cuối Tuần</span>
                      {autoScheduleStrategy === 'WEEKEND_HEAVY' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[10px] opacity-75 mt-1">
                      Bổ sung +50% nhân sự vào T7 & CN để đón tiếp khách VIP và phục vụ lái thử dồn dập.
                    </p>
                  </button>
                </div>
              </div>

              {/* Max Shifts Cap */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">
                  Định Mức Ca Trực Tối Đa / Nhân Viên / Tuần:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={4}
                    max={6}
                    value={autoScheduleMaxShifts}
                    onChange={(e) => setAutoScheduleMaxShifts(Number(e.target.value))}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-xs px-3 py-1 rounded bg-blue-500/20 text-[#89CEFF] border border-blue-500/30">
                    {autoScheduleMaxShifts} Ca / Tuần ({autoScheduleMaxShifts * 7} Giờ)
                  </span>
                </div>
              </div>

              {/* Target week info */}
              <div className="p-2.5 rounded-lg bg-surface-highlight/20 border border-surface-highlight/30 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Tuần áp dụng:</span>
                <strong className="text-white">
                  Tuần {currentWeekNumber} ({weekDays[0]?.dateStr} - {weekDays[6]?.dateStr})
                </strong>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-highlight/30">
              <button
                type="button"
                onClick={() => setShowAutoScheduleModal(false)}
                className={cn(
                  'px-4 py-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer',
                  isDarkMode
                    ? 'border-[#3E4850] text-slate-300 hover:bg-[#0B1326]'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                )}
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                onClick={handleRunAutoSchedule}
                disabled={isExecutingAutoSchedule}
                className="px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                {isExecutingAutoSchedule ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang Xếp Ca...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Thực Thi Thuật Toán Xếp Ca</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ASSIGN / EDIT SHIFT ==================== */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={cn(
              'w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-5 relative',
              isDarkMode ? 'bg-[#131B2E] border-[#3E4850] text-white' : 'bg-white border-slate-200 text-slate-900'
            )}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-highlight/40">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold">
                  Phân Công Ca Trực - {weekDays[modalTargetDay]?.label} ({weekDays[modalTargetDay]?.dateStr})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs">
              {/* Select Staff */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">
                  Chọn Nhân Viên Showroom:
                </label>
                <select
                  value={selectedStaffForAssign}
                  onChange={(e) => setSelectedStaffForAssign(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2.5 text-xs border rounded-lg focus:outline-none transition-colors cursor-pointer',
                    isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850] text-white focus:border-[#89CEFF]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                  )}
                >
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.id}) - {staff.roleLabel} [{staff.showroomName.split('(')[0]}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Showroom Branch */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">
                  Chi Nhánh Showroom Trực:
                </label>
                <select
                  value={selectedShowroomForAssign}
                  onChange={(e) => setSelectedShowroomForAssign(Number(e.target.value))}
                  className={cn(
                    'w-full px-3 py-2.5 text-xs border rounded-lg focus:outline-none transition-colors cursor-pointer',
                    isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850] text-white focus:border-[#89CEFF]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                  )}
                >
                  {showrooms
                    .filter((sr) => sr.numericId > 0)
                    .map((sr) => (
                      <option key={sr.id} value={sr.numericId}>
                        {sr.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Select Shift Type */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedShiftTypeForAssign('MORNING')}
                  className={cn(
                    'p-2.5 rounded-lg border text-center transition-all cursor-pointer',
                    selectedShiftTypeForAssign === 'MORNING'
                      ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-sm'
                      : isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850] text-slate-300'
                      : 'bg-slate-50 border-slate-300 text-slate-700'
                  )}
                >
                  <div className="font-bold text-[11px]">Ca Sáng</div>
                  <div className="text-[10px] opacity-80 mt-0.5">08:00 - 15:00</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedShiftTypeForAssign('AFTERNOON')}
                  className={cn(
                    'p-2.5 rounded-lg border text-center transition-all cursor-pointer',
                    selectedShiftTypeForAssign === 'AFTERNOON'
                      ? 'bg-amber-600 text-white border-amber-500 font-bold shadow-sm'
                      : isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850] text-slate-300'
                      : 'bg-slate-50 border-slate-300 text-slate-700'
                  )}
                >
                  <div className="font-bold text-[11px]">Ca Chiều</div>
                  <div className="text-[10px] opacity-80 mt-0.5">14:30 - 21:00</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedShiftTypeForAssign('FULL_DAY')}
                  className={cn(
                    'p-2.5 rounded-lg border text-center transition-all cursor-pointer',
                    selectedShiftTypeForAssign === 'FULL_DAY'
                      ? 'bg-purple-600 text-white border-purple-500 font-bold shadow-sm'
                      : isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850] text-slate-300'
                      : 'bg-slate-50 border-slate-300 text-slate-700'
                  )}
                >
                  <div className="font-bold text-[11px]">Hành Chính</div>
                  <div className="text-[10px] opacity-80 mt-0.5">08:30 - 17:30</div>
                </button>
              </div>

              {/* Specific Task & Notes */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 font-semibold">
                  Nhiệm Vụ Cụ Thể Trong Ca:
                </label>
                <textarea
                  value={taskNoteForAssign}
                  onChange={(e) => setTaskNoteForAssign(e.target.value)}
                  rows={3}
                  placeholder="Ví dụ: Tiếp đón khách đoàn VIP, phụ trách kiểm tra nạp sạc 800V SiC và hướng dẫn lái thử xe GT-e..."
                  className={cn(
                    'w-full p-3 text-xs border rounded-lg focus:outline-none transition-colors resize-none',
                    isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850] text-white placeholder-slate-500 focus:border-[#89CEFF]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  )}
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-highlight/30">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer',
                    isDarkMode
                      ? 'border-[#3E4850] text-slate-300 hover:bg-[#0B1326]'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  )}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer"
                >
                  Lưu & Phân Công Ca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: STAFF SHIFT & SCHEDULE DETAIL ==================== */}
      {selectedShiftDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={cn(
              'w-full max-w-2xl rounded-2xl border p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto',
              isDarkMode ? 'bg-[#131B2E] border-[#3E4850] text-white' : 'bg-white border-slate-200 text-slate-900'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-highlight/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                  {selectedShiftDetail.staffName.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold">{selectedShiftDetail.staffName}</h3>
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-blue-500/20 text-[#89CEFF] border border-blue-500/40">
                      {selectedShiftDetail.staffCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{selectedShiftDetail.roleLabel}</span>
                    <span>•</span>
                    <span>{selectedShiftDetail.showroomName}</span>
                    {staffInfo?.phone && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
                          <Phone className="w-3 h-3" />
                          {staffInfo.phone}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedShiftDetail(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chi Tiết Ca Trực Đang Chọn */}
            <div
              className={cn(
                'p-4 rounded-xl border space-y-3',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/60' : 'bg-slate-50 border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#89CEFF]">
                  Chi Tiết Ca Làm Việc Đã Chọn
                </span>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border',
                    selectedShiftDetail.shiftType === 'MORNING'
                      ? 'bg-blue-500/15 text-[#89CEFF] border-blue-500/30'
                      : selectedShiftDetail.shiftType === 'AFTERNOON'
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                  )}
                >
                  {selectedShiftDetail.shiftType === 'MORNING'
                    ? 'CA SÁNG (08:00 - 15:00)'
                    : selectedShiftDetail.shiftType === 'AFTERNOON'
                    ? 'CA CHIỀU (14:30 - 21:00)'
                    : 'CA HÀNH CHÍNH (08:30 - 17:30)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Ngày làm việc:</span>
                  <div className="font-bold flex items-center gap-1.5 mt-0.5">
                    <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {DAY_LABELS[selectedShiftDetail.dayOfWeek]}, {selectedShiftDetail.dateString}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block">Trạng thái ca trực:</span>
                  <div className="font-bold flex items-center gap-1.5 mt-0.5">
                    {selectedShiftDetail.status === 'IN_PROGRESS' ? (
                      <span className="text-cyan-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        Đang trực tại Showroom
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã xác nhận & Sẵn sàng
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-highlight/30">
                <span className="text-slate-400 text-[11px] block mb-1 font-semibold">
                  Nhiệm vụ phân công cụ thể:
                </span>
                <div
                  className={cn(
                    'p-3 rounded-lg border text-xs leading-relaxed font-medium',
                    isDarkMode
                      ? 'bg-[#131B2E] border-[#3E4850]/50 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  )}
                >
                  {selectedShiftDetail.specificTask}
                </div>
              </div>
            </div>

            {/* Toàn Bộ Lịch Trực Trong Tuần Của Nhân Viên Này */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Toàn Bộ Ca Trực Trong Tuần Của {selectedShiftDetail.staffName} ({staffWeekShifts.length} Ca)
                </h4>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {staffWeekShifts.length * 7} giờ làm việc / tuần
                </span>
              </div>

              <div className="space-y-2">
                {staffWeekShifts.map((s) => {
                  const isCurrentSelected = s.id === selectedShiftDetail.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedShiftDetail(s)}
                      className={cn(
                        'p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all cursor-pointer',
                        isCurrentSelected
                          ? isDarkMode
                            ? 'bg-[#17233B] border-[#89CEFF] ring-1 ring-[#89CEFF]/50 shadow-sm'
                            : 'bg-blue-50/70 border-blue-400 shadow-sm'
                          : isDarkMode
                          ? 'bg-[#0B1326] border-[#3E4850]/40 hover:border-[#89CEFF]/40'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-16 font-mono font-bold text-slate-300 text-[11px]">
                          {DAY_LABELS[s.dayOfWeek]}
                        </span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-mono font-bold border',
                            s.shiftType === 'MORNING'
                              ? 'bg-blue-500/15 text-[#89CEFF] border-blue-500/30'
                              : s.shiftType === 'AFTERNOON'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                          )}
                        >
                          {s.shiftHours}
                        </span>
                        <span className="text-slate-400 truncate max-w-[200px] hidden sm:inline">
                          {s.specificTask}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        {s.status === 'IN_PROGRESS' ? (
                          <span className="text-cyan-400 font-bold">Đang trực</span>
                        ) : (
                          <span className="text-emerald-400 font-medium">Đã nhận</span>
                        )}
                        <span className="text-slate-500">{s.dateString}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-highlight/30">
              <button
                type="button"
                onClick={() => {
                  const toDelete = selectedShiftDetail;
                  setSelectedShiftDetail(null);
                  handleDeleteShift(toDelete.id, toDelete.staffName);
                }}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5',
                  isDarkMode
                    ? 'border-rose-500/40 text-rose-400 hover:bg-rose-500/10'
                    : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                )}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Ca Này</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedShiftDetail(null)}
                className="px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
