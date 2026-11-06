// NOTE: Toàn bộ dữ liệu tác nghiệp của Staff hiện được nạp 100% trực tiếp từ Database SQL Server qua Spring Boot API (/staff/*).
// Đã xóa toàn bộ cơ chế fallback theo yêu cầu kiểm thử kết nối FE-BE.

export * from '@/types/staff.types';
import type {
  StaffKpiStat,
  TodayTimelineSlot,
  ConsultationLead,
  StaffTestDriveBooking,
  StaffDepositRecord,
  StaffRefundDocket,
  StaffFulfillmentOrder,
  StaffReturnItem,
  CrossBranchStock,
  DemoFleetCar,
  ShiftHandoverRecord,
} from '@/types/staff.types';

export const MOCK_STAFF_KPIS: StaffKpiStat[] = [];
export const MOCK_TODAY_TIMELINE: TodayTimelineSlot[] = [];
export const MOCK_CONSULTATION_LEADS: ConsultationLead[] = [];
export const MOCK_STAFF_TEST_DRIVES: StaffTestDriveBooking[] = [];
export const MOCK_STAFF_DEPOSITS: StaffDepositRecord[] = [];
export const MOCK_STAFF_REFUND_DOCKETS: StaffRefundDocket[] = [];
export const MOCK_STAFF_FULFILLMENT_ORDERS: StaffFulfillmentOrder[] = [];
export const MOCK_STAFF_RETURN_ITEMS: StaffReturnItem[] = [];
export const MOCK_CROSS_BRANCH_STOCKS: CrossBranchStock[] = [];
export const MOCK_DEMO_FLEET: DemoFleetCar[] = [];
export const MOCK_HANDOVER_HISTORY: ShiftHandoverRecord[] = [];
