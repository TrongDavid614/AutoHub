// TODO(mock): remove when backend ready
// Dữ liệu mô phỏng phân hệ Vận Hành Showroom (Staff Operations - STF-01 đến STF-10)
// Căn cứ Use Case: F15 - F18, UC02, UC20 - UC25, UC28 theo hồ sơ kiến trúc AutoHub & tài liệu MoTa_GiaoDien_Admin_Staff_ShadcnAdminKit

export interface StaffKpiStat {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  badgeText: string;
  badgeType: 'success' | 'warning' | 'danger' | 'info';
}

export interface TodayTimelineSlot {
  id: string;
  carModel: string;
  licensePlate: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  staffName: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ConsultationLead {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  interestedCar: string;
  preferredTime: string;
  assignedStaff: string;
  status: 'PENDING' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
  userJourney: {
    time: string;
    action: string;
    detail: string;
    dwellTime?: string;
  }[];
  aiPersona: {
    personaGroup: string;
    financialReadiness: string;
    primaryConcern: string;
    suggestedPitch: string;
    recommendedQuestions: string[];
  };
  notes?: string;
}

export interface StaffTestDriveBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  driverLicenseNumber: string;
  carModel: string;
  preferredTime: string;
  locationType: 'SHOWROOM' | 'HOME';
  assignedDemoCar?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  hasValidLicense: boolean;
  satisfactionRating?: number;
  customerPurchaseIntent?: string;
}

export interface StaffDepositRecord {
  id: string;
  depositCode: string;
  customerName: string;
  customerPhone: string;
  identityCardNumber: string;
  carModel: string;
  variant: string;
  exteriorColor: string;
  depositAmount: number;
  remainingSeconds: number; // 72h countdown
  assignedVin?: string;
  sepayTxnRef: string;
  status: 'PAID' | 'VIN_ASSIGNED' | 'CONTRACT_SIGNED';
}

export interface StaffRefundDocket {
  id: string;
  depositCode: string;
  customerName: string;
  identityCardNumber: string;
  carModel: string;
  depositAmount: number;
  reason: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  submittedAt: string;
  rejectionLetterFileName: string;
  checklist: {
    within72h: boolean;
    validBankLetter: boolean;
    noVatInvoice: boolean;
  };
  status: 'REFUND_REQUESTED' | 'VERIFIED' | 'REJECTED';
}

export interface StaffFulfillmentOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'SEPAY' | 'COD';
  totalAmount: number;
  createdAt: string;
  status: 'NEED_PACK' | 'PACKING' | 'SHIPPED';
  items: {
    sku: string;
    name: string;
    shelfLocation: string;
    quantity: number;
    price: number;
  }[];
  trackingNumber?: string;
  courier?: string;
}

export interface StaffReturnItem {
  id: string;
  rmaCode: string;
  originalOrderCode: string;
  customerName: string;
  customerPhone: string;
  accessoryName: string;
  reason: string;
  requestedAt: string;
  evidenceImages: string[];
  inspectionNotes?: string;
  status: 'RETURN_REQUESTED' | 'INSPECTING' | 'RESOLVED' | 'REJECTED';
  resolution?: 'REPLACE_NEW' | 'REFUND_MONEY' | 'REJECT';
}

export interface CrossBranchStock {
  sku: string;
  name: string;
  category: string;
  shelfLocation: string;
  localStock: number;
  branches: {
    branchName: string;
    stock: number;
  }[];
}

export interface DemoFleetCar {
  id: string;
  licensePlate: string;
  carModel: string;
  variant: string;
  color: string;
  currentOdoKm: number;
  nextServiceKm: number;
  lastServiceDate: string;
  status: 'SAN_SANG' | 'DANG_CHAY_THU' | 'BAO_DUONG';
  maintenanceReason?: string;
  expectedReturnDate?: string;
}

export interface ShiftHandoverRecord {
  id: string;
  shiftType: string;
  date: string;
  handedOverBy: string;
  receivedBy: string;
  pendingLeadsCount: number;
  demoKeysVerified: boolean;
  packedOrdersHandedOver: number;
  notes: string;
  createdAt: string;
}

// ---------------- MOCK DATA COLLECTIONS ----------------

