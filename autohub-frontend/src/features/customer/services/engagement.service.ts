import type { TestDriveItem } from '../types/test-drive.types';

const API_BASE = 'http://localhost:8080/api';

export const engagementService = {
  async getMyTestDrives(customerId?: number): Promise<TestDriveItem[]> {
    try {
      const url = customerId
        ? `${API_BASE}/customer/engagement/test-drives?customerId=${customerId}`
        : `${API_BASE}/customer/engagement/test-drives`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch {
      // offline fallback
    }
    return [];
  },

  async bookTestDrive(data: any): Promise<TestDriveItem | null> {
    try {
      const res = await fetch(`${API_BASE}/customer/engagement/test-drives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline fallback
    }
    return null;
  },

  async cancelTestDrive(id: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/customer/engagement/test-drives/${id}/cancel`, {
        method: 'POST',
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};

