import React, { useState, useMemo } from 'react';
import { Building2, MapPin, ShoppingBag, Users, PackageCheck } from 'lucide-react';
import type { RegionalRevenue } from '@/types/admin-dashboard.types';
import { MOCK_REGIONAL_REVENUES } from '../mocks/dashboard.mock';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';

export interface RegionalBreakupCardProps {
  revenues?: RegionalRevenue[];
  className?: string;
}

export const RegionalBreakupCard: React.FC<RegionalBreakupCardProps> = ({
  revenues = MOCK_REGIONAL_REVENUES,
  className,
}) => {
  const { isDarkMode } = useAdminTheme();
  const [hoveredItem, setHoveredItem] = useState<RegionalRevenue | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // SVG Donut calculation
  const total = useMemo(() => revenues.reduce((acc, curr) => acc + curr.revenue, 0), [revenues]);
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Precalculate slice positions
  const slices = useMemo(() => {
    let currentAcc = 0;
    const result = [];
    for (const item of revenues) {
      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((currentAcc / 100) * circumference);
      currentAcc += item.percentage;
      result.push({
        ...item,
        strokeDasharray,
        strokeDashoffset,
      });
    }
    return result;
  }, [revenues, circumference]);

  const handleSliceMouseMove = (e: React.MouseEvent<SVGElement | HTMLDivElement>, item: RegionalRevenue) => {
    const container = e.currentTarget.closest('.donut-wrapper');
    if (container) {
      const rect = container.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setTooltipPos(null);
  };

  const topMarket = useMemo(() => {
    if (!revenues.length) return '—';
    return [...revenues].sort((a, b) => b.revenue - a.revenue)[0]?.region || '—';
  }, [revenues]);

  const totalOrders = useMemo(
    () => revenues.reduce((acc, item) => acc + (item.ordersCount || 0), 0),
    [revenues]
  );

  return (
    <div
      className={cn(
        'rounded-lg bg-[var(--surface)] border border-[var(--line)] p-5 flex flex-col justify-between transition-colors relative h-full text-[var(--text)]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-base font-semibold text-[var(--text)]">
            Tỷ trọng doanh thu showroom
          </h2>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-[var(--line)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] tabular-nums">
          {revenues.length} chi nhánh
        </span>
      </div>

      {/* Donut Chart Visual & Summary */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-3">
        <div className="donut-wrapper relative w-[180px] h-[180px] flex-shrink-0">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 overflow-visible"
            onMouseLeave={handleMouseLeave}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={isDarkMode ? '#21262D' : '#F1F3F6'}
              strokeWidth={strokeWidth}
            />

            {slices.map((item) => {
              const isHovered = hoveredItem?.region === item.region;
              const isOtherHovered = hoveredItem && !isHovered;

              return (
                <circle
                  key={item.region}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={item.strokeDasharray}
                  strokeDashoffset={item.strokeDashoffset}
                  strokeLinecap="butt"
                  className={cn(
                    'transition-opacity duration-200 cursor-pointer',
                    isOtherHovered ? 'opacity-35' : 'opacity-100'
                  )}
                  onMouseEnter={(e) => handleSliceMouseMove(e, item)}
                  onMouseMove={(e) => handleSliceMouseMove(e, item)}
                />
              );
            })}
          </svg>

          {/* Donut Inner Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-3">
            {hoveredItem ? (
              <div className="space-y-0.5">
                <span
                  className="block text-xs font-medium truncate max-w-[100px]"
                  style={{ color: hoveredItem.color }}
                >
                  {hoveredItem.region}
                </span>
                <span className="block text-base font-bold text-[var(--text)] tabular-nums leading-none">
                  {(hoveredItem.revenue / 1000000000).toFixed(2)} tỷ
                </span>
                <span
                  className="block text-[11px] font-medium tabular-nums"
                  style={{ color: hoveredItem.color }}
                >
                  {hoveredItem.percentage}%
                </span>
              </div>
            ) : (
              <div className="space-y-0.5">
                <span className="block text-[11px] text-[var(--text-muted)]">
                  Tổng doanh thu
                </span>
                <span className="block text-base font-bold text-[var(--text)] tabular-nums leading-none">
                  {(total / 1000000000).toFixed(1)} tỷ
                </span>
                <span className="block text-[11px] text-[var(--text-secondary)] tabular-nums">
                  {totalOrders} đơn
                </span>
              </div>
            )}
          </div>

          {/* Floating Tooltip */}
          {hoveredItem && tooltipPos && (
            <div
              className="absolute pointer-events-none z-50 min-w-[200px] p-3 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] text-xs text-[var(--text)] shadow-md"
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y - 12}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[var(--line)]">
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: hoveredItem.color }} />
                  <span>{hoveredItem.region}</span>
                </div>
                <span className="text-[11px] font-medium text-[var(--text-secondary)] tabular-nums">
                  {hoveredItem.percentage}%
                </span>
              </div>

              <div className="mt-2 space-y-1 tabular-nums">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Doanh thu:</span>
                  <span className="font-semibold text-[var(--accent)]">{hoveredItem.formattedRevenue}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Showroom:</span>
                  <span className="truncate max-w-[115px] text-[var(--text)]" title={hoveredItem.showroomName}>
                    {hoveredItem.showroomName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--line)]">
                  <span className="flex items-center gap-1 text-[var(--text-muted)]">
                    <PackageCheck className="w-3 h-3 text-emerald-600" />
                    Đơn hàng:
                  </span>
                  <strong>{hoveredItem.ordersCount}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-[var(--text-muted)]">
                    <Users className="w-3 h-3 text-[var(--accent)]" />
                    Nhân sự:
                  </span>
                  <strong>{hoveredItem.staffCount} người</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Region Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs pt-4">
          {slices.map((item) => (
            <div
              key={item.region}
              className={cn(
                'flex items-center gap-1.5 cursor-pointer transition-opacity px-2 py-1 rounded hover:bg-[var(--surface-subtle)]',
                hoveredItem && hoveredItem.region !== item.region ? 'opacity-40' : 'opacity-100'
              )}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={handleMouseLeave}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[var(--text-secondary)] font-medium">
                {item.region}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Operational Footer */}
      <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)] tabular-nums">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Dẫn đầu: <strong className="text-[var(--text)]">{topMarket}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tổng đơn: <strong className="text-[var(--text)]">{totalOrders}</strong></span>
        </div>
      </div>
    </div>
  );
};
