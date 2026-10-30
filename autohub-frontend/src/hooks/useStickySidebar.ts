import { useEffect, useRef } from 'react';

export interface UseStickySidebarOptions {
  /** Khoảng cách cách mép trên khi ghim ở đỉnh (mặc định 80px để chừa Header sticky 64px + 16px padding) */
  headerOffset?: number;
  /** Khoảng cách cách mép dưới khi cuộn tới cuối bộ lọc (mặc định 24px) */
  bottomOffset?: number;
}

/**
 * Custom Hook điều khiển cơ chế Sticky Sidebar thông minh:
 * - Khi cuộn trang xuống: Bộ lọc cuộn tự nhiên theo trang cho tới khi chạm đến phần cuối (bottom) thì tự động dừng lại/ghim cố định, không bị cuộn mất khỏi tầm nhìn.
 * - Khi cuộn trang lên: Bộ lọc trượt xuống lại cho tới khi chạm đỉnh (top) thì ghim cố định.
 * - Trên màn hình lớn (nếu chiều cao bộ lọc nhỏ hơn viewport): Luôn ghim cố định ở đỉnh (top: headerOffset).
 */
export function useStickySidebar<T extends HTMLElement = HTMLElement>(
  options: UseStickySidebarOptions = {}
) {
  const sidebarRef = useRef<T | null>(null);
  const { headerOffset = 80, bottomOffset = 24 } = options;

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    let lastScrollY = window.scrollY;
    let currentTop = headerOffset;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      const windowHeight = window.innerHeight;
      const sidebarHeight = sidebar.offsetHeight;

      // Nếu bộ lọc ngắn hơn chiều cao màn hình khả dụng -> Ghim cố định ở đỉnh
      if (sidebarHeight <= windowHeight - headerOffset - bottomOffset) {
        sidebar.style.top = `${headerOffset}px`;
        lastScrollY = currentScrollY;
        return;
      }

      // Vị trí top nhỏ nhất (khi đáy của bộ lọc chạm đáy màn hình trừ bottomOffset)
      const minTop = windowHeight - sidebarHeight - bottomOffset;
      // Vị trí top lớn nhất (khi đỉnh của bộ lọc chạm headerOffset)
      const maxTop = headerOffset;

      // Khi cuộn xuống (scrollDelta > 0): currentTop giảm dần về minTop (hiển thị hết phần cuối)
      // Khi cuộn lên (scrollDelta < 0): currentTop tăng dần về maxTop (hiển thị lại phần đầu)
      currentTop = Math.max(minTop, Math.min(maxTop, currentTop - scrollDelta));
      sidebar.style.top = `${currentTop}px`;

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [headerOffset, bottomOffset]);

  return sidebarRef;
}
