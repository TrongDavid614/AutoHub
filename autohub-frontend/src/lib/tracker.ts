import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

const SESSION_KEY = 'autohub_session_id';

export type TrackingAction =
  | 'VIEW_PRODUCT'
  | 'DWELL_TIME'
  | 'INTERACT_360'
  | 'GALLERY_SLIDE'
  | 'CHANGE_COLOR'
  | 'CHANGE_TRIM'
  | 'CALCULATE_ESTIMATOR'
  | 'COMPARE_CARS'
  | 'FILTER_COMPATIBILITY'
  | 'INITIATE_TEST_DRIVE'
  | 'INITIATE_DEPOSIT'
  | 'DEPOSIT_PAID'
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'BEGIN_CHECKOUT'
  | 'ORDER_PURCHASE'
  | 'AI_CONSULTANT_QUERY';

export type TrackingEntityType =
  | 'CAR'
  | 'ACCESSORY'
  | 'ESTIMATOR'
  | 'COMPARISON'
  | 'TEST_DRIVE'
  | 'CART'
  | 'AI_CONSULTANT';

export interface TrackingPayload {
  loaiHanhVi: TrackingAction;
  loaiThucThe?: TrackingEntityType | string;
  maThucThe?: number;
  thoiGianDungXem?: number;
  duLieuBoSung?: string | Record<string, unknown>;
  nguoiDungId?: number;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'sess_ssr';
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

/**
 * Gửi sự kiện theo dõi hành vi người dùng về Backend Spring Boot (Non-blocking telemetry)
 * Hỗ trợ tự động fallback sang navigator.sendBeacon khi unmount hoặc unload trang.
 */
export const trackUserEvent = (
  payload: TrackingPayload,
  options?: { useBeacon?: boolean }
): void => {
  try {
    const duLieuBoSungStr =
      typeof payload.duLieuBoSung === 'object' && payload.duLieuBoSung !== null
        ? JSON.stringify(payload.duLieuBoSung)
        : payload.duLieuBoSung;

    const body = {
      maPhien: getSessionId(),
      ...payload,
      duLieuBoSung: duLieuBoSungStr,
    };

    const endpoint = API_CONFIG.ENDPOINTS.TRACKING?.COLLECT || '/tracking/collect';
    const baseUrl = API_CONFIG.BASE_URL.replace(/\/+$/, '');
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    if (options?.useBeacon && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
      const sent = navigator.sendBeacon(fullUrl, blob);
      if (sent) return;
    }

    axiosClient.post(endpoint, body).catch(() => {
      // Telemetry non-blocking: Không làm ảnh hưởng trải nghiệm người dùng
    });
  } catch {
    // Không bao giờ để lỗi tracking làm crash ứng dụng
  }
};
