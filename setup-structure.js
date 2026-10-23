/**
 * AUTOHUB FRONTEND ARCHITECTURE SCAFFOLDER
 * Scaffolds the complete Feature-Driven Frontend Architecture for AutoHub.
 * Run via: node setup-structure.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`[DIR CREATED] ${path.relative(ROOT_DIR, dirPath)}`);
  }
}

function writeFileSync(filePath, content) {
  ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trimStart(), 'utf8');
  console.log(`[FILE WRITTEN] ${path.relative(ROOT_DIR, filePath)}`);
}

console.log('🚀 Starting AutoHub Frontend Scaffolding...\n');

// ==========================================
// 1. CONFIG & LIB FILES
// ==========================================

writeFileSync(
  path.join(SRC_DIR, 'lib/utils.ts'),
  `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
`
);

writeFileSync(
  path.join(SRC_DIR, 'config/api.config.ts'),
  `export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
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
      DASHBOARD: '/admin/dashboard-stats',
      USERS: '/admin/users',
      VOUCHERS: '/admin/vouchers',
      FEE_TABLE: '/admin/registration-fees',
    },
  },
};
`
);

writeFileSync(
  path.join(SRC_DIR, 'config/constants.ts'),
  `export const APP_NAME = 'AutoHub';

export const ROLES = {
  CUSTOMER: 'ROLE_CUSTOMER',
  STAFF: 'ROLE_STAFF',
  ADMIN: 'ROLE_ADMIN',
} as const;

export const CAR_DEPOSIT_EXPIRATION_HOURS = 72;
export const MAX_COMPARE_CARS = 3;

export const VN_PHONE_REGEX = /^(0)(3|5|7|8|9)[0-9]{8}$/;
export const CCCD_REGEX = /^[0-9]{12}$/;
`
);

writeFileSync(
  path.join(SRC_DIR, 'lib/axios.ts'),
  `import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { useAuthStore } from '../store/authStore';

export const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('[HTTP 401] Unauthorized or token expired. Logging out.');
      useAuthStore.getState().logout();
    } else if (status === 403) {
      console.error('[HTTP 403] Access Forbidden.');
    } else if (status === 500) {
      console.error('[HTTP 500] Internal Server Error:', error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
`
);

// ==========================================
// 2. DOMAIN TYPES (MỨC B - 100% Khớp tài liệu)
// ==========================================

writeFileSync(
  path.join(SRC_DIR, 'types/api.types.ts'),
  `export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiError {
  errorCode: string;
  errorMessage: string;
  details?: Record<string, string>;
  timestamp: string;
}
`
);

writeFileSync(
  path.join(SRC_DIR, 'types/auth.types.ts'),
  `export type Role = 'ROLE_CUSTOMER' | 'ROLE_STAFF' | 'ROLE_ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  identityCardNumber?: string;
  role: Role;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface Address {
  id: number;
  userId: number;
  recipientName: string;
  phoneNumber: string;
  provinceCity: string;
  district: string;
  ward: string;
  detailedAddress: string;
  isDefault: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  role: Role | null;
  isAuthenticated: boolean;
}
`
);

writeFileSync(
  path.join(SRC_DIR, 'types/car.types.ts'),
  `export interface CarBrand {
  id: number;
  name: string;
  logoUrl: string;
  originCountry: string;
}

export interface CarModel {
  id: number;
  brandId: number;
  brandName: string;
  modelName: string;
  bodyType: 'SEDAN' | 'SUV' | 'CROSSOVER' | 'MPV' | 'PICKUP' | 'HATCHBACK';
  segment: 'A' | 'B' | 'C' | 'D' | 'E';
  releaseYear: number;
  basePrice: number;
}

export interface CarColor {
  id: number;
  colorName: string;
  colorCodeHex: string;
}

export interface CarImage {
  id: number;
  imageUrl: string;
  viewType: 'EXTERIOR_360' | 'INTERIOR_360' | 'GALLERY' | 'THUMBNAIL';
  displayOrder: number;
}

export interface CarVariant {
  id: number;
  modelId: number;
  variantName: string;
  engineSpecs: string;
  horsepower: number;
  transmission: 'AUTOMATIC' | 'MANUAL' | 'CVT' | 'DUAL_CLUTCH';
  fuelType: 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  listedPrice: number;
  depositPrice: number;
  colors: CarColor[];
  images: CarImage[];
}

export interface CarInventory {
  vinNumber: string;
  variantId: number;
  colorId: number;
  showroomLocation: string;
  status: 'IN_STOCK' | 'RESERVED_FOR_DEPOSIT' | 'SOLD';
}

export interface CarDemo {
  id: number;
  plateNumber: string;
  variantId: number;
  colorId: number;
  showroomLocation: string;
  status: 'AVAILABLE' | 'ON_TEST_DRIVING' | 'MAINTENANCE';
}

export interface CarFilterParams {
  brandId?: number;
  bodyType?: string;
  segment?: string;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: string;
  transmission?: string;
}
`
);

writeFileSync(
  path.join(SRC_DIR, 'types/accessory.types.ts'),
  `export interface AccessoryCategory {
  id: number;
  categoryName: string;
  slug: string;
}

export interface AccessoryCompatibility {
  carModelId: number;
  carModelName: string;
  manufactureYearStart: number;
  manufactureYearEnd: number;
}

export interface Accessory {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  thumbnailUrl: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  compatibilities: AccessoryCompatibility[];
  isActive: boolean;
}

export interface AccessoryFilterParams {
  categoryId?: number;
  carModelId?: number;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
`
);

writeFileSync(
  path.join(SRC_DIR, 'types/order.types.ts'),
  `import type { Accessory } from './accessory.types';

export type AccessoryOrderStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUND_REQUIRED';

export interface OrderItem {
  id: number;
  accessoryId: number;
  accessory: Accessory;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface AccessoryOrder {
  id: number;
  orderCode: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'VNPAY' | 'COD';
  status: AccessoryOrderStatus;
  subtotalAmount: number;
  shippingFee: number;
  voucherDiscount: number;
  finalTotalAmount: number;
  orderItems: OrderItem[];
  vnpayTransactionId?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface ReturnRequest {
  id: number;
  orderId: number;
  reason: string;
  evidenceImages: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  requestedAt: string;
}
`
);

writeFileSync(
  path.join(SRC_DIR, 'types/deposit.types.ts'),
  `export type CarDepositStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'EXPIRED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUND_REQUIRED';

export interface CarDeposit {
  id: number;
  depositCode: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  identityCardNumber: string;
  variantId: number;
  variantName: string;
  colorName: string;
  depositAmount: number;
  status: CarDepositStatus;
  assignedVinNumber?: string;
  assignedShowroom: string;
  expiresAt: string;
  paidAt?: string;
  paymentMethod: 'VNPAY';
  vnpayTransactionId?: string;
  createdAt: string;
}
`
);

writeFileSync(
  path.join(SRC_DIR, 'types/test-drive.types.ts'),
  `export type TestDriveStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface TestDriveBooking {
  id: number;
  bookingCode: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  driverLicenseNumber: string;
  carVariantId: number;
  carVariantName: string;
  showroomLocation: string;
  bookingTime: string;
  status: TestDriveStatus;
  assignedDemoCarPlate?: string;
  staffConsultantId?: number;
  staffConsultantName?: string;
  notes?: string;
  createdAt: string;
}
`
);

// ==========================================
// 3. ZUSTAND GLOBAL STORES
// ==========================================

writeFileSync(
  path.join(SRC_DIR, 'store/authStore.ts'),
  `import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, User } from '../types/auth.types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      role: null,
      isAuthenticated: false,

      login: (token: string, user: User) =>
        set({
          accessToken: token,
          user,
          role: user.role,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
          role: null,
          isAuthenticated: false,
        }),

      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),
    }),
    {
      name: 'autohub_auth_state',
    }
  )
);
`
);

writeFileSync(
  path.join(SRC_DIR, 'store/cartStore.ts'),
  `import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Accessory } from '../types/accessory.types';

export interface CartItem {
  accessory: Accessory;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (accessory: Accessory, quantity?: number) => void;
  removeFromCart: (accessoryId: number) => void;
  updateQuantity: (accessoryId: number, quantity: number) => void;
  clearCart: () => void;
  syncGuestCartWithServer: () => Promise<void>;
  getTotalAmount: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (accessory: Accessory, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(
            (item) => item.accessory.id === accessory.id
          );
          if (existingItemIndex > -1) {
            const updated = [...state.cartItems];
            updated[existingItemIndex].quantity += quantity;
            return { cartItems: updated };
          }
          return { cartItems: [...state.cartItems, { accessory, quantity }] };
        });
      },

      removeFromCart: (accessoryId: number) => {
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.accessory.id !== accessoryId),
        }));
      },

      updateQuantity: (accessoryId: number, quantity: number) => {
        set((state) => ({
          cartItems:
            quantity <= 0
              ? state.cartItems.filter((i) => i.accessory.id !== accessoryId)
              : state.cartItems.map((i) =>
                  i.accessory.id === accessoryId ? { ...i, quantity } : i
                ),
        }));
      },

      clearCart: () => set({ cartItems: [] }),

      syncGuestCartWithServer: async () => {
        // Stub for merging local cart to server upon login
        console.log('[CartStore] Syncing local guest cart to server backend...');
      },

      getTotalAmount: () => {
        return get().cartItems.reduce(
          (sum, item) => sum + (item.accessory.discountPrice || item.accessory.price) * item.quantity,
          0
        );
      },

      getTotalItemsCount: () => {
        return get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'autohub_guest_cart',
    }
  )
);
`
);

writeFileSync(
  path.join(SRC_DIR, 'store/compareStore.ts'),
  `import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CarVariant } from '../types/car.types';
import { MAX_COMPARE_CARS } from '../config/constants';

interface CompareStore {
  selectedVariants: CarVariant[];
  addVariantToCompare: (variant: CarVariant) => boolean;
  removeVariantFromCompare: (variantId: number) => void;
  clearCompareList: () => void;
  isInCompareList: (variantId: number) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selectedVariants: [],

      addVariantToCompare: (variant: CarVariant) => {
        const { selectedVariants } = get();
        if (selectedVariants.some((v) => v.id === variant.id)) {
          return false;
        }
        if (selectedVariants.length >= MAX_COMPARE_CARS) {
          return false;
        }
        set({ selectedVariants: [...selectedVariants, variant] });
        return true;
      },

      removeVariantFromCompare: (variantId: number) => {
        set((state) => ({
          selectedVariants: state.selectedVariants.filter((v) => v.id !== variantId),
        }));
      },

      clearCompareList: () => set({ selectedVariants: [] }),

      isInCompareList: (variantId: number) => {
        return get().selectedVariants.some((v) => v.id === variantId);
      },
    }),
    {
      name: 'autohub_car_compare',
    }
  )
);
`
);

// ==========================================
// 4. COMMON UI COMPONENTS (STUBS)
// ==========================================

writeFileSync(
  path.join(SRC_DIR, 'components/Button.tsx'),
  `import React from 'react';
import { cn } from '../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-100',
    ghost: 'text-slate-700 hover:bg-slate-100',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
`
);

writeFileSync(
  path.join(SRC_DIR, 'components/Input.tsx'),
  `import React from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors',
            error && 'border-rose-500 focus:ring-rose-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
`
);

writeFileSync(
  path.join(SRC_DIR, 'components/Badge.tsx'),
  `import React from 'react';
import { cn } from '../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className,
}) => {
  const variantStyles = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
`
);

writeFileSync(
  path.join(SRC_DIR, 'components/Modal.tsx'),
  `import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  const widthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={cn('w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200', widthMap[maxWidth])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
`
);

writeFileSync(
  path.join(SRC_DIR, 'components/Table.tsx'),
  `import React from 'react';
import { cn } from '../lib/utils';

export interface Column<T> {
  key: string;
  title: string;
  render?: (record: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  dataSource: T[];
  rowKey: (item: T) => string | number;
  className?: string;
  emptyText?: string;
}

export function Table<T>({
  columns,
  dataSource,
  rowKey,
  className,
  emptyText = 'Không có dữ liệu hiển thị',
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto border border-slate-200 rounded-lg', className)}>
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={cn('px-4 py-3', col.className)}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {dataSource.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            dataSource.map((record) => (
              <tr key={rowKey(record)} className="hover:bg-slate-50/80 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3', col.className)}>
                    {col.render ? col.render(record) : (record as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
`
);

// ==========================================
// 5. CUSTOM HOOKS
// ==========================================

writeFileSync(
  path.join(SRC_DIR, 'hooks/useDebounce.ts'),
  `import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
`
);

writeFileSync(
  path.join(SRC_DIR, 'hooks/useLocalStorage.ts'),
  `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
`
);

// ==========================================
// 6. LAYOUTS & ROUTE GUARDS (DESKTOP OPTIMIZED)
// ==========================================

writeFileSync(
  path.join(SRC_DIR, 'app/routes/ProtectedRoute.tsx'),
  `import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '../../types/auth.types';
import { useAuthStore } from '../../store/authStore';

export interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
`
);

writeFileSync(
  path.join(SRC_DIR, 'app/layouts/PublicLayout.tsx'),
  `import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Car, ShoppingCart, Scale, User as UserIcon, Bot, Search } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useCompareStore } from '../../store/compareStore';
import { useAuthStore } from '../../store/authStore';

export const PublicLayout: React.FC = () => {
  const totalCartCount = useCartStore((s) => s.getTotalItemsCount());
  const compareCount = useCompareStore((s) => s.selectedVariants.length);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      {/* DESKTOP HEADER (1366x768 -> 1920x1080) */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo & Slogan */}
          <Link to="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight text-white group">
            <div className="bg-red-600 p-1.5 rounded-lg text-white group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6" />
            </div>
            <span>Auto<span className="text-red-500">Hub</span></span>
          </Link>

          {/* Quick Search */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm dòng xe, phụ kiện chính hãng..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link to="/cars" className="hover:text-red-400 transition-colors">Showroom Ô Tô</Link>
            <Link to="/car-estimator" className="hover:text-red-400 transition-colors">Dự Toán Lăn Bánh</Link>
            <Link to="/accessories" className="hover:text-red-400 transition-colors">Phụ Kiện</Link>
            <Link to="/test-drive" className="hover:text-red-400 transition-colors">Đăng Ký Lái Thử</Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Compare Bar */}
            <Link
              to="/car-comparison"
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              title="So sánh xe"
            >
              <Scale className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              title="Giỏ hàng phụ kiện"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth Link */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={
                    user?.role === 'ROLE_ADMIN'
                      ? '/admin'
                      : user?.role === 'ROLE_STAFF'
                      ? '/staff'
                      : '/customer/profile'
                  }
                  className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white"
                >
                  <UserIcon className="w-4 h-4 text-red-500" />
                  <span>{user?.fullName}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-xs text-slate-400 hover:text-red-400"
                >
                  Thoát
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT OUTLET */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        <Outlet />
      </main>

      {/* FLOATING AI CONSULTANT TRIGGER */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const el = document.getElementById('ai-consultant-modal');
            if (el) el.classList.toggle('hidden');
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-xs rounded-full shadow-lg hover:shadow-red-500/30 hover:scale-105 transition-all"
        >
          <Bot className="w-4 h-4" />
          <span>Trợ Lý Ảo AI</span>
        </button>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 AutoHub Platform. Nhóm 7 - Đề tài Website giới thiệu, bán ô tô và phụ kiện trực tuyến.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-white">Điều khoản sử dụng</Link>
            <Link to="#" className="hover:text-white">Chính sách bảo hành</Link>
            <Link to="#" className="hover:text-white">Liên hệ hỗ trợ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
`
);

writeFileSync(
  path.join(SRC_DIR, 'app/layouts/CustomerLayout.tsx'),
  `import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { User, MapPin, Calendar, CreditCard, Package } from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const navItems = [
    { to: '/customer/profile', label: 'Hồ Sơ Cá Nhân', icon: User },
    { to: '/customer/addresses', label: 'Sổ Địa Chỉ (UC03)', icon: MapPin },
    { to: '/customer/test-drives', label: 'Lịch Hẹn Lái Thử', icon: Calendar },
    { to: '/customer/deposits', label: 'Phiếu Đặt Cọc Xe (72h)', icon: CreditCard },
    { to: '/customer/orders', label: 'Đơn Hàng Phụ Kiện', icon: Package },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="max-w-7xl w-full mx-auto px-6 py-6 flex gap-6">
        {/* CUSTOMER SIDEBAR */}
        <aside className="w-64 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
            Tài khoản thành viên
          </h2>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  \`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors \${
                    isActive
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }\`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </aside>

        {/* CUSTOMER CONTENT OUTLET */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
`
);

writeFileSync(
  path.join(SRC_DIR, 'app/layouts/StaffLayout.tsx'),
  `import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, CalendarClock, ShieldCheck, Box, RotateCcw, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const StaffLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const menu = [
    { to: '/staff/consultations', label: 'Tiếp Nhận Tư Vấn (UC20)', icon: MessageSquare },
    { to: '/staff/test-drives', label: 'Điều Phối Lái Thử (UC21)', icon: CalendarClock },
    { to: '/staff/deposit-audit', label: 'Đối Soát Cọc & Gán VIN (UC22)', icon: ShieldCheck },
    { to: '/staff/fulfillment', label: 'Đóng Gói Vận Chuyển (UC23)', icon: Box },
    { to: '/staff/returns', label: 'Xử Lý Đổi Trả (UC24)', icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* STAFF BACK-OFFICE SIDEBAR */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4">
        <div>
          <div className="mb-6 px-3">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">AutoHub Operation</span>
            <h1 className="text-lg font-black text-white">Staff Portal</h1>
            <p className="text-[11px] text-slate-400 mt-1">Xin chào, {user?.fullName}</p>
          </div>

          <nav className="space-y-1">
            {menu.map((m) => {
              const Icon = m.icon;
              return (
                <NavLink
                  key={m.to}
                  to={m.to}
                  className={({ isActive }) =>
                    \`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors \${
                      isActive
                        ? 'bg-red-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }\`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{m.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-3">
          <button
            onClick={() => {
              logout();
              navigate('/auth/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất Staff</span>
          </button>
        </div>
      </aside>

      {/* STAFF MAIN OUTLET */}
      <main className="flex-1 bg-slate-900 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
`
);

writeFileSync(
  path.join(SRC_DIR, 'app/layouts/AdminLayout.tsx'),
  `import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Car, PackageCheck, Receipt, Users, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const adminMenu = [
    { to: '/admin/dashboard', label: 'Báo Cáo Thống Kê (F19)', icon: BarChart3 },
    { to: '/admin/cars-master', label: 'Master Data Xe & Demo (F20)', icon: Car },
    { to: '/admin/accessories-master', label: 'Phụ Kiện & Tồn Kho (F21)', icon: PackageCheck },
    { to: '/admin/fees-vouchers', label: 'Biểu Phí Lăn Bánh & Voucher (F22)', icon: Receipt },
    { to: '/admin/users-rbac', label: 'Quản Trị Người Dùng RBAC (F24)', icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* ADMIN BACK-OFFICE SIDEBAR */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4">
        <div>
          <div className="mb-6 px-3">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">AutoHub Master</span>
            <h1 className="text-lg font-black text-white">Administrator</h1>
            <p className="text-[11px] text-slate-400 mt-1">Admin: {user?.fullName}</p>
          </div>

          <nav className="space-y-1">
            {adminMenu.map((m) => {
              const Icon = m.icon;
              return (
                <NavLink
                  key={m.to}
                  to={m.to}
                  className={({ isActive }) =>
                    \`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors \${
                      isActive
                        ? 'bg-red-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }\`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{m.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-3">
          <button
            onClick={() => {
              logout();
              navigate('/auth/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất Admin</span>
          </button>
        </div>
      </aside>

      {/* ADMIN MAIN OUTLET */}
      <main className="flex-1 bg-slate-900 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
`
);

// ==========================================
// 7. FEATURE MODULES STUBS
// ==========================================

const features = [
  {
    name: 'auth',
    files: [
      {
        file: 'LoginPage.tsx',
        content: `export const LoginPage = () => <div className="p-8 max-w-md mx-auto bg-white border border-slate-200 rounded-xl shadow-sm text-center"><h2 className="text-lg font-bold">Đăng Nhập Hệ Thống (Stub)</h2><p className="text-xs text-slate-500 mt-2">Hỗ trợ Stateless JWT & RBAC phân quyền</p></div>;`,
      },
      {
        file: 'RegisterPage.tsx',
        content: `export const RegisterPage = () => <div className="p-8 max-w-md mx-auto bg-white border border-slate-200 rounded-xl shadow-sm text-center"><h2 className="text-lg font-bold">Đăng Ký Tài Khoản Khách Hàng (Stub)</h2></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './LoginPage';\nexport * from './RegisterPage';`,
      },
    ],
  },
  {
    name: 'profile',
    files: [
      {
        file: 'ProfilePage.tsx',
        content: `export const ProfilePage = () => <div><h2 className="text-lg font-bold text-slate-900 mb-2">Thông Tin Cá Nhân (Stub)</h2><p className="text-xs text-slate-500">Quản lý hồ sơ định danh CCCD và số điện thoại</p></div>;`,
      },
      {
        file: 'AddressBookPage.tsx',
        content: `export const AddressBookPage = () => <div><h2 className="text-lg font-bold text-slate-900 mb-2">Sổ Địa Chỉ Giao Hàng (UC03 Stub)</h2><p className="text-xs text-slate-500">Quản lý danh sách địa chỉ nhận phụ kiện</p></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './ProfilePage';\nexport * from './AddressBookPage';`,
      },
    ],
  },
  {
    name: 'cars',
    files: [
      {
        file: 'CarListPage.tsx',
        content: `export const CarListPage = () => <div className="space-y-4"><h1 className="text-2xl font-black text-slate-900">Showroom Danh Mục Ô Tô (F01 Stub)</h1><p className="text-xs text-slate-500">Bộ lọc phân khúc A/B/C/D/E, loại nhiên liệu, hộp số và bảng giá niêm yết</p></div>;`,
      },
      {
        file: 'CarDetailPage.tsx',
        content: `export const CarDetailPage = () => <div className="space-y-4"><h1 className="text-2xl font-black text-slate-900">Chi Tiết Mẫu Xe & Phiên Bản (F02 Stub)</h1><p className="text-xs text-slate-500">Bộ sưu tập ảnh 360, chọn màu sắc xe, đặt cọc giữ xe 72h và đăng ký lái thử</p></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './CarListPage';\nexport * from './CarDetailPage';`,
      },
    ],
  },
  {
    name: 'car-estimator',
    files: [
      {
        file: 'CarEstimatorPage.tsx',
        content: `export const CarEstimatorPage = () => <div className="space-y-4"><h1 className="text-2xl font-black text-slate-900">Dự Toán Chi Phí Lăn Bánh & Vay Trả Góp (F03, F04 Stub)</h1><p className="text-xs text-slate-500">Tính thuế trước bạ, phí đăng ký biển số theo Tỉnh/Thành và bảng phân bổ lãi suất vay</p></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './CarEstimatorPage';`,
      },
    ],
  },
  {
    name: 'car-comparison',
    files: [
      {
        file: 'CarComparisonPage.tsx',
        content: `export const CarComparisonPage = () => <div className="space-y-4"><h1 className="text-2xl font-black text-slate-900">Bàn Cân Đối Đầu So Sánh Xe Song Song (F05 Stub)</h1><p className="text-xs text-slate-500">So sánh đối đầu tối đa 3 phiên bản xe theo thông số kỹ thuật, động cơ và kích thước</p></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './CarComparisonPage';`,
      },
    ],
  },
  {
    name: 'ai-consultant',
    files: [
      {
        file: 'AiConsultantWidget.tsx',
        content: `export const AiConsultantWidget = () => <div id="ai-consultant-modal" className="hidden fixed bottom-20 right-6 w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50"><h3 className="font-bold text-sm text-slate-900 mb-2">Trợ Lý Ảo AutoHub AI (F25 Stub)</h3><p className="text-xs text-slate-500 mb-4">Hỗ trợ tư vấn thông số kỹ thuật xe và phụ kiện tương thích theo LLM Function Calling.</p><div className="h-48 bg-slate-50 rounded-lg p-2 text-xs text-slate-400 overflow-y-auto">Hội thoại AI sẽ hiển thị tại đây...</div></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './AiConsultantWidget';`,
      },
    ],
  },
  {
    name: 'accessories',
    files: [
      {
        file: 'AccessoryListPage.tsx',
        content: `export const AccessoryListPage = () => <div className="space-y-4"><h1 className="text-2xl font-black text-slate-900">Sàn Thương Mại Điện Tử Phụ Kiện Ô Tô (F06 Stub)</h1><p className="text-xs text-slate-500">Bộ lọc tương thích tuyệt đối theo Dòng xe & Năm sản xuất</p></div>;`,
      },
      {
        file: 'AccessoryDetailPage.tsx',
        content: `export const AccessoryDetailPage = () => <div className="space-y-4"><h1 className="text-2xl font-black text-slate-900">Chi Tiết Phụ Kiện & Đồ Chơi Xe (F07 Stub)</h1></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './AccessoryListPage';\nexport * from './AccessoryDetailPage';`,
      },
    ],
  },
  {
    name: 'cart',
    files: [
      {
        file: 'CartPage.tsx',
        content: `export const CartPage = () => <div className="space-y-4"><h1 className="text-2xl font-black text-slate-900">Giỏ Hàng Phụ Kiện (F08 Stub)</h1><p className="text-xs text-slate-500">Hỗ trợ giỏ hàng khách vãng lai và đồng bộ tài khoản khi đăng nhập</p></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './CartPage';`,
      },
    ],
  },
  {
    name: 'checkout',
    files: [
      {
        file: 'CheckoutPage.tsx',
        content: `export const CheckoutPage = () => <div className="space-y-4"><h1 className="text-2xl font-black text-slate-900">Thanh Toán Đơn Hàng Phụ Kiện (F09 Stub)</h1><p className="text-xs text-slate-500">Tích hợp cổng VNPay HMAC-SHA512 & COD</p></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './CheckoutPage';`,
      },
    ],
  },
  {
    name: 'car-deposit',
    files: [
      {
        file: 'CarDepositPage.tsx',
        content: `export const CarDepositPage = () => <div className="space-y-4"><h1 className="text-2xl font-black text-slate-900">Quy Trình Đặt Cọc Giữ Suất Xe 72 Giờ (F13, UC17 Stub)</h1><p className="text-xs text-slate-500">Xác thực CCCD, khóa giữ xe và thanh toán đặt cọc qua VNPay</p></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './CarDepositPage';`,
      },
    ],
  },
  {
    name: 'test-drive',
    files: [
      {
        file: 'TestDriveBookingPage.tsx',
        content: `export const TestDriveBookingPage = () => <div className="space-y-4"><h1 className="text-2xl font-black text-slate-900">Đăng Ký Lái Thử Trực Tuyến (F12, UC16 Stub)</h1><p className="text-xs text-slate-500">Cam kết GPLX hợp lệ, chọn mẫu xe demo và showroom tiếp nhận</p></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './TestDriveBookingPage';`,
      },
    ],
  },
  {
    name: 'staff-operations',
    files: [
      {
        file: 'ConsultationListPage.tsx',
        content: `export const ConsultationListPage = () => <div><h2 className="text-lg font-bold text-white mb-2">Tiếp Nhận & Xử Lý Yêu Cầu Tư Vấn (UC20)</h2></div>;`,
      },
      {
        file: 'TestDriveSchedulePage.tsx',
        content: `export const TestDriveSchedulePage = () => <div><h2 className="text-lg font-bold text-white mb-2">Điều Phối Xe Demo & Lịch Lái Thử (UC21)</h2></div>;`,
      },
      {
        file: 'DepositAuditPage.tsx',
        content: `export const DepositAuditPage = () => <div><h2 className="text-lg font-bold text-white mb-2">Đối Soát Phiếu Cọc & Gán Số Khung VIN (UC22)</h2></div>;`,
      },
      {
        file: 'OrderFulfillmentPage.tsx',
        content: `export const OrderFulfillmentPage = () => <div><h2 className="text-lg font-bold text-white mb-2">Đóng Gói & Xuất Kho Phụ Kiện (UC23)</h2></div>;`,
      },
      {
        file: 'ReturnManagementPage.tsx',
        content: `export const ReturnManagementPage = () => <div><h2 className="text-lg font-bold text-white mb-2">Thẩm Định & Xử Lý Đổi Trả Phụ Kiện (UC24)</h2></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './ConsultationListPage';\nexport * from './TestDriveSchedulePage';\nexport * from './DepositAuditPage';\nexport * from './OrderFulfillmentPage';\nexport * from './ReturnManagementPage';`,
      },
    ],
  },
  {
    name: 'admin-portal',
    files: [
      {
        file: 'AdminDashboardPage.tsx',
        content: `export const AdminDashboardPage = () => <div><h2 className="text-lg font-bold text-white mb-2">Báo Cáo Doanh Thu & Chỉ Số Vận Hành (F19)</h2><p className="text-xs text-slate-400">Tích hợp biểu đồ thống kê Chart.js</p></div>;`,
      },
      {
        file: 'CarMasterPage.tsx',
        content: `export const CarMasterPage = () => <div><h2 className="text-lg font-bold text-white mb-2">Quản Trị Master Data Ô Tô & Xe Demo (F20)</h2></div>;`,
      },
      {
        file: 'AccessoryMasterPage.tsx',
        content: `export const AccessoryMasterPage = () => <div><h2 className="text-lg font-bold text-white mb-2">Quản Trị Danh Mục Phụ Kiện & Tồn Kho (F21)</h2></div>;`,
      },
      {
        file: 'FeeVoucherMasterPage.tsx',
        content: `export const FeeVoucherMasterPage = () => <div><h2 className="text-lg font-bold text-white mb-2">Biểu Phí Lăn Bánh Tỉnh Thành & Voucher (F22)</h2></div>;`,
      },
      {
        file: 'UserRbacPage.tsx',
        content: `export const UserRbacPage = () => <div><h2 className="text-lg font-bold text-white mb-2">Phân Quyền & Quản Lý Người Dùng RBAC (F24)</h2></div>;`,
      },
      {
        file: 'index.ts',
        content: `export * from './AdminDashboardPage';\nexport * from './CarMasterPage';\nexport * from './AccessoryMasterPage';\nexport * from './FeeVoucherMasterPage';\nexport * from './UserRbacPage';`,
      },
    ],
  },
];

features.forEach((feat) => {
  feat.files.forEach((f) => {
    writeFileSync(path.join(SRC_DIR, 'features', feat.name, f.file), f.content);
  });
});

// ==========================================
// 8. APP ROUTING CONFIGURATION
// ==========================================

writeFileSync(
  path.join(SRC_DIR, 'app/routes/index.tsx'),
  `import { createBrowserRouter, Navigate } from 'react-router-dom';

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
`
);

// ==========================================
// 9. APP ROOT & MAIN
// ==========================================

writeFileSync(
  path.join(SRC_DIR, 'App.tsx'),
  `import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { AiConsultantWidget } from './features/ai-consultant';

export const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      <AiConsultantWidget />
    </>
  );
};

export default App;
`
);

writeFileSync(
  path.join(SRC_DIR, 'main.tsx'),
  `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
);

writeFileSync(
  path.join(SRC_DIR, 'index.css'),
  `@import "tailwindcss";

@layer base {
  body {
    background-color: #f8fafc;
    color: #1e293b;
    -webkit-font-smoothing: antialiased;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
}
`
);

writeFileSync(
  path.join(ROOT_DIR, 'postcss.config.js'),
  `export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
`
);

writeFileSync(
  path.join(ROOT_DIR, 'tailwind.config.js'),
  `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'desktop-min': '1366px',
        'desktop-fhd': '1920px',
      },
    },
  },
  plugins: [],
};
`
);

console.log('\n🎉 AutoHub Frontend Architecture Scaffolding Completed Successfully!');
