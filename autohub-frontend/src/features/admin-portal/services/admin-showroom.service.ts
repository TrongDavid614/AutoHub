import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse, PageResponse } from '@/types/api.types';
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

export interface GetShowroomsParams {
  keyword?: string;
  region?: string;
  active?: boolean;
  page?: number;
  size?: number;
}

export const adminShowroomService = {
  async getShowrooms(
    params?: GetShowroomsParams,
    signal?: AbortSignal
  ): Promise<PageResponse<AdminShowroomItem>> {
    const queryParams: Record<string, string | number | boolean> = {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    };
    if (params?.keyword && params.keyword.trim()) {
      queryParams.keyword = params.keyword.trim();
    }
    if (params?.region && params.region.trim()) {
      queryParams.region = params.region.trim();
    }
    if (params?.active !== undefined) {
      queryParams.active = params.active;
    }
    const res = await axiosClient.get<unknown, ApiResponse<PageResponse<AdminShowroomItem>>>(
      API_CONFIG.ENDPOINTS.ADMIN.SHOWROOMS,
      { params: queryParams, signal }
    );
    return res.data || {
      items: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 1,
      first: true,
      last: true,
    };
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
