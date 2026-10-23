import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Car, ShoppingCart, Scale, User as UserIcon, Bot, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCompareStore } from '@/store/compareStore';
import { useAuthStore } from '@/store/authStore';

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
