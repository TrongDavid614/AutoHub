import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Car, ShoppingCart, Scale, Search } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCompareStore } from '@/store/useCompareStore';
import { useAuthStore } from '@/store/useAuthStore';

export const CustomerLayout: React.FC = () => {
  const totalCartCount = useCartStore((s) => s.getTotalItemsCount());
  const compareCount = useCompareStore((s) => s.selectedVariants.length);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
      {/* TOP LUXURY HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight text-white group">
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5" />
            </div>
            <span>Auto<span className="text-cyan-400">Hub</span></span>
          </Link>

          {/* Quick Search */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm thông tin cọc xe, lịch hẹn, phụ kiện..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-full text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-xs font-semibold text-slate-300">
            <Link to="/cars" className="hover:text-cyan-400 transition-colors">Showroom Ô Tô</Link>
            <Link to="/car-estimator" className="hover:text-cyan-400 transition-colors">Dự Toán Lăn Bánh</Link>
            <Link to="/accessories" className="hover:text-cyan-400 transition-colors">Phụ Kiện</Link>
            <Link to="/test-drive" className="hover:text-cyan-400 transition-colors">Đăng Ký Lái Thử</Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Compare Bar */}
            <Link
              to="/car-comparison"
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              title="So sánh xe"
            >
              <Scale className="w-4 h-4" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              title="Giỏ hàng phụ kiện"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <Link
                to="/customer/profile"
                className="flex items-center gap-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700/80 rounded-full border border-slate-700 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                  A
                </div>
                <span className="text-xs font-semibold text-slate-100">{user?.fullName || 'Nguyễn Văn A'}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  VIP Diamond
                </span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CUSTOMER OUTLET */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 AutoHub Platform. Nhóm 7 - Đề tài Website giới thiệu, bán ô tô và phụ kiện trực tuyến.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-white">Điều khoản sử dụng</Link>
            <Link to="#" className="hover:text-white">Chính sách bảo mật</Link>
            <Link to="#" className="hover:text-white">Hỗ trợ 24/7</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
