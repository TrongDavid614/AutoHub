import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Users,
  Calendar,
  Clock,
  Package,
  ShieldAlert,
  Car,
  TrendingUp,
  Loader2,
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Building2,
} from 'lucide-react';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { WorkspaceMetricsResponse } from '@/types/staff.types';
import { cn, formatCurrencyVND } from '@/lib/utils';

export const StaffWorkspacePage: React.FC = () => {
  const [metrics, setMetrics] = useState<WorkspaceMetricsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await staffService.getWorkspaceMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu bàn làm việc Showroom từ SQL Server:', err);
      setError('Không thể kết nối máy chủ để tải dữ liệu vận hành thực tế.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    staffService
      .getWorkspaceMetrics()
      .then((data) => {
        if (isMounted) {
          setMetrics(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Lỗi tải dữ liệu bàn làm việc Showroom từ SQL Server:', err);
          setError('Không thể kết nối máy chủ để tải dữ liệu vận hành thực tế.');
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Live 1-second countdown for urgentDeposits based on real DB han_giu_xe
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          urgentDeposits: (prev.urgentDeposits || []).map((d) => ({
            ...d,
            remainingSeconds: Math.max(0, d.remainingSeconds - 1),
          })),
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const kpis = metrics?.kpis || [];
  const hourlyTestDrives = metrics?.hourlyTestDrives || [];
  const depositBreakdown = metrics?.depositBreakdown || [];
  const todayTimeline = metrics?.todayTimeline || [];
  const urgentDeposits = metrics?.urgentDeposits || [];

  // Filter & Pagination state for "Danh Sách Lịch Lái Thử Hiện Có"
  const [testDriveSearch, setTestDriveSearch] = useState('');
  const [testDriveStatus, setTestDriveStatus] = useState<string>('ALL');
  const [testDriveShowroom, setTestDriveShowroom] = useState<string>('ALL');
  const [testDrivePage, setTestDrivePage] = useState<number>(1);
  const [testDrivePageSize, setTestDrivePageSize] = useState<number>(6);

  // Danh sách showroom duy nhất lấy từ dữ liệu thực tế
  const uniqueShowrooms = useMemo(() => {
    const set = new Set<string>();
    todayTimeline.forEach((item) => {
      if (item.staffName && item.staffName.trim()) {
        set.add(item.staffName.trim());
      }
    });
    return Array.from(set).sort();
  }, [todayTimeline]);

  // Bộ lọc lịch lái thử đa điều kiện (Tìm kiếm + Trạng thái + Chi nhánh)
  const filteredTimeline = useMemo(() => {
    return todayTimeline.filter((slot) => {
      // 1. Tìm kiếm từ khóa (Khách, SĐT, Dòng xe, Biển số, Showroom)
      if (testDriveSearch.trim()) {
        const q = testDriveSearch.trim().toLowerCase();
        const matchName = slot.customerName?.toLowerCase().includes(q);
        const matchPhone = slot.customerPhone?.toLowerCase().includes(q);
        const matchCar = slot.carModel?.toLowerCase().includes(q);
        const matchPlate = slot.licensePlate?.toLowerCase().includes(q);
        const matchShowroom = slot.staffName?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchCar && !matchPlate && !matchShowroom) {
          return false;
        }
      }

      // 2. Lọc theo trạng thái
      if (testDriveStatus !== 'ALL') {
        const s = (slot.status || '').toUpperCase();
        if (testDriveStatus === 'CONFIRMED') {
          if (s !== 'CONFIRMED' && s !== 'SCHEDULED') return false;
        } else if (s !== testDriveStatus) {
          return false;
        }
      }

      // 3. Lọc theo chi nhánh / Showroom
      if (testDriveShowroom !== 'ALL') {
        if (slot.staffName?.trim() !== testDriveShowroom) {
          return false;
        }
      }

      return true;
    });
  }, [todayTimeline, testDriveSearch, testDriveStatus, testDriveShowroom]);

  // Tính toán phân trang
  const totalPages = Math.max(1, Math.ceil(filteredTimeline.length / testDrivePageSize));
  const safePage = Math.min(testDrivePage, totalPages);
  const paginatedTimeline = useMemo(() => {
    const start = (safePage - 1) * testDrivePageSize;
    return filteredTimeline.slice(start, start + testDrivePageSize);
  }, [filteredTimeline, safePage, testDrivePageSize]);

  const handleResetTestDriveFilters = () => {
    setTestDriveSearch('');
    setTestDriveStatus('ALL');
    setTestDriveShowroom('ALL');
    setTestDrivePage(1);
  };

  return (
    <div className="space-y-6 antialiased text-[var(--text)]">
      {/* 1. Header & Shift Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)]">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">
            Bàn làm việc vận hành Showroom
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Theo dõi khách hàng cần tư vấn, lịch hẹn lái thử và thời hạn giữ chỗ cọc 72 giờ.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchMetrics}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-xs font-medium text-[var(--text)] flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            Làm mới
          </button>
          <span className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium tabular-nums flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Ca làm việc: 08:00 - 15:00</span>
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && !metrics ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 bg-[var(--surface)] border border-[var(--line)] rounded-lg">
          <Loader2 className="w-7 h-7 animate-spin text-[var(--accent)]" />
          <p className="text-xs text-[var(--text-secondary)]">Đang tải dữ liệu vận hành...</p>
        </div>
      ) : error && !metrics ? (
        <div className="p-10 rounded-lg border border-red-200 bg-red-50 text-red-800 text-center space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto text-red-600" />
          <p className="text-sm font-semibold">{error}</p>
          <button
            type="button"
            onClick={fetchMetrics}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <>
          {/* 2. KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => {
              const icons = [Users, Calendar, Clock, Package];
              const Icon = icons[idx % icons.length];

              return (
                <div
                  key={kpi.id}
                  className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      {kpi.title}
                    </span>
                    <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>

                  <div className="text-2xl font-bold text-[var(--text)] tabular-nums">
                    {kpi.value}
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <span className="text-xs text-[var(--text-secondary)] truncate">
                      {kpi.subtitle}
                    </span>
                    {kpi.badgeText && (
                      <span
                        className={cn(
                          'text-[11px] px-2 py-0.5 rounded-full font-medium border shrink-0',
                          kpi.badgeType === 'danger' && 'bg-red-50 text-red-700 border-red-200',
                          kpi.badgeType === 'warning' && 'bg-amber-50 text-amber-800 border-amber-200',
                          kpi.badgeType === 'success' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                          kpi.badgeType === 'info' && 'bg-blue-50 text-blue-700 border-blue-200'
                        )}
                      >
                        {kpi.badgeText}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Operational Charts (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chart 1: Hourly Test Drives */}
            <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-sm font-semibold text-[var(--text)]">
                    Mật độ lái thử theo khung giờ
                  </span>
                </div>
                <span className="text-xs font-medium text-[var(--accent)] tabular-nums">
                  {metrics?.totalTestDrivesCount || 0} lượt
                </span>
              </div>

              <div className="grid grid-cols-6 gap-2 items-end h-28 pt-2">
                {hourlyTestDrives.map((item) => {
                  const safeMax = Math.max(1, item.max);
                  const heightPercent = item.count === 0 ? 6 : Math.round((item.count / safeMax) * 100);
                  return (
                    <div key={item.slot} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span
                        className={cn(
                          'text-xs font-semibold tabular-nums',
                          item.highlight ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]',
                          item.count === 0 && 'opacity-30'
                        )}
                      >
                        {item.count}
                      </span>
                      <div
                        className={cn(
                          'w-full rounded-t transition-colors relative',
                          item.count === 0
                            ? 'bg-[var(--surface-subtle)]'
                            : item.highlight
                              ? 'bg-[var(--accent)]'
                              : 'bg-blue-300 hover:bg-blue-400'
                        )}
                        style={{ height: `${heightPercent}%` }}
                        title={`${item.slot}: ${item.label}`}
                      />
                      <span
                        className={cn(
                          'text-[11px] whitespace-nowrap tabular-nums',
                          item.highlight ? 'text-[var(--text)] font-semibold' : 'text-[var(--text-muted)]'
                        )}
                      >
                        {item.slot}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Deposit Status Breakdown */}
            <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-[var(--text)]">
                    Phân bổ phiếu cọc 72h
                  </span>
                </div>
                <span className="text-xs font-medium text-emerald-700 tabular-nums">
                  {metrics?.totalDepositsCount || 0} phiếu
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="w-full h-3 rounded-full overflow-hidden flex gap-0.5 bg-[var(--surface-subtle)] border border-[var(--line)]">
                  {depositBreakdown.map((seg) => (
                    <div
                      key={seg.label}
                      className={cn('h-full transition-all duration-300', seg.color)}
                      style={{ width: `${seg.percent}%` }}
                      title={`${seg.label}: ${seg.count} phiếu (${seg.percent}%)`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1 divide-x divide-[var(--line)] text-xs">
                  {depositBreakdown.map((seg) => (
                    <div key={seg.label} className="pl-3 first:pl-0 flex flex-col justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className={cn('w-2 h-2 rounded-full', seg.color)} />
                        <span className="text-[11px] text-[var(--text-secondary)] truncate">
                          {seg.label}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between tabular-nums">
                        <span className="text-sm font-bold text-[var(--text)]">{seg.count}</span>
                        <span className="text-[11px] text-[var(--text-muted)]">{seg.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Test Drive Timeline */}
          <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-base font-semibold text-[var(--text)]">
                  Lịch hẹn lái thử hiện có
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs tabular-nums">
                {filteredTimeline.length !== todayTimeline.length && (
                  <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Đang lọc: {filteredTimeline.length}
                  </span>
                )}
                <span className="text-[var(--text-secondary)] font-medium">
                  Tổng {todayTimeline.length} lịch hẹn
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="relative col-span-1 sm:col-span-2 lg:col-span-2">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={testDriveSearch}
                  onChange={(e) => {
                    setTestDriveSearch(e.target.value);
                    setTestDrivePage(1);
                  }}
                  placeholder="Tìm khách hàng, SĐT, mẫu xe, biển số, showroom..."
                  className="w-full pl-8 pr-7 py-2 rounded-lg text-xs bg-[var(--surface)] border border-[var(--line-strong)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-colors"
                />
                {testDriveSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setTestDriveSearch('');
                      setTestDrivePage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] text-xs cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              <select
                value={testDriveStatus}
                onChange={(e) => {
                  setTestDriveStatus(e.target.value);
                  setTestDrivePage(1);
                }}
                className="w-full px-3 py-2 rounded-lg text-xs bg-[var(--surface)] border border-[var(--line-strong)] text-[var(--text)] cursor-pointer focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xếp xe</option>
                <option value="CONFIRMED">Đã lên lịch</option>
                <option value="COMPLETED">Hoàn tất</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>

              <select
                value={testDriveShowroom}
                onChange={(e) => {
                  setTestDriveShowroom(e.target.value);
                  setTestDrivePage(1);
                }}
                className="w-full px-3 py-2 rounded-lg text-xs bg-[var(--surface)] border border-[var(--line-strong)] text-[var(--text)] cursor-pointer focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="ALL">Tất cả chi nhánh</option>
                {uniqueShowrooms.map((sr) => (
                  <option key={sr} value={sr}>
                    {sr}
                  </option>
                ))}
              </select>
            </div>

            {(testDriveSearch || testDriveStatus !== 'ALL' || testDriveShowroom !== 'ALL') && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[var(--text-muted)]">Đang lọc:</span>
                {testDriveSearch && (
                  <span className="px-2 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent)]">
                    &quot;{testDriveSearch}&quot;
                  </span>
                )}
                {testDriveStatus !== 'ALL' && (
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {testDriveStatus}
                  </span>
                )}
                {testDriveShowroom !== 'ALL' && (
                  <span className="px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--text)] border border-[var(--line)]">
                    {testDriveShowroom}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetTestDriveFilters}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[var(--line)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại</span>
                </button>
              </div>
            )}

            {/* List or Empty State */}
            {todayTimeline.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                Chưa có lịch hẹn lái thử nào được ghi nhận trong hệ thống.
              </div>
            ) : filteredTimeline.length === 0 ? (
              <div className="p-8 text-center space-y-2 border border-dashed rounded-lg border-[var(--line-strong)]">
                <Search className="w-6 h-6 mx-auto text-[var(--text-muted)]" />
                <p className="text-xs font-semibold text-[var(--text)]">
                  Không tìm thấy lịch lái thử phù hợp với bộ lọc
                </p>
                <button
                  type="button"
                  onClick={handleResetTestDriveFilters}
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại bộ lọc</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[var(--line)] border border-[var(--line)] rounded-lg overflow-hidden">
                {paginatedTimeline.map((slot) => {
                  const s = (slot.status || '').toUpperCase();
                  const isCompleted = s === 'COMPLETED';
                  const isConfirmed = s === 'CONFIRMED' || s === 'SCHEDULED';
                  const isCancelled = s === 'CANCELLED';

                  return (
                    <div
                      key={slot.id}
                      className="p-3.5 bg-[var(--surface)] hover:bg-[var(--surface-subtle)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold tabular-nums text-[var(--accent)] px-2 py-0.5 rounded bg-[var(--accent-soft)] shrink-0">
                            {slot.timeSlot}
                          </span>
                          <span className="text-sm font-semibold text-[var(--text)] truncate">
                            {slot.carModel}
                          </span>
                          <span
                            className={cn(
                              'text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0',
                              isCompleted && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                              isConfirmed && 'bg-blue-50 text-blue-700 border-blue-200',
                              isCancelled && 'bg-red-50 text-red-700 border-red-200',
                              !isCompleted && !isConfirmed && !isCancelled && 'bg-amber-50 text-amber-800 border-amber-200'
                            )}
                          >
                            {isCompleted ? 'Hoàn tất' : isConfirmed ? 'Đã lên lịch' : isCancelled ? 'Đã hủy' : 'Chờ xếp xe'}
                          </span>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] flex flex-wrap items-center gap-2">
                          <span>
                            Khách: <strong className="text-[var(--text)]">{slot.customerName}</strong>
                            {slot.customerPhone ? ` (${slot.customerPhone})` : ''}
                          </span>
                          <span>·</span>
                          <span className="font-mono text-[11px]">Biển số: {slot.licensePlate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          <span>{slot.staffName}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {filteredTimeline.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--line)]">
                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] tabular-nums">
                  <span>
                    Hiển thị <strong className="text-[var(--text)]">{(safePage - 1) * testDrivePageSize + 1}</strong> -{' '}
                    <strong className="text-[var(--text)]">{Math.min(safePage * testDrivePageSize, filteredTimeline.length)}</strong> /{' '}
                    <strong className="text-[var(--text)]">{filteredTimeline.length}</strong> lịch hẹn
                  </span>

                  <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-[var(--line)]">
                    <span>Số dòng:</span>
                    <select
                      value={testDrivePageSize}
                      onChange={(e) => {
                        setTestDrivePageSize(Number(e.target.value));
                        setTestDrivePage(1);
                      }}
                      className="px-2 py-1 rounded text-xs border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--text)] cursor-pointer focus:outline-none"
                    >
                      <option value={6}>6</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1 self-center sm:self-auto">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setTestDrivePage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Trang trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden md:inline">Trước</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        if (totalPages <= 7) return true;
                        if (p === 1 || p === totalPages) return true;
                        if (Math.abs(p - safePage) <= 1) return true;
                        return false;
                      })
                      .map((p, idx, arr) => {
                        const prev = arr[idx - 1];
                        const showEllipsis = prev && p - prev > 1;
                        return (
                          <React.Fragment key={p}>
                            {showEllipsis && <span className="px-1 text-[var(--text-muted)] text-xs">...</span>}
                            <button
                              type="button"
                              onClick={() => setTestDrivePage(p)}
                              className={cn(
                                'w-7 h-7 rounded-lg text-xs font-medium tabular-nums cursor-pointer transition-colors border',
                                safePage === p
                                  ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                                  : 'bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
                              )}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setTestDrivePage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Trang sau"
                  >
                    <span className="hidden md:inline">Sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 5. Deposit 72h & VIN Table */}
          <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h2 className="text-base font-semibold text-[var(--text)]">
                  Theo dõi phiếu cọc 72h &amp; trạng thái gán VIN
                </h2>
              </div>
              <span className="text-xs text-[var(--text-secondary)] font-medium tabular-nums">
                {urgentDeposits.length} phiếu
              </span>
            </div>

            {urgentDeposits.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                Hiện không có phiếu đặt cọc nào.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--surface-subtle)] text-[var(--text-secondary)] border-b border-[var(--line)] font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Mã cọc</th>
                      <th className="py-2.5 px-3">Khách hàng</th>
                      <th className="py-2.5 px-3">Dòng xe</th>
                      <th className="py-2.5 px-3 text-right">Tiền cọc</th>
                      <th className="py-2.5 px-3 text-center">Thời hạn 72h</th>
                      <th className="py-2.5 px-3 text-center">Số khung (VIN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {urgentDeposits.map((dep) => (
                      <tr key={dep.id} className="hover:bg-[var(--surface-subtle)] transition-colors">
                        <td className="py-3 px-3 font-mono font-semibold text-[var(--accent)]">
                          {dep.depositCode}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-[var(--text)]">{dep.customerName}</div>
                          <div className="text-[11px] text-[var(--text-secondary)] tabular-nums">
                            {dep.customerPhone}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-[var(--text)]">{dep.carModel}</div>
                          <div className="text-[11px] text-[var(--text-muted)]">{dep.variant}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-emerald-700 tabular-nums">
                          {formatCurrencyVND(dep.depositAmount)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border tabular-nums',
                              dep.remainingSeconds > 0
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-[var(--surface-subtle)] text-[var(--text-muted)] border-[var(--line)]'
                            )}
                          >
                            <Clock className="w-3 h-3" />
                            <span>
                              {dep.remainingSeconds > 0
                                ? `${Math.floor(dep.remainingSeconds / 3600)}h ${Math.floor((dep.remainingSeconds % 3600) / 60)}p`
                                : 'Hết hạn'}
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {dep.assignedVin ? (
                            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                              {dep.assignedVin}
                            </span>
                          ) : (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                              Chưa gán VIN
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
