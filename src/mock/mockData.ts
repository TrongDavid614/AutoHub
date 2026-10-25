export interface MockCar {
  id: string;
  name: string;
  badge: string;
  segment: string;
  subtitle: string;
  powertrain: string;
  seats: string;
  acceleration: string;
  power: string;
  range: string;
  charging: string;
  feature1: string;
  feature2: string;
  listedPrice: number;
  depositAmount: number;
  depositNote: string;
  estimatedOnRoad: number;
  image: string;
  availableColors: { name: string; hex: string }[];
  gridSpecs?: {
    s1Label: string;
    s1Val: string;
    s2Label: string;
    s2Val: string;
    s3Label: string;
    s3Val: string;
  };
  isUpcoming?: boolean;
}

export const MOCK_CARS: MockCar[] = [
  {
    id: 'gt-e-grand-touring',
    name: 'AutoHub GT-e Grand Touring',
    badge: 'FLAGSHIP • KHUYÊN DÙNG',
    segment: 'Sedan thể thao',
    subtitle: 'Sedan Thể Thao • AWD Dual-Motor (680 HP)',
    powertrain: 'Dual-Motor AWD',
    seats: '5 Chỗ Tiêu chuẩn',
    acceleration: '3.2 giây',
    power: '680 HP (Dual-Motor AWD)',
    range: '680 km (LFP 105 kWh)',
    charging: '10–80% trong 15 phút (350kW)',
    feature1: 'HubPilot 2+ tự hành',
    feature2: 'Treo khí nén chủ động',
    listedPrice: 2890000000,
    depositAmount: 20000000,
    depositNote: 'Cọc giữ suất 20.000.000 đ (Khóa VIN 72h)',
    estimatedOnRoad: 3087140700,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    availableColors: [
      { name: 'Xanh Riviera', hex: '#0284C7' },
      { name: 'Trắng Ceramic', hex: '#F8FAFC' },
      { name: 'Xám Liquid', hex: '#94A3B8' },
      { name: 'Đen Obsidian', hex: '#0F172A' },
    ],
    gridSpecs: {
      s1Label: '0-100 KM/H',
      s1Val: '3.2s',
      s2Label: 'TẦM CHẠY (WLTP)',
      s2Val: '680 km',
      s3Label: 'SẠC 800V',
      s3Val: '15 phút',
    },
  },
  {
    id: 'gt-e-track-edition',
    name: 'AutoHub GT-e Track Edition',
    badge: 'TRACK READY • 1.020 HP',
    segment: 'GT Hypercar',
    subtitle: 'Sedan Siêu Năng • Tri-Motor AWD (1.020 HP)',
    powertrain: 'Tri-Motor Hyper AWD',
    seats: '4 chỗ VIP',
    acceleration: '2.8 giây (Hyper)',
    power: '1.020 HP (Tri-Motor Vectoring)',
    range: '600 km (NMC SiC 112 kWh)',
    charging: '10–80% trong 12 phút (SiC Gen 3)',
    feature1: 'Phanh Gốm Carbon Track',
    feature2: 'Ghế Đua Carbon Monocoque',
    listedPrice: 3490000000,
    depositAmount: 20000000,
    depositNote: 'Cọc giữ suất 20.000.000 đ (Giao Q2/2025)',
    estimatedOnRoad: 3734200000,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    availableColors: [
      { name: 'Đen Obsidian', hex: '#0F172A' },
      { name: 'Xám Liquid', hex: '#94A3B8' },
      { name: 'Đỏ Crimson', hex: '#DC2626' },
    ],
    gridSpecs: {
      s1Label: '0-100 KM/H',
      s1Val: '2.8s',
      s2Label: 'TẦM CHẠY (WLTP)',
      s2Val: '600 km',
      s3Label: 'HỆ THỐNG PHANH',
      s3Val: 'Gốm Carbon',
    },
  },
  {
    id: 'gt-e-standard',
    name: 'AutoHub GT-e Standard',
    badge: 'TIÊU CHUẨN',
    segment: 'Sedan thể thao',
    subtitle: 'Sedan Đô Thị • RWD Đơn Motor (450 HP)',
    powertrain: 'Thuần điện EV 800V SiC',
    seats: '5 Chỗ Tiêu chuẩn',
    acceleration: '3.8 giây',
    power: '450 HP (Single-Motor RWD)',
    range: '620 km (LFP 92 kWh)',
    charging: '10–80% trong 18 phút (250kW)',
    feature1: 'Pin LFP Thế Hệ Mới Bền Bỉ',
    feature2: 'OTA Cập Nhật Vô Tận',
    listedPrice: 2490000000,
    depositAmount: 20000000,
    depositNote: 'Cọc giữ suất 20.000.000 đ',
    estimatedOnRoad: 2659300000,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    availableColors: [
      { name: 'Trắng Ceramic', hex: '#F8FAFC' },
      { name: 'Đen Obsidian', hex: '#0F172A' },
      { name: 'Xanh Riviera', hex: '#0284C7' },
    ],
    gridSpecs: {
      s1Label: '0-100 KM/H',
      s1Val: '3.8s',
      s2Label: 'TẦM CHẠY (WLTP)',
      s2Val: '620 km',
      s3Label: 'TỰ HÀNH',
      s3Val: 'HubPilot 2+',
    },
  },
  {
    id: 'suv-e-cross-touring',
    name: 'AutoHub SUV-e Cross Touring',
    badge: 'SẮP RA MẮT • NHẬN ĐẶT CHỖ',
    segment: 'SUV Đa dụng',
    subtitle: 'SUV 5 Chỗ • Dual-Motor AWD (580 HP)',
    powertrain: 'Dual-Motor AWD',
    seats: '5 Chỗ Tiêu chuẩn',
    acceleration: '3.9 giây',
    power: '580 HP (Dual-Motor AWD)',
    range: '650 km (LFP 105 kWh)',
    charging: '10–80% trong 16 phút (350kW)',
    feature1: 'Khí nén 3 cấp nâng hạ gầm chủ động',
    feature2: 'Khoang cốp mở rộng 1.450 lít',
    listedPrice: 2990000000,
    depositAmount: 20000000,
    depositNote: 'Mở nhận đặt cọc ưu đãi đợt 1',
    estimatedOnRoad: 3194000000,
    isUpcoming: true,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    availableColors: [
      { name: 'Đỏ Crimson', hex: '#DC2626' },
      { name: 'Xám Liquid', hex: '#94A3B8' },
      { name: 'Đen Obsidian', hex: '#0F172A' },
    ],
    gridSpecs: {
      s1Label: '0-100 KM/H',
      s1Val: '3.9s',
      s2Label: 'TẦM CHẠY (WLTP)',
      s2Val: '650 km',
      s3Label: 'HỆ THỐNG TREO',
      s3Val: 'Khí nén 3 cấp',
    },
  },
  {
    id: 'gt-e-executive',
    name: 'AutoHub GT-e Executive',
    badge: 'LUXURY EXECUTIVE',
    segment: 'Shooting Brake',
    subtitle: 'Sedan Hạng Sang • Dual-Motor AWD (520 HP)',
    powertrain: 'Dual-Motor AWD',
    seats: '4 chỗ VIP',
    acceleration: '3.6 giây',
    power: '520 HP (Dual-Motor AWD)',
    range: '700 km (LFP 110 kWh)',
    charging: 'Massage đá nóng 4 ghế • Burmester 23 loa',
    feature1: 'Ghế Ottoman Hạng Thương Gia',
    feature2: 'HubPilot VIP Chauffeur Mode',
    listedPrice: 2690000000,
    depositAmount: 20000000,
    depositNote: 'Cọc giữ suất 20.000.000 đ',
    estimatedOnRoad: 2873400000,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    availableColors: [
      { name: 'Xanh Phantom', hex: '#1E293B' },
      { name: 'Xám Liquid', hex: '#94A3B8' },
      { name: 'Trắng Ceramic', hex: '#F8FAFC' },
    ],
    gridSpecs: {
      s1Label: '0-100 KM/H',
      s1Val: '3.6s',
      s2Label: 'TẦM CHẠY (WLTP)',
      s2Val: '700 km',
      s3Label: 'TIỆN NGHI CAO CẤP',
      s3Val: 'Massage 4 Ghế',
    },
  },
  {
    id: 'gt-e-sport-tourer',
    name: 'AutoHub GT-e Sport Tourer',
    badge: 'LIMITED EDITION • 50 XE VN',
    segment: 'Shooting Brake',
    subtitle: 'Wagon Hiệu Năng • AWD SiC (680 HP)',
    powertrain: 'Dual-Motor AWD',
    seats: '5 Chỗ Tiêu chuẩn',
    acceleration: '3.3 giây',
    power: '680 HP (Dual-Motor SiC)',
    range: '660 km (LFP 100 kWh)',
    charging: '10–80% trong 15 phút (350kW)',
    feature1: 'Giá nóc khí động học Carbon',
    feature2: 'Dẫn động 4 bánh chủ động thông minh',
    listedPrice: 3120000000,
    depositAmount: 20000000,
    depositNote: 'Cọc giữ suất 20.000.000 đ',
    estimatedOnRoad: 3338400000,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    availableColors: [
      { name: 'Xám Liquid', hex: '#94A3B8' },
      { name: 'Đen Obsidian', hex: '#0F172A' },
      { name: 'Trắng Ceramic', hex: '#F8FAFC' },
    ],
    gridSpecs: {
      s1Label: '0-100 KM/H',
      s1Val: '3.3s',
      s2Label: 'CỐP HÀNH LÝ',
      s2Val: '650 Lít',
      s3Label: 'TẦM CHẠY (WLTP)',
      s3Val: '660 km',
    },
  },
];

