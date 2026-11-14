import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type {
  AdminShowroomItem,
  AdminShowroomDetail,
  AdminShowroomStats,
  ProvinceOption,
  CreateShowroomPayload,
  UpdateShowroomPayload,
  CreateDemoCarPayload,
  DemoCarItem,
} from '@/types/showroom.types';

export const adminShowroomService = {
  async getShowrooms(
    params?: { keyword?: string; region?: string; active?: boolean },
    signal?: AbortSignal
  ): Promise<AdminShowroomItem[]> {
    const res = await axiosClient.get<unknown, ApiResponse<AdminShowroomItem[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS,
      { params, signal }
    );
    return res.data || [];
  },

  async getShowroomStats(signal?: AbortSignal): Promise<AdminShowroomStats> {
    const res = await axiosClient.get<unknown, ApiResponse<AdminShowroomStats>>(
      API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS_STATS,
      { signal }
    );
    return (
      res.data || {
        totalShowrooms: 0,
        activeShowrooms: 0,
        inactiveShowrooms: 0,
        totalDemoFleet: 0,
        readyDemoFleet: 0,
        totalPhysicalInventory: 0,
        totalReservedInventory: 0,
        totalStaff: 0,
        regionDistribution: {},
      }
    );
  },

  async getProvinces(signal?: AbortSignal): Promise<ProvinceOption[]> {
    const res = await axiosClient.get<unknown, ApiResponse<ProvinceOption[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS_PROVINCES,
      { signal }
    );
    return res.data || [];
  },

  async getShowroomDetail(id: number, signal?: AbortSignal): Promise<AdminShowroomDetail> {
    const res = await axiosClient.get<unknown, ApiResponse<AdminShowroomDetail>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS}/${id}`,
      { signal }
    );
    return res.data;
  },

  async createShowroom(payload: CreateShowroomPayload): Promise<AdminShowroomItem> {
    const res = await axiosClient.post<unknown, ApiResponse<AdminShowroomItem>>(
      API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS,
      payload
    );
    return res.data;
  },

  async updateShowroom(id: number, payload: UpdateShowroomPayload): Promise<AdminShowroomItem> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminShowroomItem>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS}/${id}`,
      payload
    );
    return res.data;
  },

  async toggleStatus(id: number, active: boolean): Promise<AdminShowroomItem> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminShowroomItem>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS}/${id}/status`,
      null,
      { params: { active } }
    );
    return res.data;
  },

  async deleteShowroom(id: number): Promise<void> {
    await axiosClient.delete<unknown, ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS}/${id}`
    );
  },

  async addDemoCar(showroomId: number, payload: CreateDemoCarPayload): Promise<DemoCarItem> {
    const res = await axiosClient.post<unknown, ApiResponse<DemoCarItem>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS}/${showroomId}/demo-cars`,
      payload
    );
    return res.data;
  },

  async updateDemoCarStatus(
    showroomId: number,
    demoCarId: number,
    status: string,
    odo?: number
  ): Promise<void> {
    await axiosClient.put<unknown, ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS}/${showroomId}/demo-cars/${demoCarId}/status`,
      null,
      { params: { status, odo } }
    );
  },
};
