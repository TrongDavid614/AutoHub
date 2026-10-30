import type { AccessoryOrder } from '@/types/order.types';
import type { Accessory } from '@/types/accessory.types';

const createMockAccessory = (data: Partial<Accessory> & { id: number; name: string; sku: string; price: number; thumbnailUrl: string }): Accessory => ({
  categoryId: 1,
  categoryName: 'Linh kiện sạc & Pin',
  categoryBadge: 'SiC Tech',
  brand: 'AutoHub Genuine',
  stockQuantity: 50,
  images: [data.thumbnailUrl],
  description: 'Linh kiện chính hãng dành riêng cho xe điện AutoHub EV.',
  specifications: { 'Điện áp': '800V', 'Bảo hành': '3 năm' },
  specPills: ['800V Ultra-Fast', 'OEM 100%'],
  tags: ['Chính hãng', 'SiC'],
  compatibilities: [
    {
      carModelId: 1,
      carModelName: 'AutoHub GT-E',
      manufactureYearStart: 2024,
      manufactureYearEnd: 2026,
    },
  ],
  isActive: true,
  isGenuine: true,
  warrantyYears: 3,
  homeInstallation: true,
  ...data,
});

export const MOCK_CUSTOMER_ORDERS: AccessoryOrder[] = [
  // 1. Đơn hàng PAID (Đã thanh toán qua SePay - đơn chính khớp trang E-Receipt)
  {
    id: 1,
    orderCode: '#AH-ACC-2026-9952',
    customerId: 1,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912 345 678',
    shippingAddress: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    paymentMethod: 'SEPAY',
    status: 'PAID',
    subtotalAmount: 24900000,
    shippingFee: 0,
    voucherDiscount: 500000,
    finalTotalAmount: 24400000,
    sepayTransactionId: 'vnp_2489218',
    trackingNumber: 'AH-VNP-EXPRESS-9952',
    createdAt: '2026-10-20T18:30:25Z',
    orderItems: [
      {
        id: 11,
        accessoryId: 1,
        accessory: createMockAccessory({
          id: 1,
          name: 'Bộ sạc treo tường AutoHub Ultra Wallbox 22kW',
          sku: 'AH-WB-22KW-SIC',
          price: 18500000,
          thumbnailUrl:
            'https://api.builder.io/api/v1/image/assets/TEMP/2926b27f7460ecb719ff769117d513328396db2a?width=160',
          categoryBadge: 'SiC Tech',
        }),
        unitPrice: 18500000,
        quantity: 1,
        totalPrice: 18500000,
      },
      {
        id: 12,
        accessoryId: 2,
        accessory: createMockAccessory({
          id: 2,
          name: 'Thảm lót sàn đúc TPE nguyên sinh GT-e (Bộ 2 hàng)',
          sku: 'AH-MAT-TPE-3D',
          price: 3200000,
          thumbnailUrl:
            'https://api.builder.io/api/v1/image/assets/TEMP/a712f51232d9d6c294236dff0fc46ebc4f3faabd?width=160',
          categoryBadge: 'OEM 100%',
        }),
        unitPrice: 3200000,
        quantity: 2,
        totalPrice: 6400000,
      },
    ],
  },

  // 2. Đơn hàng DELIVERED (Đã giao hàng thành công)
  {
    id: 2,
    orderCode: '#AH-ACC-2026-7810',
    customerId: 1,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912 345 678',
    shippingAddress: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    paymentMethod: 'SEPAY',
    status: 'DELIVERED',
    subtotalAmount: 12200000,
    shippingFee: 0,
    voucherDiscount: 0,
    finalTotalAmount: 12200000,
    sepayTransactionId: 'vnp_1892102',
    trackingNumber: 'VNP-VNPOST-781044',
    createdAt: '2026-10-15T09:15:00Z',
    orderItems: [
      {
        id: 21,
        accessoryId: 3,
        accessory: createMockAccessory({
          id: 3,
          name: 'Bộ sạc di động khẩn cấp AutoHub Mobile Charger 3.5kW',
          sku: 'AH-CHG-MOB-35',
          price: 8500000,
          thumbnailUrl:
            'https://api.builder.io/api/v1/image/assets/TEMP/3c5b56eb26158c9a90d04cdaac7f5d8efcdba683?width=160',
          categoryBadge: 'Cáp 5m IP67',
        }),
        unitPrice: 8500000,
        quantity: 1,
        totalPrice: 8500000,
      },
      {
        id: 22,
        accessoryId: 4,
        accessory: createMockAccessory({
          id: 4,
          name: 'Khay lót khoang hành lý cốp sau chống nước GT-e',
          sku: 'AH-TRK-TPE-GTE',
          price: 3700000,
          thumbnailUrl:
            'https://api.builder.io/api/v1/image/assets/TEMP/cf198000b8efc1cfbb28f4bb249458d71683febd?width=160',
          categoryBadge: 'Chống nước 100%',
        }),
        unitPrice: 3700000,
        quantity: 1,
        totalPrice: 3700000,
      },
    ],
  },

  // 3. Đơn hàng SHIPPING (Đang vận chuyển giao hàng)
  {
    id: 3,
    orderCode: '#AH-ACC-2026-8841',
    customerId: 1,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912 345 678',
    shippingAddress: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    paymentMethod: 'SEPAY',
    status: 'SHIPPING',
    subtotalAmount: 6800000,
    shippingFee: 0,
    voucherDiscount: 0,
    finalTotalAmount: 6800000,
    sepayTransactionId: 'vnp_3910244',
    trackingNumber: 'VNP-EXPRESS-884199',
    createdAt: '2026-10-24T14:10:00Z',
    orderItems: [
      {
        id: 31,
        accessoryId: 5,
        accessory: createMockAccessory({
          id: 5,
          name: 'Camera hành trình 4K HubVision LiDAR ban đêm',
          sku: 'AH-CAM-4K-LIDAR',
          price: 6800000,
          thumbnailUrl:
            'https://api.builder.io/api/v1/image/assets/TEMP/2926b27f7460ecb719ff769117d513328396db2a?width=160',
          categoryBadge: 'Ghi hình 4K HDR',
        }),
        unitPrice: 6800000,
        quantity: 1,
        totalPrice: 6800000,
      },
    ],
  },

  // 4. Đơn hàng PROCESSING (Đang đóng gói & kiểm định SiC tại kho)
  {
    id: 4,
    orderCode: '#AH-ACC-2026-9022',
    customerId: 1,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912 345 678',
    shippingAddress: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    paymentMethod: 'SEPAY',
    status: 'PROCESSING',
    subtotalAmount: 3400000,
    shippingFee: 0,
    voucherDiscount: 0,
    finalTotalAmount: 3400000,
    sepayTransactionId: 'vnp_9918231',
    createdAt: '2026-10-25T11:20:00Z',
    orderItems: [
      {
        id: 41,
        accessoryId: 6,
        accessory: createMockAccessory({
          id: 6,
          name: 'Bộ phát Wi-Fi 4G/5G chuyên dụng khoang lái HubConnect',
          sku: 'AH-NET-5G-CAR',
          price: 3400000,
          thumbnailUrl:
            'https://api.builder.io/api/v1/image/assets/TEMP/3c5b56eb26158c9a90d04cdaac7f5d8efcdba683?width=160',
          categoryBadge: 'Sim 5G tốc độ cao',
        }),
        unitPrice: 3400000,
        quantity: 1,
        totalPrice: 3400000,
      },
    ],
  },

  // 5. Đơn hàng PENDING_PAYMENT (Chờ thanh toán SePay trong 15 phút theo UC34)
  {
    id: 5,
    orderCode: '#AH-ACC-2026-9988',
    customerId: 1,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912 345 678',
    shippingAddress: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    paymentMethod: 'SEPAY',
    status: 'PENDING_PAYMENT',
    subtotalAmount: 18500000,
    shippingFee: 0,
    voucherDiscount: 0,
    finalTotalAmount: 18500000,
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 phút trước, còn 12 phút
    orderItems: [
      {
        id: 51,
        accessoryId: 7,
        accessory: createMockAccessory({
          id: 7,
          name: 'Trụ sạc đứng Smart Pillar HomeBox 11kW kèm chân đế nhôm đúc',
          sku: 'AH-PLR-11KW-ALU',
          price: 18500000,
          thumbnailUrl:
            'https://api.builder.io/api/v1/image/assets/TEMP/2926b27f7460ecb719ff769117d513328396db2a?width=160',
          categoryBadge: 'Trụ đứng nhôm đúc',
        }),
        unitPrice: 18500000,
        quantity: 1,
        totalPrice: 18500000,
      },
    ],
  },

  // 6. Đơn hàng PENDING (Chờ duyệt - đơn COD mới đặt)
  {
    id: 6,
    orderCode: '#AH-ACC-2026-6712',
    customerId: 1,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912 345 678',
    shippingAddress: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    paymentMethod: 'COD',
    status: 'PENDING',
    subtotalAmount: 2900000,
    shippingFee: 0,
    voucherDiscount: 0,
    finalTotalAmount: 2900000,
    createdAt: '2026-10-25T16:45:00Z',
    orderItems: [
      {
        id: 61,
        accessoryId: 8,
        accessory: createMockAccessory({
          id: 8,
          name: 'Bọc vô lăng thể thao da Alcantara cao cấp AutoHub Performance',
          sku: 'AH-STR-ALC-SPT',
          price: 2900000,
          thumbnailUrl:
            'https://api.builder.io/api/v1/image/assets/TEMP/a712f51232d9d6c294236dff0fc46ebc4f3faabd?width=160',
          categoryBadge: 'Da Alcantara',
        }),
        unitPrice: 2900000,
        quantity: 1,
        totalPrice: 2900000,
      },
    ],
  },

  // 7. Đơn hàng CANCELLED (Đã hủy)
  {
    id: 7,
    orderCode: '#AH-ACC-2026-5520',
    customerId: 1,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912 345 678',
    shippingAddress: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    paymentMethod: 'SEPAY',
    status: 'CANCELLED',
    subtotalAmount: 5500000,
    shippingFee: 0,
    voucherDiscount: 0,
    finalTotalAmount: 5500000,
    createdAt: '2026-10-10T08:00:00Z',
    orderItems: [
      {
        id: 71,
        accessoryId: 9,
        accessory: createMockAccessory({
          id: 9,
          name: 'Bộ ốp gương chiếu hậu sợi Carbon Dry-Forged thể thao',
          sku: 'AH-MIR-CRB-DRY',
          price: 5500000,
          thumbnailUrl:
            'https://api.builder.io/api/v1/image/assets/TEMP/cf198000b8efc1cfbb28f4bb249458d71683febd?width=160',
          categoryBadge: 'Carbon Dry',
        }),
        unitPrice: 5500000,
        quantity: 1,
        totalPrice: 5500000,
      },
    ],
  },

  // 8. Đơn hàng RETURNED (Đã đổi trả thành công theo UC25)
  {
    id: 8,
    orderCode: '#AH-ACC-2026-4411',
    customerId: 1,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912 345 678',
    shippingAddress: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    paymentMethod: 'SEPAY',
    status: 'RETURNED',
    subtotalAmount: 4200000,
    shippingFee: 0,
    voucherDiscount: 0,
    finalTotalAmount: 4200000,
    sepayTransactionId: 'vnp_4411099',
    createdAt: '2026-10-05T10:15:00Z',
    orderItems: [
      {
        id: 81,
        accessoryId: 10,
        accessory: createMockAccessory({
          id: 10,
          name: 'Bơm lốp điện tử không dây AutoHub AirPump 150 PSI thế hệ mới',
          sku: 'AH-PMP-AIR-150',
          price: 4200000,
          thumbnailUrl:
            'https://api.builder.io/api/v1/image/assets/TEMP/3c5b56eb26158c9a90d04cdaac7f5d8efcdba683?width=160',
          categoryBadge: 'Pin 6000mAh',
        }),
        unitPrice: 4200000,
        quantity: 1,
        totalPrice: 4200000,
      },
    ],
  },
];
