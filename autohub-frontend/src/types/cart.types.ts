import type { Accessory } from './accessory.types';

export interface BackendCartItem {
  accessoryId: number;
  quantity: number;
  unitPrice: number;
  discountPrice?: number;
  totalPrice: number;
  stockQuantity: number;
  inStock: boolean;
  accessory: Accessory;
}

export interface BackendCartResponse {
  cartId: number;
  customerId: number;
  totalItems: number;
  rawSubtotal: number;
  updatedAt: string;
  items: BackendCartItem[];
}

export interface VoucherValidationResponse {
  valid: boolean;
  code: string;
  discountAmount: number;
  phanTramGiam?: number;
  giamToiDa?: number;
  expiryDate?: string;
  message: string;
}

export interface AvailableVoucher {
  id: number;
  code: string;
  percentage?: number;
  maxDiscount?: number;
  expiryDate?: string;
  description: string;
}

export interface ShippingMethod {
  id: string;
  methodId?: string;
  code: string;
  title: string;
  tag: string;
  price: number;
  estimatedDelivery: string;
  subDescription: string;
  freeThreshold?: number;
  isDefault?: boolean;
}

export interface CheckoutOrderItemPayload {
  accessoryId: number;
  quantity: number;
  unitPrice: number;
}

export interface CheckoutOrderRequest {
  customerId?: number;
  recipientName: string;
  phone: string;
  shippingAddress: string;
  customerNote?: string;
  paymentMethod: 'COD' | 'SEPAY' | 'VNPAY';
  voucherCode?: string;
  shippingMethodId?: string;
  shippingFee: number;
  items: CheckoutOrderItemPayload[];
}

export interface SepayPaymentInfo {
  accountNumber: string;
  bankBrandName: string;
  accountName?: string;
  transferAmount: number;
  transferContent: string;
  qrUrl: string;
}

export interface ShippingAddress {
  id: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  tag?: string;
  isDefault: boolean;
  technicalNote?: string;
}

export interface CheckoutAddress {
  id: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  tag: string;
  isDefault: boolean;
}

export interface CheckoutOrderItem {
  id: number;
  name: string;
  subtitle: string;
  sku: string;
  price: number;
  quantity: number;
  thumbnailUrl: string;
}

export interface CheckoutOrderResponse {
  orderId: number;
  maDonHang: string;
  orderCode: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  totalPayable: number;
  sepay?: SepayPaymentInfo;
  order: unknown;
}
