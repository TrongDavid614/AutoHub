import React from 'react';
import { Zap, ShieldCheck, ChevronDown } from 'lucide-react';
import type { MockCar } from '../mocks/car.mock';

export interface ModelRibbonProps {
  currentCar?: MockCar | null;
  allCars?: MockCar[];
  onSelectCar?: (carId: string) => void;
}

export const ModelRibbon: React.FC<ModelRibbonProps> = ({
  currentCar,
  allCars = [],
  onSelectCar,
}) => {
  const carName = currentCar?.name || 'AutoHub GT-e';
  const segment = currentCar?.segment || 'Sedan thể thao thuần điện';
  const powertrain = currentCar?.powertrain || 'Kiến trúc điện áp cao 800V SiC';
  const charging = currentCar?.charging || 'Sạc 10-80% trong 15 phút';

  const initials = carName.includes('VinFast')
    ? 'VF'
    : carName.includes('Porsche')
    ? 'PO'
    : carName.includes('Tesla')
    ? 'TS'
    : carName.slice(0, 2).toUpperCase();

  return (
    <div className="p-5 sm:p-6 rounded-lg bg-surface-container border border-surface-highlight shadow-lg space-y-4">
      {/* Ribbon Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-primary">
          DÒNG XE ĐƯỢC CHỌN
        </span>

        {allCars && allCars.length > 1 ? (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-text-muted hidden sm:inline uppercase">
              Đổi dòng xe:
            </span>
            <div className="relative inline-flex items-center">
              <select
                value={currentCar?.id || ''}
                onChange={(e) => onSelectCar?.(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1 rounded bg-surface-elevated border border-surface-highlight hover:border-accent-primary/60 text-text-primary text-xs font-medium cursor-pointer focus:outline-none focus:border-accent-primary transition-colors shadow-sm"
              >
                {allCars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2 pointer-events-none" />
            </div>
          </div>
        ) : (
          <div className="px-2.5 py-0.5 rounded-[2px] bg-accent-action/20 border border-accent-primary/30 text-accent-primary font-mono text-[10px] font-bold tracking-wider uppercase">
            {segment}
          </div>
        )}
      </div>

      {/* Ribbon Card */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-elevated border border-surface-highlight/70">
        {currentCar?.image ? (
          <img
            src={currentCar.image}
            alt={carName}
            className="w-16 h-12 rounded-lg object-cover border border-[var(--line)] shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/25 flex items-center justify-center text-[var(--accent)] font-bold text-lg tracking-tight shrink-0">
            {initials}
          </div>
        )}

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-text-primary tracking-tight truncate">
              {carName}
            </h2>
            <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <ShieldCheck className="w-3 h-3" />
              <span>{powertrain.toLowerCase().includes('hybrid') ? 'HYBRID CAO CẤP' : 'PIN SIÊU DẪN'}</span>
            </div>
          </div>
          <p className="text-xs text-text-muted flex items-center gap-1.5 truncate">
            <Zap className="w-3.5 h-3.5 text-accent-primary shrink-0" />
            <span className="truncate">{powertrain} • {charging}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
