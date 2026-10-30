import React from 'react';
import {
  Users,
  Calendar,
  Clock,
  Package,
  ShieldAlert,
  Car,
  TrendingUp,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  MOCK_STAFF_KPIS,
  MOCK_TODAY_TIMELINE,
  MOCK_STAFF_DEPOSITS,
} from '@/features/staff-operations/mocks/staff.mock';
import { cn, formatCurrencyVND } from '@/lib/utils';

// Dữ liệu mật độ lái thử 6 khung giờ trong ngày
const HOURLY_TEST_DRIVES = [
  { slot: '08-10h', count: 1, max: 4, label: '1 lượt', highlight: false },
  { slot: '10-12h', count: 3, max: 4, label: '3 lượt (Cao điểm)', highlight: true },
  { slot: '13-14h', count: 0, max: 4, label: 'Trống', highlight: false },
  { slot: '14-16h', count: 4, max: 4, label: '4 lượt (Kín lịch)', highlight: true },
  { slot: '16-17h', count: 2, max: 4, label: '2 lượt', highlight: false },
  { slot: '17-18h', count: 1, max: 4, label: '1 lượt', highlight: false },
];

// Dữ liệu phân bổ trạng thái cọc xe 72h
const DEPOSIT_STATUS_BREAKDOWN = [
  { label: 'Đã khóa VIN', count: 4, percent: 57, color: 'bg-emerald-500', text: 'text-emerald-400' },
  { label: 'Thẩm định Bank', count: 2, percent: 29, color: 'bg-blue-500', text: 'text-[#89CEFF]' },
  { label: 'Sắp hết hạn <24h', count: 1, percent: 14, color: 'bg-amber-500', text: 'text-amber-400' },
];

