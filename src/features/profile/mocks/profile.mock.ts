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

export interface CustomerActiveDeposit {
  id: string;
  contractCode: string;
  depositStatus: 'VIN_LOCKED' | 'PENDING' | 'REFUNDED' | 'DELIVERED';
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

export interface CustomerUpcomingTestDrive {
  ticketCode: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
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

export interface CustomerProfile {
  id: number;
  code: string;
  fullName: string;
  vipTier: string;
  email: string;
  phoneNumber: string;
  identityCardNumber: string;
  identityCardIssuedDate: string;
  identityCardIssuedPlace: string;
  drivingLicenseNumber: string;
  drivingLicenseExpiry: string;
  dateOfBirth: string;
  activeDeposit: CustomerActiveDeposit;
  upcomingTestDrive: CustomerUpcomingTestDrive;
  savedAddresses: MockAddressItem[];
}

export const MOCK_CUSTOMER_PROFILE: CustomerProfile = {
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
    depositStatus: 'VIN_LOCKED',
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
    status: 'CONFIRMED',
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
      badge: 'MẶC ĐỊNH',
      isDefault: true,
      recipientName: 'Nguyễn Văn A',
      phoneNumber: '0912 345 678',
      fullAddress: 'Căn hộ Penthouse 1802, Tháp Aqua 1, Vinhomes Golden River, Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.',
      note: 'Đã khảo sát lắp trụ sạc treo tường HubWall 22kW',
    },
    {
      id: 2,
      title: 'Văn phòng làm việc',
      badge: 'PHỤ',
      isDefault: false,
      recipientName: 'Nguyễn Văn A (Trợ lý nhận thay)',
      phoneNumber: '0908 678 999',
      fullAddress: 'Tầng 25, Bitexco Financial Tower, Số 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.',
      note: 'Chỉ nhận bưu phẩm vào giờ hành chính (08:30 - 18:00)',
    },
  ],
};
