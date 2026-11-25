import React, { useState, useMemo, useEffect } from 'react';
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
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { AdminThemeProvider, useAdminTheme } from '@/context/AdminThemeContext';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { WorkspaceMetricsResponse } from '@/types/staff.types';

interface StaffNavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

interface StaffNavGroup {
  id: string;
  title: string;
  items: StaffNavItem[];
}

const StaffLayoutContent: React.FC = () => {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useAdminTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaceData, setWorkspaceData] = useState<WorkspaceMetricsResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    staffService
      .getWorkspaceMetrics()
      .then((res) => {
        if (isMounted) setWorkspaceData(res);
      })
      .catch(() => {
        // Keep sidebar clean with no fake fallback numbers
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const counts = workspaceData?.sidebarCounts;

  const navigationGroups: StaffNavGroup[] = useMemo(
    () => [
      {
        id: 'workspace-leads',
        title: 'Bàn làm việc & khách hàng',
        items: [
          {
            to: '/staff/workspace',
            label: 'Bàn làm việc showroom',
            icon: Briefcase,
          },
          {
            to: '/staff/consultations',
            label: 'Tiếp nhận tư vấn',
            icon: MessageSquare,
            badgeCount: counts?.totalLeads,
          },
        ],
      },
      {
        id: 'testdrive-deposits',
        title: 'Lái thử & đặt cọc 72h',
        items: [
          {
            to: '/staff/test-drives',
            label: 'Điều phối lái thử',
            icon: CalendarClock,
            badgeCount: counts?.totalTestDrives,
          },
          {
            to: '/staff/deposit-audit',
            label: 'Đối soát cọc & gán VIN',
            icon: ShieldCheck,
            badgeCount: counts?.totalDeposits,
          },
          {
            to: '/staff/refund-dockets',
            label: 'Thẩm định hoàn cọc',
            icon: FileText,
            badgeCount: counts?.pendingRefunds,
          },
        ],
      },
      {
        id: 'inventory-logistics',
        title: 'Kho hàng & vận chuyển',
        items: [
          {
            to: '/staff/fulfillment',
            label: 'Đóng gói xuất kho',
            icon: Package,
            badgeCount: counts?.pendingOrders,
          },
          {
            to: '/staff/returns',
            label: 'Xử lý đổi trả',
            icon: RotateCcw,
          },
          {
            to: '/staff/inventory-transfer',
            label: 'Tra cứu & chuyển kho',
            icon: Boxes,
          },
          {
            to: '/staff/fleet-maintenance',
            label: 'Bảo dưỡng xe lái thử',
            icon: Wrench,
          },
        ],
      },
      {
        id: 'personnel-shift',
        title: 'Nhân sự & ca trực',
        items: [
          {
            to: '/staff/profile-handover',
            label: 'Hồ sơ & bàn giao ca',
            icon: UserCheck,
          },
        ],
      },
    ],
    [counts]
  );

  const notificationCount = (counts?.pendingLeads || 0) + (counts?.activeDeposits || 0);

  return (
    <div className="min-h-screen flex font-sans antialiased bg-[var(--bg)] text-[var(--text)]">
      {/* Staff Sidebar */}
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

          <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-10 space-y-5">
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
                            <div className="flex items-center justify-between w-full min-w-0">
                              <span className="truncate">{item.label}</span>
                              {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                                <span className="text-[12px] font-medium px-1.5 py-0.5 rounded-[4px] bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text-secondary)] tabular-nums ml-1.5">
                                  {item.badgeCount}
                                </span>
                              )}
                            </div>
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

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="sticky top-0 h-16 px-6 bg-[var(--surface)] border-b border-[var(--line)] flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-subtle)] border border-[var(--line)] text-[13px] text-[var(--text-secondary)]">
              <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Showroom Sài Gòn – Q.7</span>
            </div>

            <div className="relative w-64 md:w-80">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm khách hàng, mã cọc, số VIN..."
                className="w-full pl-9 pr-4 py-1.5 text-[13px] rounded-[var(--radius)] bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
              />
            </div>
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
                title="Nhiệm vụ ca trực"
                aria-label="Thông báo nhiệm vụ ca trực"
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--status-danger)] text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
                    {notificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] shadow-lg p-4 space-y-3 z-50 text-[13px] animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                    <span className="font-semibold text-[var(--text)]">Nhiệm vụ ca trực</span>
                    <span className="text-[12px] text-[var(--text-muted)] tabular-nums">
                      {(workspaceData?.urgentDeposits.length || 0) + (workspaceData?.todayTimeline.length || 0)} mục
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(workspaceData?.urgentDeposits || []).slice(0, 2).map((dep) => (
                      <div key={dep.id} className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-subtle)] border border-[var(--line)]">
                        <div className="font-medium text-[var(--text)]">Phiếu cọc {dep.depositCode}</div>
                        <div className="text-[12px] text-[var(--text-muted)]">
                          {dep.customerName} • {dep.assignedVin ? `VIN: ${dep.assignedVin}` : 'Chưa gán VIN'}
                        </div>
                      </div>
                    ))}
                    {(workspaceData?.todayTimeline || []).slice(0, 2).map((slot) => (
                      <div key={slot.id} className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-subtle)] border border-[var(--line)]">
                        <div className="font-medium text-[var(--text)]">Lái thử {slot.timeSlot}</div>
                        <div className="text-[12px] text-[var(--text-muted)]">
                          {slot.customerName} • {slot.carModel}
                        </div>
                      </div>
                    ))}
                    {(!workspaceData || (workspaceData.urgentDeposits.length === 0 && workspaceData.todayTimeline.length === 0)) && (
                      <div className="text-[13px] text-[var(--text-muted)] text-center py-3">
                        Chưa có nhiệm vụ mới trong ca trực.
                      </div>
                    )}
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
                title={`Nhân viên: ${user?.fullName || 'Nhân viên'}`}
                aria-label="Tài khoản nhân viên"
              >
                {(user?.fullName || 'N').charAt(0).toUpperCase()}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] shadow-lg p-3 space-y-2 z-50 text-[13px] animate-fadeIn">
                  <div className="border-b border-[var(--line)] pb-2">
                    <div className="font-semibold text-[var(--text)]">{user?.fullName || 'Nhân viên showroom'}</div>
                    <div className="text-[12px] text-[var(--text-muted)] truncate">
                      {user?.email || 'staff@autohub.vn'}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/staff/profile-handover"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-2.5 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                    >
                      Hồ sơ & bàn giao ca
                    </Link>
                    <Link
                      to="/cars"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-2.5 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                    >
                      Xem showroom khách
                    </Link>
                  </div>

                  <div className="border-t border-[var(--line)] pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        navigate('/staff/login');
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

export const StaffLayout: React.FC = () => {
  return (
    <AdminThemeProvider>
      <StaffLayoutContent />
    </AdminThemeProvider>
  );
};
