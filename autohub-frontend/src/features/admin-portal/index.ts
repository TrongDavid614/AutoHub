// Public Barrel API for Admin Portal Feature Module (ADM-01 to ADM-11)
// 1. Executive & Analytics
export * from './pages/executive/AdminDashboardPage';
export * from './pages/executive/AdminAnalyticsPage';
export * from './pages/executive/SystemMonitorPage';

// 2. Automotive Master Data & Network
export * from './pages/automotive-master/CarMasterPage';
export * from './pages/automotive-master/AccessoryMasterPage';
export * from './pages/automotive-master/ShowroomNetworkPage';

// 3. Finance & Policies
export * from './pages/finance-policies/RegistrationFeePage';
export * from './pages/finance-policies/VoucherMasterPage';
export * from './pages/finance-policies/FeeVoucherMasterPage';
export * from './pages/finance-policies/RefundApprovalPage';

// 4. System Governance & Moderation
export * from './pages/system-governance/UserRbacPage';
export * from './pages/system-governance/StaffSchedulePage';
export * from './pages/system-governance/ReviewModerationPage';

// Components & Mocks
export * from './components/AdminStatCards';
export * from './components/UrgentActionQueue';
export * from './mocks/dashboard.mock';
