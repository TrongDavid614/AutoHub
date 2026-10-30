import React, { useState, useMemo } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Briefcase,
  MessageSquare,
  CalendarClock,
  ShieldCheck,
  FileText,
  Package,
  RotateCcw,
  Boxes,
  Wrench,
  UserCheck,
  Search,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  MapPin,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { AdminThemeProvider, useAdminTheme } from '@/context/AdminThemeContext';

interface StaffNavItem {
  to: string;
  code: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    variant: 'danger' | 'warning' | 'success' | 'cyan' | 'neutral';
  };
}

interface StaffNavGroup {
  id: string;
  title: string;
  items: StaffNavItem[];
}

const StaffLayoutContent: React.FC = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useAdminTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const top = e.currentTarget.scrollTop;
    if (top > 12) {
      if (!isScrolled) setIsScrolled(true);
    } else {
      if (isScrolled) setIsScrolled(false);
    }
  };

  // 4 Core Groups according to marmelab/shadcn-admin-kit & MoTa_GiaoDien_Admin_Staff_ShadcnAdminKit
  const navigationGroups: StaffNavGroup[] = useMemo(
    () => [
      {
        id: 'workspace-leads',
        title: 'Bàn Làm Việc & Khách Hàng',
        items: [
          {
            to: '/staff/workspace',
            code: 'STF-01',
            label: 'Bàn Làm Việc Showroom',
            icon: Briefcase,
            badge: { text: 'Co-Pilot', variant: 'cyan' },
          },
          {
            to: '/staff/consultations',
            code: 'STF-02',
            label: 'Tiếp Nhận Tư Vấn',
            icon: MessageSquare,
            badge: { text: '6 Lead', variant: 'warning' },
          },
        ],
      },
      {
        id: 'testdrive-deposits',
        title: 'Lái Thử & Giữ Chỗ 72 Giờ',
        items: [
          {
            to: '/staff/test-drives',
            code: 'STF-03',
            label: 'Điều Phối Lái Thử',
            icon: CalendarClock,
            badge: { text: '4 Lịch', variant: 'success' },
          },
          {
            to: '/staff/deposit-audit',
            code: 'STF-04',
            label: 'Đối Soát Cọc & Gán VIN',
            icon: ShieldCheck,
            badge: { text: '3 Phiếu', variant: 'danger' },
          },
          {
            to: '/staff/refund-dockets',
            code: 'STF-05',
            label: 'Thẩm Định Hoàn Cọc',
            icon: FileText,
          },
        ],
      },
      {
        id: 'inventory-logistics',
        title: 'Kho Hàng & Vận Chuyển',
        items: [
          {
            to: '/staff/fulfillment',
            code: 'STF-06',
            label: 'Đóng Gói Xuất Kho',
            icon: Package,
            badge: { text: '8 Đơn', variant: 'warning' },
          },
          {
            to: '/staff/returns',
            code: 'STF-07',
            label: 'Xử Lý Đổi Trả',
            icon: RotateCcw,
          },
          {
            to: '/staff/inventory-transfer',
            code: 'STF-08',
            label: 'Tra Cứu & Chuyển Kho',
            icon: Boxes,
          },
          {
            to: '/staff/fleet-maintenance',
            code: 'STF-09',
            label: 'Bảo Dưỡng Xe Demo',
            icon: Wrench,
          },
        ],
      },
      {
        id: 'personnel-shift',
        title: 'Nhân Sự & Ca Trực',
        items: [
          {
            to: '/staff/profile-handover',
            code: 'STF-10',
            label: 'Hồ Sơ & Bàn Giao Ca',
            icon: UserCheck,
          },
        ],
      },
    ],
    []
  );

  return (
    <div
      className={cn(
        'min-h-screen flex font-sans antialiased transition-colors duration-300',
        isDarkMode ? 'dark bg-[#060E20] text-[#DAE2FD]' : 'bg-slate-50 text-slate-800'
      )}
    >
      {/* 1. STAFF BACK-OFFICE SIDEBAR (Collapsible 280px <-> 72px) */}
      <aside
        className={cn(
          'border-r flex flex-col justify-between transition-all duration-300 z-30 select-none flex-shrink-0 sticky top-0 h-screen',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 text-[#DAE2FD]'
            : 'bg-white border-slate-200 text-slate-700 shadow-xs',
          isCollapsed ? 'w-20' : 'w-72'
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Brand Header */}
          <div
            className={cn(
              'p-4 border-b flex items-center justify-between',
              isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200'
            )}
          >
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Logo variant={isCollapsed ? 'icon-only' : 'horizontal'} size="sm" />
            </Link>
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                'w-7 h-7 rounded-md border flex items-center justify-center transition-colors cursor-pointer',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/50 hover:bg-[#171F33] text-[#88929B] hover:text-[#89CEFF]'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              )}
              title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Grouped Navigation Links Area */}
          <div className="flex-1 overflow-y-auto px-3 pt-4 pb-16 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
            {navigationGroups.map((group) => (
              <div key={group.id} className="space-y-1">
                {!isCollapsed && (
                  <div
                    className={cn(
                      'px-2.5 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider',
                      isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                    )}
                  >
                    {group.title}
                  </div>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group relative',
                          isActive
                            ? isDarkMode
                              ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30 font-semibold shadow-sm'
                              : 'bg-blue-50 text-blue-600 border border-blue-200 font-semibold shadow-xs'
                            : isDarkMode
                            ? 'text-[#88929B] hover:text-[#DAE2FD] hover:bg-[#131B2E]'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        )
                      }
                      title={isCollapsed ? `${item.code} - ${item.label}` : undefined}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105" />
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                'text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-tight flex-shrink-0 ml-1.5',
                                item.badge.variant === 'danger' &&
                                  (isDarkMode
                                    ? 'bg-[#450A0A] text-[#FCA5A5] border border-[#DC2626]/40'
                                    : 'bg-red-50 text-red-600 border border-red-200'),
                                item.badge.variant === 'warning' &&
                                  (isDarkMode
                                    ? 'bg-[#78350F]/50 text-[#FDE68A] border border-[#D97706]/40'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'),
                                item.badge.variant === 'success' &&
                                  (isDarkMode
                                    ? 'bg-[#0D2818] text-[#10B981] border border-[#10B981]/40'
                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'),
                                item.badge.variant === 'cyan' &&
                                  (isDarkMode
                                    ? 'bg-[#0F2942] text-[#89CEFF] border border-[#0284C7]/40'
                                    : 'bg-sky-50 text-sky-600 border border-sky-200'),
                                item.badge.variant === 'neutral' &&
                                  (isDarkMode ? 'bg-[#1E293B] text-[#94A3B8]' : 'bg-slate-100 text-slate-600')
                              )}
                            >
                              {item.badge.text}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tooltip on Collapsed Mode */}
                      {isCollapsed && (
                        <div
                          className={cn(
                            'absolute left-full ml-2 px-2.5 py-1.5 border rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50',
                            isDarkMode
                              ? 'bg-[#131B2E] border-[#3E4850]/80 text-white'
                              : 'bg-white border-slate-200 text-slate-800'
                          )}
                        >
                          <div className={cn('font-mono text-[10px]', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600')}>
                            {item.code}
                          </div>
                          <div>{item.label}</div>
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. STAFF MAIN CONTAINER WITH STICKY HEADER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top App Header Bar */}
        <header
          className={cn(
            'sticky top-0 h-16 px-6 flex items-center justify-between flex-shrink-0 z-30 transition-all duration-300',
            isDarkMode
              ? 'bg-[#0B1326]/95 border-b border-[#3E4850]/40'
              : 'bg-white/95 border-b border-slate-200',
            isScrolled &&
              (isDarkMode
                ? 'shadow-lg shadow-black/50 border-[#89CEFF]/20 backdrop-blur-md bg-[#0B1326]/90'
                : 'shadow-md shadow-slate-200/80 backdrop-blur-md bg-white/90')
          )}
        >
          {/* Left: Showroom Location Tag & Quick Search */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-[#89CEFF]'
                  : 'bg-sky-50 border-sky-200 text-sky-700'
              )}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Showroom Sài Gòn Central - Q.7</span>
            </div>

            <div className="relative w-64 md:w-80">
              <Search
                className={cn(
                  'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors',
                  isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                )}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm khách, mã cọc, số VIN... (Ctrl+K)"
                className={cn(
                  'w-full pl-9 pr-14 py-1.5 text-xs rounded-xl transition-all duration-200 outline-none',
                  isDarkMode
                    ? 'bg-[#131B2E] border border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                    : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                )}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <kbd
                  className={cn(
                    'px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded border select-none',
                    isDarkMode
                      ? 'bg-[#171F33] text-[#88929B] border-[#3E4850]/60'
                      : 'bg-white text-slate-500 border-slate-200 shadow-2xs'
                  )}
                >
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Animated Smooth Dark / Light Theme Toggle Switch */}
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                'relative w-14 h-8 rounded-full p-1 transition-all duration-500 ease-in-out cursor-pointer focus:outline-none shadow-inner flex items-center',
                isDarkMode
                  ? 'bg-[#131B2E] border border-[#3E4850]/70'
                  : 'bg-slate-200 border border-slate-300'
              )}
              title={isDarkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
              aria-label="Toggle Dark/Light Mode"
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 transform shadow-md',
                  isDarkMode
                    ? 'translate-x-6 bg-[#171F33] text-[#89CEFF] rotate-0'
                    : 'translate-x-0 bg-white text-amber-500 rotate-180'
                )}
              >
                {isDarkMode ? (
                  <Moon className="w-3.5 h-3.5 transition-transform duration-500 rotate-0" />
                ) : (
                  <Sun className="w-3.5 h-3.5 transition-transform duration-500 rotate-180" />
                )}
              </div>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className={cn(
                  'relative p-2 rounded-xl border transition-colors cursor-pointer',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-[#88929B] hover:text-[#89CEFF] hover:bg-[#171F33]'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-200'
                )}
                title="Thông báo nhiệm vụ ca trực"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                  4
                </span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div
                  className={cn(
                    'absolute right-0 mt-2 w-80 border rounded-xl shadow-2xl p-4 space-y-3 z-50 animate-fade-in text-xs',
                    isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850]/60 text-white'
                      : 'bg-white border-slate-200 text-slate-800'
                  )}
                >
                  <div className={cn('flex items-center justify-between pb-2 border-b', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-100')}>
                    <span className="font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Nhiệm Vụ Ca Trực Cần Xử Lý
                    </span>
                    <span className="text-[10px] font-mono text-red-500 font-bold">4 MỤC</span>
                  </div>
                  <div className="space-y-2">
                    <div className={cn('p-2.5 rounded-lg border', isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200')}>
                      <div className="font-semibold text-blue-500">Phiếu cọc #DEP-8835 sắp hết 72h</div>
                      <div className={cn('text-[11px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>Còn 6 tiếng đếm ngược, cần gán số VIN</div>
                    </div>
                    <div className={cn('p-2.5 rounded-lg border', isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200')}>
                      <div className="font-semibold text-emerald-500">Lịch lái thử 09:30 sáng nay</div>
                      <div className={cn('text-[11px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>Khách Trần Hoàng Nam - VinFast VF8</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ONLY AVATAR TRIGGER */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 cursor-pointer shadow-sm relative focus:outline-none',
                  isDarkMode
                    ? 'bg-gradient-to-tr from-[#0284C7] to-[#89CEFF] text-[#060E20] border border-[#89CEFF]/50 hover:scale-105'
                    : 'bg-gradient-to-tr from-blue-600 to-sky-400 text-white border border-blue-300 hover:scale-105'
                )}
                title={`Nhân viên: ${user?.fullName || 'Staff'}`}
                aria-label="Tài khoản Nhân viên Showroom"
              >
                {(user?.fullName || 'S').charAt(0).toUpperCase()}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0B1326]" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div
                  className={cn(
                    'absolute right-0 mt-2 w-56 border rounded-xl shadow-2xl p-3 space-y-2 z-50 animate-fade-in text-xs',
                    isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850]/60 text-[#DAE2FD]'
                      : 'bg-white border-slate-200 text-slate-800'
                  )}
                >
                  <div className={cn('border-b pb-2', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
                    <div className="font-bold">{user?.fullName || 'Nguyễn Văn Tuấn'}</div>
                    <div className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      {user?.email || 'tuan.nguyen@autohub.vn'}
                    </div>
                    <div className="mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-950/80 text-blue-300 border border-blue-800/40 font-bold">
                      STAFF OPERATIONS
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/staff/profile-handover"
                      onClick={() => setShowUserMenu(false)}
                      className={cn(
                        'block px-2.5 py-1.5 rounded transition-colors',
                        isDarkMode ? 'hover:bg-[#131B2E] hover:text-[#89CEFF]' : 'hover:bg-slate-100 hover:text-blue-600'
                      )}
                    >
                      Hồ sơ cá nhân & Bàn giao ca
                    </Link>
                    <Link
                      to="/cars"
                      onClick={() => setShowUserMenu(false)}
                      className={cn(
                        'block px-2.5 py-1.5 rounded transition-colors',
                        isDarkMode ? 'hover:bg-[#131B2E] hover:text-[#89CEFF]' : 'hover:bg-slate-100 hover:text-blue-600'
                      )}
                    >
                      Xem Showroom Khách
                    </Link>
                  </div>

                  <div className={cn('border-t pt-2', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        navigate('/auth/login');
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-red-500 transition-colors cursor-pointer text-left',
                        isDarkMode ? 'hover:bg-[#131B2E]' : 'hover:bg-red-50'
                      )}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất Staff</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. SCROLLABLE CONTENT BODY */}
        <main
          onScroll={handleScroll}
          className={cn(
            'flex-1 p-6 lg:p-8 overflow-y-auto transition-colors duration-300',
            isDarkMode ? 'bg-[#060E20]' : 'bg-slate-50'
          )}
        >
          <div key={pathname} className="animate-pageTransition w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export const StaffLayout: React.FC = () => {
  return (
    <AdminThemeProvider>
      <StaffLayoutContent />
    </AdminThemeProvider>
  );
};
