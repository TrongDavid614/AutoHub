import React, { useState, useMemo } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  Cpu,
  Car,
  PackageCheck,
  Building2,
  Receipt,
  TicketPercent,
  BadgeDollarSign,
  Users,
  MessageSquareCheck,
  CalendarDays,
  Search,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { AdminThemeProvider, useAdminTheme } from '@/context/AdminThemeContext';

interface NavItem {
  to: string;
  code: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    variant: 'danger' | 'warning' | 'success' | 'cyan' | 'neutral';
  };
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

const AdminLayoutContent: React.FC = () => {
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
  const navigationGroups: NavGroup[] = useMemo(
    () => [
      {
        id: 'executive',
        title: 'Điều Hành & Báo Cáo',
        items: [
          {
            to: '/admin/dashboard',
            code: 'ADM-01',
            label: 'Bảng Điều Khiển Tổng Quan',
            icon: LayoutDashboard,
          },
          {
            to: '/admin/analytics',
            code: 'ADM-02',
            label: 'Phân Tích & User Tracking',
            icon: LineChart,
            badge: { text: 'AI Insights', variant: 'cyan' },
          },
          {
            to: '/admin/system-monitor',
            code: 'ADM-03',
            label: 'Giám Sát Vận Hành & AI Engine',
            icon: Cpu,
            badge: { text: 'Live', variant: 'success' },
          },
        ],
      },
      {
        id: 'automotive-master',
        title: 'Master Data Ô Tô & Kho',
        items: [
          {
            to: '/admin/cars-master',
            code: 'ADM-04',
            label: 'Danh Mục Dòng Xe & Xe Demo',
            icon: Car,
            badge: { text: 'Vector DB', variant: 'cyan' },
          },
          {
            to: '/admin/accessories-master',
            code: 'ADM-05',
            label: 'Master Data Phụ Kiện & Kho',
            icon: PackageCheck,
            badge: { text: '3 Cảnh báo', variant: 'warning' },
          },
          {
            to: '/admin/showrooms',
            code: 'ADM-06',
            label: 'Mạng Lưới Showroom & Phân Bổ',
            icon: Building2,
          },
        ],
      },
      {
        id: 'finance-policies',
        title: 'Chính Sách & Tài Chính',
        items: [
          {
            to: '/admin/fees',
            code: 'ADM-07',
            label: 'Biểu Phí Lăn Bánh & Lãi Suất',
            icon: Receipt,
          },
          {
            to: '/admin/vouchers',
            code: 'ADM-08',
            label: 'Khuyến Mại & Mã Voucher',
            icon: TicketPercent,
          },
          {
            to: '/admin/refund-approval',
            code: 'ADM-11',
            label: 'Phê Duyệt Hoàn Cọc 72h',
            icon: BadgeDollarSign,
            badge: { text: '2 Chờ duyệt', variant: 'danger' },
          },
        ],
      },
      {
        id: 'system-governance',
        title: 'Quản Trị Hệ Thống',
        items: [
          {
            to: '/admin/users-rbac',
            code: 'ADM-09',
            label: 'Người Dùng & Phân Quyền RBAC',
            icon: Users,
          },
          {
            to: '/admin/staff-schedules',
            code: 'ADM-12',
            label: 'Phân Công Lịch Trực & Ca Làm',
            icon: CalendarDays,
            badge: { text: 'Tuần này', variant: 'cyan' },
          },
          {
            to: '/admin/reviews',
            code: 'ADM-10',
            label: 'Kiểm Duyệt Đánh Giá Phụ Kiện',
            icon: MessageSquareCheck,
            badge: { text: '12', variant: 'warning' },
          },
        ],
      },
    ],
    []
  );

  const urgentDeposits = [
    { id: '#DEP-8841', car: 'VinFast VF8 Plus AWD', timeLeft: 'Còn 04:12:30', amount: '20.000.000 ₫' },
    { id: '#DEP-8839', car: 'Hyundai SantaFe Calligraphy', timeLeft: 'Còn 05:20:10', amount: '10.000.000 ₫' },
    { id: '#DEP-8835', car: 'Honda CR-V e:HEV RS', timeLeft: 'Còn 02:45:00', amount: '10.000.000 ₫' },
    { id: '#DEP-8822', car: 'VinFast VF9 Plus 6 Chỗ', timeLeft: 'Còn 01:15:20', amount: '20.000.000 ₫' },
  ];

  return (
    <div
      className={cn(
        'min-h-screen flex font-sans antialiased transition-colors duration-300',
        isDarkMode ? 'dark bg-[#060E20] text-[#DAE2FD]' : 'bg-slate-50 text-slate-800'
      )}
    >
      {/* 1. ADMIN BACK-OFFICE SIDEBAR (Collapsible 280px <-> 72px) */}
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
          {/* Top Brand Header (Clean: Logo + Toggle button only) */}
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
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
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
                                'text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase tracking-tight flex-shrink-0 ml-1.5',
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

      {/* 2. ADMIN MAIN CONTAINER WITH STICKY REDESIGNED HEADER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top App Header Bar (Sticky on scroll, with smooth elevation) */}
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
          {/* Left: Global Quick Search Bar */}
          <div className="relative w-72 sm:w-80 md:w-96">
            <Search
              className={cn(
                'w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors',
                isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
              )}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm xe, mã VIN, mã cọc, đơn hàng... (Ctrl+K)"
              className={cn(
                'w-full pl-10 pr-16 py-2 text-xs rounded-xl transition-all duration-200 outline-none',
                isDarkMode
                  ? 'bg-[#131B2E] border border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF] focus:ring-1 focus:ring-[#89CEFF]/30'
                  : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30'
              )}
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
              <kbd
                className={cn(
                  'px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded border select-none',
                  isDarkMode
                    ? 'bg-[#171F33] text-[#88929B] border-[#3E4850]/60'
                    : 'bg-white text-slate-500 border-slate-200 shadow-2xs'
                )}
              >
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Right Action Controls */}
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
              {/* Sliding knob with icon morph */}
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

            {/* Urgent 72h Action Notifications Popover */}
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
                title="4 Phiếu cọc sắp hết hạn 72h (< 6 tiếng)"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                  4
                </span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div
                  className={cn(
                    'absolute right-0 mt-2 w-80 border rounded-xl shadow-2xl p-4 space-y-3 z-50 animate-fade-in',
                    isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850]/60'
                      : 'bg-white border-slate-200 text-slate-800'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-between border-b pb-2',
                      isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Cọc Xe 72h Sắp Quá Hạn (&lt; 6h)</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#EF4444] font-bold">4 CẦN XỬ LÝ</span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {urgentDeposits.map((dep) => (
                      <div
                        key={dep.id}
                        className={cn(
                          'p-2.5 rounded-lg border space-y-1 transition-colors',
                          isDarkMode
                            ? 'bg-[#131B2E] border-[#3E4850]/40 hover:border-[#89CEFF]/50'
                            : 'bg-slate-50 border-slate-200 hover:border-blue-400'
                        )}
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={cn('font-bold', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600')}>
                            {dep.id}
                          </span>
                          <span className="text-[#EF4444] font-bold text-[11px]">{dep.timeLeft}</span>
                        </div>
                        <div className="text-xs font-medium">{dep.car}</div>
                        <div className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                          Số tiền: {dep.amount}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={cn('pt-2 border-t text-center', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
                    <Link
                      to="/admin/refund-approval"
                      onClick={() => setShowNotifications(false)}
                      className={cn('text-xs font-semibold hover:underline', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600')}
                    >
                      Xem toàn bộ hồ sơ hoàn cọc &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ONLY AVATAR ON HEADER (NO USER TEXT) */}
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
                title={`Quản trị viên: ${user?.fullName || 'Admin'}`}
                aria-label="Tài khoản Quản trị viên"
              >
                {(user?.fullName || 'A').charAt(0).toUpperCase()}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#0B1326]" />
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
                    <div className="font-bold">{user?.fullName || 'Quản Trị Viên'}</div>
                    <div className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      {user?.email || 'admin@autohub.vn'}
                    </div>
                    <div className="mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#450A0A] text-[#FCA5A5] border border-[#DC2626]/40 font-bold">
                      ADMIN MASTER
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/admin/users-rbac"
                      onClick={() => setShowUserMenu(false)}
                      className={cn(
                        'block px-2.5 py-1.5 rounded transition-colors',
                        isDarkMode
                          ? 'hover:bg-[#131B2E] hover:text-[#89CEFF]'
                          : 'hover:bg-slate-100 hover:text-blue-600'
                      )}
                    >
                      Quản lý tài khoản & Quyền
                    </Link>
                    <Link
                      to="/cars"
                      onClick={() => setShowUserMenu(false)}
                      className={cn(
                        'block px-2.5 py-1.5 rounded transition-colors',
                        isDarkMode
                          ? 'hover:bg-[#131B2E] hover:text-[#89CEFF]'
                          : 'hover:bg-slate-100 hover:text-blue-600'
                      )}
                    >
                      Showroom khách hàng
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
                        'w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[#EF4444] transition-colors cursor-pointer text-left',
                        isDarkMode ? 'hover:bg-[#131B2E]' : 'hover:bg-red-50'
                      )}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. SCROLLABLE CONTENT BODY (Triggers sticky header elevation on scroll) */}
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

export const AdminLayout: React.FC = () => {
  return (
    <AdminThemeProvider>
      <AdminLayoutContent />
    </AdminThemeProvider>
  );
};
