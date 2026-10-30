import React from 'react';
import { Activity, Gauge, Navigation } from 'lucide-react';

export const ComparisonRadarBenchmark: React.FC = () => {
  return (
    <div className="p-6 sm:p-10 rounded-2xl bg-canvas-deep border border-surface-highlight shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Glow */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-accent-action/10 blur-[90px] pointer-events-none" />

      {/* Header and Legend */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-surface-highlight/50">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-accent-primary uppercase">
              DYNAMIC BENCHMARK
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Đánh Giá Toàn Diện Trực Quan
          </h3>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Mỗi phiên bản AutoHub GT-e được thiết kế cho triết lý cầm lái riêng biệt. Bản Grand Touring mang lại sự cân bằng hoàn hảo giữa phạm vi hoạt động xa nhất và gia tốc tức thời vượt trội.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-semibold shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-500" />
            <span className="text-text-muted">Standard</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-action shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
            <span className="text-accent-primary">Grand Touring</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(125,208,255,0.6)]" />
            <span className="text-sky-300">Track Edition</span>
          </div>
        </div>
      </div>

      {/* Comparative Progress Bars */}
      <div className="space-y-5">
        {/* Metric 1: Acceleration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-text-primary font-medium">
              <Activity className="w-4 h-4 text-accent-primary" />
              <span>Tăng tốc & Phản hồi chân ga (0-100 km/h)</span>
            </div>
            <span className="font-mono text-xs text-accent-primary">2.8s - 3.8s</span>
          </div>

          <div className="h-4 rounded-full bg-surface-elevated p-0.5 relative flex items-center overflow-hidden border border-surface-highlight/60">
            <div
              className="h-full rounded-full bg-slate-500/80 transition-all duration-1000"
              style={{ width: '74%' }}
              title="Standard: 3.8s"
            />
            <div
              className="h-full rounded-full bg-accent-action shadow-[0_0_10px_rgba(14,165,233,0.7)] transition-all duration-1000 -ml-2"
              style={{ width: '87%' }}
              title="Grand Touring: 3.2s"
            />
            <div
              className="h-full rounded-full bg-sky-300 shadow-[0_0_10px_rgba(125,208,255,0.7)] transition-all duration-1000 -ml-2"
              style={{ width: '100%' }}
              title="Track Edition: 2.8s"
            />
          </div>
        </div>

        {/* Metric 2: WLTP Range */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-text-primary font-medium">
              <Gauge className="w-4 h-4 text-accent-primary" />
              <span>Phạm vi di chuyển đường trường (WLTP Range)</span>
            </div>
            <span className="font-mono text-xs text-accent-primary">Max 680 KM</span>
          </div>

          <div className="h-4 rounded-full bg-surface-elevated p-0.5 relative flex items-center overflow-hidden border border-surface-highlight/60">
            <div
              className="h-full rounded-full bg-slate-500/80 transition-all duration-1000"
              style={{ width: '91%' }}
              title="Standard: 620 km"
            />
            <div
              className="h-full rounded-full bg-accent-action shadow-[0_0_10px_rgba(14,165,233,0.7)] transition-all duration-1000 -ml-2"
              style={{ width: '100%' }}
              title="Grand Touring: 680 km (Cao nhất)"
            />
            <div
              className="h-full rounded-full bg-sky-300 transition-all duration-1000 -ml-2"
              style={{ width: '88%' }}
              title="Track Edition: 600 km"
            />
          </div>
        </div>

        {/* Metric 3: LiDAR Intelligence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-text-primary font-medium">
              <Navigation className="w-4 h-4 text-accent-primary" />
              <span>Cấp độ trí tuệ tự hành HubPilot AI & LiDAR</span>
            </div>
            <span className="font-mono text-xs text-accent-primary">L2+ to L3+</span>
          </div>

          <div className="h-4 rounded-full bg-surface-elevated p-0.5 relative flex items-center overflow-hidden border border-surface-highlight/60">
            <div
              className="h-full rounded-full bg-slate-500/80 transition-all duration-1000"
              style={{ width: '50%' }}
              title="Standard: Level 2"
            />
            <div
              className="h-full rounded-full bg-accent-action shadow-[0_0_10px_rgba(14,165,233,0.7)] transition-all duration-1000 -ml-2"
              style={{ width: '85%' }}
              title="Grand Touring: Level 3 LiDAR 128 tia"
            />
            <div
              className="h-full rounded-full bg-sky-300 shadow-[0_0_10px_rgba(125,208,255,0.7)] transition-all duration-1000 -ml-2"
              style={{ width: '100%' }}
              title="Track Edition: Full Sensor Array Telemetry FIA"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