export interface MockDeposit {
  id: string;
  contractCode: string;
  depositStatus: 'VIN_LOCKED' | 'PENDING' | 'REFUNDED';
  carName: string;
  carVariant: string;
  carImage: string;
  vinNumber: string;
  depositAmount: number;
  paymentGateway: string;
  paymentRef: string;
  depositTimestamp: string;
  remainingHours: number;
  remainingMinutes: number;
  remainingSeconds: number;
  consultantName: string;
  consultantPhone: string;
  showroomLocation: string;
}

export interface MockTestDriveTicket {
  ticketCode: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED';
  carName: string;
  experiencePackage: string;
  duration: string;
  scheduledTime: string;
  scheduledDate: string;
  dateDayNumber: string;
  dateDayText: string;
  locationName: string;
  locationAddress: string;
  instructorName: string;
  instructorTitle: string;
  instructorPhone: string;
  notes: string;
}

export interface MockAddressItem {
  id: number;
  title: string;
  badge?: 'MẶC ĐỊNH' | 'PHỤ';
  isDefault: boolean;
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  note?: string;
}

export const MOCK_CUSTOMER_PROFILE = {
  id: 8892,
  code: '#AH-VIP-8892',
  fullName: 'Nguyễn Văn A',
  vipTier: 'VIP DIAMOND RESERVE',
  email: 'nguyen.vana@autohub.vn',
  phoneNumber: '0912 345 678',
  identityCardNumber: '001201012345',
  identityCardIssuedDate: '15/04/2021',
  identityCardIssuedPlace: 'Cục Cảnh sát QLHC về TTXH',
  drivingLicenseNumber: 'B2-79018492019',
  drivingLicenseExpiry: '20/12/2030',
  dateOfBirth: '18/08/1988',
  activeDeposit: {
    id: 'DEP-2026-8821',
    contractCode: '#AH-DEP-2026-8821',
    depositStatus: 'VIN_LOCKED' as const,
    carName: 'AutoHub GT-e Grand Touring',
    carVariant: 'AWD Dual-Motor 680 HP • Ngoại thất: Xanh Phantom Metallic • Nội thất: Da Nappa Đen Obsidian ốp Carbon Matrix.',
    carImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    vinNumber: 'VIN-2026-GTE-8821VN (Lô xuất xưởng Tháng 10/2026)',
    depositAmount: 20000000,
    paymentGateway: 'Cổng thanh toán VNPay IPN',
    paymentRef: '#VNP1489201',
    depositTimestamp: '14:15 - 25/10/2026',
    remainingHours: 58,
    remainingMinutes: 14,
    remainingSeconds: 21,
    consultantName: 'Nguyễn Văn Quốc',
    consultantPhone: '0909 123 456',
    showroomLocation: 'AutoHub Flagship Showroom Q7 (Crescent Mall, TP.HCM)',
  },
  upcomingTestDrive: {
    ticketCode: '#TD-2026-881',
    status: 'CONFIRMED' as const,
    carName: 'AutoHub GT-e Grand Touring (Demo Track Ready)',
    experiencePackage: 'VIP Performance Track',
    duration: 'THỜI LƯỢNG: 60 PHÚT',
    scheduledTime: '09:30 AM — Thứ Bảy',
    scheduledDate: '27/10/2026',
    dateDayNumber: '27',
    dateDayText: 'T. BẢY',
    locationName: 'Showroom AutoHub Q7 Flagship',
    locationAddress: 'Tầng G, Crescent Mall, Nguyễn Văn Linh, Q.7, TP.HCM',
    instructorName: 'KTV Phạm Hùng',
    instructorTitle: 'Trưởng đội xe thử',
    instructorPhone: '0903 881 920',
    notes: 'Quý khách vui lòng xuất trình Giấy phép lái xe (GPLX) bản gốc Hạng B2 trở lên còn hiệu lực khi làm thủ tục ký biên bản nhận xe tại quầy VIP Concierge.',
  },
  savedAddresses: [
    {
      id: 1,
      title: 'Nhà riêng',
      badge: 'MẶC ĐỊNH' as const,
      isDefault: true,
      recipientName: 'Nguyễn Văn A',
      phoneNumber: '0912 345 678',
      fullAddress: 'Căn hộ Penthouse 1802, Tháp Aqua 1, Vinhomes Golden River, Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.',
      note: 'Đã khảo sát lắp trụ sạc treo tường HubWall 22kW',
    },
    {
      id: 2,
      title: 'Văn phòng làm việc',
      badge: 'PHỤ' as const,
      isDefault: false,
      recipientName: 'Nguyễn Văn A (Trợ lý nhận thay)',
      phoneNumber: '0908 678 999',
      fullAddress: 'Tầng 25, Bitexco Financial Tower, Số 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.',
      note: 'Chỉ nhận bưu phẩm vào giờ hành chính (08:30 - 18:00)',
    },
  ],
};
