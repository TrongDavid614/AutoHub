import type { Accessory } from './accessory.types';

export type AccessoryOrderStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUND_REQUIRED';

export interface OrderItem {
  id: number;
  accessoryId: number;
  accessory: Accessory;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface AccessoryOrder {
  id: number;
  orderCode: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'VNPAY' | 'COD';
  status: AccessoryOrderStatus;
  subtotalAmount: number;
  shippingFee: number;
  voucherDiscount: number;
  finalTotalAmount: number;
  orderItems: OrderItem[];
  vnpayTransactionId?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface ReturnRequest {
  id: number;
  orderId: number;
  reason: string;
  evidenceImages: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  requestedAt: string;
}
