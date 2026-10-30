import React, { useState, useMemo } from 'react';
import { Building2, MapPin, ShoppingBag, Users, PackageCheck } from 'lucide-react';
import { MOCK_REGIONAL_REVENUES, type RegionalRevenue } from '../mocks/dashboard.mock';
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
    let accPercent = 0;
    return revenues.map((item) => {
      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((accPercent / 100) * circumference);
      accPercent += item.percentage;
      return {
        ...item,
        strokeDasharray,
        strokeDashoffset,
      };
    });
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

  return (
    <div
      className={cn(
        'rounded-xl border p-6 flex flex-col justify-between transition-colors duration-300 relative h-full',
        isDarkMode
          ? 'bg-[#131B2E] border-[#3E4850]/50 shadow-xl text-white'
          : 'bg-white border-slate-200 shadow-sm text-slate-900',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between pb-3 border-b',
          isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-100'
        )}
      >
        <div>
          <div className="flex items-center gap-2">
            <Building2 className={cn('w-4 h-4', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600')} />
            <h2
              className={cn(
                'text-base font-bold tracking-tight',
                isDarkMode ? 'text-white' : 'text-slate-900'
              )}
            >
              Tỷ Trọng Doanh Thu Showroom
            </h2>
          </div>
        </div>

        <span
          className={cn(
            'px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border',
            isDarkMode
              ? 'bg-[#171F33] text-[#89CEFF] border-[#3E4850]/60'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          )}
        >
          3 CHI NHÁNH
        </span>
      </div>

      {/* Donut Chart Visual & Summary - Centered & Equal Height */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-3">
        {/* SVG Donut Wrapper with Tooltip */}
        <div className="donut-wrapper relative w-[180px] h-[180px] flex-shrink-0">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 overflow-visible"
            onMouseLeave={handleMouseLeave}
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={isDarkMode ? '#171F33' : '#F1F5F9'}
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
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
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={item.strokeDasharray}
                  strokeDashoffset={item.strokeDashoffset}
                  strokeLinecap="round"
                  className={cn(
                    'transition-all duration-200 cursor-pointer',
                    isHovered
                      ? 'opacity-100 filter drop-shadow-[0_0_10px_rgba(137,206,255,0.45)]'
                      : isOtherHovered
                      ? 'opacity-35'
                      : 'opacity-100'
                  )}
                  onMouseEnter={(e) => handleSliceMouseMove(e, item)}
                  onMouseMove={(e) => handleSliceMouseMove(e, item)}
                />
              );
            })}
          </svg>

          {/* Donut Inner Text (Live Dynamic on Hover) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none transition-all duration-200 px-3">
            {hoveredItem ? (
              <div className="animate-fadeIn space-y-0.5">
                <span
                  className="block text-[11px] font-mono font-bold uppercase truncate max-w-[100px]"
                  style={{ color: hoveredItem.color }}
                >
                  {hoveredItem.region}
                </span>
                <span
                  className={cn(
                    'block text-base font-mono font-black tracking-tight leading-none',
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  )}
                >
                  {(hoveredItem.revenue / 1000000000).toFixed(2)} Tỷ
                </span>
                <span
                  className="block text-[10px] font-mono font-bold"
                  style={{ color: hoveredItem.color }}
                >
                  {hoveredItem.percentage}% thị phần
                </span>
              </div>
            ) : (
              <div className="animate-fadeIn space-y-0.5">
                <span className={cn('block text-[10px] font-mono uppercase', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                  Tổng Hệ Thống
                </span>
                <span
                  className={cn(
                    'block text-base font-mono font-bold tracking-tight leading-none',
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  )}
                >
                  {(total / 1000000000).toFixed(1)} Tỷ
                </span>
                <span className="block text-[10px] font-mono text-[#10B981] font-bold">+18.4% YoY</span>
              </div>
            )}
          </div>

          {/* Floating Tooltip with Full Statistics */}
          {hoveredItem && tooltipPos && (
            <div
              className={cn(
                'absolute pointer-events-none z-50 min-w-[210px] p-3 rounded-lg border text-xs shadow-2xl backdrop-blur-md transition-opacity duration-150 animate-fadeIn',
                isDarkMode
                  ? 'bg-[#0B1326]/95 border-[#3E4850] text-[#DAE2FD] shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
                  : 'bg-white/95 border-slate-200 text-slate-800 shadow-[0_12px_30px_rgba(0,0,0,0.12)]'
              )}
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y - 12}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-surface-highlight/40">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: hoveredItem.color }} />
                  <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{hoveredItem.region}</span>
                </div>
                <span
                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                >
                  {hoveredItem.percentage}%
                </span>
              </div>

              <div className="mt-2 space-y-1 font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Doanh thu:</span>
                  <span className="font-bold text-[#89CEFF]">{hoveredItem.formattedRevenue}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Showroom:</span>
                  <span className={cn('truncate max-w-[120px]', isDarkMode ? 'text-slate-300' : 'text-slate-700')} title={hoveredItem.showroomName}>
                    {hoveredItem.showroomName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-surface-highlight/30">
                  <span className="flex items-center gap-1 text-slate-400">
                    <PackageCheck className="w-3 h-3 text-emerald-400" />
                    Đơn hàng:
                  </span>
                  <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{hoveredItem.ordersCount}</strong>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3 h-3 text-blue-400" />
                    Nhân sự:
                  </span>
                  <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{hoveredItem.staffCount} người</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subtle Region Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono pt-4">
          {slices.map((item) => (
            <div
              key={item.region}
              className={cn(
                'flex items-center gap-1.5 cursor-pointer transition-opacity px-2 py-1 rounded hover:bg-surface-highlight/20',
                hoveredItem && hoveredItem.region !== item.region ? 'opacity-40' : 'opacity-100'
              )}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={handleMouseLeave}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className={isDarkMode ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'}>
                {item.region}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Operational Breakdown Footer */}
      <div
        className={cn(
          'pt-3 border-t grid grid-cols-2 gap-2 text-xs font-mono',
          isDarkMode ? 'border-[#3E4850]/40 text-[#88929B]' : 'border-slate-100 text-slate-500'
        )}
      >
        <div className="flex items-center gap-1.5">
          <MapPin className={cn('w-3.5 h-3.5', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600')} />
          <span>Thị trường dẫn đầu: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>TP.HCM</strong></span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <ShoppingBag className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Xe giao trong tháng: <strong className="text-[#10B981]">142 Xe</strong></span>
        </div>
      </div>
    </div>
  );
};
