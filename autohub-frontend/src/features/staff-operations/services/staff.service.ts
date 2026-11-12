import { axiosClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type {
  AvailableVinOption,
  ConsultationLead,
  CrossBranchStock,
  DemoCarOption,
  DemoFleetCar,
  StaffDepositRecord,
  StaffFulfillmentOrder,
  StaffRefundDocket,
  StaffReturnItem,
  StaffTestDriveBooking,
  WorkspaceMetricsResponse,
} from '@/types/staff.types';

export const staffService = {
  // 1. Quản lý yêu cầu tư vấn (UC20)
  async getConsultations(): Promise<ConsultationLead[]> {
    const res = await axiosClient.get<ApiResponse<ConsultationLead[]>>('/staff/consultations');
    const apiRes = res as unknown as ApiResponse<ConsultationLead[]>;
    return apiRes.data || [];
  },

  async updateConsultationStatus(id: string, status: string): Promise<string> {
    const res = await axiosClient.put<ApiResponse<string>>(`/staff/consultations/${id}/status`, { status });
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  async addConsultationNote(id: string, note: string): Promise<string> {
    const res = await axiosClient.post<ApiResponse<string>>(`/staff/consultations/${id}/notes`, { note });
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  // 2. Đối soát cọc và gán VIN (UC22)
  async getStaffDeposits(): Promise<StaffDepositRecord[]> {
    const res = await axiosClient.get<ApiResponse<StaffDepositRecord[]>>('/staff/deposits');
    const apiRes = res as unknown as ApiResponse<StaffDepositRecord[]>;
    return apiRes.data || [];
  },

  async getAvailableVins(): Promise<AvailableVinOption[]> {
    const res = await axiosClient.get<ApiResponse<AvailableVinOption[]>>('/staff/deposits/available-vins');
    const apiRes = res as unknown as ApiResponse<AvailableVinOption[]>;
    return apiRes.data || [];
  },

  async assignVinToDeposit(depositId: string, vinNumber: string): Promise<string> {
    const res = await axiosClient.post<ApiResponse<string>>(`/staff/deposits/${depositId}/assign-vin`, {
      vinNumber,
    });
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  async signContract(depositId: string): Promise<string> {
    const res = await axiosClient.post<ApiResponse<string>>(`/staff/deposits/${depositId}/sign-contract`, {});
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  // 3. Thẩm định hồ sơ hoàn cọc (UC40)
  async getRefundDockets(): Promise<StaffRefundDocket[]> {
    const res = await axiosClient.get<ApiResponse<StaffRefundDocket[]>>('/staff/refunds');
    const apiRes = res as unknown as ApiResponse<StaffRefundDocket[]>;
    return apiRes.data || [];
  },

  async verifyRefundDocket(id: string): Promise<string> {
    const res = await axiosClient.post<ApiResponse<string>>(`/staff/refunds/${id}/verify`, {});
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  async rejectRefundDocket(id: string, reason: string): Promise<string> {
    const res = await axiosClient.post<ApiResponse<string>>(`/staff/refunds/${id}/reject`, { reason });
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  // 4. Quản lý lịch hẹn lái thử (UC21)
  async getTestDriveBookings(): Promise<StaffTestDriveBooking[]> {
    const res = await axiosClient.get<ApiResponse<StaffTestDriveBooking[]>>('/staff/test-drives');
    const apiRes = res as unknown as ApiResponse<StaffTestDriveBooking[]>;
    return apiRes.data || [];
  },

  async getAvailableDemoCars(): Promise<DemoCarOption[]> {
    const res = await axiosClient.get<ApiResponse<DemoCarOption[]>>('/staff/test-drives/demo-cars');
    const apiRes = res as unknown as ApiResponse<DemoCarOption[]>;
    return apiRes.data || [];
  },

  async dispatchTestDrive(id: string, demoPlate: string): Promise<string> {
    const res = await axiosClient.post<ApiResponse<string>>(`/staff/test-drives/${id}/dispatch`, {
      demoPlate,
    });
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  async completeTestDrive(id: string, evaluation: Record<string, unknown>): Promise<string> {
    const res = await axiosClient.post<ApiResponse<string>>(`/staff/test-drives/${id}/complete`, {
      evaluation,
    });
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  // 5. Đóng gói đơn hàng phụ kiện (UC23)
  async getFulfillmentOrders(): Promise<StaffFulfillmentOrder[]> {
    const res = await axiosClient.get<ApiResponse<StaffFulfillmentOrder[]>>('/staff/fulfillment');
    const apiRes = res as unknown as ApiResponse<StaffFulfillmentOrder[]>;
    return apiRes.data || [];
  },

  async packOrder(orderId: string): Promise<string> {
    const res = await axiosClient.post<ApiResponse<string>>(`/staff/fulfillment/${orderId}/pack`, {});
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  async handoverOrder(orderId: string, courier: string, trackingNumber: string): Promise<string> {
    const res = await axiosClient.post<ApiResponse<string>>(`/staff/fulfillment/${orderId}/handover`, {
      courier,
      trackingNumber,
    });
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  // 6. Xử lý yêu cầu đổi trả (UC24)
  async getReturnItems(): Promise<StaffReturnItem[]> {
    const res = await axiosClient.get<ApiResponse<StaffReturnItem[]>>('/staff/returns');
    const apiRes = res as unknown as ApiResponse<StaffReturnItem[]>;
    return apiRes.data || [];
  },

  async resolveReturnItem(id: string, resolution: string, inspectionNotes?: string): Promise<string> {
    const res = await axiosClient.post<ApiResponse<string>>(`/staff/returns/${id}/resolve`, {
      resolution,
      inspectionNotes,
    });
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  // 7. Quản lý đội xe Demo & bảo dưỡng (UC41)
  async getDemoFleet(): Promise<DemoFleetCar[]> {
    const res = await axiosClient.get<ApiResponse<DemoFleetCar[]>>('/staff/fleet');
    const apiRes = res as unknown as ApiResponse<DemoFleetCar[]>;
    return apiRes.data || [];
  },

  async updateDemoOdo(id: string, newOdo: number): Promise<string> {
    const res = await axiosClient.put<ApiResponse<string>>(`/staff/fleet/${id}/odo`, { newOdo });
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  async scheduleDemoMaintenance(id: string, reason: string, expectedReturnDate: string): Promise<string> {
    const res = await axiosClient.post<ApiResponse<string>>(`/staff/fleet/${id}/maintenance`, {
      reason,
      expectedReturnDate,
    });
    const apiRes = res as unknown as ApiResponse<string>;
    return apiRes.data;
  },

  // 8. Workspace Metrics & Chỉ số Mini-Chart
  async getWorkspaceMetrics(): Promise<WorkspaceMetricsResponse> {
    const res = await axiosClient.get<ApiResponse<WorkspaceMetricsResponse>>('/staff/workspace');
    const apiRes = res as unknown as ApiResponse<WorkspaceMetricsResponse>;
    return apiRes.data;
  },

  // 9. Tra cứu tồn kho & Điều chuyển chi nhánh (UC23 / F21)
  async getCrossBranchStocks(): Promise<CrossBranchStock[]> {
    const res = await axiosClient.get<ApiResponse<CrossBranchStock[]>>('/staff/stocks');
    const apiRes = res as unknown as ApiResponse<CrossBranchStock[]>;
    return apiRes.data || [];
  },
};
