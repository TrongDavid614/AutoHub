import React from 'react';
import { MapPin, Info } from 'lucide-react';
import type { CityOption } from '../types/estimator.types';

interface CitySelectorProps {
  cities: CityOption[];
  selectedCityId: string;
  onSelectCity: (id: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  cities,
  selectedCityId,
  onSelectCity,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-lg bg-surface-container border border-surface-highlight shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-primary">
          TỈNH / THÀNH PHỐ ĐĂNG KÝ BIỂN SỐ
        </span>
        <div className="px-2 py-0.5 rounded-[2px] bg-accent-primary/10 border border-accent-primary/30 text-accent-primary font-mono text-[10px] font-bold tracking-wider">
          QUY ĐỊNH 2025
        </div>
      </div>

      {/* Select Dropdown */}
      <div className="space-y-3">
        <div className="relative flex items-center">
          <MapPin className="w-4 h-4 text-accent-primary absolute left-3 pointer-events-none" />
          <select
            value={selectedCityId}
            onChange={(e) => onSelectCity(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-canvas-deep border border-surface-highlight hover:border-accent-primary/50 focus:border-accent-primary rounded text-xs sm:text-sm text-text-primary font-medium focus:outline-none cursor-pointer transition-colors"
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.displayLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Regulatory Note */}
        <div className="p-3 rounded bg-surface-elevated/70 border border-surface-highlight/70 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            Theo Nghị định hiện hành, ô tô điện chạy pin được hưởng khung ưu đãi tỷ lệ thu lệ phí trước bạ lần đầu đặc biệt hỗ trợ chuyển dịch năng lượng xanh.
          </p>
        </div>
      </div>
    </div>
  );
};
