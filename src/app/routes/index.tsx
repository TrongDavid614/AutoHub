import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { StaffLayout } from '../layouts/StaffLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Feature Pages
import { CarListPage, CarDetailPage } from '../../features/cars';
import { CarEstimatorPage } from '../../features/car-estimator';
import { CarComparisonPage } from '../../features/car-comparison';
import { AccessoryListPage, AccessoryDetailPage } from '../../features/accessories';
import { CartPage } from '../../features/cart';
import { CheckoutPage } from '../../features/checkout';
import { CarDepositPage } from '../../features/car-deposit';
import { TestDriveBookingPage } from '../../features/test-drive';
import { LoginPage, RegisterPage } from '../../features/auth';
import { ProfilePage, AddressBookPage } from '../../features/profile';
import {
  ConsultationListPage,
  TestDriveSchedulePage,
  DepositAuditPage,
  OrderFulfillmentPage,
  ReturnManagementPage,
} from '../../features/staff-operations';
import {
  AdminDashboardPage,
  CarMasterPage,
  AccessoryMasterPage,
  FeeVoucherMasterPage,
  UserRbacPage,
} from '../../features/admin-portal';

export const router = createBrowserRouter([
  // 1. PUBLIC ROUTES (Mọi người dùng & Khách vãng lai)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <CarListPage /> },
      { path: 'cars', element: <CarListPage /> },
      { path: 'cars/:id', element: <CarDetailPage /> },
      { path: 'car-estimator', element: <CarEstimatorPage /> },
      { path: 'car-comparison', element: <CarComparisonPage /> },
      { path: 'accessories', element: <AccessoryListPage /> },
      { path: 'accessories/:id', element: <AccessoryDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'deposit/:variantId', element: <CarDepositPage /> },
      { path: 'test-drive', element: <TestDriveBookingPage /> },
      { path: 'auth/login', element: <LoginPage /> },
      { path: 'auth/register', element: <RegisterPage /> },
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
          { path: 'orders', element: <CartPage /> },
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
          { index: true, element: <Navigate to="/staff/consultations" replace /> },
          { path: 'consultations', element: <ConsultationListPage /> },
          { path: 'test-drives', element: <TestDriveSchedulePage /> },
          { path: 'deposit-audit', element: <DepositAuditPage /> },
          { path: 'fulfillment', element: <OrderFulfillmentPage /> },
          { path: 'returns', element: <ReturnManagementPage /> },
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
          { path: 'cars-master', element: <CarMasterPage /> },
          { path: 'accessories-master', element: <AccessoryMasterPage /> },
          { path: 'fees-vouchers', element: <FeeVoucherMasterPage /> },
          { path: 'users-rbac', element: <UserRbacPage /> },
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
