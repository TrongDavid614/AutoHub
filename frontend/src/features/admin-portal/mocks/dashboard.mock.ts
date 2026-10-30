// TODO(mock): remove when backend ready
// Dữ liệu mô phỏng cho Bảng Điều Khiển Điều Hành Doanh Nghiệp (ADM-01: Executive Dashboard)
// Căn cứ Use Case: F19, UC26 theo hồ sơ kiến trúc AutoHub & tài liệu MoTa_GiaoDien_Admin_Staff_ShadcnAdminKit

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  changePercent: number;
  isPositive: boolean;
  targetLabel: string;
  subtitle: string;
  sparklineData: number[];
  badgeText: string;
  badgeType: 'success' | 'warning' | 'info' | 'danger';
}

export interface RevenueDataPoint {
  date: string;
  dayLabel: string;
  accessoryRevenue: number; // VNĐ
  carDepositCashflow: number; // VNĐ
}

export interface RegionalRevenue {
  region: string;
  showroomName: string;
  revenue: number; // VNĐ
  formattedRevenue: string;
  percentage: number;
  color: string;
  staffCount: number;
  ordersCount: number;
}

export interface UrgentDeposit {
  id: string;
  depositCode: string;
  customerName: string;
  customerPhone: string;
  carModel: string;
  variant: string;
  color: string;
  depositAmount: number;
  remainingSeconds: number; // số giây còn lại của 72h
  assignedStaff: string;
  assignedShowroom: string;
  sepayTxnRef: string;
  vnpayTxnRef?: string;
  status: 'PENDING_VIN' | 'PENDING_CONTRACT';
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  timeAgo: string;
  type: 'SEPAY_IPN' | 'VIN_ASSIGN' | 'TEST_DRIVE' | 'ACCESSORY_ORDER' | 'AI_RAG' | 'REFUND_APPROVED';
  actor: string;
  actorType: 'STAFF' | 'CUSTOMER' | 'SYSTEM' | 'AI';
  title: string;
  description: string;
  meta: string;
  statusBadge: string;
  badgeColor: string;
}

export interface AiEngineStatus {
  gemini: {
    model: string;
    status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
    apiEndpoint: string;
    responseTimeMs: number;
    quotaUsedPercent: number;
    contextWindow: string;
    successRate: number;
  };
  vectorDb: {
    engine: string;
    status: 'CONNECTED' | 'DISCONNECTED';
    indexedEmbeddingsCount: number;
    queryLatencyMs: number;
  };
  paymentGateway: {
    name: string;
    status: 'LIVE' | 'MAINTENANCE';
    uptimePercent: number;
  };
  cronJobs: Array<{
    name: string;
    schedule: string;
    lastRun: string;
    status: 'HEALTHY' | 'RUNNING' | 'FAILED';
  }>;
}

export const MOCK_DASHBOARD_KPIS: KpiMetric[] = [
  {
    id: 'kpi-accessory-rev',
    title: 'Doanh Thu Phụ Kiện Tháng',
    value: '3.842.500.000 ₫',
    numericValue: 3842500000,
    changePercent: 14.2,
    isPositive: true,
    targetLabel: 'Mục tiêu: 4.2 tỷ',
    subtitle: 'Đạt 91.5% kế hoạch tháng • 1.428 đơn hàng',
    sparklineData: [45, 52, 58, 62, 55, 68, 74, 82, 88, 95],
    badgeText: '+14.2% MoM',
    badgeType: 'success',
  },
  {
    id: 'kpi-car-deposits',
    title: 'Cọc Xe 72h Đang Giữ',
    value: '24 Suất (380.000.000 ₫)',
    numericValue: 380000000,
    changePercent: -4.5,
    isPositive: false,
    targetLabel: '4 suất sắp hết hạn (< 6h)',
    subtitle: '18 suất đã gán số VIN • 6 suất chờ đối soát',
    sparklineData: [20, 22, 28, 25, 30, 26, 28, 22, 24, 24],
    badgeText: '4 Suất Cảnh Báo',
    badgeType: 'warning',
  },
  {
    id: 'kpi-test-drives',
    title: 'Lịch Lái Thử Chờ Duyệt',
    value: '42 Lịch Hẹn',
    numericValue: 42,
    changePercent: 8.5,
    isPositive: true,
    targetLabel: 'Cần điều phối xe Demo',
    subtitle: '16 lịch trải nghiệm tại nhà • 26 tại showroom',
    sparklineData: [15, 18, 24, 28, 32, 35, 38, 40, 42, 42],
    badgeText: '+8.5% Tuần Này',
    badgeType: 'info',
  },
  {
    id: 'kpi-conversion-rate',
    title: 'Tỷ Lệ Chốt Hợp Đồng Cọc',
    value: '78.5%',
    numericValue: 78.5,
    changePercent: 6.5,
    isPositive: true,
    targetLabel: 'KPI Quý: 72.0%',
    subtitle: 'Vượt 6.5% mục tiêu • 94 hợp đồng ký thành công',
    sparklineData: [65, 68, 70, 72, 71, 74, 76, 75, 77, 78.5],
    badgeText: 'Vượt KPI Quý',
    badgeType: 'success',
  },
];

