import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  User,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  X,
  ChevronRight,
  LogOut,
  Sparkles,
  Headphones,
} from 'lucide-react';
import { Header, Footer } from '@/components';
import { useAuthStore } from '@/store/useAuthStore';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const CustomerLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navItems: NavItem[] = [
    { to: '/customer/profile', label: 'Hồ Sơ Cá Nhân', icon: User },
    { to: '/customer/addresses', label: 'Sổ Địa Chỉ', icon: MapPin },
    { to: '/customer/test-drives', label: 'Lịch Hẹn Lái Thử', icon: Calendar },
    { to: '/customer/deposits', label: 'Phiếu Đặt Cọc Xe (72h)', icon: CreditCard, badge: '72h' },
    { to: '/customer/orders', label: 'Đơn Hàng Phụ Kiện', icon: Package },
  ];

  // Tìm nav item đang active để hiển thị breadcrumb trên thanh công cụ
  const currentNavItem = navItems.find((item) => location.pathname.startsWith(item.to)) || navItems[0];

  // Đóng Drawer khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  // Khóa cuộn trang nền khi Drawer đang mở
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1326] text-[#DAE2FD]">
      {/* 1. GLOBAL HEADER */}
      <Header />

      {/* 2. CUSTOMER TOP CONTROL BAR (Thanh điều hướng với nút 3 gạch) */}
      <section className="border-b border-[#2D3449]/80 bg-[#131B2E]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Nút 3 gạch mở Drawer */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-[4px] bg-[#171F33] hover:bg-[#1C263E] border border-[#2D3449] hover:border-[#89CEFF]/60 text-[#DAE2FD] hover:text-[#89CEFF] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(137,206,255,0.2)]"
              aria-label="Mở menu tài khoản thành viên"
              title="Mở menu tài khoản thành viên"
            >
              {/* Icon 3 gạch với hiệu ứng chuyển động khi hover */}
              <div className="w-4 h-4 flex flex-col justify-center gap-1">
                <span className="h-[2px] w-4 bg-[#89CEFF] rounded-full transition-transform duration-200 group-hover:translate-x-0.5" />
                <span className="h-[2px] w-3 bg-[#DAE2FD] rounded-full transition-all duration-200 group-hover:w-4 group-hover:bg-[#89CEFF]" />
                <span className="h-[2px] w-4 bg-[#89CEFF] rounded-full transition-transform duration-200 group-hover:-translate-x-0.5" />
              </div>

              <span className="text-xs font-semibold tracking-wide hidden sm:inline">
                Tài khoản thành viên
              </span>

              {/* Indicator chấm xanh thông báo */}
              <span className="w-1.5 h-1.5 rounded-full bg-[#89CEFF] animate-pulse" />
            </button>

            {/* Breadcrumb hiển thị mục đang xem */}
            <div className="flex items-center gap-2 text-xs text-[#88929B]">
              <ChevronRight className="w-3.5 h-3.5 text-[#3E4850]" />
              <div className="flex items-center gap-1.5 text-[#DAE2FD] font-semibold">
                {React.createElement(currentNavItem.icon, { className: 'w-4 h-4 text-[#89CEFF]' })}
                <span>{currentNavItem.label}</span>
              </div>
            </div>
          </div>

          {/* User Status Badge bên phải */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#171F33] border border-[#2D3449]">
              <Sparkles className="w-3 h-3 text-[#FFB86E]" />
              <span className="font-mono text-[10px] font-bold text-[#FFB86E] uppercase tracking-wider">
                ★ GT-E VIP RESERVE
              </span>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-[#DAE2FD]">
                {user?.fullName || 'Nguyễn Văn A'}
              </div>
              <div className="text-[10px] text-[#88929B] font-mono">
                {user?.email || 'nguyenvana@gmail.com'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SLIDE-OVER DRAWER MENU (Hiệu ứng animation ra vào mượt mà) */}
      {/* Backdrop mờ tối */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Panel Drawer trượt từ bên trái */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[300px] sm:w-[320px] bg-[#131B2E] border-r border-[#2D3449] shadow-[0_0_50px_rgba(0,0,0,0.85),0_0_30px_rgba(14,165,233,0.18)] z-50 flex flex-col transition-transform duration-300 ease-out will-change-transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Thanh điều hướng tài khoản thành viên"
      >
        {/* Specular Highlight Bar trên đỉnh */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#89CEFF] to-transparent" />

        {/* Drawer Header */}
        <div className="p-5 border-b border-[#2D3449] flex items-center justify-between gap-3 bg-[#171F33]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#060E20] border border-[#89CEFF]/40 flex items-center justify-center text-[#89CEFF] font-bold text-sm shadow-inner">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#DAE2FD]">
                {user?.fullName || 'Nguyễn Văn A'}
              </h3>
              <div className="inline-flex items-center gap-1 font-mono text-[9px] font-bold text-[#FFB86E] uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" />
                <span>★ GT-E VIP RESERVE</span>
              </div>
            </div>
          </div>

          {/* Nút Đóng X */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="w-8 h-8 rounded-[4px] bg-[#131B2E] border border-[#2D3449] hover:border-[#89CEFF]/50 text-[#BEC8D2] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng menu"
            aria-label="Đóng menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Navigation List matching 100% người dùng cung cấp */}
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Nhãn tiêu đề danh mục */}
          <div className="px-3 pt-2 pb-3">
            <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#88929B] font-mono">
              TÀI KHOẢN THÀNH VIÊN
            </span>
          </div>

          {/* 5 Menu Items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsDrawerOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center justify-between px-3.5 py-3 rounded-[4px] text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF] shadow-[0_0_15px_rgba(137,206,255,0.25)]'
                      : 'text-[#BEC8D2] border border-transparent hover:bg-[#171F33]/80 hover:text-white hover:border-[#2D3449]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-[#89CEFF]' : 'text-[#89CEFF]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] font-mono text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}

                    {/* Chỉ báo active thanh viền cyan bên trái */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-[#89CEFF] shadow-[0_0_8px_#89CEFF]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Drawer Footer: Hỗ trợ & Đăng xuất */}
        <div className="p-4 border-t border-[#2D3449] bg-[#171F33]/40 space-y-2">
          <div className="p-2.5 rounded-[4px] bg-[#060E20] border border-[#2D3449]/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#BEC8D2]">
              <Headphones className="w-3.5 h-3.5 text-[#89CEFF]" />
              <span>Hỗ trợ 24/7:</span>
            </div>
            <a
              href="tel:19008888"
              className="font-mono font-bold text-[#89CEFF] hover:underline"
            >
              1900 8888
            </a>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsDrawerOpen(false);
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[4px] bg-[#171F33] hover:bg-rose-950/40 border border-[#2D3449] hover:border-rose-500/50 text-xs font-semibold text-[#BEC8D2] hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất tài khoản</span>
          </button>
        </div>
      </aside>

      {/* 4. CUSTOMER CONTENT OUTLET (Toàn bộ không gian rộng rãi, thoáng đãng) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-[#131B2E] border border-[#2D3449] rounded-[4px] p-4 sm:p-6 md:p-8 shadow-2xl min-w-0 transition-all">
          <Outlet />
        </div>
      </main>

      {/* 5. GLOBAL FOOTER */}
      <Footer />
    </div>
  );
};
