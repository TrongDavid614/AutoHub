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

export interface AiEngineInfo {
  model: string;
  status: string;
  apiEndpoint: string;
  responseTimeMs: number;
  quotaUsedPercent: number;
  contextWindow: string;
  successRate: number;
}

export interface AiEngineStatus {
  openrouter?: AiEngineInfo;
  gemini?: AiEngineInfo;
  vectorDb: {
    engine: string;
    status: string;
    indexedEmbeddingsCount: number;
    queryLatencyMs: number;
  };
  paymentGateway: {
    name: string;
    status: string;
    uptimePercent: number;
  };
  cronJobs: Array<{
    name: string;
    schedule: string;
    lastRun: string;
    status: string;
  }>;
}

export interface AdminDashboardOverview {
  kpis: KpiMetric[];
  revenueChart: RevenueDataPoint[];
  regionalRevenues: RegionalRevenue[];
  urgentDeposits: UrgentDeposit[];
  aiEngineStatus?: AiEngineStatus;
}
