import type { TestDriveItem } from '../types/test-drive.types';

const API_BASE = 'http://localhost:8080/api';

export interface BookTestDriveResult {
  success: boolean;
  data?: TestDriveItem;
  message?: string;
}

export const engagementService = {
  async getMyTestDrives(customerId?: number): Promise<TestDriveItem[]> {
    try {
      const url = customerId
        ? `${API_BASE}/customer/engagement/test-drives?customerId=${customerId}`
        : `${API_BASE}/customer/engagement/test-drives`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // offline fallback
    }
    return [];
  },

  async getBookedSlots(date: string, variantId?: number, customerId?: number): Promise<string[]> {
    try {
      let url = `${API_BASE}/customer/engagement/test-drives/booked-slots?date=${encodeURIComponent(date)}`;
      if (variantId) url += `&variantId=${variantId}`;
      if (customerId) url += `&customerId=${customerId}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // fallback
    }
    return [];
  },

  async bookTestDrive(data: any): Promise<BookTestDriveResult> {
    try {
      const res = await fetch(`${API_BASE}/customer/engagement/test-drives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }
      if (res.ok && json?.data) {
        return { success: true, data: json.data, message: json.message || 'Đặt lịch hẹn lái thử thành công' };
      }
      return {
        success: false,
        message: json?.message || 'Không thể đặt lịch hẹn lái thử do trùng lịch hoặc vi phạm quy chế hệ thống.',
      };
    } catch {
      return { success: false, message: 'Lỗi kết nối máy chủ khi đăng ký lái thử. Vui lòng kiểm tra backend!' };
    }
  },

  async cancelTestDrive(id: number, reason?: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/customer/engagement/test-drives/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason || 'Khách hàng yêu cầu hủy lịch' }),
      });
      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }
      if (res.ok) {
        return { success: true, message: json?.message || 'Đã hủy lịch hẹn lái thử thành công.' };
      }
      return { success: false, message: json?.message || 'Không thể hủy lịch hẹn lái thử.' };
    } catch {
      return { success: false, message: 'Lỗi kết nối máy chủ khi hủy lịch hẹn.' };
    }
  },
};

