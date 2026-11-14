import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

const SESSION_KEY = 'autohub_session_id';

export function getSessionId(): string {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export interface TrackingPayload {
  loaiHanhVi: 'VIEW_PRODUCT' | 'DWELL_TIME' | 'INTERACT_360' | 'GALLERY_SLIDE';
  loaiThucThe?: 'CAR' | 'ACCESSORY';
  maThucThe?: number;
  thoiGianDungXem?: number;
  duLieuBoSung?: string | Record<string, unknown>;
  nguoiDungId?: number;
}

/**
 * Gửi sự kiện theo dõi hành vi người dùng về Backend Spring Boot (Non-blocking telemetry)
 */
export const trackUserEvent = (payload: TrackingPayload): void => {
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
    axiosClient.post(endpoint, body).catch(() => {
      // Telemetry non-blocking: Không làm ảnh hưởng trải nghiệm người dùng
    });
  } catch {
    // Không bao giờ để lỗi tracking làm crash ứng dụng
  }
};
