import type { Accessory } from '@/types/accessory.types';

export interface ShippingAddress {
  id: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  tag?: string;
  isDefault: boolean;
  technicalNote?: string;
}

export const DEFAULT_SHIPPING_ADDRESS: ShippingAddress = {
  id: 'addr-01',
  recipientName: 'Nguyễn Văn A',
  phone: '0912 345 678',
  fullAddress:
    'Căn hộ P7-18.02, Tòa Landmark, Vinhomes Central Park, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
  tag: 'VIP KHÁCH HÀNG AUTOHUB GT-E',
  isDefault: true,
  technicalNote: 'Liên hệ trước 30 phút, hẹn kỹ thuật viên lắp đặt vào buổi sáng (9:00 - 11:30).',
};

export const MOCK_ADDRESS_BOOK: ShippingAddress[] = [
  DEFAULT_SHIPPING_ADDRESS,
  {
    id: 'addr-02',
    recipientName: 'Nguyễn Văn A (Trụ sở làm việc)',
    phone: '0912 345 678',
    fullAddress: 'Tầng 12, Tháp Vincom Đồng Khởi, 72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    tag: 'VĂN PHÒNG',
    isDefault: false,
    technicalNote: 'Đăng ký an ninh tòa nhà trước với ban quản lý hầm B3.',
  },
];

export const WALLBOX_SAMPLE_ACCESSORY: Accessory = {
  id: 101,
  categoryId: 1,
  categoryName: 'Sạc & Năng lượng',
  categoryBadge: 'NĂNG LƯỢNG CAO CẤP',
  name: 'Bộ sạc treo tường thông minh Wallbox 22kW',
  sku: 'AH-WBX-22K-GTE',
  brand: 'AutoHub Power',
  price: 25000000,
  stockQuantity: 15,
  thumbnailUrl: 'https://api.builder.io/api/v1/image/assets/TEMP/67a2cbced7ed9ad6a46fb464183bc1a4f593b233?width=256',
  images: ['https://api.builder.io/api/v1/image/assets/TEMP/67a2cbced7ed9ad6a46fb464183bc1a4f593b233?width=256'],
  description: 'Trạm sạc AC 3 pha công suất 22kW đạt chuẩn sạc nhanh tại gia cho hệ thống pin cao áp 800V GT-e.',
  specifications: {
    'Công suất sạc': '22kW 3 Pha 32A',
    'Chuẩn kết nối': 'Type-2 IEC 62196',
    'Kháng nước': 'IP65 Outdoor Ready',
  },
  specPills: ['22kW AC', '100% MATCH GT-E', 'KIẾN TRÚC 800V'],
  compatibilities: [{ carModelId: 1, carModelName: 'AutoHub GT-e', manufactureYearStart: 2024, manufactureYearEnd: 2026 }],
  isActive: true,
};