export const MOCK_STAFF_KPIS: StaffKpiStat[] = [
  {
    id: 'kpi-1',
    title: 'Khách Tư Vấn Đang Chăm Sóc',
    value: '14 Khách',
    subtitle: '3 khách hẹn gọi lại trong sáng nay',
    badgeText: 'Ưu tiên cao',
    badgeType: 'warning',
  },
  {
    id: 'kpi-2',
    title: 'Lịch Lái Thử Hôm Nay',
    value: '6 Lượt',
    subtitle: 'Lượt gần nhất: 09:30 sáng nay',
    badgeText: 'Đã chuẩn bị xe',
    badgeType: 'success',
  },
  {
    id: 'kpi-3',
    title: 'Phiếu Cọc Cần Gán VIN (72h)',
    value: '3 Phiếu',
    subtitle: '1 phiếu còn dưới 12h đếm ngược',
    badgeText: 'Khẩn cấp',
    badgeType: 'danger',
  },
  {
    id: 'kpi-4',
    title: 'Đơn Phụ Kiện Cần Đóng Gói',
    value: '8 Đơn',
    subtitle: 'Đang chờ bưu tá GHN lấy hàng lúc 11:30',
    badgeText: 'Xuất kho',
    badgeType: 'info',
  },
];

export const MOCK_TODAY_TIMELINE: TodayTimelineSlot[] = [
  {
    id: 'slot-1',
    carModel: 'VinFast VF8 Plus AWD',
    licensePlate: '51K-992.14',
    timeSlot: '09:00 - 10:00',
    customerName: 'Trần Hoàng Nam',
    customerPhone: '0988.123.456',
    staffName: 'Nguyễn Văn Tuấn',
    status: 'SCHEDULED',
  },
  {
    id: 'slot-2',
    carModel: 'Hyundai SantaFe Calligraphy',
    licensePlate: '51K-881.23',
    timeSlot: '10:30 - 11:30',
    customerName: 'Phạm Thị Lan',
    customerPhone: '0912.445.678',
    staffName: 'Lê Quốc Bảo',
    status: 'SCHEDULED',
  },
  {
    id: 'slot-3',
    carModel: 'VinFast VF9 Plus 6 Chỗ',
    licensePlate: '51K-773.09',
    timeSlot: '14:00 - 15:30',
    customerName: 'Ngô Quang Khải',
    customerPhone: '0903.998.112',
    staffName: 'Nguyễn Văn Tuấn',
    status: 'SCHEDULED',
  },
  {
    id: 'slot-4',
    carModel: 'Honda CR-V e:HEV RS',
    licensePlate: '51K-664.55',
    timeSlot: '16:00 - 17:00',
    customerName: 'Hoàng Minh Đức',
    customerPhone: '0977.223.344',
    staffName: 'Trần Thu Hà',
    status: 'SCHEDULED',
  },
];

