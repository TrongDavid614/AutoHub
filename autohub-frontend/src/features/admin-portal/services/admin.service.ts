import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

export interface DashboardMetricsResponse {
  totalRevenueMonthly: number;
  totalCarDeposits: number;
  totalAccessoriesSold: number;
  pendingRefundsCount: number;
  pendingReviewsCount: number;
  totalRegisteredUsers: number;
  depositConversionRate: string;
  aiQueryCountToday: number;
}

export interface AnalyticsOverviewResponse {
  avgDwellTimeSeconds: number;
  interact360Percentage: string;
  calculatorLoanPercentage: string;
  aiConsultantQueries: number;
  aiAverageLatencyMs: number;
  dwellByCar: Array<{
    car: string;
    time: string;
    pct: string;
    color: string;
    favColor: string;
  }>;
  aiTrends: Array<{
    topic: string;
    queries: number;
    pct: string;
  }>;
}

export interface ReviewItem {
  id: string;
  rawId: number;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface RefundItem {
  id: number;
  docketCode: string;
  depositCode: string;
  customerName: string;
  identityCardNumber?: string;
  carModel: string;
  depositAmount: number;
  reason: string;
  submittedAt: string;
  status: string;
  verifiedByStaff?: string;
}

export interface AdminUserItem {
  id: number;
  hoTen: string;
  email: string;
  soDienThoai: string;
  vaiTro: string;
  trangThaiTaiKhoan: string;
  ngayTao?: string;
}

export const adminService = {
  // 1. Dashboard Metrics
  getDashboardMetrics: async () => {
    const res = await axiosClient.get<{ success: boolean; data: DashboardMetricsResponse }>(
      API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD
    );
    return (res as unknown as { data: DashboardMetricsResponse }).data;
  },

  // 2. User Tracking Analytics
  getAnalyticsOverview: async () => {
    const res = await axiosClient.get<{ success: boolean; data: AnalyticsOverviewResponse }>(
      API_CONFIG.ENDPOINTS.ADMIN.ANALYTICS
    );
    return (res as unknown as { data: AnalyticsOverviewResponse }).data;
  },

  // 3. Review Moderation
  getReviews: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    const res = await axiosClient.get<{ success: boolean; data: ReviewItem[] }>(
      `${API_CONFIG.ENDPOINTS.ADMIN.REVIEWS}${params}`
    );
    return (res as unknown as { data: ReviewItem[] }).data;
  },

  updateReviewStatus: async (id: number, status: 'APPROVED' | 'REJECTED') => {
    return axiosClient.put(`${API_CONFIG.ENDPOINTS.ADMIN.REVIEWS}/${id}/status?status=${status}`);
  },

  // 4. Refund Approval
  getRefundRequests: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    const res = await axiosClient.get<{ success: boolean; data: RefundItem[] }>(
      `${API_CONFIG.ENDPOINTS.ADMIN.REFUNDS}${params}`
    );
    return (res as unknown as { data: RefundItem[] }).data;
  },

  approveRefund: async (id: number) => {
    return axiosClient.post(`${API_CONFIG.ENDPOINTS.ADMIN.REFUNDS}/${id}/approve`);
  },

  rejectRefund: async (id: number, reason?: string) => {
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return axiosClient.post(`${API_CONFIG.ENDPOINTS.ADMIN.REFUNDS}/${id}/reject${params}`);
  },

  // 5. User RBAC
  getUsers: async () => {
    const res = await axiosClient.get<{ success: boolean; data: AdminUserItem[] }>(
      API_CONFIG.ENDPOINTS.ADMIN.USERS
    );
    return (res as unknown as { data: AdminUserItem[] }).data;
  },

  toggleUserStatus: async (id: number, status: 'HOAT_DONG' | 'BI_KHOA') => {
    return axiosClient.put(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}/${id}/status?status=${status}`);
  },

  // 6. AI & Copilot Seam
  askAdminCopilot: async (query: string) => {
    const res = await axiosClient.post<{ success: boolean; data: { answer: string } }>(
      API_CONFIG.ENDPOINTS.ADMIN.AI_COPILOT,
      { query }
    );
    return (res as unknown as { data: { answer: string } }).data;
  },

  analyzeReviewSentiment: async (content: string) => {
    const res = await axiosClient.post<{
      success: boolean;
      data: { isToxic: boolean; sentiment: string; confidenceScore: number; recommendation: string };
    }>(API_CONFIG.ENDPOINTS.ADMIN.AI_ANALYZE_REVIEW, { content });
    return (res as unknown as { data: { isToxic: boolean; sentiment: string; confidenceScore: number; recommendation: string } }).data;
  },
};
