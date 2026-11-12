import { axiosClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { ExtendedAddress } from '@/features/customer/components/AddressCard';

export interface AddressPayload {
  customerId?: number;
  recipientName: string;
  phoneNumber: string;
  provinceCity: string;
  district: string;
  ward: string;
  detailedAddress: string;
  isDefault?: boolean;
  tag?: string;
}

export const addressService = {
  async getMyAddresses(customerId?: number): Promise<ExtendedAddress[]> {
    try {
      const url = customerId
        ? `/customer/addresses?customerId=${customerId}`
        : `/customer/addresses`;
      const res = await axiosClient.get<unknown, ApiResponse<ExtendedAddress[]>>(url);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // offline fallback
    }
    return [];
  },

  async addAddress(data: AddressPayload): Promise<ExtendedAddress | null> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<ExtendedAddress>>('/customer/addresses', data);
      return res?.data || null;
    } catch {
      // offline fallback
    }
    return null;
  },

  async updateAddress(id: number, data: Partial<AddressPayload>): Promise<ExtendedAddress | null> {
    try {
      const res = await axiosClient.put<unknown, ApiResponse<ExtendedAddress>>(`/customer/addresses/${id}`, data);
      return res?.data || null;
    } catch {
      // offline fallback
    }
    return null;
  },

  async deleteAddress(id: number): Promise<boolean> {
    try {
      const res = await axiosClient.delete<unknown, ApiResponse<unknown>>(`/customer/addresses/${id}`);
      return Boolean(res);
    } catch {
      return false;
    }
  },

  async setDefaultAddress(id: number): Promise<boolean> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<ExtendedAddress>>(`/customer/addresses/${id}/default`);
      return Boolean(res);
    } catch {
      return false;
    }
  },
};
