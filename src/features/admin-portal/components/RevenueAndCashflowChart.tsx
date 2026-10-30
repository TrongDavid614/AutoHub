import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { MOCK_REVENUE_CHART_30_DAYS, type RevenueDataPoint } from '../mocks/dashboard.mock';
import { formatCurrencyVND, cn } from '@/lib/utils';
import { useAdminTheme } from '@/context/AdminThemeContext';

export interface RevenueAndCashflowChartProps {
  data?: RevenueDataPoint[];
  className?: string;
}

export const RevenueAndCashflowChart: React.FC<RevenueAndCashflowChartProps> = ({
  data = MOCK_REVENUE_CHART_30_DAYS,
  className,
}) => {
  const { isDarkMode } = useAdminTheme();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filtered dataset
  const activeData =
    timeRange === '7D'
      ? data.slice(-7)
      : timeRange === '90D'
      ? data
      : data;

  // Chart dimensions & scaling
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(
    ...activeData.map((d) => Math.max(d.accessoryRevenue, d.carDepositCashflow))
  );
  const minVal = 0;
  const range = maxVal - minVal || 1;

  // Coordinate mapper
  const getX = (index: number) => {
    return paddingX + (index / (activeData.length - 1)) * (chartWidth - paddingX * 2);
  };
  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - minVal) / range) * (chartHeight - paddingY * 2);
  };

  // Generate SVG path for line & area
  const accessoryPoints = activeData.map((d, i) => `${getX(i)},${getY(d.accessoryRevenue)}`);
  const depositPoints = activeData.map((d, i) => `${getX(i)},${getY(d.carDepositCashflow)}`);

  const accessoryPathD = `M ${accessoryPoints.join(' L ')}`;
  const depositPathD = `M ${depositPoints.join(' L ')}`;

  const accessoryAreaD = `${accessoryPathD} L ${getX(activeData.length - 1)},${chartHeight - paddingY} L ${getX(0)},${chartHeight - paddingY} Z`;
  const depositAreaD = `${depositPathD} L ${getX(activeData.length - 1)},${chartHeight - paddingY} L ${getX(0)},${chartHeight - paddingY} Z`;

  // Total summary calculations
  const totalAccessories = activeData.reduce((acc, curr) => acc + curr.accessoryRevenue, 0);
  const totalDeposits = activeData.reduce((acc, curr) => acc + curr.carDepositCashflow, 0);
  const grandTotal = totalAccessories + totalDeposits;

  return (
    <div
      className={cn(
        'rounded-xl border p-6 flex flex-col justify-between transition-colors duration-300 h-full',
        isDarkMode
          ? 'bg-[#131B2E] border-[#3E4850]/50 shadow-xl text-white'
          : 'bg-white border-slate-200 shadow-sm text-slate-900',
        className
      )}
    >
      {/* Chart Header & Controls */}
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b',
          isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-100'
        )}
      >
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className={cn('w-4 h-4', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600')} />
            <h2
              className={cn(
                'text-base font-bold tracking-tight',
                isDarkMode ? 'text-white' : 'text-slate-900'
              )}
            >
              Biểu Đồ Doanh Số & Dòng Tiền Trực Quan
            </h2>
          </div>
        </div>

        {/* Legend & Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Legend Items */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#89CEFF]" />
              <span className={isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700'}>Phụ Kiện</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" />
              <span className={isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700'}>Cọc Xe 72h</span>
            </div>
          </div>

          {/* Time Filter Buttons */}
          <div
            className={cn(
              'flex items-center p-0.5 rounded-lg border text-xs font-mono',
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/60'
                : 'bg-slate-100 border-slate-200'
            )}
          >
            {(['7D', '30D', '90D'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={cn(
                  'px-3 py-1 rounded-[6px] transition-all font-semibold cursor-pointer',
                  timeRange === r
                    ? isDarkMode
                      ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30 shadow-sm'
                      : 'bg-white text-blue-600 border border-blue-200 shadow-2xs'
                    : isDarkMode
                    ? 'text-[#88929B] hover:text-[#DAE2FD]'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full pt-4 overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Gradient Area: Accessories */}
            <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#89CEFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#89CEFF" stopOpacity="0.0" />
            </linearGradient>

            {/* Gradient Area: Deposits */}
            <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Background Lines (3-5 Horizontal Guidelines) */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingY + pct * (chartHeight - paddingY * 2);
            const val = maxVal - pct * range;
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke={isDarkMode ? '#3E4850' : '#E2E8F0'}
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill={isDarkMode ? '#88929B' : '#94A3B8'}
                  className="text-[9px] font-mono select-none"
                >
                  {(val / 1000000).toFixed(0)}M
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          <path d={accessoryAreaD} fill="url(#accGrad)" />
          <path d={depositAreaD} fill="url(#depGrad)" />

          {/* Line Strokes */}
          <path
            d={accessoryPathD}
            fill="none"
            stroke="#89CEFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={depositPathD}
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Hover Guides & Circles */}
          {activeData.map((d, i) => {
            const cx = getX(i);
            const cyAcc = getY(d.accessoryRevenue);
            const cyDep = getY(d.carDepositCashflow);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                {/* Vertical hover crosshair */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={chartHeight - paddingY}
                    stroke={isDarkMode ? '#89CEFF' : '#0284C7'}
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point: Accessory */}
                <circle
                  cx={cx}
                  cy={cyAcc}
                  r={isHovered ? 5 : 2.5}
                  fill="#89CEFF"
                  className="transition-all duration-150 cursor-pointer"
                />

                {/* Point: Deposit */}
                <circle
                  cx={cx}
                  cy={cyDep}
                  r={isHovered ? 5 : 2.5}
                  fill="#0EA5E9"
                  className="transition-all duration-150 cursor-pointer"
                />

                {/* Invisible hover trigger column */}
                <rect
                  x={cx - (chartWidth / activeData.length) / 2}
                  y={0}
                  width={chartWidth / activeData.length}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && activeData[hoveredIndex] && (
          <div
            className={cn(
              'absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none p-2.5 rounded-lg border text-xs font-mono shadow-2xl z-20 flex items-center gap-4',
              isDarkMode
                ? 'bg-[#0B1326] border-[#89CEFF]/50 text-white'
                : 'bg-white border-slate-300 text-slate-900 shadow-md'
            )}
          >
            <div>
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}>Ngày: </span>
              <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{activeData[hoveredIndex].date}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#89CEFF]" />
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}>Phụ kiện: </span>
              <strong className="text-[#89CEFF]">
                {formatCurrencyVND(activeData[hoveredIndex].accessoryRevenue)}
              </strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}>Cọc xe 72h: </span>
              <strong className="text-[#0EA5E9]">
                {formatCurrencyVND(activeData[hoveredIndex].carDepositCashflow)}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Summary Metrics Row */}
      <div
        className={cn(
          'pt-4 mt-2 border-t grid grid-cols-1 sm:grid-cols-3 gap-3',
          isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-100'
        )}
      >
        <div
          className={cn(
            'p-3 rounded-lg border flex flex-col',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
          )}
        >
          <span className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Tổng Doanh Số Phụ Kiện
          </span>
          <span className="text-base font-bold font-mono text-[#89CEFF] mt-0.5">
            {formatCurrencyVND(totalAccessories)}
          </span>
        </div>

        <div
          className={cn(
            'p-3 rounded-lg border flex flex-col',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
          )}
        >
          <span className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Dòng Tiền Cọc Xe 72 Giờ
          </span>
          <span className="text-base font-bold font-mono text-[#0EA5E9] mt-0.5">
            {formatCurrencyVND(totalDeposits)}
          </span>
        </div>

        <div
          className={cn(
            'p-3 rounded-lg border flex flex-col',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
          )}
        >
          <span className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Tổng Dòng Tiền Kỳ Này
          </span>
          <span
            className={cn(
              'text-base font-bold font-mono mt-0.5',
              isDarkMode ? 'text-white' : 'text-slate-900'
            )}
          >
            {formatCurrencyVND(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
