// TODO(mock): remove when backend ready
import type { AiChatMessage } from '@/types/ai.types';

export const INITIAL_AI_CHAT_MESSAGES: AiChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'AI',
    senderTitle: 'AutoHub AI',
    timestamp: '10:41 AM',
    content:
      'Xin chào quý khách! Tôi là trợ lý AI chuyên trách của AutoHub. Tôi có thể hỗ trợ quý khách tìm kiếm dòng xe điện ưng ý, tính toán chi phí lăn bánh, hoặc đề xuất gói phụ kiện và giải pháp sạc tại gia chuẩn kỹ thuật. Quý khách đang quan tâm đến dòng xe nào hôm nay?',
  },
  {
    id: 'msg-2',
    sender: 'USER',
    senderTitle: 'Quý khách (VIP Member)',
    timestamp: '10:42 AM',
    avatarText: 'VK',
    content:
      'Tôi có ngân sách khoảng 2.5 - 3 tỷ, cần tìm một chiếc sedan chạy điện cao cấp cho gia đình, đề xuất cho tôi xe và gói phụ kiện tương thích.',
  },
  {
    id: 'msg-3',
    sender: 'AI',
    senderTitle: 'AutoHub AI',
    timestamp: '10:42 AM',
    content: '',
    functionCall: {
      querySegment: 'Phân khúc Sedan Điện Hạng Sang (2.5 - 3.0 Tỷ VNĐ)',
      priceRange: '2.5 - 3.0 Tỷ VNĐ',
      matchPercentage: 98.6,
    },
    rationale:
      'Dựa trên ngân sách 2.5 – 3 tỷ VNĐ và tiêu chí tìm kiếm sedan điện cao cấp phục vụ gia đình, lựa chọn hoàn hảo nhất trong hệ sinh thái AutoHub là mẫu AutoHub GT-e phiên bản Grand Touring. Mẫu xe này sở hữu khoang nội thất rộng rãi chuẩn thương gia, chiều dài cơ sở gần 3m, hệ thống lọc không khí ion âm và công nghệ tự hành cấp độ 2+ mang lại sự an tâm tuyệt đối cho các chuyến đi của cả gia đình.\n\nĐồng thời, đối với nhu cầu sử dụng gia đình thường xuyên, AutoHub khuyến nghị quý khách nên trang bị thêm giải pháp sạc nhanh tại nhà chuẩn công nghiệp để xe luôn sẵn sàng 100% năng lượng mỗi sáng.',
    recommendedVehicle: {
      variantId: 101,
      modelId: 1,
      name: 'AutoHub GT-e Grand Touring',
      badge: 'LỰA CHỌN PHÙ HỢP NHẤT',
      categoryBadge: 'SEDAN ĐIỆN HẠNG SANG',
      availabilityBadge: 'SẴN XE GIAO NGAY',
      flagshipLabel: 'FLAGSHIP MODEL',
      listedPrice: 2890000000,
      priceNote: '(Đã bao gồm VAT & Pin)',
      imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      acceleration0100: '3.2',
      rangeKm: 680,
      interior: 'Nappa Da Thật',
      seats: '5 Chỗ Thương Gia',
      safetyRating: '5 SAO',
      safetyOrg: 'EURO NCAP TOÀN DIỆN',
      deliveryTime: 'Giao xe tận nhà trong vòng 7 ngày làm việc',
      depositAmount: 20000000,
    },
    recommendedAccessory: {
      accessoryId: 501,
      matchPercentage: 100,
      badgeTitle: 'PHỤ KIỆN THIẾT YẾU TƯƠNG THÍCH 100%',
      name: 'Bộ sạc nhanh treo tường Wallbox 22kW',
      price: 25000000,
      description:
        'Tích hợp chuẩn sạc Type-2 tương thích tuyệt đối hệ thống điện 800V của AutoHub GT-e. Tốc độ sạc đầy chỉ từ 4.5 giờ tại nhà, quản lý thông minh qua App điện thoại, chống nước chuẩn IP65 an toàn tuyệt đối ngoài trời.',
      benefits: [
        'Bao gồm chi phí khảo sát & lắp đặt tiêu chuẩn tại nhà',
        'Bảo hành chính hãng 3 năm 1 đổi 1',
      ],
      sku: 'AH-ACC-WB22-GT',
      imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80',
    },
    suggestedPrompts: [
      'So sánh GT-e với bản Track Edition',
      'Ước tính lịch trả góp ngân hàng 80%',
      'Đăng ký lái thử tại nhà',
      'Thời gian sạc đầy tại trạm sạc công cộng',
    ],
  },
];
