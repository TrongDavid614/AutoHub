import React from 'react';
import { Zap, ChevronDown } from 'lucide-react';

interface AvailableCarOption {
  id: string | number;
  name: string;
  subtitle?: string;
  power?: string;
  acceleration?: string;
  range?: string;
  image?: string;
}

interface VehicleDemoCardProps {
  modelName?: string;
  variantName?: string;
  year?: string;
  power?: string;
  acceleration?: string;
  range?: string;
  imageUrl?: string;
  availableCars?: AvailableCarOption[];
  selectedCarId?: string | number;
  onSelectCar?: (carId: string) => void;
}

export const VehicleDemoCard: React.FC<VehicleDemoCardProps> = ({
  modelName = 'AutoHub GT-e',
  variantName = 'AutoHub GT-e Grand Touring',
  year = 'MY 2025',
  power = '680',
  acceleration = '3.2',
  range = '680',
  imageUrl,
  availableCars,
  selectedCarId,
  onSelectCar,
}) => {
  const displayImage =
    imageUrl ||
    'https://api.builder.io/api/v1/image/assets/TEMP/f2d74d318bd26ac8a4616ee2717997a70a3b2b91?width=653';

  return (
    <div className="p-4 sm:p-5 rounded bg-surface-container border border-surface-highlight flex flex-col md:flex-row items-center gap-5">
      {/* Car Visual with Badges */}
      <div className="relative w-full md:w-72 h-44 rounded-lg overflow-hidden bg-[var(--surface-subtle)] shrink-0 border border-[var(--line)]">
        <img
          src={displayImage}
          alt={variantName}
          className="w-full h-full object-cover object-center"
        />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-white/95 border border-[var(--line)] text-xs font-medium text-[var(--text)]">
            Phantom Metallic
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white/95 border border-[var(--line)] text-xs font-semibold text-[var(--accent)]">
            Bản Demo
          </span>
        </div>
      </div>

      {/* Details & Telemetry Specs */}
      <div className="flex-1 space-y-3 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

          {availableCars && availableCars.length > 0 && onSelectCar && (
            <div className="relative">
              <label htmlFor="carSelect" className="sr-only">Đổi dòng xe</label>
              <select
                id="carSelect"
                value={String(selectedCarId || '')}
                onChange={(e) => onSelectCar(e.target.value)}
                className="appearance-none bg-canvas-deep border border-surface-highlight hover:border-accent-primary/60 text-accent-primary text-xs font-semibold py-1.5 pl-3 pr-8 rounded cursor-pointer focus:outline-none"
              >
                {availableCars.map((c) => (
                  <option key={c.id} value={String(c.id)} className="bg-surface-container text-text-primary">
                    Đổi xe: {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-accent-primary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
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