export const MOCK_CONSULTATION_LEADS: ConsultationLead[] = [
  {
    id: 'LEAD-001',
    customerName: 'Trần Hoàng Nam',
    phone: '0988.123.456',
    email: 'nam.tran@gmail.com',
    interestedCar: 'VinFast VF8 Plus AWD',
    preferredTime: '09:00 - 11:30 sáng',
    assignedStaff: 'Nguyễn Văn Tuấn',
    status: 'PENDING',
    createdAt: 'Hôm nay 08:15',
    userJourney: [
      { time: '14:10', action: 'VIEW_PRODUCT', detail: 'Xem trang chi tiết xe VinFast VF8 Plus (lần thứ 6 trong tuần)', dwellTime: '120s' },
      { time: '14:15', action: 'DWELL_COLOR', detail: 'Dừng xem ảnh màu Xanh Deep Ocean', dwellTime: '195s (Rất cao)' },
      { time: '14:22', action: 'INTERACT_360', detail: 'Xoay khoang lái 360 độ ngắm nội thất Da Nâu Saddle' },
      { time: '14:30', action: 'ESTIMATOR_RUN', detail: 'Tính Dự toán lăn bánh tại TP.HCM (gói vay 70% trong 5 năm ngân hàng Vietcombank)' },
      { time: '14:45', action: 'SUBMIT_LEAD', detail: 'Gửi biểu mẫu yêu cầu nhân viên tư vấn gọi điện' },
    ],
    aiPersona: {
      personaGroup: 'Gia đình trung lưu trẻ • Yêu thích công nghệ & xe điện',
      financialReadiness: 'Rất cao (Đã tự tính gói vay ngân hàng và chuẩn bị vốn đối ứng 30%)',
      primaryConcern: 'Hệ thống an toàn chủ động ADAS Level 2 và chi phí sạc pin tại trạm công cộng',
      suggestedPitch: 'Chào anh Nam, em thấy anh đang quan tâm bản VF8 Plus màu Xanh Deep Ocean nội thất da Nâu rất sang trọng. Showroom Q.7 hiện có sẵn xe giao ngay kèm ưu đãi sạc pin miễn phí 1 năm, em mời anh ghé lái thử trải nghiệm thực tế nhé!',
      recommendedQuestions: [
        'Anh Nam dự kiến nhận xe trong tháng này để kịp chuyến du lịch cùng gia đình không ạ?',
        'Anh đã trải nghiệm tính năng tự động chuyển làn và giữ khoảng cách ADAS trên VF8 chưa ạ?',
        'Anh có muốn em gửi bảng chiết tính chi phí sạc pin hàng tháng so với xe xăng để gia đình tham khảo thêm không ạ?',
      ],
    },
    notes: 'Khách hẹn gọi trước 10h sáng, giọng điệu thân thiện, chu đáo.',
  },
  {
    id: 'LEAD-002',
    customerName: 'Nguyễn Bích Thủy',
    phone: '0903.882.119',
    email: 'thuy.nguyen@company.vn',
    interestedCar: 'Hyundai SantaFe Calligraphy Hybrid',
    preferredTime: '14:00 - 16:00 chiều',
    assignedStaff: 'Lê Quốc Bảo',
    status: 'CONTACTED',
    createdAt: 'Hôm qua 16:30',
    userJourney: [
      { time: '15:20', action: 'VIEW_PRODUCT', detail: 'Xem so sánh SantaFe Hybrid vs CR-V Hybrid' },
      { time: '15:35', action: 'DWELL_COLOR', detail: 'Xem màu Đen Phantom và nội thất 6 chỗ Ghế Cơ Trưởng', dwellTime: '140s' },
      { time: '15:45', action: 'SUBMIT_LEAD', detail: 'Cần tư vấn thời gian giao xe thực tế' },
    ],
    aiPersona: {
      personaGroup: 'Nữ doanh nhân • Chú trọng sự êm ái và không gian hàng ghế thứ hai',
      financialReadiness: 'Thanh toán thẳng 100% không vay',
      primaryConcern: 'Khả năng cách âm, độ êm ái của động cơ Smartstream Turbo Hybrid',
      suggestedPitch: 'Dạ chào chị Thủy, SantaFe Calligraphy Hybrid nổi tiếng với khả năng cách âm 2 lớp và hàng ghế thương gia, rất phù hợp cho công việc di chuyển gặp đối tác của chị!',
      recommendedQuestions: [
        'Chị Thủy có muốn showroom đưa xe demo đến cơ quan để chị trải nghiệm trực tiếp không ạ?',
      ],
    },
    notes: 'Đã gọi lần 1, chị hẹn chiều mai ghé showroom xem màu đen thực tế.',
  },
  {
    id: 'LEAD-003',
    customerName: 'Lê Hoàng Long',
    phone: '0977.441.223',
    email: 'long.le@fpt.com',
    interestedCar: 'VinFast VF9 Plus 6 Chỗ',
    preferredTime: 'Sau 17:00',
    assignedStaff: 'Nguyễn Văn Tuấn',
    status: 'PENDING',
    createdAt: 'Hôm nay 07:45',
    userJourney: [
      { time: '21:10', action: 'VIEW_PRODUCT', detail: 'Tìm hiểu phiên bản VF9 Ghế cơ trưởng tích hợp massage' },
      { time: '21:25', action: 'INTERACT_360', detail: 'Tương tác 360 độ ngắm trần kính toàn cảnh Panorama' },
      { time: '21:40', action: 'SUBMIT_LEAD', detail: 'Đăng ký nhận báo giá lăn bánh trọn gói' },
    ],
    aiPersona: {
      personaGroup: 'Lãnh đạo doanh nghiệp • Yêu cầu tiện nghi hạng nhất',
      financialReadiness: 'Đăng ký theo hình thức đứng tên công ty để khấu trừ thuế',
      primaryConcern: 'Chính sách bảo hành 10 năm pin xe và dịch vụ cứu hộ pin 24/7',
      suggestedPitch: 'Chào anh Long, VF9 phiên bản Ghế cơ trưởng hiện đang là dòng SUV điện đầu bảng với ghế massage sưởi/thông gió, bên em hỗ trợ xuất hóa đơn công ty và giao xe tận văn phòng ạ!',
      recommendedQuestions: [
        'Anh Long dự định đăng ký tên công ty hay đứng tên cá nhân ạ?',
      ],
    },
  },
];

