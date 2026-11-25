import React, { useEffect } from 'react';
import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Header, Footer } from '@/components';
import { AiConsultantWidget } from '@/features/customer';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const fetchCartFromServer = useCartStore((s) => s.fetchCartFromServer);

  // Tự động tải giỏ hàng từ cơ sở dữ liệu nếu đã đăng nhập để số lượng badge trên Header luôn chính xác
  useEffect(() => {
    if (user?.id) {
      fetchCartFromServer(user.id);
    }
  }, [user?.id, fetchCartFromServer]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] antialiased">
      <ScrollRestoration />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div key={pathname} className="animate-pageTransition w-full">
          <Outlet />
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('ai-consultant-modal');
            if (el) el.classList.toggle('hidden');
          }}
          className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[var(--surface)] text-[var(--text)] border border-[var(--line-strong)] font-medium text-sm rounded-[var(--radius)] shadow-md hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
          <span>Hỏi tư vấn xe</span>
        </button>
      </div>

      <AiConsultantWidget />

      <Footer />
    </div>
  );
};