export const StaffWorkspacePage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* 1. Header & Shift Greeting */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <h1 className={cn('text-xl font-bold mt-1', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Bàn Làm Việc Vận Hành Showroom
          </h1>
          <p className={cn('text-xs mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Theo dõi nhiệm vụ ca trực, mật độ khách lái thử trong ngày và kiểm soát hạn chót cọc xe 72 giờ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2',
              isDarkMode
                ? 'bg-emerald-950/70 border-emerald-800/40 text-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ca Sáng: 08:00 - 15:00</span>
          </span>
        </div>
      </div>

      {/* 2. Hàng 4 Thẻ chỉ số ca trực (<StatCardGrid>) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STAFF_KPIS.map((kpi, idx) => {
          const icons = [Users, Calendar, Clock, Package];
          const Icon = icons[idx % icons.length];

          return (
            <div
              key={kpi.id}
              className={cn(
                'p-4 rounded-xl border space-y-2 transition-colors',
                isDarkMode
                  ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm'
                  : 'bg-white border-slate-200 shadow-xs'
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn('text-xs font-medium', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                  {kpi.title}
                </span>
                <div
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center',
                    isDarkMode ? 'bg-[#171F33] text-[#89CEFF]' : 'bg-sky-50 text-blue-600'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className={cn('text-2xl font-bold font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
                {kpi.value}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className={cn('text-[11px] truncate', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                  {kpi.subtitle}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase',
                    kpi.badgeType === 'danger' &&
                      (isDarkMode
                        ? 'bg-red-950/70 text-red-300 border border-red-800/40'
                        : 'bg-red-50 text-red-700 border border-red-200'),
                    kpi.badgeType === 'warning' &&
                      (isDarkMode
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'),
                    kpi.badgeType === 'success' &&
                      (isDarkMode
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'),
                    kpi.badgeType === 'info' &&
                      (isDarkMode
                        ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                        : 'bg-blue-50 text-blue-700 border border-blue-200')
                  )}
                >
                  {kpi.badgeText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. KHỐI MINI-CHART TRỰC QUAN ĐIỀU PHỐI (2 Cột Song Song) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart 1: Mật độ ca lái thử theo khung giờ (Hourly Test-Drive Density) */}
        <div
          className={cn(
            'p-4 rounded-xl border space-y-3 transition-colors',
            isDarkMode
              ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm'
              : 'bg-white border-slate-200 shadow-xs'
          )}
        >
          <div className="flex items-center justify-between pb-2 border-b border-surface-highlight/40">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-500" />
              <span className={cn('text-xs font-bold font-mono uppercase tracking-wider', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Mật Độ Lái Thử Trong Ngày
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold text-blue-500">11 Lượt / Ngày</span>
          </div>

          {/* Bar Chart Container */}
          <div className="grid grid-cols-6 gap-2 items-end h-28 pt-2">
            {HOURLY_TEST_DRIVES.map((item) => {
              const heightPercent = item.count === 0 ? 6 : Math.round((item.count / item.max) * 100);
              return (
                <div key={item.slot} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold transition-opacity',
                      item.highlight ? 'text-blue-500 font-extrabold' : 'text-slate-400',
                      item.count === 0 ? 'opacity-30' : 'opacity-100'
                    )}
                  >
                    {item.count}
                  </span>
                  <div
                    className={cn(
                      'w-full rounded-t-md transition-all duration-300 relative',
                      item.count === 0
                        ? isDarkMode ? 'bg-[#171F33]/40' : 'bg-slate-100'
                        : item.highlight
                        ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                        : isDarkMode ? 'bg-blue-500/40 hover:bg-blue-500/60' : 'bg-blue-400 hover:bg-blue-500'
                    )}
                    style={{ height: `${heightPercent}%` }}
                    title={`${item.slot}: ${item.label}`}
                  />
                  <span
                    className={cn(
                      'text-[10px] font-mono whitespace-nowrap',
                      item.highlight
                        ? isDarkMode ? 'text-white font-bold' : 'text-slate-900 font-bold'
                        : isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
                    )}
                  >
                    {item.slot}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Phân bổ trạng thái phiếu cọc 72h (72h Deposit Health Bar) */}
        <div
          className={cn(
            'p-4 rounded-xl border space-y-3 transition-colors',
            isDarkMode
              ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm'
              : 'bg-white border-slate-200 shadow-xs'
          )}
        >
          <div className="flex items-center justify-between pb-2 border-b border-surface-highlight/40">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className={cn('text-xs font-bold font-mono uppercase tracking-wider', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Phân Bổ Phiếu Cọc 72H
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold text-emerald-500">7 Phiếu Hoạt Động</span>
          </div>

          <div className="space-y-3 pt-2">
            {/* Stacked Multi-Segment Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3.5 rounded-full overflow-hidden flex gap-1 p-0.5 bg-black/20 border border-surface-highlight/30">
                {DEPOSIT_STATUS_BREAKDOWN.map((seg) => (
                  <div
                    key={seg.label}
                    className={cn('h-full rounded-full transition-all duration-300', seg.color)}
                    style={{ width: `${seg.percent}%` }}
                    title={`${seg.label}: ${seg.count} phiếu (${seg.percent}%)`}
                  />
                ))}
              </div>
            </div>

            {/* Legend & Count Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              {DEPOSIT_STATUS_BREAKDOWN.map((seg) => (
                <div
                  key={seg.label}
                  className={cn(
                    'p-2 rounded-lg border flex flex-col justify-between gap-1',
                    isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={cn('w-2 h-2 rounded-full', seg.color)} />
                    <span className={cn('text-[10px] truncate', isDarkMode ? 'text-slate-300' : 'text-slate-600')}>
                      {seg.label}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className={cn('text-sm font-bold', seg.text)}>{seg.count}</span>
                    <span className="text-[10px] text-slate-400">{seg.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Operational Grid: Today's Timeline (Full Width) */}
      <div
        className={cn(
          'p-5 rounded-xl border space-y-4 transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#3E4850]/40">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <h2 className={cn('text-sm font-bold uppercase tracking-wider font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
              Tiến Trình Lái Thử Hôm Nay (08:00 - 18:00)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-500 font-bold">4 Khung Giờ Đã Khóa</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MOCK_TODAY_TIMELINE.map((slot) => (
            <div
              key={slot.id}
              className={cn(
                'p-3.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/40 hover:border-[#89CEFF]/50'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-400'
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-[#89CEFF] px-2 py-0.5 rounded bg-blue-50 dark:bg-[#171F33] border border-blue-200 dark:border-[#3E4850]/60">
                    {slot.timeSlot}
                  </span>
                  <span className={cn('text-xs font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                    {slot.carModel}
                  </span>
                </div>
                <div className={cn('text-xs flex items-center gap-2', isDarkMode ? 'text-[#88929B]' : 'text-slate-600')}>
                  <span>Khách: <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>{slot.customerName}</strong> ({slot.customerPhone})</span>
                  <span>•</span>
                  <span className="font-mono text-[11px]">Biển số: {slot.licensePlate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/40 font-bold">
                  Phụ trách: {slot.staffName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Danh sách cảnh báo tác vụ khẩn cấp (Cọc 72h) */}
      <div
        className={cn(
          'p-5 rounded-xl border space-y-4 transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#3E4850]/40">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <h2 className={cn('text-sm font-bold uppercase tracking-wider font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
              Phiếu Cọc Sắp Chạm Ngưỡng 72H (&lt; 24 Tiếng) Cần Chăm Sóc
            </h2>
          </div>
          <span className="text-xs font-mono text-red-500 font-bold">3 Phiếu Cần Gán VIN / Ký HĐ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={cn(
                'font-mono uppercase text-[11px] border-b',
                isDarkMode ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40' : 'bg-slate-50 text-slate-500 border-slate-200'
              )}
            >
              <tr>
                <th className="py-2.5 px-3">Mã Cọc</th>
                <th className="py-2.5 px-3">Khách Hàng & SĐT</th>
                <th className="py-2.5 px-3">Dòng Xe</th>
                <th className="py-2.5 px-3 text-right">Tiền Cọc</th>
                <th className="py-2.5 px-3 text-center">Thời Hạn 72H</th>
                <th className="py-2.5 px-3 text-center">Trạng Thái VIN</th>
              </tr>
            </thead>
            <tbody className={cn('divide-y font-sans', isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100')}>
              {MOCK_STAFF_DEPOSITS.slice(0, 3).map((dep) => (
                <tr
                  key={dep.id}
                  className={cn(
                    'transition-colors',
                    isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50'
                  )}
                >
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-[#89CEFF]">{dep.depositCode}</td>
                  <td className="py-3 px-3">
                    <div className={cn('font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>{dep.customerName}</div>
                    <div className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>{dep.customerPhone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className={cn('font-medium', isDarkMode ? 'text-white' : 'text-slate-800')}>{dep.carModel}</div>
                    <div className={cn('text-[10px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>{dep.variant}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-[#10B981]">
                    {formatCurrencyVND(dep.depositAmount)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor(dep.remainingSeconds / 3600)}h {Math.floor((dep.remainingSeconds % 3600) / 60)}p</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {dep.assignedVin ? (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-bold">
                        {dep.assignedVin}
                      </span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/40 font-bold">
                        Chưa Gán VIN
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