export const MOCK_REVENUE_CHART_30_DAYS: RevenueDataPoint[] = [
  { date: '2025-09-30', dayLabel: '30/09', accessoryRevenue: 85000000, carDepositCashflow: 120000000 },
  { date: '2025-10-02', dayLabel: '02/10', accessoryRevenue: 92000000, carDepositCashflow: 100000000 },
  { date: '2025-10-04', dayLabel: '04/10', accessoryRevenue: 110000000, carDepositCashflow: 140000000 },
  { date: '2025-10-06', dayLabel: '06/10', accessoryRevenue: 105000000, carDepositCashflow: 130000000 },
  { date: '2025-10-08', dayLabel: '08/10', accessoryRevenue: 125000000, carDepositCashflow: 170000000 },
  { date: '2025-10-10', dayLabel: '10/10', accessoryRevenue: 140000000, carDepositCashflow: 190000000 },
  { date: '2025-10-12', dayLabel: '12/10', accessoryRevenue: 135000000, carDepositCashflow: 160000000 },
  { date: '2025-10-14', dayLabel: '14/10', accessoryRevenue: 150000000, carDepositCashflow: 210000000 },
  { date: '2025-10-16', dayLabel: '16/10', accessoryRevenue: 145000000, carDepositCashflow: 200000000 },
  { date: '2025-10-18', dayLabel: '18/10', accessoryRevenue: 165000000, carDepositCashflow: 240000000 },
  { date: '2025-10-20', dayLabel: '20/10', accessoryRevenue: 180000000, carDepositCashflow: 260000000 },
  { date: '2025-10-22', dayLabel: '22/10', accessoryRevenue: 175000000, carDepositCashflow: 230000000 },
  { date: '2025-10-24', dayLabel: '24/10', accessoryRevenue: 190000000, carDepositCashflow: 250000000 },
  { date: '2025-10-26', dayLabel: '26/10', accessoryRevenue: 210000000, carDepositCashflow: 270000000 },
  { date: '2025-10-28', dayLabel: '28/10', accessoryRevenue: 225000000, carDepositCashflow: 280000000 },
];

export const MOCK_REGIONAL_REVENUES: RegionalRevenue[] = [
  {
    region: 'Miền Nam',
    showroomName: 'Showroom TP.HCM (Thủ Đức)',
    revenue: 1800000000,
    formattedRevenue: '1.800.000.000 ₫',
    percentage: 46.8,
    color: '#89CEFF',
    staffCount: 24,
    ordersCount: 680,
  },
  {
    region: 'Miền Bắc',
    showroomName: 'Showroom Hà Nội (Cầu Giấy)',
    revenue: 1400000000,
    formattedRevenue: '1.400.000.000 ₫',
    percentage: 36.4,
    color: '#0EA5E9',
    staffCount: 18,
    ordersCount: 512,
  },
  {
    region: 'Miền Trung',
    showroomName: 'Showroom Đà Nẵng (Hải Châu)',
    revenue: 642500000,
    formattedRevenue: '642.500.000 ₫',
    percentage: 16.8,
    color: '#38BDF8',
    staffCount: 12,
    ordersCount: 236,
  },
];

