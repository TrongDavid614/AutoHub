import type { ExtendedAddress } from '../components/AddressCard';

const API_BASE = 'http://localhost:8080/api';

export const addressService = {
  async getMyAddresses(customerId?: number): Promise<ExtendedAddress[]> {
    try {
      const url = customerId
        ? `${API_BASE}/customer/addresses?customerId=${customerId}`
        : `${API_BASE}/customer/addresses`;
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

  async addAddress(data: any): Promise<ExtendedAddress | null> {
    try {
      const res = await fetch(`${API_BASE}/customer/addresses`, {
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

  async updateAddress(id: number, data: any): Promise<ExtendedAddress | null> {
    try {
      const res = await fetch(`${API_BASE}/customer/addresses/${id}`, {
        method: 'PUT',
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

  async deleteAddress(id: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/customer/addresses/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async setDefaultAddress(id: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/customer/addresses/${id}/default`, {
        method: 'POST',
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
