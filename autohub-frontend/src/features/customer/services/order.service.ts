import { axiosClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { AccessoryOrder } from '@/types/order.types';
import type { CheckoutOrderRequest, CheckoutOrderResponse } from '@/types/cart.types';

export const orderService = {
  async getMyOrders(customerId?: number): Promise<AccessoryOrder[]> {
    try {
      const url = customerId
        ? `/customer/orders?customerId=${customerId}`
        : `/customer/orders`;
      const res = await axiosClient.get<unknown, ApiResponse<AccessoryOrder[]>>(url);
      const rawList = res?.data ?? (Array.isArray(res) ? (res as AccessoryOrder[]) : []);
      if (Array.isArray(rawList)) {
        return rawList.map((order) => {
          const items = order.orderItems ?? order.items ?? [];
          return {
            ...order,
            orderItems: items,
            items,
          };
        });
      }
    } catch (error) {
      console.error('[orderService.getMyOrders] Lỗi khi tải danh sách đơn hàng:', error);
    }
    return [];
  },

  async createOrder(payload: CheckoutOrderRequest): Promise<CheckoutOrderResponse> {
    const res = await axiosClient.post<unknown, ApiResponse<CheckoutOrderResponse>>(
      '/customer/orders/checkout',
      payload
    );
    if (!res?.data) {
      throw new Error(res?.message || 'Không thể tạo đơn hàng');
    }
    return res.data;
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
