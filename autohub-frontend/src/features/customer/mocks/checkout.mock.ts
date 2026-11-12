export interface CheckoutAddress {
  id: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  tag: string;
  isDefault: boolean;
}

export interface ShippingMethod {
  id: 'standard' | 'express-technician';
  title: string;
  tag: string;
  price: number;
  estimatedDelivery: string;
  subDescription: string;
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

export const MOCK_CHECKOUT_ADDRESSES: CheckoutAddress[] = [];

export const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    title: 'Giao hàng tiêu chuẩn AutoHub Logistics',
    tag: 'BẢO HIỂM HÀNG HÓA 100%',
    price: 0,
    estimatedDelivery: 'Dự kiến nhận hàng: 1 - 2 ngày làm việc',
    subDescription: 'Bàn giao niêm phong thùng chuyên dụng',
  },
  {
    id: 'express-technician',
    title: 'Hỏa tốc & Kỹ thuật viên hỗ trợ lắp đặt tại chỗ',
    tag: 'VIP ON-SITE TECH',
    price: 150000,
    estimatedDelivery: 'Dự kiến nhận hàng: Trong ngày',
    subDescription: 'Bao gồm khảo sát đường dây & kiểm tra tải điện',
  },
];

export const MOCK_CHECKOUT_ITEMS: CheckoutOrderItem[] = [];
