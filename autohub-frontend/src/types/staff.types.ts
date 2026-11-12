export interface StaffKpiStat {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  badgeText: string;
  badgeType: 'success' | 'warning' | 'danger' | 'info';
}

export interface HourlyTestDriveSlot {
  slot: string;
  count: number;
  max: number;
  label: string;
  highlight: boolean;
}

export interface DepositStatusSegment {
  label: string;
  count: number;
  percent: number;
  color: string;
  text: string;
}

export interface WorkspaceUrgentDeposit {
  id: string;
  depositCode: string;
  customerName: string;
  customerPhone: string;
  carModel: string;
  variant: string;
  depositAmount: number;
  remainingSeconds: number;
  assignedVin?: string | null;
  status: string;
}

export interface WorkspaceSidebarCounts {
  totalLeads: number;
  pendingLeads: number;
  totalTestDrives: number;
  totalDeposits: number;
  activeDeposits: number;
  pendingRefunds: number;
  pendingOrders?: number;
}

export interface WorkspaceMetricsResponse {
  kpis: StaffKpiStat[];
  hourlyTestDrives: HourlyTestDriveSlot[];
  totalTestDrivesCount: number;
  depositBreakdown: DepositStatusSegment[];
  totalDepositsCount: number;
  todayTimeline: TodayTimelineSlot[];
  urgentDeposits: WorkspaceUrgentDeposit[];
  sidebarCounts: WorkspaceSidebarCounts;
}

export interface AvailableVinOption {
  id: string;
  vin: string;
  model: string;
  color: string;
  location: string;
}

export interface DemoCarOption {
  id: string;
  bienSo: string;
  model: string;
  showroom: string;
  trangThai: string;
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
  assignedStaff?: string;
  status: 'PENDING' | 'CONTACTED' | 'CLOSED';
  createdAt?: string;
  receivedAt?: string;
  userJourney?: {
    time: string;
    action: string;
    detail: string;
    dwellTime?: string;
  }[];
  aiPersona?: {
    personaGroup: string;
    financialReadiness: string;
    primaryConcern: string;
    suggestedPitch: string;
    recommendedQuestions: string[];
  };
  notes?: string;
  callHistory?: string[];
}

export interface StaffTestDriveBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone?: string;
  phone?: string;
  driverLicenseNumber?: string;
  carModel: string;
  preferredTime?: string;
  scheduledTime?: string;
  locationType?: 'SHOWROOM' | 'HOME';
  pickupLocation?: string;
  assignedDemoCar?: string;
  assignedDemoPlate?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  hasValidLicense?: boolean;
  licenseVerified?: boolean;
  satisfactionRating?: number;
  customerPurchaseIntent?: string;
  notes?: string;
}

export interface StaffDepositRecord {
  id: string;
  depositCode: string;
  customerName: string;
  customerPhone: string;
  identityCardNumber: string;
  carModel: string;
  variant: string;
  exteriorColor?: string;
  depositAmount: number;
  remainingSeconds: number; // 72h countdown
  assignedVin?: string;
  sepayTxnRef: string;
  status: 'PAID' | 'VIN_ASSIGNED' | 'CONTRACT_SIGNED' | 'COMPLETED' | 'REFUND_REQUESTED' | 'REFUNDED';
}

export interface StaffRefundDocket {
  id: string;
  docketCode?: string;
  depositCode: string;
  customerName: string;
  identityCardNumber: string;
  carModel: string;
  depositAmount: number;
  reason: string;
  reasonType?: string;
  rejectionReason?: string | null;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  submittedAt: string;
  rejectionLetterFileName?: string;
  evidenceUrls?: string[];
  checklist?: {
    within72h: boolean;
    validBankLetter: boolean;
    noVatInvoice: boolean;
  };
  status: 'REFUND_REQUESTED' | 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REFUNDED' | 'REJECTED';
}

export interface StaffFulfillmentOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod?: 'SEPAY' | 'COD' | 'VNPAY';
  totalAmount: number;
  createdAt?: string;
  orderDate?: string;
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
  status: 'RETURN_REQUESTED' | 'INSPECTING' | 'RESOLVED' | 'REJECTED' | 'APPROVED' | 'COMPLETED';
  resolution?: 'REPLACE_NEW' | 'REFUND_MONEY' | 'REJECT' | 'DOI_HANG' | 'HOAN_TIEN';
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
  variant?: string;
  color?: string;
  currentOdoKm?: number;
  currentOdo?: number;
  nextServiceKm?: number;
  lastServiceDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
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
  createdAt?: string;
}
