import { axiosClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { AccessoryOrder } from '@/types/order.types';

export const orderService = {
  async getMyOrders(customerId?: number): Promise<AccessoryOrder[]> {
    try {
      const url = customerId
        ? `/customer/orders?customerId=${customerId}`
        : `/customer/orders`;
      const res = await axiosClient.get<unknown, ApiResponse<AccessoryOrder[]>>(url);
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch {
      // network error
    }
    return [];
  },

  async confirmDelivered(orderId: number): Promise<boolean> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<unknown>>(`/customer/orders/${orderId}/delivered`);
      return Boolean(res);
    } catch {
      return false;
    }
  },

  async cancelOrder(orderId: number): Promise<boolean> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<unknown>>(`/customer/orders/${orderId}/cancel`);
      return Boolean(res);
    } catch {
      return false;
    }
  },

  async requestReturn(orderId: number, reason?: string): Promise<boolean> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<unknown>>(`/customer/orders/${orderId}/return`, {
        reason: reason || 'Đổi trả phụ kiện kỹ thuật',
      });
      return Boolean(res);
    } catch {
      return false;
    }
  },

  async submitReview(orderId: number, rating: number, comment: string): Promise<boolean> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<unknown>>(`/customer/orders/${orderId}/review`, {
        rating,
        comment,
      });
      return Boolean(res);
    } catch {
      return false;
    }
  },
};
