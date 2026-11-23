import { useEffect, useRef, useCallback } from 'react';
import {
  trackUserEvent,
  type TrackingAction,
  type TrackingEntityType,
} from '@/lib/tracker';

export interface PageTrackingOptions {
  loaiThucThe: TrackingEntityType | string;
  maThucThe?: number;
  metadata?: Record<string, unknown>;
  minDwellSeconds?: number;
  autoTrackView?: boolean;
  viewAction?: TrackingAction;
  enabled?: boolean;
}

/**
 * Custom Hook tự động theo dõi lượt xem (View) và thời gian dừng thực tế (Dwell Time)
 * của trang hoặc thực thể thông qua Page Visibility API (tạm dừng khi chuyển tab/thu nhỏ).
 */
export const usePageTracking = ({
  loaiThucThe,
  maThucThe,
  metadata,
  minDwellSeconds = 2,
  autoTrackView = true,
  viewAction = 'VIEW_PRODUCT',
  enabled = true,
}: PageTrackingOptions) => {
  const activeDwellRef = useRef<number>(0);
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const isVisibleRef = useRef<boolean>(true);
  const hasSentDwellRef = useRef<boolean>(false);
  const metadataRef = useRef(metadata);

  useEffect(() => {
    metadataRef.current = metadata;
  }, [metadata]);

  // Hàm tính toán và gom toàn bộ thời gian thực sự đang nhìn vào trang
  const flushDwellTime = useCallback(
    (useBeacon = false) => {
      if (hasSentDwellRef.current) return;

      // Cộng dồn thời gian active còn lại nếu tab vẫn đang hiển thị
      if (isVisibleRef.current) {
        const now = Date.now();
        const chunk = Math.round((now - lastActiveTimestampRef.current) / 1000);
        if (chunk > 0) {
          activeDwellRef.current += chunk;
          lastActiveTimestampRef.current = now;
        }
      }

      const totalDwell = activeDwellRef.current;
      if (totalDwell >= minDwellSeconds) {
        hasSentDwellRef.current = true;
        trackUserEvent(
          {
            loaiHanhVi: 'DWELL_TIME',
            loaiThucThe,
            maThucThe,
            thoiGianDungXem: totalDwell,
            duLieuBoSung: {
              ...(metadataRef.current || {}),
              dwellSeconds: totalDwell,
            },
          },
          { useBeacon }
        );
      }
    },
    [loaiThucThe, maThucThe, minDwellSeconds]
  );

  useEffect(() => {
    if (!enabled) return;

    // 1. Reset trạng thái khi mount hoặc đổi maThucThe
    activeDwellRef.current = 0;
    lastActiveTimestampRef.current = Date.now();
    isVisibleRef.current =
      typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;
    hasSentDwellRef.current = false;

    // 2. Gửi sự kiện xem ban đầu (VIEW_PRODUCT)
    if (autoTrackView) {
      trackUserEvent({
        loaiHanhVi: viewAction,
        loaiThucThe,
        maThucThe,
        duLieuBoSung: {
          ...(metadataRef.current || {}),
          referrer: typeof window !== 'undefined' ? window.location.pathname : '',
        },
      });
    }

    // 3. Xử lý khi người dùng chuyển tab hoặc ẩn cửa sổ (Page Visibility API)
    const handleVisibilityChange = () => {
      const now = Date.now();
      if (document.visibilityState === 'hidden') {
        if (isVisibleRef.current) {
          const chunk = Math.round((now - lastActiveTimestampRef.current) / 1000);
          if (chunk > 0) {
            activeDwellRef.current += chunk;
          }
        }
        isVisibleRef.current = false;
      } else {
        isVisibleRef.current = true;
        lastActiveTimestampRef.current = now;
      }
    };

    // 4. Xử lý khi người dùng đóng tab hoặc điều hướng ngoài (pagehide / beforeunload)
    const handlePageHide = () => {
      flushDwellTime(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      flushDwellTime(false);
    };
  }, [enabled, loaiThucThe, maThucThe, autoTrackView, viewAction, flushDwellTime]);

  /**
   * Helper gửi các hành động tương tác chi tiết gắn liền với thực thể hiện tại
   */
  const trackAction = useCallback(
    (action: TrackingAction, extraData?: Record<string, unknown>) => {
      trackUserEvent({
        loaiHanhVi: action,
        loaiThucThe,
        maThucThe,
        duLieuBoSung: {
          ...(metadataRef.current || {}),
          ...(extraData || {}),
        },
      });
    },
    [loaiThucThe, maThucThe]
  );

  return { trackAction };
};
