import React, { useEffect } from 'react';
import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { Header, Footer } from '@/components';
import { AiConsultantWidget } from '@/features/customer';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Luôn luôn cuộn về đầu trang (0, 0) mỗi khi chuyển trang
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1326] text-[#DAE2FD] antialiased">
      <ScrollRestoration />
      {/* DESKTOP HEADER (1366x768 -> 1920x1080) */}
      <Header />

      {/* MAIN CONTENT OUTLET */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        <div key={pathname} className="animate-pageTransition w-full">
          <Outlet />
        </div>
      </main>

      {/* FLOATING AI CONSULTANT TRIGGER & MODAL WIDGET */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const el = document.getElementById('ai-consultant-modal');
            if (el) el.classList.toggle('hidden');
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#171F33] to-[#222A3D] text-[#89CEFF] border border-[#3E4850]/80 font-bold text-xs rounded-full shadow-2xl hover:border-[#89CEFF] hover:scale-105 transition-all cursor-pointer"
        >
          <Bot className="w-4 h-4 text-[#89CEFF]" />
          <span>Trợ Lý Ảo AI</span>
        </button>
      </div>

      <AiConsultantWidget />

      {/* COMPREHENSIVE FOOTER */}
      <Footer />
    </div>
  );
};