export const MOCK_STAFF_TEST_DRIVES: StaffTestDriveBooking[] = [
  {
    id: 'TD-001',
    bookingCode: '#TD-7712',
    customerName: 'Trần Hoàng Nam',
    customerPhone: '0988.123.456',
    driverLicenseNumber: '079198008819',
    carModel: 'VinFast VF8 Plus AWD',
    preferredTime: 'Hôm nay 09:30 - 11:00',
    locationType: 'SHOWROOM',
    assignedDemoCar: '51K-992.14',
    status: 'PENDING',
    hasValidLicense: true,
  },
  {
    id: 'TD-002',
    bookingCode: '#TD-7715',
    customerName: 'Phạm Thị Lan',
    customerPhone: '0912.445.678',
    driverLicenseNumber: '001092004561',
    carModel: 'Hyundai SantaFe Hybrid Calligraphy',
    preferredTime: 'Hôm nay 10:30 - 11:30',
    locationType: 'SHOWROOM',
    assignedDemoCar: '51K-881.23',
    status: 'CONFIRMED',
    hasValidLicense: true,
  },
  {
    id: 'TD-003',
    bookingCode: '#TD-7718',
    customerName: 'Đặng Quốc Huy',
    customerPhone: '0938.990.112',
    driverLicenseNumber: '079089002234',
    carModel: 'VinFast VF9 Plus 6 Chỗ',
    preferredTime: 'Hôm nay 14:30 - 16:00',
    locationType: 'HOME',
    assignedDemoCar: '51K-773.09',
    status: 'CONFIRMED',
    hasValidLicense: true,
  },
  {
    id: 'TD-004',
    bookingCode: '#TD-7690',
    customerName: 'Vũ Minh Trí',
    customerPhone: '0902.333.888',
    driverLicenseNumber: '024185007788',
    carModel: 'Honda CR-V e:HEV RS',
    preferredTime: 'Hôm qua 15:00 - 16:30',
    locationType: 'SHOWROOM',
    assignedDemoCar: '51K-664.55',
    status: 'COMPLETED',
    hasValidLicense: true,
    satisfactionRating: 5,
    customerPurchaseIntent: 'Rất cao (Đang chọn ngày lành để đặt cọc giữ xe)',
  },
];

