import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
  Search,
  X,
  Car,
  Package,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { cn, formatCurrencyVND, matchesSearchTerms } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { useCartStore } from '@/store/useCartStore';
import { useCompareStore } from '@/store/useCompareStore';
import { useAuthStore } from '@/store/useAuthStore';
import { carService } from '@/features/customer/services/car.service';
import { accessoryService } from '@/features/customer/services/accessory.service';
import type { MockCar } from '@/types/car.types';
import type { Accessory } from '@/types/accessory.types';

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const urlSearchParam = searchParams.get('search') || '';

  const totalCartCount = useCartStore((s) => s.getTotalItemsCount());
  const compareCount = useCompareStore((s) => s.selectedVariants.length);
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Quick search state (draft synced automatically with URL without setState-in-effect)
  const urlContextKey = `${pathname}::${urlSearchParam}`;
  const [searchDraft, setSearchDraft] = useState<{ contextKey: string; value: string } | null>(null);
  const searchQuery = searchDraft?.contextKey === urlContextKey ? searchDraft.value : urlSearchParam;
  const setSearchQuery = (value: string) => {
    setSearchDraft({ contextKey: urlContextKey, value });
  };
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoadingSearchData, setIsLoadingSearchData] = useState<boolean>(false);
  const [hasLoadedCatalog, setHasLoadedCatalog] = useState<boolean>(false);
  const [carsCatalog, setCarsCatalog] = useState<MockCar[]>([]);
  const [accessoriesCatalog, setAccessoriesCatalog] = useState<Accessory[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const ensureSearchCatalogLoaded = useCallback(async () => {
    if (hasLoadedCatalog || isLoadingSearchData) return;
    setIsLoadingSearchData(true);
    try {
      const [cars, accessories] = await Promise.all([
        carService.getAllCars(),
        accessoryService.getAccessories(),
      ]);
      setCarsCatalog(cars || []);
      setAccessoriesCatalog(accessories || []);
      setHasLoadedCatalog(true);
    } catch {
      setCarsCatalog([]);
    } finally {
      setIsLoadingSearchData(false);
    }
  }, [hasLoadedCatalog, isLoadingSearchData]);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const matchedCars = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return [];
    return carsCatalog.filter((car) =>
      matchesSearchTerms(trimmed, car.name, car.subtitle, car.segment, car.powertrain, car.seats)
    );
  }, [carsCatalog, searchQuery]);

  const matchedAccessories = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return [];
    return accessoriesCatalog.filter((acc) =>
      matchesSearchTerms(trimmed, acc.name, acc.brand, acc.categoryName, acc.sku, acc.description)
    );
  }, [accessoriesCatalog, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!hasLoadedCatalog) {
      void ensureSearchCatalogLoaded();
    }
    setIsSearchOpen(value.trim().length > 0);

    // Real-time filtering when already on catalog pages
    if (pathname === '/cars' || pathname === '/accessories') {
      const nextParams = new URLSearchParams(searchParams);
      if (value.trim()) {
        nextParams.set('search', value);
      } else {
        nextParams.delete('search');
      }
      const nextSearch = nextParams.toString();
      navigate(nextSearch ? `${pathname}?${nextSearch}` : pathname, { replace: true });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
    if (pathname === '/cars' || pathname === '/accessories') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('search');
      const nextSearch = nextParams.toString();
      navigate(nextSearch ? `${pathname}?${nextSearch}` : pathname, { replace: true });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setIsSearchOpen(false);

    if (!trimmed) {
      if (pathname === '/cars' || pathname === '/accessories') {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('search');
        const nextSearch = nextParams.toString();
        navigate(nextSearch ? `${pathname}?${nextSearch}` : pathname);
      } else {
        navigate('/cars');
      }
      return;
    }

    const encoded = encodeURIComponent(trimmed);
    if (pathname.startsWith('/accessories')) {
      navigate(`/accessories?search=${encoded}`);
    } else if (matchedCars.length === 0 && matchedAccessories.length > 0 && pathname !== '/cars') {
      navigate(`/accessories?search=${encoded}`);
    } else {
      navigate(`/cars?search=${encoded}`);
    }
  };

  const handleSelectSuggestion = (to: string) => {
    setIsSearchOpen(false);
    navigate(to);
  };

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

        {/* 3. Quick Search */}
        <div ref={searchContainerRef} className="flex-1 max-w-md relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                void ensureSearchCatalogLoaded();
                if (searchQuery.trim().length > 0) {
                  setIsSearchOpen(true);
                }
              }}
              placeholder="Tìm kiếm dòng xe, phụ kiện chính hãng..."
              className="w-full pl-9 pr-8 py-1.5 bg-[var(--surface-subtle)] border border-[var(--line)] rounded-[var(--radius)] text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Xóa từ khóa tìm kiếm"
                className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Search Autocomplete Dropdown */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] shadow-xl overflow-hidden z-50 text-xs">
              {isLoadingSearchData && !hasLoadedCatalog ? (
                <div className="p-4 flex items-center justify-center gap-2 text-[var(--text-muted)]">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
                  <span>Đang tìm kiếm dữ liệu Showroom...</span>
                </div>
              ) : matchedCars.length === 0 && matchedAccessories.length === 0 ? (
                <div className="p-4 text-center space-y-1">
                  <p className="text-[var(--text)] font-medium">
                    Không tìm thấy kết quả cho &ldquo;{searchQuery.trim()}&rdquo;
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Thử tìm theo tên xe (GT-e, VF8, SantaFe, Everest...) hoặc phụ kiện (sạc, thảm, camera...).
                  </p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto divide-y divide-[var(--line)]">
                  {matchedCars.length > 0 && (
                    <div className="p-2 space-y-1">
                      <div className="px-2 py-1 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                        <span className="flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5" />
                          Dòng Xe Showroom ({matchedCars.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectSuggestion(`/cars?search=${encodeURIComponent(searchQuery.trim())}`)}
                          className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer normal-case font-sans font-semibold"
                        >
                          Xem tất cả <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      {matchedCars.slice(0, 5).map((car) => (
                        <button
                          key={`search-car-${car.id}`}
                          type="button"
                          onClick={() => handleSelectSuggestion(`/cars/${car.id}`)}
                          className="w-full flex items-center justify-between gap-3 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={car.image}
                              alt={car.name}
                              className="w-12 h-8 object-cover rounded-[var(--radius-sm)] border border-[var(--line)] flex-shrink-0 bg-[var(--surface-subtle)]"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-[var(--text)] truncate">{car.name}</div>
                              <div className="text-[10px] text-[var(--text-muted)] truncate">
                                {car.segment} • {car.powertrain}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-[var(--accent)] text-[11px] flex-shrink-0">
                            {formatCurrencyVND(car.listedPrice)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {matchedAccessories.length > 0 && (
                    <div className="p-2 space-y-1">
                      <div className="px-2 py-1 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          Phụ Kiện Chính Hãng ({matchedAccessories.length})
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectSuggestion(`/accessories?search=${encodeURIComponent(searchQuery.trim())}`)
                          }
                          className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer normal-case font-sans font-semibold"
                        >
                          Xem tất cả <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      {matchedAccessories.slice(0, 5).map((acc) => (
                        <button
                          key={`search-acc-${acc.id}`}
                          type="button"
                          onClick={() => handleSelectSuggestion(`/accessories/${acc.id}`)}
                          className="w-full flex items-center justify-between gap-3 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={acc.thumbnailUrl || acc.images?.[0] || ''}
                              alt={acc.name}
                              className="w-10 h-8 object-cover rounded-[var(--radius-sm)] border border-[var(--line)] flex-shrink-0 bg-[var(--surface-subtle)]"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-[var(--text)] truncate">{acc.name}</div>
                              <div className="text-[10px] text-[var(--text-muted)] truncate">
                                {acc.categoryName} • {acc.brand}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[11px] flex-shrink-0">
                            {formatCurrencyVND(acc.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName || 'User'}
                    className="w-8 h-8 rounded-full object-cover border border-[var(--line)] shadow-sm"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--line)]">
                    {(user?.fullName || 'A').charAt(0).toUpperCase()}
                  </span>
                )}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 border border-[var(--line)] rounded-[var(--radius)] shadow-lg p-3 space-y-2 z-50 bg-[var(--surface)] text-[var(--text)] text-[13px] animate-fadeIn">
                  <div className="border-b border-[var(--line)] pb-2.5 flex items-center gap-3">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName || 'User'}
                        className="w-10 h-10 rounded-full object-cover border border-red-500/30 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--line)] flex items-center justify-center font-bold text-sm shrink-0">
                        {(user?.fullName || 'A').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[var(--text)] text-sm truncate">{user?.fullName || 'Khách hàng'}</div>
                      <div className="text-[12px] text-[var(--text-muted)] truncate">
                        {user?.email || 'customer@autohub.vn'}
                      </div>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 rounded-[var(--radius-sm)] text-[11px] font-medium bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--line)]">
                          {user?.role === 'ROLE_ADMIN'
                            ? 'Quản trị viên'
                            : user?.role === 'ROLE_STAFF'
                            ? 'Nhân viên showroom'
                            : 'Thành viên AutoHub'}
                        </span>
                      </div>
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
