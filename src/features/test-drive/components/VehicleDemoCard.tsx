import React from 'react';
import { Zap } from 'lucide-react';

interface VehicleDemoCardProps {
  modelName?: string;
  variantName?: string;
  year?: string;
  power?: string;
  acceleration?: string;
  range?: string;
}

export const VehicleDemoCard: React.FC<VehicleDemoCardProps> = ({
  modelName = 'AutoHub GT-e',
  variantName = 'AutoHub GT-e Grand Touring',
  year = 'MY 2025',
  power = '680',
  acceleration = '3.2',
  range = '680',
}) => {
  return (
    <div className="p-4 sm:p-5 rounded bg-surface-container border border-surface-highlight flex flex-col md:flex-row items-center gap-5">
      {/* Car Visual with Badges */}
      <div className="relative w-full md:w-72 h-44 rounded overflow-hidden bg-canvas-deep shrink-0 border border-surface-highlight/70 group">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f2d74d318bd26ac8a4616ee2717997a70a3b2b91?width=653"
          alt={variantName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas-deep/80 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-[2px] bg-canvas-deep/80 backdrop-blur-md border border-accent-primary/40 text-[9px] font-mono font-bold text-accent-primary">
            PHANTOM METALLIC
          </span>
          <span className="px-2 py-0.5 rounded-[2px] bg-accent-action/25 backdrop-blur-md border border-accent-primary/50 text-[9px] font-mono font-bold text-accent-primary">
            BẢN DEMO CAO CẤP
          </span>
        </div>
      </div>

      {/* Details & Telemetry Specs */}
      <div className="flex-1 space-y-3 w-full">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
            DÒNG XE TRẢI NGHIỆM • {modelName}
          </span>
          <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
            <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
              {variantName}
            </h3>
            <span className="text-xs font-mono font-semibold text-accent-primary">
              {year}
            </span>
          </div>
        </div>

        {/* 3 Telemetry Spec Chips */}
        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="p-2.5 rounded bg-surface-elevated/70 border border-surface-highlight/60 text-center space-y-0.5">
            <div className="text-[9px] font-mono text-text-muted uppercase">
              CÔNG SUẤT TỔNG
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-text-primary">
              {power} <span className="text-[10px] font-normal text-text-muted">HP</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-surface-elevated/70 border border-surface-highlight/60 text-center space-y-0.5">
            <div className="text-[9px] font-mono text-text-muted uppercase">
              0-100 KM/H
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-accent-primary">
              {acceleration} <span className="text-[10px] font-normal text-text-muted">SEC</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-surface-elevated/70 border border-surface-highlight/60 text-center space-y-0.5">
            <div className="text-[9px] font-mono text-text-muted uppercase">
              PHẠM VI WLTP
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-text-primary">
              {range} <span className="text-[10px] font-normal text-text-muted">KM</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-text-muted flex items-center gap-1.5 leading-relaxed">
          <Zap className="w-3.5 h-3.5 text-accent-primary shrink-0" />
          <span>Trang bị gói lái tự hành Level 3 LiDAR & hệ thống treo khí nén chủ động thích ứng.</span>
        </p>
      </div>
    </div>
  );
};
