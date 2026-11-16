import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type {
  ShiftAssignment,
  StaffMember,
  SwapRequest,
  StaffScheduleStats,
  AutoSchedulePayload,
  AutoScheduleResult,
  CreateShiftPayload,
  CreateSwapPayload,
  ShiftType,
  StaffRoleCategory,
  ShiftStatus,
} from '@/types/staff-schedule.types';

interface BackendScheduleDto {
  id: number;
  staffId: number;
  staffName: string;
  staffCode: string;
  staffPhone?: string;
  role: string;
  roleLabel: string;
  showroomId: number;
  showroomName: string;
  ngayTruc: string;
  dayOfWeek: number;
  dateString: string;
  caTruc: string;
  shiftType: string;
  shiftHours: string;
  specificTask: string;
  status: string;
  ngayTao?: string;
}

interface BackendStaffOptionDto {
  id: number;
  staffCode: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  roleLabel: string;
  showroomId: number;
  showroomName: string;
  avatarColor: string;
}

interface BackendSwapDto {
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

function mapToShiftAssignment(dto: BackendScheduleDto): ShiftAssignment {
  const shiftTypeNormalized: ShiftType =
    dto.shiftType === 'AFTERNOON' || dto.caTruc === 'CA_CHIEU'
      ? 'AFTERNOON'
      : dto.shiftType === 'FULL_DAY' || dto.caTruc === 'CA_HANH_CHINH' || dto.caTruc === 'CA_FULL'
      ? 'FULL_DAY'
      : 'MORNING';

  const roleNormalized: StaffRoleCategory =
    dto.role === 'TEST_DRIVE'
      ? 'TEST_DRIVE'
      : dto.role === 'WAREHOUSE'
      ? 'WAREHOUSE'
      : dto.role === 'SUPERVISOR'
      ? 'SUPERVISOR'
      : 'SALES';

  const statusNormalized: ShiftStatus =
    dto.status === 'IN_PROGRESS'
      ? 'IN_PROGRESS'
      : dto.status === 'COMPLETED'
      ? 'COMPLETED'
      : 'CONFIRMED';

  const showroomIdStr = dto.showroomId ? `SR-${dto.showroomId}` : 'SR-ALL';

  return {
    id: `SH-${dto.id}`,
    numericId: dto.id,
    staffId: `STF-${String(dto.staffId).padStart(3, '0')}`,
    staffNumericId: dto.staffId,
    staffName: dto.staffName,
    staffCode: dto.staffCode || `STF-${String(dto.staffId).padStart(3, '0')}`,
    staffPhone: dto.staffPhone,
    role: roleNormalized,
    roleLabel: dto.roleLabel,
    showroomId: showroomIdStr,
    showroomName: dto.showroomName,
    dayOfWeek: dto.dayOfWeek != null ? dto.dayOfWeek : 0,
    dateString: dto.dateString,
    isoDate: dto.ngayTruc,
    shiftType: shiftTypeNormalized,
    shiftHours: dto.shiftHours,
    specificTask: dto.specificTask,
    status: statusNormalized,
  };
}

function mapToStaffMember(dto: BackendStaffOptionDto): StaffMember {
  const roleNormalized: StaffRoleCategory =
    dto.role === 'TEST_DRIVE'
      ? 'TEST_DRIVE'
      : dto.role === 'WAREHOUSE'
      ? 'WAREHOUSE'
      : dto.role === 'SUPERVISOR'
      ? 'SUPERVISOR'
      : 'SALES';

  return {
    id: dto.staffCode || `STF-${String(dto.id).padStart(3, '0')}`,
    numericId: dto.id,
    name: dto.name,
    phone: dto.phone,
    email: dto.email,
    role: roleNormalized,
    roleLabel: dto.roleLabel,
    showroomId: dto.showroomId ? `SR-${dto.showroomId}` : 'SR-ALL',
    showroomName: dto.showroomName,
    avatarColor: dto.avatarColor || 'bg-blue-600',
  };
}

export const adminStaffScheduleService = {
  async getSchedules(
    params?: {
      showroomId?: number | null;
      startDate?: string;
      endDate?: string;
      shiftType?: string;
      role?: string;
      keyword?: string;
    },
    signal?: AbortSignal
  ): Promise<ShiftAssignment[]> {
    const res = await axiosClient.get<unknown, ApiResponse<BackendScheduleDto[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.STAFF_SCHEDULES,
      { params, signal }
    );
    const data = res.data || [];
    return data.map(mapToShiftAssignment);
  },

  async getStats(
    params?: {
      showroomId?: number | null;
      startDate?: string;
      endDate?: string;
    },
    signal?: AbortSignal
  ): Promise<StaffScheduleStats> {
    const res = await axiosClient.get<unknown, ApiResponse<StaffScheduleStats>>(
      API_CONFIG.ENDPOINTS.ADMIN.STAFF_SCHEDULES_STATS,
      { params, signal }
    );
    return (
      res.data || {
        totalShiftsThisWeek: 0,
        testDriveShifts: 0,
        warehouseShifts: 0,
        salesShifts: 0,
        supervisorShifts: 0,
        pendingSwapRequests: 0,
        coverageRate: '100% Đạt chỉ tiêu',
        activeStaffCount: 0,
      }
    );
  },

  async getStaffOptions(showroomId?: number | null, signal?: AbortSignal): Promise<StaffMember[]> {
    const res = await axiosClient.get<unknown, ApiResponse<BackendStaffOptionDto[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.STAFF_SCHEDULES_STAFF,
      { params: showroomId ? { showroomId } : {}, signal }
    );
    const data = res.data || [];
    return data.map(mapToStaffMember);
  },

  async createSchedule(payload: CreateShiftPayload): Promise<ShiftAssignment> {
    const res = await axiosClient.post<unknown, ApiResponse<BackendScheduleDto>>(
      API_CONFIG.ENDPOINTS.ADMIN.STAFF_SCHEDULES,
      payload
    );
    return mapToShiftAssignment(res.data);
  },

  async deleteSchedule(id: number): Promise<void> {
    await axiosClient.delete<unknown, ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.STAFF_SCHEDULES}/${id}`
    );
  },

  async autoSchedule(payload: AutoSchedulePayload): Promise<AutoScheduleResult> {
    const res = await axiosClient.post<unknown, ApiResponse<AutoScheduleResult & { schedules: BackendScheduleDto[] }>>(
      API_CONFIG.ENDPOINTS.ADMIN.STAFF_SCHEDULES_AUTO,
      payload
    );
    const raw = res.data;
    return {
      totalShiftsCreated: raw?.totalShiftsCreated || 0,
      totalStaffAssigned: raw?.totalStaffAssigned || 0,
      coverageRate: raw?.coverageRate || 100,
      avgShiftsPerStaff: raw?.avgShiftsPerStaff || 0,
      avgHoursPerStaff: raw?.avgHoursPerStaff || 0,
      strategy: raw?.strategy || 'BALANCED',
      message: raw?.message || 'Phân ca tự động thành công',
      schedules: (raw?.schedules || []).map(mapToShiftAssignment),
    };
  },

  async getSwapRequests(signal?: AbortSignal): Promise<SwapRequest[]> {
    const res = await axiosClient.get<unknown, ApiResponse<BackendSwapDto[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.STAFF_SCHEDULES_SWAP,
      { signal }
    );
    return res.data || [];
  },

  async createSwapRequest(payload: CreateSwapPayload): Promise<SwapRequest> {
    const res = await axiosClient.post<unknown, ApiResponse<BackendSwapDto>>(
      API_CONFIG.ENDPOINTS.ADMIN.STAFF_SCHEDULES_SWAP,
      payload
    );
    return res.data;
  },

  async approveSwapRequest(id: string): Promise<SwapRequest> {
    const res = await axiosClient.put<unknown, ApiResponse<BackendSwapDto>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.STAFF_SCHEDULES_SWAP}/${id}/approve`
    );
    return res.data;
  },

  async rejectSwapRequest(id: string): Promise<SwapRequest> {
    const res = await axiosClient.put<unknown, ApiResponse<BackendSwapDto>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.STAFF_SCHEDULES_SWAP}/${id}/reject`
    );
    return res.data;
  },

  async exportCsv(params?: {
    showroomId?: number | null;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const res = await axiosClient.get(API_CONFIG.ENDPOINTS.ADMIN.STAFF_SCHEDULES_EXPORT, {
      params,
      responseType: 'blob',
    });
    return res as unknown as Blob;
  },
};

