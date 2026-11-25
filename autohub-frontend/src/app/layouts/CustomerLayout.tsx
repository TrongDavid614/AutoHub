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
  Menu,
  Phone,
} from 'lucide-react';
import { Header, Footer } from '@/components';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

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
    { to: '/customer/profile', label: 'Hồ sơ cá nhân', icon: User },
    { to: '/customer/addresses', label: 'Sổ địa chỉ', icon: MapPin },
    { to: '/customer/test-drives', label: 'Lịch hẹn lái thử', icon: Calendar },
    { to: '/customer/deposits', label: 'Phiếu đặt cọc xe (72h)', icon: CreditCard, badge: '72h' },
    { to: '/customer/orders', label: 'Đơn hàng phụ kiện', icon: Package },
  ];

  const currentNavItem = navItems.find((item) => location.pathname.startsWith(item.to)) || navItems[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

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
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] antialiased">
      <Header />

      {/* Customer Sub-Bar */}
      <section className="border-b border-[var(--line)] bg-[var(--surface)] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-[var(--radius)] bg-[var(--surface-subtle)] hover:bg-[var(--surface-muted)] border border-[var(--line)] text-[var(--text)] text-[13px] font-medium transition-colors cursor-pointer"
              aria-label="Mở menu tài khoản thành viên"
            >
              <Menu className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="hidden sm:inline">Danh mục tài khoản</span>
            </button>

            <div className="flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
              <ChevronRight className="w-4 h-4 text-[var(--line-strong)]" />
              <div className="flex items-center gap-1.5 text-[var(--text)] font-medium">
                {React.createElement(currentNavItem.icon, { className: 'w-4 h-4 text-[var(--accent)]' })}
                <span>{currentNavItem.label}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drawer Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/30 z-50 transition-opacity duration-200',
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Navigation Drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-[300px] sm:w-[320px] bg-[var(--surface)] border-r border-[var(--line)] shadow-lg z-50 flex flex-col transition-transform duration-200 ease-out',
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Điều hướng tài khoản thành viên"
      >
        <div className="p-5 border-b border-[var(--line)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)] font-semibold text-sm shrink-0">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[var(--text)] truncate">
                {user?.fullName || 'Khách hàng'}
              </h3>
              <p className="text-[13px] text-[var(--text-muted)] truncate">
                {user?.email || 'customer@autohub.vn'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="w-9 h-9 rounded-[var(--radius-sm)] border border-[var(--line)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng menu"
            aria-label="Đóng menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-3 pt-1 pb-2 text-[13px] font-medium text-[var(--text-muted)]">
            Tài khoản thành viên
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsDrawerOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-colors cursor-pointer',
                    isActive
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'w-[18px] h-[18px]',
                          isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text-secondary)] text-[12px] font-medium tabular-nums">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--line)] space-y-3">
          <div className="flex items-center justify-between text-[13px] px-1">
            <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <Phone className="w-3.5 h-3.5" />
              Hỗ trợ khách hàng
            </span>
            <a href="tel:19008888" className="font-semibold text-[var(--text)] tabular-nums hover:text-[var(--accent)]">
              1900 8888
            </a>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsDrawerOpen(false);
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-[var(--radius)] border border-[var(--line)] hover:bg-[var(--status-danger-bg)] hover:border-[var(--status-danger)]/30 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--status-danger)] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất tài khoản</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div
          key={location.pathname}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-4 sm:p-6 md:p-8 min-w-0 animate-pageTransition"
        >
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};
