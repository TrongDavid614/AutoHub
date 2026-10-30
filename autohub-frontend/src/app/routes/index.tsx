import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { CustomerLayout } from '@/app/layouts/CustomerLayout';
import { StaffLayout } from '@/app/layouts/StaffLayout';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Feature Pages
// 1. Customer Module (Showroom, Store, Services, Auth & Landing)
import {
  CarListPage,
  CarDetailPage,
  CarEstimatorPage,
  CarComparisonPage,
  AccessoryListPage,
  AccessoryDetailPage,
  CartPage,
  CheckoutPage,
  OrderSuccessPage,
  ProfilePage,
  AddressBookPage,
  TestDriveBookingPage,
  TestDriveCanvasPage,
  CarDepositPage,
  CustomerOrderListPage,
  LoginPage,
  RegisterPage,
  RegisterSuccessPage,
  AdminStaffLoginPage,
  AdminLoginPage,
  AiConsultantPage,
  Scene,
} from '@/features/customer';

// 2. Staff Operations Module
import {
  StaffWorkspacePage,
  ConsultationListPage,
  TestDriveSchedulePage,
  DepositAuditPage,
  StaffRefundDocketPage,
  OrderFulfillmentPage,
  ReturnManagementPage,
  StockTransferPage,
  FleetMaintenancePage,
  ShiftHandoverPage,
} from '@/features/staff-operations';

// 3. Admin Portal Module
import {
  AdminDashboardPage,
  AdminAnalyticsPage,
  SystemMonitorPage,
  CarMasterPage,
  AccessoryMasterPage,
  ShowroomNetworkPage,
  RegistrationFeePage,
  VoucherMasterPage,
  FeeVoucherMasterPage,
  UserRbacPage,
  StaffSchedulePage,
  ReviewModerationPage,
  RefundApprovalPage,
} from '@/features/admin-portal';

export const router = createBrowserRouter([
  // 0. STANDALONE 3D KAGE LANDING PAGE & HERO
  {
    path: '/',
    element: <Scene />,
  },
  {
    path: '/landing',
    element: <Scene />,
  },
  {
    path: '/hero',
    element: <Scene />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/staff/login',
    element: <AdminStaffLoginPage />,
  },

  // 1. PUBLIC ROUTES (Mọi người dùng & Khách vãng lai)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: 'cars', element: <CarListPage /> },
      { path: 'cars/:id', element: <CarDetailPage /> },
      { path: 'ai-consultant', element: <AiConsultantPage /> },
      { path: 'car-estimator', element: <CarEstimatorPage /> },
      { path: 'car-comparison', element: <CarComparisonPage /> },
      { path: 'accessories', element: <AccessoryListPage /> },
      { path: 'accessories/:id', element: <AccessoryDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'checkout/success', element: <OrderSuccessPage /> },
      { path: 'order-success', element: <OrderSuccessPage /> },
      { path: 'deposit/:variantId', element: <CarDepositPage /> },
      { path: 'test-drive', element: <TestDriveCanvasPage /> },
      { path: 'auth/login', element: <LoginPage /> },
      { path: 'auth/admin-login', element: <AdminLoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'auth/register', element: <RegisterPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'auth/register-success', element: <RegisterSuccessPage /> },
      {
        path: 'unauthorized',
        element: (
          <div className="p-12 text-center text-slate-800">
            <h2 className="text-2xl font-black text-rose-600 mb-2">403 - Quyền Truy Cập Bị Từ Chối</h2>
            <p className="text-xs text-slate-500">Bạn không có quyền hạn cần thiết để truy cập tài nguyên này.</p>
          </div>
        ),
      },
    ],
  },

  // 2. CUSTOMER PORTAL (Đăng nhập với vai trò ROLE_CUSTOMER)
  {
    path: '/customer',
    element: <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_STAFF', 'ROLE_ADMIN']} />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { index: true, element: <Navigate to="/customer/profile" replace /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'addresses', element: <AddressBookPage /> },
          { path: 'test-drives', element: <TestDriveBookingPage /> },
          { path: 'deposits', element: <CarDepositPage /> },
          { path: 'orders', element: <CustomerOrderListPage /> },
        ],
      },
    ],
  },

  // 3. STAFF BACK-OFFICE PORTAL (Đăng nhập với vai trò ROLE_STAFF hoặc ROLE_ADMIN)
  {
    path: '/staff',
    element: <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']} />,
    children: [
      {
        element: <StaffLayout />,
        children: [
          { index: true, element: <Navigate to="/staff/workspace" replace /> },
          { path: 'workspace', element: <StaffWorkspacePage /> },
          { path: 'consultations', element: <ConsultationListPage /> },
          { path: 'test-drives', element: <TestDriveSchedulePage /> },
          { path: 'deposit-audit', element: <DepositAuditPage /> },
          { path: 'refund-dockets', element: <StaffRefundDocketPage /> },
          { path: 'fulfillment', element: <OrderFulfillmentPage /> },
          { path: 'returns', element: <ReturnManagementPage /> },
          { path: 'inventory-transfer', element: <StockTransferPage /> },
          { path: 'fleet-maintenance', element: <FleetMaintenancePage /> },
          { path: 'profile-handover', element: <ShiftHandoverPage /> },
        ],
      },
    ],
  },

  // 4. ADMIN MASTER PORTAL (Đăng nhập duy nhất với vai trò ROLE_ADMIN)
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['ROLE_ADMIN']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'analytics', element: <AdminAnalyticsPage /> },
          { path: 'system-monitor', element: <SystemMonitorPage /> },
          { path: 'cars-master', element: <CarMasterPage /> },
          { path: 'accessories-master', element: <AccessoryMasterPage /> },
          { path: 'showrooms', element: <ShowroomNetworkPage /> },
          { path: 'fees', element: <RegistrationFeePage /> },
          { path: 'vouchers', element: <VoucherMasterPage /> },
          { path: 'fees-vouchers', element: <FeeVoucherMasterPage /> },
          { path: 'users-rbac', element: <UserRbacPage /> },
          { path: 'staff-schedules', element: <StaffSchedulePage /> },
          { path: 'schedules', element: <StaffSchedulePage /> },
          { path: 'reviews', element: <ReviewModerationPage /> },
          { path: 'refund-approval', element: <RefundApprovalPage /> },
        ],
      },
    ],
  },

  // 5. CATCH-ALL 404
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white">
        <div className="text-center">
          <h1 className="text-6xl font-black text-red-500">404</h1>
          <p className="text-sm text-slate-400 mt-2">Trang bạn tìm kiếm không tồn tại trên AutoHub Platform.</p>
        </div>
      </div>
    ),
  },
]);
