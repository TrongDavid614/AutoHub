import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';

export type ShiftType = 'MORNING' | 'AFTERNOON' | 'FULL_DAY';
export type StaffRoleCategory = 'SALES' | 'TEST_DRIVE' | 'WAREHOUSE' | 'SUPERVISOR';
export type ShiftStatus = 'CONFIRMED' | 'IN_PROGRESS' | 'PENDING_CONFIRMATION' | 'LEAVE_REQUESTED';

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: StaffRoleCategory;
  roleLabel: string;
  showroomId: string;
  showroomName: string;
  avatarColor: string;
}

export interface ShiftAssignment {
  id: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  role: StaffRoleCategory;
  roleLabel: string;
  showroomId: string;
  showroomName: string;
  dayOfWeek: number; // 0: Thứ 2, 1: Thứ 3, ..., 6: Chủ Nhật
  dateString: string; // "27/10/2026"
  shiftType: ShiftType;
  shiftHours: string;
  specificTask: string;
  status: ShiftStatus;
  notes?: string;
}

export interface SwapRequest {
  id: string;
  requesterName: string;
  requesterCode: string;
  currentDate: string;
  currentShift: string;
  targetStaffName: string;
  targetStaffCode: string;
  targetDate: string;
  targetShift: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const SHOWROOMS = [
  { id: 'ALL', name: 'Toàn Hệ Thống Showroom' },
  { id: 'SR-HCM-01', name: 'Sài Gòn Central (Q.7)' },
  { id: 'SR-HN-01', name: 'Cầu Giấy (Hà Nội)' },
  { id: 'SR-DN-01', name: 'Đà Nẵng Riverside' },
];

const STAFF_LIST: StaffMember[] = [
  {
    id: 'STF-001',
    name: 'Nguyễn Quản Trị',
    phone: '0912.000.999',
    role: 'SUPERVISOR',
    roleLabel: 'Giám Sát Vận Hành',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central (Q.7)',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'STF-002',
    name: 'Lê Quốc Bảo',
    phone: '0908.112.233',
    role: 'SALES',
    roleLabel: 'Tư Vấn Bán Hàng',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central (Q.7)',
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'STF-003',
    name: 'Phạm Hoàng Nam',
    phone: '0933.445.566',
    role: 'TEST_DRIVE',
    roleLabel: 'Điều Phối Lái Thử',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central (Q.7)',
    avatarColor: 'bg-cyan-600',
  },
  {
    id: 'STF-004',
    name: 'Nguyễn Văn Tuấn',
    phone: '0988.123.456',
    role: 'SUPERVISOR',
    roleLabel: 'Trưởng Ca Showroom',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central (Q.7)',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'STF-005',
    name: 'Đặng Minh Khôi',
    phone: '0977.334.455',
    role: 'WAREHOUSE',
    roleLabel: 'Kho & Đóng Gói Phụ Kiện',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central (Q.7)',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'STF-006',
    name: 'Trần Thị Thu Hà',
    phone: '0977.888.999',
    role: 'SALES',
    roleLabel: 'Tư Vấn Bán Hàng',
    showroomId: 'SR-HN-01',
    showroomName: 'Cầu Giấy (Hà Nội)',
    avatarColor: 'bg-rose-600',
  },
  {
    id: 'STF-007',
    name: 'Vũ Hải Đăng',
    phone: '0966.777.888',
    role: 'TEST_DRIVE',
    roleLabel: 'Điều Phối Lái Thử',
    showroomId: 'SR-HN-01',
    showroomName: 'Cầu Giấy (Hà Nội)',
    avatarColor: 'bg-teal-600',
  },
  {
    id: 'STF-008',
    name: 'Hoàng Gia Bảo',
    phone: '0919.223.344',
    role: 'SALES',
    roleLabel: 'Tư Vấn Bán Hàng',
    showroomId: 'SR-DN-01',
    showroomName: 'Đà Nẵng Riverside',
    avatarColor: 'bg-violet-600',
  },
  {
    id: 'STF-009',
    name: 'Bùi Phương Thảo',
    phone: '0944.556.677',
    role: 'WAREHOUSE',
    roleLabel: 'Kho & Bàn Giao Xe',
    showroomId: 'SR-DN-01',
    showroomName: 'Đà Nẵng Riverside',
    avatarColor: 'bg-pink-600',
  },
];

const WEEK_DAYS = [
  { index: 0, label: 'Thứ Hai', dateStr: '27/10/2026' },
  { index: 1, label: 'Thứ Ba', dateStr: '28/10/2026' },
  { index: 2, label: 'Thứ Tư', dateStr: '29/10/2026' },
  { index: 3, label: 'Thứ Năm', dateStr: '30/10/2026' },
  { index: 4, label: 'Thứ Sáu', dateStr: '31/10/2026' },
  { index: 5, label: 'Thứ Bảy', dateStr: '01/11/2026' },
  { index: 6, label: 'Chủ Nhật', dateStr: '02/11/2026' },
];

const INITIAL_SHIFTS: ShiftAssignment[] = [
  // Thứ 2
  {
    id: 'SH-001',
    staffId: 'STF-004',
    staffName: 'Nguyễn Văn Tuấn',
    staffCode: 'STF-004',
    role: 'SUPERVISOR',
    roleLabel: 'Trưởng Ca',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 0,
    dateString: '27/10/2026',
    shiftType: 'MORNING',
    shiftHours: '08:00 - 15:00',
    specificTask: 'Điều phối mở cửa showroom, bàn giao tủ khóa Demo',
    status: 'CONFIRMED',
  },
  {
    id: 'SH-002',
    staffId: 'STF-002',
    staffName: 'Lê Quốc Bảo',
    staffCode: 'STF-002',
    role: 'SALES',
    roleLabel: 'Tư Vấn Khách',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 0,
    dateString: '27/10/2026',
    shiftType: 'MORNING',
    shiftHours: '08:00 - 15:00',
    specificTask: 'Tiếp đón khách tham quan showroom & cọc giữ chỗ 72h',
    status: 'CONFIRMED',
  },
  {
    id: 'SH-003',
    staffId: 'STF-003',
    staffName: 'Phạm Hoàng Nam',
    staffCode: 'STF-003',
    role: 'TEST_DRIVE',
    roleLabel: 'Lái Thử Xe',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 0,
    dateString: '27/10/2026',
    shiftType: 'AFTERNOON',
    shiftHours: '14:30 - 21:00',
    specificTask: 'Phụ trách 4 lượt trải nghiệm GT-e & VF8',
    status: 'CONFIRMED',
  },
  {
    id: 'SH-004',
    staffId: 'STF-005',
    staffName: 'Đặng Minh Khôi',
    staffCode: 'STF-005',
    role: 'WAREHOUSE',
    roleLabel: 'Kho Phụ Kiện',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 0,
    dateString: '27/10/2026',
    shiftType: 'FULL_DAY',
    shiftHours: '08:30 - 17:30',
    specificTask: 'Kiểm kê sạc 800V SiC & đóng gói 18 kiện xuất kho',
    status: 'CONFIRMED',
  },

  // Thứ 3
  {
    id: 'SH-005',
    staffId: 'STF-002',
    staffName: 'Lê Quốc Bảo',
    staffCode: 'STF-002',
    role: 'SALES',
    roleLabel: 'Tư Vấn Khách',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 1,
    dateString: '28/10/2026',
    shiftType: 'MORNING',
    shiftHours: '08:00 - 15:00',
    specificTask: 'Tư vấn hợp đồng tài chính mua trả góp cho khách',
    status: 'CONFIRMED',
  },
  {
    id: 'SH-006',
    staffId: 'STF-004',
    staffName: 'Nguyễn Văn Tuấn',
    staffCode: 'STF-004',
    role: 'SUPERVISOR',
    roleLabel: 'Trưởng Ca',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 1,
    dateString: '28/10/2026',
    shiftType: 'AFTERNOON',
    shiftHours: '14:30 - 21:00',
    specificTask: 'Trực POS thanh toán cọc xe & bàn giao biên bản cuối ngày',
    status: 'CONFIRMED',
  },
  {
    id: 'SH-007',
    staffId: 'STF-006',
    staffName: 'Trần Thị Thu Hà',
    staffCode: 'STF-006',
    role: 'SALES',
    roleLabel: 'Tư Vấn Khách',
    showroomId: 'SR-HN-01',
    showroomName: 'Cầu Giấy (Hà Nội)',
    dayOfWeek: 1,
    dateString: '28/10/2026',
    shiftType: 'FULL_DAY',
    shiftHours: '08:30 - 17:30',
    specificTask: 'Tiếp khách showroom miền Bắc & đối soát cọc VIN',
    status: 'CONFIRMED',
  },

  // Thứ 4 (Hôm nay)
  {
    id: 'SH-008',
    staffId: 'STF-003',
    staffName: 'Phạm Hoàng Nam',
    staffCode: 'STF-003',
    role: 'TEST_DRIVE',
    roleLabel: 'Lái Thử Xe',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 2,
    dateString: '29/10/2026',
    shiftType: 'MORNING',
    shiftHours: '08:00 - 15:00',
    specificTask: 'Kiểm tra pin, áp suất lốp 4 xe demo trước giờ lái thử',
    status: 'IN_PROGRESS',
  },
  {
    id: 'SH-009',
    staffId: 'STF-004',
    staffName: 'Nguyễn Văn Tuấn',
    staffCode: 'STF-004',
    role: 'SUPERVISOR',
    roleLabel: 'Trưởng Ca',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 2,
    dateString: '29/10/2026',
    shiftType: 'MORNING',
    shiftHours: '08:00 - 15:00',
    specificTask: 'Giám sát điều phối nhân sự tiếp nhận lead tư vấn',
    status: 'IN_PROGRESS',
  },
  {
    id: 'SH-010',
    staffId: 'STF-002',
    staffName: 'Lê Quốc Bảo',
    staffCode: 'STF-002',
    role: 'SALES',
    roleLabel: 'Tư Vấn Khách',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 2,
    dateString: '29/10/2026',
    shiftType: 'AFTERNOON',
    shiftHours: '14:30 - 21:00',
    specificTask: 'Bàn giao ca trực chiều, tiếp nhận khách VIP',
    status: 'PENDING_CONFIRMATION',
  },
  {
    id: 'SH-011',
    staffId: 'STF-007',
    staffName: 'Vũ Hải Đăng',
    staffCode: 'STF-007',
    role: 'TEST_DRIVE',
    roleLabel: 'Lái Thử Xe',
    showroomId: 'SR-HN-01',
    showroomName: 'Cầu Giấy (Hà Nội)',
    dayOfWeek: 2,
    dateString: '29/10/2026',
    shiftType: 'AFTERNOON',
    shiftHours: '14:30 - 21:00',
    specificTask: 'Hỗ trợ khách lái thử tuyến đường cao tốc Nhật Tân',
    status: 'CONFIRMED',
  },

  // Thứ 5
  {
    id: 'SH-012',
    staffId: 'STF-005',
    staffName: 'Đặng Minh Khôi',
    staffCode: 'STF-005',
    role: 'WAREHOUSE',
    roleLabel: 'Kho Phụ Kiện',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 3,
    dateString: '30/10/2026',
    shiftType: 'FULL_DAY',
    shiftHours: '08:30 - 17:30',
    specificTask: 'Soạn đơn giao hàng COD phụ kiện & kiểm định tem chống giả',
    status: 'CONFIRMED',
  },
  {
    id: 'SH-013',
    staffId: 'STF-008',
    staffName: 'Hoàng Gia Bảo',
    staffCode: 'STF-008',
    role: 'SALES',
    roleLabel: 'Tư Vấn Khách',
    showroomId: 'SR-DN-01',
    showroomName: 'Đà Nẵng Riverside',
    dayOfWeek: 3,
    dateString: '30/10/2026',
    shiftType: 'MORNING',
    shiftHours: '08:00 - 15:00',
    specificTask: 'Tiếp đón khách ký hợp đồng cọc xe VIN 72h',
    status: 'CONFIRMED',
  },

  // Thứ 6
  {
    id: 'SH-014',
    staffId: 'STF-002',
    staffName: 'Lê Quốc Bảo',
    staffCode: 'STF-002',
    role: 'SALES',
    roleLabel: 'Tư Vấn Khách',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 4,
    dateString: '31/10/2026',
    shiftType: 'MORNING',
    shiftHours: '08:00 - 15:00',
    specificTask: 'Tư vấn dự toán lăn bánh và đối soát voucher cho khách',
    status: 'CONFIRMED',
  },
  {
    id: 'SH-015',
    staffId: 'STF-003',
    staffName: 'Phạm Hoàng Nam',
    staffCode: 'STF-003',
    role: 'TEST_DRIVE',
    roleLabel: 'Lái Thử Xe',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 4,
    dateString: '31/10/2026',
    shiftType: 'AFTERNOON',
    shiftHours: '14:30 - 21:00',
    specificTask: 'Hỗ trợ khách hàng test tính năng sạc nhanh 800V',
    status: 'CONFIRMED',
  },

  // Thứ 7 (Cuối tuần cao điểm)
  {
    id: 'SH-016',
    staffId: 'STF-004',
    staffName: 'Nguyễn Văn Tuấn',
    staffCode: 'STF-004',
    role: 'SUPERVISOR',
    roleLabel: 'Trưởng Ca',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 5,
    dateString: '01/11/2026',
    shiftType: 'FULL_DAY',
    shiftHours: '08:00 - 21:00',
    specificTask: 'Trực cao điểm cuối tuần, đón tiếp đoàn khách sự kiện lái thử',
    status: 'CONFIRMED',
  },
  {
    id: 'SH-017',
    staffId: 'STF-002',
    staffName: 'Lê Quốc Bảo',
    staffCode: 'STF-002',
    role: 'SALES',
    roleLabel: 'Tư Vấn Khách',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 5,
    dateString: '01/11/2026',
    shiftType: 'MORNING',
    shiftHours: '08:00 - 15:00',
    specificTask: 'Hỗ trợ sự kiện ra mắt gói phụ kiện bảo hành mở rộng',
    status: 'CONFIRMED',
  },
  {
    id: 'SH-018',
    staffId: 'STF-003',
    staffName: 'Phạm Hoàng Nam',
    staffCode: 'STF-003',
    role: 'TEST_DRIVE',
    roleLabel: 'Lái Thử Xe',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 5,
    dateString: '01/11/2026',
    shiftType: 'AFTERNOON',
    shiftHours: '14:30 - 21:00',
    specificTask: 'Đồng hành 6 lượt lái thử xe demo GT-e',
    status: 'CONFIRMED',
  },

  // Chủ Nhật
  {
    id: 'SH-019',
    staffId: 'STF-005',
    staffName: 'Đặng Minh Khôi',
    staffCode: 'STF-005',
    role: 'WAREHOUSE',
    roleLabel: 'Kho Phụ Kiện',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 6,
    dateString: '02/11/2026',
    shiftType: 'MORNING',
    shiftHours: '08:00 - 15:00',
    specificTask: 'Bàn giao phụ kiện lắp đặt trực tiếp tại xưởng dịch vụ',
    status: 'CONFIRMED',
  },
  {
    id: 'SH-020',
    staffId: 'STF-002',
    staffName: 'Lê Quốc Bảo',
    staffCode: 'STF-002',
    role: 'SALES',
    roleLabel: 'Tư Vấn Khách',
    showroomId: 'SR-HCM-01',
    showroomName: 'Sài Gòn Central',
    dayOfWeek: 6,
    dateString: '02/11/2026',
    shiftType: 'AFTERNOON',
    shiftHours: '14:30 - 21:00',
    specificTask: 'Tổng kết doanh số tuần và báo cáo hợp đồng cọc giữ xe',
    status: 'CONFIRMED',
  },
];

const INITIAL_SWAP_REQUESTS: SwapRequest[] = [
  {
    id: 'SW-101',
    requesterName: 'Lê Quốc Bảo',
    requesterCode: 'STF-002',
    currentDate: '29/10/2026',
    currentShift: 'Ca Chiều (14:30 - 21:00)',
    targetStaffName: 'Phạm Hoàng Nam',
    targetStaffCode: 'STF-003',
    targetDate: '30/10/2026',
    targetShift: 'Ca Sáng (08:00 - 15:00)',
    reason: 'Có lịch đón gia đình từ quê lên bến xe miền Đông lúc 16h',
    status: 'PENDING',
  },
  {
    id: 'SW-102',
    requesterName: 'Vũ Hải Đăng',
    requesterCode: 'STF-007',
    currentDate: '31/10/2026',
    currentShift: 'Ca Chiều (14:30 - 21:00)',
    targetStaffName: 'Trần Thị Thu Hà',
    targetStaffCode: 'STF-006',
    targetDate: '01/11/2026',
    targetShift: 'Ca Sáng (08:00 - 15:00)',
    reason: 'Tham gia lớp tập huấn chứng chỉ an toàn pin điện cao áp EV',
    status: 'PENDING',
  },
];

export const StaffSchedulePage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  // State management
  const [shifts, setShifts] = useState<ShiftAssignment[]>(INITIAL_SHIFTS);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(INITIAL_SWAP_REQUESTS);
  const [selectedShowroom, setSelectedShowroom] = useState<string>('ALL');
  const [selectedShiftTypeFilter, setSelectedShiftTypeFilter] = useState<string>('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'WEEK_MATRIX' | 'SWAP_REQUESTS'>('WEEK_MATRIX');
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(44); // Tuần 44

  // Modal State
  const [selectedShiftDetail, setSelectedShiftDetail] = useState<ShiftAssignment | null>(null);

  const staffWeekShifts = useMemo(() => {
    if (!selectedShiftDetail) return [];
    return shifts.filter((s) => s.staffId === selectedShiftDetail.staffId);
  }, [shifts, selectedShiftDetail]);

  const staffInfo = useMemo(() => {
    if (!selectedShiftDetail) return null;
    return STAFF_LIST.find((s) => s.id === selectedShiftDetail.staffId);
  }, [selectedShiftDetail]);

  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [modalTargetDay, setModalTargetDay] = useState<number>(0);
  const [selectedStaffForAssign, setSelectedStaffForAssign] = useState<string>(STAFF_LIST[1].id);
  const [selectedShiftTypeForAssign, setSelectedShiftTypeForAssign] = useState<ShiftType>('MORNING');
  const [selectedShowroomForAssign, setSelectedShowroomForAssign] = useState<string>('SR-HCM-01');
  const [taskNoteForAssign, setTaskNoteForAssign] = useState<string>('');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered shifts
  const filteredShifts = useMemo(() => {
    return shifts.filter((item) => {
      // Showroom filter
      if (selectedShowroom !== 'ALL' && item.showroomId !== selectedShowroom) {
        return false;
      }
      // Shift Type filter
      if (selectedShiftTypeFilter !== 'ALL' && item.shiftType !== selectedShiftTypeFilter) {
        return false;
      }
      // Role filter
      if (selectedRoleFilter !== 'ALL' && item.role !== selectedRoleFilter) {
        return false;
      }
      // Search keyword
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

  // Handle Quick Add Shift to day
  const handleOpenAssignModal = (dayIndex: number, defaultShift: ShiftType = 'MORNING') => {
    setModalTargetDay(dayIndex);
    setSelectedShiftTypeForAssign(defaultShift);
    setTaskNoteForAssign('');
    setShowAssignModal(true);
  };

  // Submit Shift Assignment
  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = STAFF_LIST.find((s) => s.id === selectedStaffForAssign);
    if (!staff) return;

    const showroom = SHOWROOMS.find((sr) => sr.id === selectedShowroomForAssign) || SHOWROOMS[1];
    const targetDayInfo = WEEK_DAYS[modalTargetDay];

    const hoursMap: Record<ShiftType, string> = {
      MORNING: '08:00 - 15:00',
      AFTERNOON: '14:30 - 21:00',
      FULL_DAY: '08:30 - 17:30',
    };

    const newAssignment: ShiftAssignment = {
      id: `SH-${Date.now().toString().slice(-4)}`,
      staffId: staff.id,
      staffName: staff.name,
      staffCode: staff.id,
      role: staff.role,
      roleLabel: staff.roleLabel,
      showroomId: showroom.id,
      showroomName: showroom.name,
      dayOfWeek: modalTargetDay,
      dateString: targetDayInfo.dateStr,
      shiftType: selectedShiftTypeForAssign,
      shiftHours: hoursMap[selectedShiftTypeForAssign],
      specificTask: taskNoteForAssign.trim() || 'Trực vận hành showroom tiêu chuẩn',
      status: 'CONFIRMED',
    };

    setShifts((prev) => [...prev, newAssignment]);
    setShowAssignModal(false);
    showToast(`Đã phân công thành công ${staff.name} (${staff.id}) vào ${targetDayInfo.label}!`);
  };

  // Remove shift
  const handleDeleteShift = (shiftId: string, staffName: string) => {
    if (window.confirm(`Xác nhận xóa ca làm việc của ${staffName}?`)) {
      setShifts((prev) => prev.filter((s) => s.id !== shiftId));
      showToast(`Đã xóa ca trực của ${staffName}.`);
    }
  };

  // Handle Swap Request Approval
  const handleApproveSwap = (id: string, req: SwapRequest) => {
    setSwapRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
    showToast(`Đã phê duyệt yêu cầu đổi ca trực giữa ${req.requesterName} và ${req.targetStaffName}!`);
  };

  const handleRejectSwap = (id: string, req: SwapRequest) => {
    setSwapRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
    );
    showToast(`Đã từ chối yêu cầu đổi ca trực của ${req.requesterName}.`);
  };

  // Auto-schedule generator
  const handleAutoSchedule = () => {
    showToast('Hệ thống đã tự động phân bổ cân bằng ca trực theo năng suất và định mức giờ làm!');
  };

  return (
    <div className={cn('space-y-6 antialiased transition-colors duration-300', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl shadow-2xl border border-emerald-500 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
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
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 text-[10px] font-mono font-bold">
              100% ĐỘ PHỦ CA
            </span>
          </div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Phân Công Lịch Trực & Ca Làm Việc Nhân Viên
          </h1>
          <p className={cn('text-sm mt-0.5 max-w-2xl', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Quản trị điều phối nhân sự showroom, phân bổ ca lái thử xe demo, hỗ trợ đóng gói phụ kiện và đối soát bàn giao ca trực trên toàn hệ thống.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleAutoSchedule}
            className={cn(
              'h-[38px] flex items-center gap-2 px-3.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer',
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF] border-[#89CEFF]/40 hover:border-[#89CEFF]'
                : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
            )}
            title="Tự động phân bổ lịch làm việc thông minh"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Tự Động Xếp Ca</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Đang xuất bảng lịch trực tuần ra định dạng Excel (.xlsx)...')}
            className={cn(
              'h-[38px] flex items-center gap-2 px-3.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
              isDarkMode
                ? 'bg-[#0B1326] text-[#DAE2FD] hover:text-white border-[#3E4850]/70'
                : 'bg-white text-slate-700 hover:text-slate-900 border-slate-300'
            )}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Xuất Excel</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAssignModal(2, 'MORNING')}
            className="h-[38px] flex items-center gap-2 px-4 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Phân Công Ca Mới</span>
          </button>
        </div>
      </div>

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
              {shifts.length}
            </span>
            <span className="text-[11px] font-mono text-emerald-500 font-bold">100% Đạt chỉ tiêu</span>
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
              {shifts.filter((s) => s.role === 'TEST_DRIVE').length}
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
              {shifts.filter((s) => s.role === 'WAREHOUSE').length}
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

          {/* Week Navigator */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentWeekIndex((prev) => prev - 1)}
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
              <span>Tuần {currentWeekIndex} (27/10 - 02/11/2026)</span>
            </div>

            <button
              type="button"
              onClick={() => setCurrentWeekIndex((prev) => prev + 1)}
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
              onClick={() => setCurrentWeekIndex(44)}
              className={cn(
                'px-2.5 py-1.5 rounded-md text-[11px] font-semibold border cursor-pointer transition-colors',
                isDarkMode ? 'border-[#3E4850] text-[#89CEFF] hover:bg-[#171F33]' : 'border-slate-300 text-blue-600 hover:bg-slate-50'
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
              {SHOWROOMS.map((sr) => (
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
              <Search className={cn('w-4 h-4 absolute left-3 top-2.5', isDarkMode ? 'text-slate-400' : 'text-slate-500')} />
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
            {WEEK_DAYS.map((day) => {
              const dayShifts = filteredShifts.filter((s) => s.dayOfWeek === day.index);
              const isToday = day.index === 2; // Giả lập hôm nay Thứ Tư

              return (
                <div
                  key={day.index}
                  className={cn(
                    'rounded-xl border flex flex-col transition-all duration-200',
                    isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-2xs',
                    isToday && (isDarkMode ? 'ring-2 ring-[#89CEFF]/60 border-[#89CEFF]' : 'ring-2 ring-blue-500/40 border-blue-400')
                  )}
                >
                  {/* Day Column Header */}
                  <div
                    className={cn(
                      'p-3 border-b flex items-center justify-between',
                      isDarkMode ? 'border-[#3E4850]/40 bg-[#131B2E]/60' : 'border-slate-100 bg-slate-50/80',
                      isToday && (isDarkMode ? 'bg-blue-950/40 text-[#89CEFF]' : 'bg-blue-50/80 text-blue-700')
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">{day.label}</span>
                        {isToday && (
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
                              <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border', shiftBadgeColor)}>
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
                                <div className={cn('font-bold truncate text-[11px]', isDarkMode ? 'text-white' : 'text-slate-900')}>
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
                                isDarkMode ? 'bg-[#0B1326]/70 border-[#3E4850]/40 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
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
            {swapRequests.map((req) => (
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
                      isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
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
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN / EDIT SHIFT */}
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
                  Phân Công Ca Trực - {WEEK_DAYS[modalTargetDay].label} ({WEEK_DAYS[modalTargetDay].dateStr})
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
                  {STAFF_LIST.map((staff) => (
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
                  onChange={(e) => setSelectedShowroomForAssign(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2.5 text-xs border rounded-lg focus:outline-none transition-colors cursor-pointer',
                    isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850] text-white focus:border-[#89CEFF]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                  )}
                >
                  {SHOWROOMS.filter((sr) => sr.id !== 'ALL').map((sr) => (
                    <option key={sr.id} value={sr.id}>
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
                    isDarkMode ? 'border-[#3E4850] text-slate-300 hover:bg-[#0B1326]' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
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
      {/* MODAL: STAFF SHIFT & SCHEDULE DETAIL */}
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
                    <h3 className="text-base font-bold">
                      {selectedShiftDetail.staffName}
                    </h3>
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
                    <span>{WEEK_DAYS[selectedShiftDetail.dayOfWeek].label}, {selectedShiftDetail.dateString}</span>
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
                <span className="text-slate-400 text-[11px] block mb-1 font-semibold">Nhiệm vụ phân công cụ thể:</span>
                <div
                  className={cn(
                    'p-3 rounded-lg border text-xs leading-relaxed font-medium',
                    isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
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
                          {WEEK_DAYS[s.dayOfWeek].label}
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
                className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer"
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
