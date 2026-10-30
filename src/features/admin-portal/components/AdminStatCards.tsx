import React from 'react';
import { PackageCheck, Car, CalendarClock, TrendingUp, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { MOCK_DASHBOARD_KPIS, type KpiMetric } from '../mocks/dashboard.mock';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';

export interface AdminStatCardsProps {
  kpis?: KpiMetric[];
}

export const AdminStatCards: React.FC<AdminStatCardsProps> = ({
  kpis = MOCK_DASHBOARD_KPIS,
}) => {
  const { isDarkMode } = useAdminTheme();

  const getIcon = (id: string) => {
    switch (id) {
      case 'kpi-accessory-rev':
        return <PackageCheck className={cn('w-5 h-5', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600')} />;
      case 'kpi-car-deposits':
        return <Car className="w-5 h-5 text-[#F59E0B]" />;
      case 'kpi-test-drives':
        return <CalendarClock className="w-5 h-5 text-[#0EA5E9]" />;
      case 'kpi-conversion-rate':
        return <TrendingUp className="w-5 h-5 text-[#10B981]" />;
      default:
        return <TrendingUp className={cn('w-5 h-5', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600')} />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        // Generate SVG sparkline path
        const max = Math.max(...kpi.sparklineData);
        const min = Math.min(...kpi.sparklineData);
        const range = max - min || 1;
        const width = 120;
        const height = 36;
        const points = kpi.sparklineData.map((val, idx) => {
          const x = (idx / (kpi.sparklineData.length - 1)) * width;
          const y = height - ((val - min) / range) * (height - 6) - 3;
          return `${x},${y}`;
        });
        const pathD = `M ${points.join(' L ')}`;
        const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

        const isWarning = kpi.badgeType === 'warning';
        const isSuccess = kpi.badgeType === 'success';

        return (
          <div
            key={kpi.id}
            className={cn(
              'group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 flex flex-col justify-between',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 shadow-lg hover:border-[#89CEFF]/50 text-white'
                : 'bg-white border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md text-slate-900'
            )}
          >
            {/* Top Bar: Icon, Title & Badge */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'p-2.5 rounded-lg border transition-colors',
                      isDarkMode
                        ? 'bg-[#171F33] border-[#3E4850]/60 group-hover:border-[#89CEFF]/40'
                        : 'bg-slate-50 border-slate-200 group-hover:border-blue-300'
                    )}
                  >
                    {getIcon(kpi.id)}
                  </div>
                  <div>
                    <h3
                      className={cn(
                        'text-xs font-semibold uppercase tracking-wider',
                        isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
                      )}
                    >
                      {kpi.title}
                    </h3>
                  </div>
                </div>

                {/* Badge */}
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold',
                    isWarning
                      ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 animate-pulse'
                      : isSuccess
                      ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                      : isDarkMode
                      ? 'bg-[#89CEFF]/15 text-[#89CEFF] border border-[#89CEFF]/30'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  )}
                >
                  {isWarning ? (
                    <AlertTriangle className="w-2.5 h-2.5" />
                  ) : (
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  )}
                  {kpi.badgeText}
                </span>
              </div>

              {/* Main Metric Value */}
              <div>
                <div
                  className={cn(
                    'text-xl sm:text-2xl font-mono font-black tracking-tight',
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  )}
                >
                  {kpi.value}
                </div>
                <p
                  className={cn(
                    'text-[11px] mt-1 line-clamp-1',
                    isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-600'
                  )}
                >
                  {kpi.subtitle}
                </p>
              </div>
            </div>

            {/* Bottom Row: Target Progress & Mini Sparkline */}
            <div
              className={cn(
                'pt-4 mt-3 border-t flex items-end justify-between gap-2',
                isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-100'
              )}
            >
              <div className="space-y-1">
                <div
                  className={cn(
                    'text-[10px] font-mono font-bold',
                    isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'
                  )}
                >
                  {kpi.targetLabel}
                </div>
                <div
                  className={cn(
                    'text-[10px] font-mono',
                    isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                  )}
                >
                  {kpi.subtitle}
                </div>
              </div>

              {/* Sparkline Graphic */}
              <div className="w-[120px] h-[36px] flex-shrink-0">
                <svg width={width} height={height} className="overflow-visible">
                  <defs>
                    <linearGradient id={`spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={isWarning ? '#F59E0B' : isDarkMode ? '#89CEFF' : '#0284C7'}
                        stopOpacity="0.25"
                      />
                      <stop
                        offset="100%"
                        stopColor={isWarning ? '#F59E0B' : isDarkMode ? '#89CEFF' : '#0284C7'}
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                  </defs>
                  <path d={areaD} fill={`url(#spark-${kpi.id})`} />
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isWarning ? '#F59E0B' : isDarkMode ? '#89CEFF' : '#0284C7'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
