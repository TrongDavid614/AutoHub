import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Scale,
  User as UserIcon,
  Search,
  Phone,
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

  // Close dropdown when clicking outside
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
        'sticky top-0 z-40 bg-[#131B2E] text-white shadow-xl border-b border-[#3E4850]/50 transition-colors',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link to="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
          <Logo size="md" />
        </Link>

        {/* Quick Search */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <Search className="w-4 h-4 text-[#88929B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm dòng xe, phụ kiện chính hãng..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#0B1326] border border-[#3E4850]/60 rounded-full text-xs text-[#DAE2FD] placeholder-[#88929B] focus:outline-none focus:border-[#89CEFF] focus:ring-1 focus:ring-[#89CEFF] transition-all"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-[#BEC8D2]">
          <Link to="/cars" className="hover:text-[#89CEFF] transition-colors">
            Dòng Xe
          </Link>
          <Link to="/accessories" className="hover:text-[#89CEFF] transition-colors">
            Phụ Kiện
          </Link>
        </nav>

        {/* Action Icons & Hotline */}
        <div className="flex items-center gap-4">
          {/* Hotline Tag matching Figma */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-[2px] border border-[#3E4850]/60 bg-[#222A3D] text-[11px] font-mono">
            <Phone className="w-3 h-3 text-[#89CEFF]" />
            <span className="text-[#89CEFF] font-bold">HOTLINE:</span>
            <span className="text-[#DAE2FD] font-bold">1900 8888</span>
          </div>

          {/* Compare Car Bar */}
          <Link
            to="/car-comparison"
            className="relative p-2 text-[#BEC8D2] hover:text-[#89CEFF] hover:bg-[#222A3D] rounded-full transition-colors"
            title="So sánh xe"
          >
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Shopping Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-[#BEC8D2] hover:text-[#89CEFF] hover:bg-[#222A3D] rounded-full transition-colors"
            title="Giỏ hàng phụ kiện"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0EA5E9] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* User Profile Trigger (Icon-only like Admin) */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 cursor-pointer shadow-sm relative focus:outline-none bg-gradient-to-tr from-[#0284C7] to-[#89CEFF] text-[#060E20] border border-[#89CEFF]/50 hover:scale-105"
                title={`Tài khoản: ${user?.fullName || 'Người dùng'}`}
                aria-label="Tài khoản cá nhân"
              >
                <UserIcon className="w-4 h-4 text-[#060E20]" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#131B2E]" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 border border-[#3E4850]/60 rounded-xl shadow-2xl p-3 space-y-2 z-50 bg-[#0B1326] text-[#DAE2FD] text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  <div className="border-b border-[#3E4850]/40 pb-2.5">
                    <div className="font-bold text-white text-sm">{user?.fullName || 'Khách Hàng'}</div>
                    <div className="text-[11px] font-mono text-[#88929B] truncate">
                      {user?.email || 'customer@autohub.vn'}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {user?.role === 'ROLE_ADMIN' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                          ADMIN MASTER
                        </span>
                      ) : user?.role === 'ROLE_STAFF' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                          STAFF SHOWROOM
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold">
                          THÀNH VIÊN AUTOHUB
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="space-y-1 py-1">
                    {/* Management link if admin or staff */}
                    {user?.role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#171F33] text-rose-400 font-semibold transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5" />
                          Trang Quản Trị Admin
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </Link>
                    )}

                    {user?.role === 'ROLE_STAFF' && (
                      <Link
                        to="/staff"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#171F33] text-amber-400 font-semibold transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5" />
                          Bàn Vận Hành Showroom
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </Link>
                    )}

                    <Link
                      to="/customer/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#171F33] text-[#BEC8D2] hover:text-white transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#89CEFF]" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>

                    <Link
                      to="/customer/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#171F33] text-[#BEC8D2] hover:text-white transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#89CEFF]" />
                      <span>Đơn hàng phụ kiện</span>
                    </Link>

                    <Link
                      to="/customer/deposits"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#171F33] text-[#BEC8D2] hover:text-white transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#89CEFF]" />
                      <span>Phiếu cọc xe 72h</span>
                    </Link>

                    <Link
                      to="/customer/test-drives"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#171F33] text-[#BEC8D2] hover:text-white transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#89CEFF]" />
                      <span>Lịch hẹn lái thử</span>
                    </Link>

                    <Link
                      to="/customer/addresses"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#171F33] text-[#BEC8D2] hover:text-white transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#89CEFF]" />
                      <span>Sổ địa chỉ nhận hàng</span>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-[#3E4850]/40 pt-1.5">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-950/30 text-rose-400 font-semibold transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="px-4 py-1.5 bg-[#89CEFF] hover:bg-[#89CEFF]/90 text-[#00344D] text-xs font-bold rounded-[2px] shadow-sm transition-all"
            >
              Đăng Nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