export const MOCK_STAFF_DEPOSITS: StaffDepositRecord[] = [
  {
    id: 'DEP-REC-01',
    depositCode: '#DEP-8841',
    customerName: 'Nguyễn Văn Cường',
    customerPhone: '0918.223.344',
    identityCardNumber: '079092001122',
    carModel: 'VinFast VF8',
    variant: 'Plus AWD (402 HP)',
    exteriorColor: 'Xanh Deep Ocean',
    depositAmount: 20000000,
    remainingSeconds: 67320, // ~18.7 hours
    sepayTxnRef: 'VNP-20261029-8841',
    status: 'PAID',
  },
  {
    id: 'DEP-REC-02',
    depositCode: '#DEP-8835',
    customerName: 'Hoàng Minh Tuấn',
    customerPhone: '0983.556.778',
    identityCardNumber: '001088009933',
    carModel: 'Hyundai SantaFe',
    variant: '1.6T Hybrid AWD Calligraphy',
    exteriorColor: 'Đen Phantom',
    depositAmount: 10000000,
    remainingSeconds: 21600, // 6.0 hours (cảnh báo)
    assignedVin: 'HMC-SAN-2026-8812',
    sepayTxnRef: 'VNP-20261028-8835',
    status: 'VIN_ASSIGNED',
  },
  {
    id: 'DEP-REC-03',
    depositCode: '#DEP-8820',
    customerName: 'Lê Thị Thu Cúc',
    customerPhone: '0903.667.889',
    identityCardNumber: '031195004455',
    carModel: 'VinFast VF9',
    variant: 'Plus 6 Chỗ Ghế Cơ Trưởng',
    exteriorColor: 'Trắng Ngọc Trai',
    depositAmount: 20000000,
    remainingSeconds: 154800, // ~43 hours
    sepayTxnRef: 'VNP-20261029-8820',
    status: 'PAID',
  },
  {
    id: 'DEP-REC-04',
    depositCode: '#DEP-8798',
    customerName: 'Bùi Đức Trọng',
    customerPhone: '0912.778.899',
    identityCardNumber: '079184003322',
    carModel: 'Honda CR-V',
    variant: 'e:HEV RS Hybrid',
    exteriorColor: 'Đỏ Lịch Lãm',
    depositAmount: 10000000,
    remainingSeconds: 0,
    assignedVin: 'HD-CRV-2026-9901',
    sepayTxnRef: 'VNP-20261026-8798',
    status: 'CONTRACT_SIGNED',
  },
];

export const MOCK_STAFF_REFUND_DOCKETS: StaffRefundDocket[] = [
  {
    id: 'REF-DOC-01',
    depositCode: '#DEP-8841',
    customerName: 'Trần Văn Cường',
    identityCardNumber: '001202008819',
    carModel: 'VinFast VF8 Plus AWD',
    depositAmount: 20000000,
    reason: 'Ngân hàng từ chối cấp hạn mức cho vay 70% giá trị xe theo đơn thẩm định',
    bankName: 'Vietcombank - Chi nhánh Tân Bình',
    bankAccountNumber: '0071001234567',
    bankAccountHolder: 'TRAN VAN CUONG',
    submittedAt: 'Hôm nay 10:15',
    rejectionLetterFileName: 'ThongBaoTuChoiCapTinDung_VCB_001202.pdf',
    checklist: {
      within72h: true,
      validBankLetter: true,
      noVatInvoice: true,
    },
    status: 'REFUND_REQUESTED',
  },
  {
    id: 'REF-DOC-02',
    depositCode: '#DEP-8832',
    customerName: 'Lê Thị Mai',
    identityCardNumber: '079195004321',
    carModel: 'Hyundai SantaFe Calligraphy',
    depositAmount: 10000000,
    reason: 'Gia đình có việc đột xuất cần rút cọc bảo đảm theo điều khoản thỏa thuận',
    bankName: 'Techcombank - Chi nhánh Thảo Điền',
    bankAccountNumber: '19034567891011',
    bankAccountHolder: 'LE THI MAI',
    submittedAt: 'Hôm qua 15:40',
    rejectionLetterFileName: 'DonDeNghiRutCoc_LeThiMai.pdf',
    checklist: {
      within72h: true,
      validBankLetter: true,
      noVatInvoice: true,
    },
    status: 'VERIFIED',
  },
];

