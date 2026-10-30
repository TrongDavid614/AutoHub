// Public Barrel API for Staff Operations Feature Module (STF-01 to STF-10)
// 1. Desk & CRM
export * from './pages/desk-crm/StaffWorkspacePage';
export * from './pages/desk-crm/ConsultationListPage';

// 2. Test Drive & 72H Deposit
export * from './pages/testdrive-deposit/TestDriveSchedulePage';
export * from './pages/testdrive-deposit/DepositAuditPage';
export * from './pages/testdrive-deposit/StaffRefundDocketPage';

// 3. Logistics & Inventory
export * from './pages/logistics-inventory/OrderFulfillmentPage';
export * from './pages/logistics-inventory/ReturnManagementPage';
export * from './pages/logistics-inventory/StockTransferPage';

// 4. Fleet & Shifts
export * from './pages/fleet-shifts/FleetMaintenancePage';
export * from './pages/fleet-shifts/ShiftHandoverPage';

// Mocks
export * from './mocks/staff.mock';
