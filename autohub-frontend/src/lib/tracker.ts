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
  duLieuBoSung?: string;
  nguoiDungId?: number;
}

/**
 * Gửi ngầm sự kiện theo dõi hành vi người dùng về Backend Spring Boot
 */
export const trackUserEvent = (payload: TrackingPayload) => {
  const body = {
    maPhien: getSessionId(),
    ...payload,
  };

  axiosClient.post(API_CONFIG.ENDPOINTS.TRACKING.COLLECT, body).catch(() => {
    // Không chặn luồng người dùng nếu có lỗi mạng
  });
};