export const MOCK_STAFF_FULFILLMENT_ORDERS: StaffFulfillmentOrder[] = [
  {
    id: 'ORD-101',
    orderCode: '#ORD-11029',
    customerName: 'Nguyễn Minh Quân',
    customerPhone: '0912.883.992',
    shippingAddress: '45 Lê Văn Sỹ, Phường 13, Quận 3, TP.HCM',
    paymentMethod: 'SEPAY',
    totalAmount: 2450000,
    createdAt: 'Hôm nay 08:30',
    status: 'NEED_PACK',
    items: [
      {
        sku: 'ACC-FLR-082',
        name: 'Thảm Lót Sàn Ô Tô Tràn Viền 5D Kháng Nước (VinFast VF8)',
        shelfLocation: 'Kệ A2 - Ngăn 03',
        quantity: 1,
        price: 2450000,
      },
    ],
  },
  {
    id: 'ORD-102',
    orderCode: '#ORD-11032',
    customerName: 'Hoàng Anh Dũng',
    customerPhone: '0988.441.993',
    shippingAddress: '120 Trần Phú, Hà Đông, Hà Nội',
    paymentMethod: 'COD',
    totalAmount: 3890000,
    createdAt: 'Hôm nay 09:15',
    status: 'NEED_PACK',
    items: [
      {
        sku: 'ACC-CAM-4K',
        name: 'Camera Hành Trình 4K Trước & Sau GPS Wi-Fi',
        shelfLocation: 'Kệ E1 - Ngăn 01',
        quantity: 1,
        price: 3890000,
      },
    ],
  },
  {
    id: 'ORD-103',
    orderCode: '#ORD-10998',
    customerName: 'Vũ Hải Đăng',
    customerPhone: '0903.112.556',
    shippingAddress: '78 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    paymentMethod: 'SEPAY',
    totalAmount: 8900000,
    createdAt: 'Hôm qua 14:00',
    status: 'PACKING',
    items: [
      {
        sku: 'ACC-CHG-EV7',
        name: 'Bộ Sạc Treo Tường Xe Điện Di Động 7.4kW',
        shelfLocation: 'Kệ C4 - Ngăn 02',
        quantity: 1,
        price: 8900000,
      },
    ],
  },
  {
    id: 'ORD-104',
    orderCode: '#ORD-10982',
    customerName: 'Đỗ Tiến Đạt',
    customerPhone: '0977.889.001',
    shippingAddress: '12 Bạch Đằng, Hải Châu, Đà Nẵng',
    paymentMethod: 'SEPAY',
    totalAmount: 6500000,
    createdAt: 'Hôm qua 11:20',
    status: 'SHIPPED',
    items: [
      {
        sku: 'ACC-FILM-CR',
        name: 'Phim Cách Nhiệt Ceramic Chống Tia UV 99%',
        shelfLocation: 'Kệ B1 - Ngăn 04',
        quantity: 1,
        price: 6500000,
      },
    ],
    trackingNumber: 'GHN-88219920',
    courier: 'Giao Hàng Nhanh (GHN Express)',
  },
];

export const MOCK_STAFF_RETURN_ITEMS: StaffReturnItem[] = [
  {
    id: 'RMA-01',
    rmaCode: '#RMA-402',
    originalOrderCode: '#ORD-10892',
    customerName: 'Nguyễn Thị Hương',
    customerPhone: '0912.334.556',
    accessoryName: 'Thảm Lót Sàn Ô Tô Tràn Viền 5D Kháng Nước',
    reason: 'Giao nhầm phiên bản form xe (khách đi VF9 nhưng nhận thảm VF8)',
    requestedAt: 'Hôm qua 14:20',
    evidenceImages: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
    ],
    inspectionNotes: 'Kiện hàng đã gửi về kho Showroom, thảm còn nguyên bọc nilon và tem niêm phong, chưa qua sử dụng.',
    status: 'INSPECTING',
  },
  {
    id: 'RMA-02',
    rmaCode: '#RMA-398',
    originalOrderCode: '#ORD-10775',
    customerName: 'Phan Văn Hậu',
    customerPhone: '0988.665.443',
    accessoryName: 'Camera Hành Trình 4K Trước & Sau',
    reason: 'Màn hình camera chập chờn khi khởi động xe buổi sáng',
    requestedAt: '3 ngày trước',
    evidenceImages: [
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=400&q=80',
    ],
    inspectionNotes: 'Đã kiểm tra kỹ thuật tại phòng bảo hành: Lỗi IC nguồn bo mạch chính. Đủ điều kiện đổi sản phẩm mới.',
    status: 'RESOLVED',
    resolution: 'REPLACE_NEW',
  },
];

