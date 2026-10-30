// Public Barrel API for Customer Module (Showroom, Store, Services, Auth & Landing)

// 1. Showroom & Vehicles
export * from './pages/showroom-cars/CarListPage';
export * from './pages/showroom-cars/CarDetailPage';
export * from './pages/showroom-cars/CarEstimatorPage';
export * from './pages/showroom-cars/CarComparisonPage';

// 2. Accessories Store & Checkout
export * from './pages/accessories-store/AccessoryListPage';
export * from './pages/accessories-store/AccessoryDetailPage';
export * from './pages/accessories-store/CartPage';
export * from './pages/accessories-store/CheckoutPage';
export * from './pages/accessories-store/OrderSuccessPage';

// 3. Customer Portal Services
export * from './pages/portal-services/ProfilePage';
export * from './pages/portal-services/AddressBookPage';
export * from './pages/portal-services/TestDriveBookingPage';
export * from './pages/portal-services/TestDriveCanvasPage';
export * from './pages/portal-services/CarDepositPage';
export * from './pages/portal-services/CustomerOrderListPage';

// 4. AI Consultant
export * from './pages/ai-consultant/AiConsultantPage';
export * from './components/AiConsultantWidget';

// 5. Authentication
export * from './pages/auth/LoginPage';
export * from './pages/auth/RegisterPage';
export * from './pages/auth/RegisterSuccessPage';
export * from './pages/auth/AdminStaffLoginPage';
export * from './pages/auth/AdminLoginPage';

// 6. Landing & Showcase
export * from './pages/landing/LandingPage';

// Common Modals & Components
export * from './components/detail/CarDepositModal';
export * from './components/TestDriveBookingModal';
export * from './components/AddressEditModal';
export * from './components/ChangeCarModelModal';
export * from './components/VehicleCompatibilityBar';
export * from './components/AccessoryProductCard';
export * from './components/AccessoryFilterSidebar';
export * from './components/AccessoryCommitmentBanner';

// Services, Hooks & Mocks
export * from './services/accessory.service';
export * from './services/car.service';
export * from './services/auth.service';
export * from './services/ai-consultant.service';
export * from './hooks/useAccessoryFilter';
export * from './hooks/useCarCatalog';
export * from './hooks/useCarDetail';
export * from './hooks/useCarEstimator';
export * from './hooks/useCartCheckout';
export * from './hooks/useCheckoutFlow';
export * from './hooks/useAiConsultant';
export * from './mocks/car.mock';
export * from './mocks/accessory.mock';
export * from './mocks/orders.mock';
