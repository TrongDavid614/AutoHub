import { axiosClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { TestDriveItem } from '@/features/customer/types/test-drive.types';

export interface BookTestDrivePayload {
  customerId?: number;
  phienBanId: number;
  showroomId: number;
  hoTenKhach: string;
  soDienThoaiKhach: string;
  diaDiemLaiThu: string;
  thoiGianHen: string;
  camKetGplx: boolean;
  ghiChu?: string;
}

export interface BookTestDriveResult {
  success: boolean;
  data?: TestDriveItem;
  message?: string;
}

export const engagementService = {
  async getMyTestDrives(customerId?: number): Promise<TestDriveItem[]> {
    try {
      const url = customerId
        ? `/customer/engagement/test-drives?customerId=${customerId}`
        : `/customer/engagement/test-drives`;
      const res = await axiosClient.get<unknown, ApiResponse<TestDriveItem[]>>(url);
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch {
      // offline fallback
    }
    return [];
  },

  async getBookedSlots(date: string, variantId?: number, customerId?: number): Promise<string[]> {
    try {
      let url = `/customer/engagement/test-drives/booked-slots?date=${encodeURIComponent(date)}`;
      if (variantId) url += `&variantId=${variantId}`;
      if (customerId) url += `&customerId=${customerId}`;
      const res = await axiosClient.get<unknown, ApiResponse<string[]>>(url);
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch {
      // fallback
    }
    return [];
  },

  async bookTestDrive(data: BookTestDrivePayload): Promise<BookTestDriveResult> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<TestDriveItem>>('/customer/engagement/test-drives', data);
      if (res?.data) {
        return { success: true, data: res.data, message: res.message || 'Đặt lịch hẹn lái thử thành công' };
      }
      return {
        success: false,
        message: res?.message || 'Không thể đặt lịch hẹn lái thử do trùng lịch hoặc vi phạm quy chế hệ thống.',
      };
    } catch {
      return { success: false, message: 'Lỗi kết nối máy chủ khi đăng ký lái thử. Vui lòng kiểm tra backend!' };
    }
  },

  async cancelTestDrive(id: number, reason?: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<TestDriveItem>>(`/customer/engagement/test-drives/${id}/cancel`, {
        reason: reason || 'Khách hàng yêu cầu hủy lịch',
      });
      if (res?.data) {
        return { success: true, message: res.message || 'Đã hủy lịch hẹn lái thử thành công.' };
      }
      return { success: false, message: res?.message || 'Không thể hủy lịch hẹn lái thử.' };
    } catch {
      return { success: false, message: 'Lỗi kết nối máy chủ khi hủy lịch hẹn.' };
    }
  },
};