export const MOCK_CROSS_BRANCH_STOCKS: CrossBranchStock[] = [
  {
    sku: 'ACC-CAM-4K',
    name: 'Camera Hành Trình 4K Trước & Sau GPS Wi-Fi',
    category: 'Đồ Điện Tử',
    shelfLocation: 'Kệ E1 - Ngăn 01',
    localStock: 2, // sắp hết
    branches: [
      { branchName: 'Showroom Cầu Giấy Hà Nội', stock: 18 },
      { branchName: 'Showroom Đà Nẵng Riverside', stock: 8 },
      { branchName: 'Kho Tổng Bình Dương', stock: 45 },
    ],
  },
  {
    sku: 'ACC-FLR-082',
    name: 'Thảm Lót Sàn Ô Tô Tràn Viền 5D Kháng Nước',
    category: 'Nội Thất Ô Tô',
    shelfLocation: 'Kệ A2 - Ngăn 03',
    localStock: 24,
    branches: [
      { branchName: 'Showroom Cầu Giấy Hà Nội', stock: 15 },
      { branchName: 'Showroom Đà Nẵng Riverside', stock: 6 },
      { branchName: 'Kho Tổng Bình Dương', stock: 60 },
    ],
  },
  {
    sku: 'ACC-CHG-EV7',
    name: 'Bộ Sạc Treo Tường Xe Điện Di Động 7.4kW',
    category: 'Phụ Kiện Xe Điện',
    shelfLocation: 'Kệ C4 - Ngăn 02',
    localStock: 4,
    branches: [
      { branchName: 'Showroom Cầu Giấy Hà Nội', stock: 12 },
      { branchName: 'Kho Tổng Bình Dương', stock: 30 },
    ],
  },
];

export const MOCK_DEMO_FLEET: DemoFleetCar[] = [
  {
    id: 'DEMO-01',
    licensePlate: '51K-992.14',
    carModel: 'VinFast VF8',
    variant: 'Plus AWD (402 HP)',
    color: 'Xanh Deep Ocean',
    currentOdoKm: 8450,
    nextServiceKm: 10000,
    lastServiceDate: '2026-09-15',
    status: 'SAN_SANG',
  },
  {
    id: 'DEMO-02',
    licensePlate: '51K-881.23',
    carModel: 'Hyundai SantaFe',
    variant: '1.6T Hybrid Calligraphy AWD',
    color: 'Đen Phantom',
    currentOdoKm: 12100,
    nextServiceKm: 15000,
    lastServiceDate: '2026-08-20',
    status: 'SAN_SANG',
  },
  {
    id: 'DEMO-03',
    licensePlate: '51K-773.09',
    carModel: 'VinFast VF9',
    variant: 'Plus 6 Chỗ Ghế Cơ Trưởng',
    color: 'Trắng Ngọc Trai',
    currentOdoKm: 9980,
    nextServiceKm: 10000,
    lastServiceDate: '2026-07-10',
    status: 'BAO_DUONG',
    maintenanceReason: 'Bảo dưỡng định kỳ mốc 10.000 km và đảo lốp',
    expectedReturnDate: '2026-10-31',
  },
  {
    id: 'DEMO-04',
    licensePlate: '51K-664.55',
    carModel: 'Honda CR-V',
    variant: 'e:HEV RS Hybrid',
    color: 'Đỏ Lịch Lãm',
    currentOdoKm: 4320,
    nextServiceKm: 5000,
    lastServiceDate: '2026-09-01',
    status: 'SAN_SANG',
  },
];

export const MOCK_HANDOVER_HISTORY: ShiftHandoverRecord[] = [
  {
    id: 'HO-01',
    shiftType: 'Ca Sáng (08:00 - 15:00) ➔ Ca Chiều (15:00 - 21:00)',
    date: '2026-10-28',
    handedOverBy: 'Nguyễn Văn Tuấn (STF-004)',
    receivedBy: 'Lê Quốc Bảo (STF-002)',
    pendingLeadsCount: 2,
    demoKeysVerified: true,
    packedOrdersHandedOver: 6,
    notes: 'Khách Trần Hoàng Nam hẹn gọi lại lúc 16:30 để gửi báo giá chi tiết VF8 Plus.',
    createdAt: '2026-10-28 14:55',
  },
  {
    id: 'HO-02',
    shiftType: 'Ca Chiều (15:00 - 21:00) ➔ Ca Sáng hôm sau',
    date: '2026-10-27',
    handedOverBy: 'Lê Quốc Bảo (STF-002)',
    receivedBy: 'Nguyễn Văn Tuấn (STF-004)',
    pendingLeadsCount: 1,
    demoKeysVerified: true,
    packedOrdersHandedOver: 4,
    notes: 'Xe Demo VF9 đã bàn giao chìa khóa cho xưởng dịch vụ bảo dưỡng định kỳ.',
    createdAt: '2026-10-27 20:50',
  },
];
