import React, { useState, useMemo, useEffect } from 'react';
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
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Logo } from '@/components/Logo';
import { cn, formatCurrencyVND } from '@/lib/utils';
import { AdminThemeProvider, useAdminTheme } from '@/context/AdminThemeContext';
import { adminDashboardService } from '@/features/admin-portal/services/admin-dashboard.service';
import type { UrgentDeposit } from '@/types/admin-dashboard.types';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

const formatCountdownShort = (seconds: number): string => {
  if (seconds <= 0) return 'Đã quá hạn';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `Còn ${h}g ${m}p`;
};

const AdminLayoutContent: React.FC = () => {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useAdminTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [urgentDeposits, setUrgentDeposits] = useState<UrgentDeposit[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    adminDashboardService
      .getDashboardOverview(controller.signal)
      .then((overview) => {
        if (overview?.urgentDeposits) {
          setUrgentDeposits(overview.urgentDeposits);
        }
      })
      .catch(() => {
        // Leave empty honestly when overview endpoint fails
      });
    return () => controller.abort();
  }, []);

  const navigationGroups: NavGroup[] = useMemo(
    () => [
      {
        id: 'executive',
        title: 'Điều hành & báo cáo',
        items: [
          {
            to: '/admin/dashboard',
            label: 'Tổng quan điều hành',
            icon: LayoutDashboard,
          },
          {
            to: '/admin/analytics',
            label: 'Phân tích & hành vi',
            icon: LineChart,
          },
          {
            to: '/admin/system-monitor',
            label: 'Giám sát hệ thống',
            icon: Cpu,
          },
        ],
      },
      {
        id: 'automotive-master',
        title: 'Danh mục xe & showroom',
        items: [
          {
            to: '/admin/cars-master',
            label: 'Dòng xe & xe lái thử',
            icon: Car,
          },
          {
            to: '/admin/accessories-master',
            label: 'Phụ kiện & tồn kho',
            icon: PackageCheck,
          },
          {
            to: '/admin/showrooms',
            label: 'Mạng lưới showroom',
            icon: Building2,
          },
        ],
      },
      {
        id: 'finance-policies',
        title: 'Tài chính & chính sách',
        items: [
          {
            to: '/admin/fees',
            label: 'Biểu phí & lãi suất',
            icon: Receipt,
          },
          {
            to: '/admin/vouchers',
            label: 'Khuyến mại & mã giảm giá',
            icon: TicketPercent,
          },
          {
            to: '/admin/refund-approval',
            label: 'Phê duyệt hoàn cọc 72h',
            icon: BadgeDollarSign,
          },
        ],
      },
      {
        id: 'system-governance',
        title: 'Quản trị hệ thống',
        items: [
          {
            to: '/admin/users-rbac',
            label: 'Người dùng & phân quyền',
            icon: Users,
          },
          {
            to: '/admin/staff-schedules',
            label: 'Lịch trực & ca làm',
            icon: CalendarDays,
          },
          {
            to: '/admin/reviews',
            label: 'Kiểm duyệt đánh giá',
            icon: MessageSquareCheck,
          },
        ],
      },
    ],
    []
  );

  return (
    <div className="min-h-screen flex font-sans antialiased bg-[var(--bg)] text-[var(--text)]">
      {/* Admin Sidebar */}
      <aside
        className={cn(
          'border-r border-[var(--line)] bg-[var(--surface)] flex flex-col justify-between transition-all duration-200 z-30 select-none flex-shrink-0 sticky top-0 h-screen',
          isCollapsed ? 'w-20' : 'w-68'
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4 h-16 border-b border-[var(--line)] flex items-center justify-between">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <Logo variant={isCollapsed ? 'icon-only' : 'horizontal'} size="sm" />
            </Link>
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-8 h-8 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-subtle)] hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] flex items-center justify-center transition-colors cursor-pointer"
              title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
              aria-label={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
            {navigationGroups.map((group) => (
              <div key={group.id} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-2.5 pb-1 text-[12px] font-medium text-[var(--text-muted)]">
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
                          'flex items-center gap-3 px-2.5 py-2 rounded-[var(--radius-sm)] text-[13px] font-medium transition-colors group relative',
                          isActive
                            ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)]'
                        )
                      }
                      title={isCollapsed ? item.label : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={cn(
                              'w-4 h-4 flex-shrink-0',
                              isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text)]'
                            )}
                          />
                          {!isCollapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="sticky top-0 h-16 px-6 bg-[var(--surface)] border-b border-[var(--line)] flex items-center justify-between flex-shrink-0 z-30">
          <div className="relative w-72 sm:w-80 md:w-96">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm xe, số VIN, mã cọc, đơn hàng..."
              className="w-full pl-9 pr-4 py-1.5 text-[13px] rounded-[var(--radius)] bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] flex items-center justify-center transition-colors cursor-pointer"
              title={isDarkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
              aria-label="Đổi giao diện sáng/tối"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative w-9 h-9 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] flex items-center justify-center transition-colors cursor-pointer"
                title="Phiếu cọc cần theo dõi"
                aria-label="Thông báo cọc xe"
              >
                <Bell className="w-4 h-4" />
                {urgentDeposits.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--status-danger)] text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
                    {urgentDeposits.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] shadow-lg p-4 space-y-3 z-50 text-[13px] animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                    <span className="font-semibold text-[var(--text)]">Phiếu cọc 72h sắp hết hạn</span>
                    <span className="text-[12px] text-[var(--text-muted)] tabular-nums">
                      {urgentDeposits.length} phiếu
                    </span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {urgentDeposits.length > 0 ? (
                      urgentDeposits.map((dep) => (
                        <div
                          key={dep.id}
                          className="p-2.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-1"
                        >
                          <div className="flex items-center justify-between text-[13px]">
                            <span className="font-semibold text-[var(--accent)] tabular-nums">{dep.depositCode}</span>
                            <span className="text-[var(--status-danger)] font-medium text-[12px] tabular-nums">
                              {formatCountdownShort(dep.remainingSeconds)}
                            </span>
                          </div>
                          <div className="text-[13px] font-medium text-[var(--text)]">{dep.carModel}</div>
                          <div className="text-[12px] text-[var(--text-muted)] tabular-nums">
                            {formatCurrencyVND(dep.depositAmount)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[13px] text-[var(--text-muted)] text-center py-3">
                        Hiện không có phiếu cọc nào sắp hết hạn.
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[var(--line)] text-center">
                    <Link
                      to="/admin/refund-approval"
                      onClick={() => setShowNotifications(false)}
                      className="text-[13px] font-medium text-[var(--accent)] hover:underline"
                    >
                      Xem hồ sơ hoàn cọc
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--line)] cursor-pointer"
                title={`Quản trị viên: ${user?.fullName || 'Admin'}`}
                aria-label="Tài khoản quản trị viên"
              >
                {(user?.fullName || 'A').charAt(0).toUpperCase()}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] shadow-lg p-3 space-y-2 z-50 text-[13px] animate-fadeIn">
                  <div className="border-b border-[var(--line)] pb-2">
                    <div className="font-semibold text-[var(--text)]">{user?.fullName || 'Quản trị viên'}</div>
                    <div className="text-[12px] text-[var(--text-muted)] truncate">
                      {user?.email || 'admin@autohub.vn'}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/admin/users-rbac"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-2.5 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                    >
                      Quản lý tài khoản & quyền
                    </Link>
                    <Link
                      to="/cars"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-2.5 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                    >
                      Xem showroom khách hàng
                    </Link>
                  </div>

                  <div className="border-t border-[var(--line)] pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        navigate('/admin/login');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-[var(--status-danger)] hover:bg-[var(--status-danger-bg)] transition-colors cursor-pointer text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[var(--bg)]">
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