export const MOCK_URGENT_DEPOSITS: UrgentDeposit[] = [
  {
    id: 'dep-01',
    depositCode: '#DEP-8841',
    customerName: 'Nguyễn Văn Tuấn',
    customerPhone: '0912 345 678',
    carModel: 'VinFast VF8',
    variant: 'Plus AWD (Thuần Điện)',
    color: 'Xanh Phantom',
    depositAmount: 20000000,
    remainingSeconds: 7835, // 02:10:35
    assignedStaff: 'Trần Quốc Huy (STF-004)',
    assignedShowroom: 'Showroom TP.HCM',
    sepayTxnRef: 'SEP14892011', vnpayTxnRef: 'SEP14892011',
    status: 'PENDING_CONTRACT',
  },
  {
    id: 'dep-02',
    depositCode: '#DEP-8842',
    customerName: 'Lê Thị Thu Thanh',
    customerPhone: '0983 234 567',
    carModel: 'Porsche Taycan',
    variant: '4S Cross Turismo',
    color: 'Trắng Ngọc Trai',
    depositAmount: 50000000,
    remainingSeconds: 12340, // 03:25:40
    assignedStaff: 'Nguyễn Thị Lan (STF-008)',
    assignedShowroom: 'Showroom Hà Nội',
    sepayTxnRef: 'SEP14892015', vnpayTxnRef: 'SEP14892015',
    status: 'PENDING_VIN',
  },
  {
    id: 'dep-03',
    depositCode: '#DEP-8844',
    customerName: 'Hoàng Minh Đức',
    customerPhone: '0904 889 900',
    carModel: 'BMW i4',
    variant: 'M50 Gran Coupe',
    color: 'Đen Obsidian',
    depositAmount: 30000000,
    remainingSeconds: 18210, // 05:03:30
    assignedStaff: 'Phạm Hải Nam (STF-012)',
    assignedShowroom: 'Showroom Đà Nẵng',
    sepayTxnRef: 'SEP14892022', vnpayTxnRef: 'SEP14892022',
    status: 'PENDING_VIN',
  },
  {
    id: 'dep-04',
    depositCode: '#DEP-8847',
    customerName: 'Đặng Thu Hà',
    customerPhone: '0977 112 233',
    carModel: 'Mercedes-Benz EQE',
    variant: '500 4MATIC SUV',
    color: 'Bạc Titanium',
    depositAmount: 40000000,
    remainingSeconds: 21450, // 05:57:30
    assignedStaff: 'Vũ Đức Long (STF-002)',
    assignedShowroom: 'Showroom TP.HCM',
    sepayTxnRef: 'SEP14892030', vnpayTxnRef: 'SEP14892030',
    status: 'PENDING_CONTRACT',
  },
];

