import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import type { RevenueDataPoint } from '@/types/admin-dashboard.types';
import { MOCK_REVENUE_CHART_30_DAYS } from '../mocks/dashboard.mock';
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

  // Filtered dataset: 7D (last 7), 30D (last 30), 90D (all/last 90)
  const activeData =
    timeRange === '7D'
      ? data.slice(-7)
      : timeRange === '30D'
      ? data.slice(-30)
      : data.slice(-90);

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
        'rounded-lg bg-[var(--surface)] border border-[var(--line)] p-5 flex flex-col justify-between transition-colors h-full text-[var(--text)]',
        className
      )}
    >
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-base font-semibold text-[var(--text)]">
            Biểu đồ doanh số & dòng tiền
          </h2>
        </div>

        {/* Legend & Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1D5BD6]" />
              <span>Phụ kiện</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E]" />
              <span>Tiền cọc xe 72h</span>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] text-xs">
            {(['7D', '30D', '90D'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={cn(
                  'px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer tabular-nums',
                  timeRange === r
                    ? 'bg-[var(--surface)] text-[var(--accent)] shadow-2xs font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
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
            <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D5BD6" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#1D5BD6" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F766E" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#0F766E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

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
                  stroke={isDarkMode ? '#30363D' : '#E2E4E9'}
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill={isDarkMode ? '#8B949E' : '#6B7280'}
                  className="text-[10px] select-none"
                >
                  {(val / 1000000).toFixed(0)}M
                </text>
              </g>
            );
          })}

          <path d={accessoryAreaD} fill="url(#accGrad)" />
          <path d={depositAreaD} fill="url(#depGrad)" />

          <path
            d={accessoryPathD}
            fill="none"
            stroke="#1D5BD6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={depositPathD}
            fill="none"
            stroke="#0F766E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {activeData.map((d, i) => {
            const cx = getX(i);
            const cyAcc = getY(d.accessoryRevenue);
            const cyDep = getY(d.carDepositCashflow);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={chartHeight - paddingY}
                    stroke="#1D5BD6"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                )}

                <circle
                  cx={cx}
                  cy={cyAcc}
                  r={isHovered ? 4.5 : 2.5}
                  fill="#1D5BD6"
                  className="transition-all duration-150 cursor-pointer"
                />

                <circle
                  cx={cx}
                  cy={cyDep}
                  r={isHovered ? 4.5 : 2.5}
                  fill="#0F766E"
                  className="transition-all duration-150 cursor-pointer"
                />

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

        {hoveredIndex !== null && activeData[hoveredIndex] && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-2 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] text-xs text-[var(--text)] shadow-md z-20 flex items-center gap-4 tabular-nums">
            <div>
              <span className="text-[var(--text-muted)]">Ngày: </span>
              <strong>{activeData[hoveredIndex].date}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1D5BD6]" />
              <span className="text-[var(--text-muted)]">Phụ kiện: </span>
              <strong className="text-[#1D5BD6]">
                {formatCurrencyVND(activeData[hoveredIndex].accessoryRevenue)}
              </strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
              <span className="text-[var(--text-muted)]">Cọc xe: </span>
              <strong className="text-[#0F766E]">
                {formatCurrencyVND(activeData[hoveredIndex].carDepositCashflow)}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Summary Metrics Row */}
      <div className="pt-4 mt-3 border-t border-[var(--line)] grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)]">
        <div className="flex flex-col pt-2 sm:pt-0">
          <span className="text-xs text-[var(--text-secondary)]">Tổng doanh số phụ kiện</span>
          <span className="text-base font-bold text-[#1D5BD6] tabular-nums mt-0.5">
            {formatCurrencyVND(totalAccessories)}
          </span>
        </div>

        <div className="flex flex-col pt-2 sm:pt-0 sm:pl-4">
          <span className="text-xs text-[var(--text-secondary)]">Dòng tiền cọc xe 72 giờ</span>
          <span className="text-base font-bold text-[#0F766E] tabular-nums mt-0.5">
            {formatCurrencyVND(totalDeposits)}
          </span>
        </div>

        <div className="flex flex-col pt-2 sm:pt-0 sm:pl-4">
          <span className="text-xs text-[var(--text-secondary)]">Tổng dòng tiền kỳ này</span>
          <span className="text-base font-bold text-[var(--text)] tabular-nums mt-0.5">
            {formatCurrencyVND(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
