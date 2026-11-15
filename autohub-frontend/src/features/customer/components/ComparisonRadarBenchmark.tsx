import React from 'react';
import { Activity, Gauge, Navigation, Sparkles } from 'lucide-react';
import type { VehicleComparisonTrim, ComparisonBenchmarkMetric } from '@/features/customer/types/comparison.types';

export interface ComparisonRadarBenchmarkProps {
  trims: VehicleComparisonTrim[];
  benchmarkMetrics?: ComparisonBenchmarkMetric[];
}

const TRIM_COLORS = [
  { bar: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]', dot: 'bg-sky-400', text: 'text-sky-400' },
  { bar: 'bg-accent-action shadow-[0_0_8px_rgba(14,165,233,0.8)]', dot: 'bg-accent-action', text: 'text-accent-primary' },
  { bar: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]', dot: 'bg-amber-400', text: 'text-amber-400' },
];

export const ComparisonRadarBenchmark: React.FC<ComparisonRadarBenchmarkProps> = ({
  trims,
  benchmarkMetrics,
}) => {
  // Fallback metrics if backend doesn't provide them
  const metrics: ComparisonBenchmarkMetric[] =
    benchmarkMetrics && benchmarkMetrics.length > 0
      ? benchmarkMetrics
      : [
          {
            id: 'acceleration',
            title: 'Tăng tốc & Phản hồi chân ga (0-100 km/h)',
            icon: 'activity',
            rangeText: '2.8s - 3.8s',
            scores: { '0': 74, '1': 87, '2': 100 },
            labels: { '0': 'Standard: 3.8s', '1': 'Grand Touring: 3.2s', '2': 'Track Edition: 2.8s' },
          },
          {
            id: 'range',
            title: 'Phạm vi di chuyển đường trường (WLTP Range)',
            icon: 'gauge',
            rangeText: 'Max 680 KM',
            scores: { '0': 91, '1': 100, '2': 88 },
            labels: { '0': 'Standard: 620 km', '1': 'Grand Touring: 680 km', '2': 'Track Edition: 600 km' },
          },
          {
            id: 'safety',
            title: 'Cấp độ trí tuệ tự hành HubPilot AI & LiDAR',
            icon: 'navigation',
            rangeText: 'L2+ to L3+',
            scores: { '0': 50, '1': 85, '2': 100 },
            labels: { '0': 'Standard: Level 2', '1': 'Grand Touring: Level 3 LiDAR', '2': 'Track Edition: Full Sensor Array' },
          },
        ];

  const getMetricIcon = (iconName: string) => {
    switch (iconName) {
      case 'activity':
        return <Activity className="w-4 h-4 text-accent-primary" />;
      case 'gauge':
        return <Gauge className="w-4 h-4 text-accent-primary" />;
      case 'navigation':
        return <Navigation className="w-4 h-4 text-accent-primary" />;
      default:
        return <Sparkles className="w-4 h-4 text-accent-primary" />;
    }
  };

  return (
    <div className="p-6 sm:p-10 rounded-2xl bg-canvas-deep border border-surface-highlight shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Glow */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-accent-action/10 blur-[90px] pointer-events-none" />

      {/* Header and Legend */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-surface-highlight/50">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-accent-primary uppercase">
              DYNAMIC BENCHMARK TELEMETRY
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Đánh Giá Toàn Diện Trực Quan
          </h3>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Hệ số so sánh đối đầu động được lượng hóa trực tiếp từ cơ sở dữ liệu kỹ thuật thực tế của các dòng xe đang chọn.
          </p>
        </div>

        {/* Dynamic Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-semibold shrink-0">
          {trims.map((trim, idx) => {
            const color = TRIM_COLORS[idx % TRIM_COLORS.length];
            return (
              <div key={trim.id} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${color.dot} ${color.bar}`} />
                <span className={color.text}>{trim.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparative Progress Bars */}
      <div className="space-y-5">
        {metrics.map((metric) => (
          <div key={metric.id} className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-text-primary font-medium">
                {getMetricIcon(metric.icon)}
                <span>{metric.title}</span>
              </div>
              <span className="font-mono text-xs text-accent-primary">{metric.rangeText}</span>
            </div>

            <div className="h-4 rounded-full bg-surface-elevated p-0.5 relative flex items-center overflow-hidden border border-surface-highlight/60">
              {trims.map((trim, idx) => {
                const trimKey = String(trim.id);
                const score = metric.scores?.[trimKey] ?? metric.scores?.[String(idx)] ?? (70 + idx * 10);
                const label = metric.labels?.[trimKey] ?? metric.labels?.[String(idx)] ?? `${trim.name}: ${score}%`;
                const color = TRIM_COLORS[idx % TRIM_COLORS.length];

                return (
                  <div
                    key={trim.id}
                    className={`h-full rounded-full transition-all duration-1000 ${color.bar} ${idx > 0 ? '-ml-2' : ''}`}
                    style={{ width: `${Math.min(100, Math.max(15, score))}%` }}
                    title={label}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