export const MOCK_SYSTEM_EVENTS: SystemEvent[] = [
  {
    id: 'evt-01',
    timestamp: '2025-10-29 15:42:10',
    timeAgo: 'Vừa xong',
    type: 'SEPAY_IPN',
    actor: 'Nguyễn Văn Tuấn',
    actorType: 'CUSTOMER',
    title: 'Thanh toán cọc xe 72h thành công',
    description: 'Thanh toán 20.000.000 ₫ qua SePay cho mẫu VinFast VF8 Plus (Mã cọc #DEP-8849). Chữ ký HMAC-SHA512 hợp lệ.',
    meta: 'vnp_TxnRef: VNP14892088 • Mã GD: 14892088',
    statusBadge: '200 OK',
    badgeColor: '#10B981',
  },
  {
    id: 'evt-02',
    timestamp: '2025-10-29 15:30:05',
    timeAgo: '12 phút trước',
    type: 'VIN_ASSIGN',
    actor: 'Trần Quốc Huy (STF-004)',
    actorType: 'STAFF',
    title: 'Gán số khung VIN xe vật lý',
    description: 'Đã gán thành công số khung VF8-VIN-2026-9921 cho phiếu cọc #DEP-8845. Xe chuyển sang trạng thái DA_GIU_CHO.',
    meta: 'Showroom TP.HCM • Kho Thủ Đức',
    statusBadge: 'VIN GÁN XONG',
    badgeColor: '#89CEFF',
  },
  {
    id: 'evt-03',
    timestamp: '2025-10-29 15:15:22',
    timeAgo: '27 phút trước',
    type: 'TEST_DRIVE',
    actor: 'Lê Thị Mai',
    actorType: 'CUSTOMER',
    title: 'Đăng ký lịch hẹn lái thử xe mới',
    description: 'Đăng ký trải nghiệm VinFast VF9 tại Showroom Hà Nội vào 10:00 ngày mai. Đã cam kết có GPLX B2 hợp lệ.',
    meta: 'Lịch #TD-3091 • Xe Demo 29A-888.99',
    statusBadge: 'CHỜ DUYỆT',
    badgeColor: '#F59E0B',
  },
  {
    id: 'evt-04',
    timestamp: '2025-10-29 14:50:18',
    timeAgo: '52 phút trước',
    type: 'ACCESSORY_ORDER',
    actor: 'Phạm Hoàng Nam',
    actorType: 'CUSTOMER',
    title: 'Đơn hàng phụ kiện thanh toán COD',
    description: 'Đặt mua Bộ trạm sạc treo tường 7.4kW và Thảm lót sàn cao cấp KAGU. Tổng giá trị: 21.500.000 ₫.',
    meta: 'Đơn #ORD-7712 • Giao Hàng Nhanh',
    statusBadge: 'CHỜ ĐÓNG GÓI',
    badgeColor: '#89CEFF',
  },
  {
    id: 'evt-05',
    timestamp: '2025-10-29 14:22:45',
    timeAgo: '1 giờ trước',
    type: 'AI_RAG',
    actor: 'Gemini AI API & Vector DB',
    actorType: 'AI',
    title: 'Phục vụ tư vấn xe qua Gemini AI & Vector DB',
    description: 'Truy vấn Vector Database độ tương đồng Cosine 0.94 kết hợp Gemini API, trả lời so sánh thông số VF8 vs CR-V Hybrid cho khách online.',
    meta: 'Độ trễ: 24ms • Vector RAG: OK',
    statusBadge: 'COSINE: 0.94',
    badgeColor: '#A855F7',
  },
  {
    id: 'evt-06',
    timestamp: '2025-10-29 13:58:10',
    timeAgo: '1.5 giờ trước',
    type: 'REFUND_APPROVED',
    actor: 'Admin Master',
    actorType: 'SYSTEM',
    title: 'Phê duyệt giải ngân hoàn cọc xe 72h',
    description: 'Duyệt hoàn 20.000.000 ₫ cho phiếu #DEP-8820 do ngân hàng từ chối cấp tín dụng trong hạn 72h theo quy chuẩn UC23.',
    meta: 'STK: 0071000*** VCB • Mã HS #REF-102',
    statusBadge: 'ĐÃ GIẢI NGÂN',
    badgeColor: '#10B981',
  },
];

export const MOCK_AI_ENGINE_STATUS: AiEngineStatus = {
  gemini: {
    model: 'Gemini 1.5 Pro / Flash (Google AI Cloud)',
    status: 'ONLINE',
    apiEndpoint: 'generativelanguage.googleapis.com',
    responseTimeMs: 380,
    quotaUsedPercent: 32,
    contextWindow: '1M Tokens',
    successRate: 99.8,
  },
  vectorDb: {
    engine: 'Vector Database (RAG Semantic Store)',
    status: 'CONNECTED',
    indexedEmbeddingsCount: 1250,
    queryLatencyMs: 16.4,
  },
  paymentGateway: {
    name: 'SePay Webhook IPN v2.0',
    status: 'LIVE',
    uptimePercent: 99.85,
  },
  cronJobs: [
    {
      name: 'Quét phiếu cọc quá hạn 72h',
      schedule: 'Mỗi 60 giây (* * * * *)',
      lastRun: '15:53:00 (Thành công)',
      status: 'HEALTHY',
    },
    {
      name: 'Tự động hủy lịch lái thử trễ 12h',
      schedule: 'Mỗi 30 phút (*/30 * * * *)',
      lastRun: '15:30:00 (Thành công)',
      status: 'HEALTHY',
    },
    {
      name: 'Gửi email nhắc lịch hẹn lái thử 24h',
      schedule: 'Mỗi 1 giờ (0 * * * *)',
      lastRun: '15:00:00 (Thành công)',
      status: 'HEALTHY',
    },
  ],
};
