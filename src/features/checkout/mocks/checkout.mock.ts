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

export const MOCK_CHECKOUT_ADDRESSES: CheckoutAddress[] = [
  {
    id: 'addr-01',
    recipientName: 'Nguyễn Tuấn Khôi',
    phone: '0908 678 999',
    fullAddress:
      'Căn hộ Penthouse 1802, Tháp Aqua 1, Vinhomes Golden River, Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    tag: 'NHÀ RIÊNG',
    isDefault: true,
  },
  {
    id: 'addr-02',
    recipientName: 'Nguyễn Tuấn Khôi',
    phone: '0908 678 999',
    fullAddress:
      'Tầng 25, Bitexco Financial Tower, Số 2 Hải Triều, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    tag: 'VĂN PHÒNG',
    isDefault: false,
  },
];

export const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    title: 'Giao hàng tiêu chuẩn AutoHub Logistics',
    tag: 'BẢO HIỂM HÀNG HÓA 100%',
    price: 0,
    estimatedDelivery: 'Dự kiến nhận hàng: Ngày mai (26/10)',
    subDescription: 'Bàn giao niêm phong thùng chuyên dụng',
  },
  {
    id: 'express-technician',
    title: 'Hỏa tốc & Kỹ thuật viên hỗ trợ lắp đặt tại chỗ',
    tag: 'VIP ON-SITE TECH',
    price: 150000,
    estimatedDelivery: 'Dự kiến nhận hàng: Trong vòng 4 - 6 giờ hôm nay',
    subDescription: 'Bao gồm khảo sát đường dây & kiểm tra tải điện',
  },
];

export const MOCK_CHECKOUT_ITEMS: CheckoutOrderItem[] = [
  {
    id: 101,
    name: 'Bộ sạc Home Wallbox Pro 22kW',
    subtitle: 'Kiến trúc SiC, Cáp Type 2 7m, Wi-Fi/4G & App…',
    sku: 'AH-WBX-PRO-22K',
    price: 19500000,
    quantity: 1,
    thumbnailUrl:
      'https://api.builder.io/api/v1/image/assets/TEMP/3c5b56eb26158c9a90d04cdaac7f5d8efcdba683?width=160',
  },
  {
    id: 102,
    name: 'Thảm lót sàn Carbon WeatherTech GT-e',
    subtitle: 'Chống nước đúc khuôn 3D nguyên khối, viền cao su',
    sku: 'AH-MAT-CRB-GTE',
    price: 5500000,
    quantity: 1,
    thumbnailUrl:
      'https://api.builder.io/api/v1/image/assets/TEMP/cf198000b8efc1cfbb28f4bb249458d71683febd?width=160',
  },
];
