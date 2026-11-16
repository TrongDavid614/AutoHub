export type ShiftType = 'MORNING' | 'AFTERNOON' | 'FULL_DAY';
export type StaffRoleCategory = 'SALES' | 'TEST_DRIVE' | 'WAREHOUSE' | 'SUPERVISOR';
export type ShiftStatus = 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING_CONFIRMATION' | 'LEAVE_REQUESTED';

export interface StaffMember {
  id: string; // "STF-001" or numeric string
  numericId: number;
  name: string;
  phone: string;
  email?: string;
  role: StaffRoleCategory;
  roleLabel: string;
  showroomId: string;
  showroomName: string;
  avatarColor: string;
}

export interface ShiftAssignment {
  id: string; // "SH-001" or "1"
  numericId?: number;
  staffId: string;
  staffNumericId?: number;
  staffName: string;
  staffCode: string;
  staffPhone?: string;
  role: StaffRoleCategory;
  roleLabel: string;
  showroomId: string;
  showroomName: string;
  dayOfWeek: number; // 0: Thứ 2, 1: Thứ 3, ..., 6: Chủ Nhật
  dateString: string; // "27/10/2026"
  isoDate?: string; // "2026-10-27"
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

export interface StaffScheduleStats {
  totalShiftsThisWeek: number;
  testDriveShifts: number;
  warehouseShifts: number;
  salesShifts: number;
  supervisorShifts: number;
  pendingSwapRequests: number;
  coverageRate: string;
  activeStaffCount: number;
}

export interface AutoSchedulePayload {
  showroomId?: number | null;
  startDate?: string; // "YYYY-MM-DD"
  maxShiftsPerStaff?: number;
  strategy?: 'BALANCED' | 'WEEKEND_HEAVY';
  replaceExisting?: boolean;
}

export interface AutoScheduleResult {
  totalShiftsCreated: number;
  totalStaffAssigned: number;
  coverageRate: number;
  avgShiftsPerStaff: number;
  avgHoursPerStaff: number;
  strategy: string;
  message: string;
  schedules: ShiftAssignment[];
}

export interface CreateShiftPayload {
  staffId: number;
  showroomId: number;
  ngayTruc: string; // "YYYY-MM-DD"
  caTruc: string; // "CA_SANG" | "CA_CHIEU" | "CA_HANH_CHINH"
  ghiChu?: string;
}

export interface CreateSwapPayload {
  requesterId: number;
  requesterScheduleId: number;
  targetStaffId: number;
  targetScheduleId?: number;
  reason: string;
}

