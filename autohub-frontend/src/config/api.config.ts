export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 15000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
      LOGOUT: '/auth/logout',
    },
    CARS: {
      BASE: '/cars',
      BRANDS: '/cars/brands',
      MODELS: '/cars/models',
      VARIANTS: '/cars/variants',
      COMPARISON: '/cars/compare',
      ESTIMATOR: '/cars/estimate-rollout',
    },
    ACCESSORIES: {
      BASE: '/accessories',
      CATEGORIES: '/accessories/categories',
      COMPATIBILITY: '/accessories/check-compatibility',
    },
    CART: {
      BASE: '/cart',
      SYNC: '/cart/sync',
      SHIPPING_METHODS: '/customer/shipping-methods',
    },
    ORDERS: {
      BASE: '/orders',
      MY_ORDERS: '/orders/my-orders',
    },
    DEPOSITS: {
      BASE: '/deposits',
      CREATE: '/deposits/create',
      MY_DEPOSITS: '/deposits/my-deposits',
    },
    TEST_DRIVE: {
      BASE: '/test-drive',
      BOOK: '/test-drive/book',
      SCHEDULE: '/test-drive/schedule',
    },
    PROFILE: {
      BASE: '/customer/profile',
      PASSWORD: '/customer/profile/password',
    },
    AI_CONSULTANT: {
      CHAT: '/ai/consult',
    },
    STAFF: {
      CONSULTATIONS: '/staff/consultations',
      TEST_DRIVE_DISPATCH: '/staff/test-drive-dispatch',
      DEPOSIT_AUDIT: '/staff/deposit-audit',
      ORDER_FULFILLMENT: '/staff/fulfillment',
      RETURNS: '/staff/returns',
    },
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      DASHBOARD_OVERVIEW: '/admin/dashboard/overview',
      DASHBOARD_REVENUE_CHART: '/admin/dashboard/revenue-chart',
      DASHBOARD_KPIS: '/admin/dashboard/kpis',
      DASHBOARD_REGIONAL: '/admin/dashboard/regional-revenues',
      DASHBOARD_URGENT_DEPOSITS: '/admin/dashboard/urgent-deposits',
      USERS: '/admin/users',
      ACCESSORIES: '/admin/accessories',
      VOUCHERS: '/admin/vouchers',
      FEE_TABLE: '/admin/registration-fees',
      CARS: '/admin/cars',
      VECTOR_SYNC: '/admin/cars/sync-vector-db',
    },
  },
};
