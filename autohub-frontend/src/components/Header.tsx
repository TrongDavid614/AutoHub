import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Scale,
  User as UserIcon,
  LogOut,
  FileText,
  Calendar,
  MapPin,
  Shield,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { useCartStore } from '@/store/useCartStore';
import { useCompareStore } from '@/store/useCompareStore';
import { useAuthStore } from '@/store/useAuthStore';

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const totalCartCount = useCartStore((s) => s.getTotalItemsCount());
  const compareCount = useCompareStore((s) => s.selectedVariants.length);
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-[var(--surface)] text-[var(--text)] border-b border-[var(--line)]',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-6 sm:gap-8 min-w-0">
          {/* 1. Brand Logo */}
          <Link to="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* 2. Two primary navigation links */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <NavLink
              to="/cars"
              className={({ isActive }) =>
                cn(
                  'py-1 transition-colors',
                  isActive ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                )
              }
            >
              Dòng xe
            </NavLink>
            <NavLink
              to="/accessories"
              className={({ isActive }) =>
                cn(
                  'py-1 transition-colors',
                  isActive ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                )
              }
            >
              Phụ kiện
            </NavLink>
          </nav>
        </div>

        {/* 4. Actions: Compare, Cart, Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/car-comparison"
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)] rounded-[var(--radius)] transition-colors"
            title="So sánh xe"
            aria-label="So sánh xe"
          >
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[var(--accent)] text-[var(--accent-contrast)] text-[11px] font-semibold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center tabular-nums">
                {compareCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)] rounded-[var(--radius)] transition-colors"
            title="Giỏ hàng phụ kiện"
            aria-label="Giỏ hàng phụ kiện"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[var(--accent)] text-[var(--accent-contrast)] text-[11px] font-semibold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center tabular-nums">
                {totalCartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[var(--radius)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                title={`Tài khoản: ${user?.fullName || 'Người dùng'}`}
                aria-label="Tài khoản cá nhân"
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--line)]">
                  {(user?.fullName || 'A').charAt(0).toUpperCase()}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 border border-[var(--line)] rounded-[var(--radius)] shadow-lg p-3 space-y-2 z-50 bg-[var(--surface)] text-[var(--text)] text-[13px] animate-fadeIn">
                  <div className="border-b border-[var(--line)] pb-2.5">
                    <div className="font-semibold text-[var(--text)] text-sm">{user?.fullName || 'Khách hàng'}</div>
                    <div className="text-[13px] text-[var(--text-muted)] truncate">
                      {user?.email || 'customer@autohub.vn'}
                    </div>
                    <div className="mt-1.5">
                      <span className="inline-block px-2 py-0.5 rounded-[var(--radius-sm)] text-[12px] font-medium bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--line)]">
                        {user?.role === 'ROLE_ADMIN'
                          ? 'Quản trị viên'
                          : user?.role === 'ROLE_STAFF'
                          ? 'Nhân viên showroom'
                          : 'Thành viên AutoHub'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0.5 py-1">
                    {user?.role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center justify-between px-2.5 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] text-[var(--accent)] font-medium transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Cổng quản trị
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                      </Link>
                    )}

                    {(user?.role === 'ROLE_STAFF' || user?.role === 'ROLE_ADMIN') && (
                      <Link
                        to="/staff"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center justify-between px-2.5 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] text-[var(--text)] font-medium transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[var(--text-muted)]" />
                          Bàn làm việc showroom
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                      </Link>
                    )}

                    <Link
                      to="/customer/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>

                    <Link
                      to="/customer/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Đơn hàng phụ kiện</span>
                    </Link>

                    <Link
                      to="/customer/deposits"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                    >
                      <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Phiếu cọc xe 72 giờ</span>
                    </Link>

                    <Link
                      to="/customer/test-drives"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Lịch hẹn lái thử</span>
                    </Link>

                    <Link
                      to="/customer/addresses"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Sổ địa chỉ</span>
                    </Link>
                  </div>

                  <div className="border-t border-[var(--line)] pt-1.5">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--status-danger-bg)] text-[var(--status-danger)] font-medium transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="px-4 py-2 min-h-[40px] inline-flex items-center justify-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-contrast)] text-sm font-medium rounded-[var(--radius)] transition-colors"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
