import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Scale, User as UserIcon, Search, Sparkles, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { useCartStore } from '@/store/useCartStore';
import { useCompareStore } from '@/store/useCompareStore';
import { useAuthStore } from '@/store/useAuthStore';

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const totalCartCount = useCartStore((s) => s.getTotalItemsCount());
  const compareCount = useCompareStore((s) => s.selectedVariants.length);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

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
          <Link to="/test-drive" className="hover:text-[#89CEFF] transition-colors">
            Lái Thử
          </Link>
          <Link
            to="/ai-consultant"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#171F33] border border-cyan-500/40 text-[#89CEFF] hover:text-white hover:border-[#89CEFF] hover:bg-[#222A3D] transition-all text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#89CEFF]" />
            <span>Tư Vấn AI</span>
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

          {/* User Profile / Auth Link */}
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
                className="flex items-center gap-2 text-xs font-semibold text-[#DAE2FD] hover:text-[#89CEFF]"
              >
                <UserIcon className="w-4 h-4 text-[#89CEFF]" />
                <span className="max-w-[120px] truncate">{user?.fullName}</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-xs text-[#88929B] hover:text-rose-400 transition-colors"
              >
                Thoát
              </button>
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
