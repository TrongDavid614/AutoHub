import type { AccessoryOrder } from '@/types/order.types';
import { MOCK_CUSTOMER_ORDERS } from '../mocks/orders.mock';

const API_BASE = 'http://localhost:8080/api';

export const orderService = {
  async getMyOrders(customerId?: number): Promise<AccessoryOrder[]> {
    try {
      const url = customerId
        ? `${API_BASE}/customer/orders?customerId=${customerId}`
        : `${API_BASE}/customer/orders`;
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
    return MOCK_CUSTOMER_ORDERS;
  },

  async confirmDelivered(orderId: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/customer/orders/${orderId}/delivered`, {
        method: 'POST',
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async cancelOrder(orderId: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/customer/orders/${orderId}/cancel`, {
        method: 'POST',
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async requestReturn(orderId: number, reason?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/customer/orders/${orderId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason || 'Đổi trả phụ kiện kỹ thuật' }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
