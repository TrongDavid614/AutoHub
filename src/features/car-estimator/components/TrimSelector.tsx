import React from 'react';
import { Check } from 'lucide-react';
import type { TrimId, TrimOption } from '../types/estimator.types';

interface TrimSelectorProps {
  trims: TrimOption[];
  selectedTrimId: TrimId;
  onSelectTrim: (id: TrimId) => void;
}

export const TrimSelector: React.FC<TrimSelectorProps> = ({
  trims,
  selectedTrimId,
  onSelectTrim,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-lg bg-surface-container border border-surface-highlight shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-primary">
          PHIÊN BẢN & HIỆU NĂNG
        </span>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
          BẢO HÀNH 8 NĂM PIN TOÀN DIỆN
        </span>
      </div>

      {/* 3 Tiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {trims.map((trim) => {
          const isSelected = selectedTrimId === trim.id;
          return (
            <button
              key={trim.id}
              type="button"
              onClick={() => onSelectTrim(trim.id)}
              className={`text-left p-4 rounded border transition-all cursor-pointer relative flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-surface-elevated border-accent-primary ring-1 ring-accent-primary/60 shadow-[0_0_20px_rgba(14,165,233,0.2)]'
                  : 'bg-surface-elevated/70 border-surface-highlight hover:border-surface-interactive hover:bg-surface-elevated'
              }`}
            >
              {/* Recommended Badge */}
              {trim.isRecommended && (
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-[2px] bg-accent-action text-accent-contrast font-mono text-[9px] font-black uppercase tracking-wider shadow">
                  KHUYÊN DÙNG
                </div>
              )}

              {/* Title & Radio Icon */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">
                    {trim.name}
                  </h3>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-accent-primary bg-accent-action'
                        : 'border-surface-highlight bg-canvas-deep'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-accent-contrast stroke-[3]" />}
                  </div>
                </div>
                <div className="text-[11px] font-mono text-text-muted">
                  {trim.spec}
                </div>
              </div>

              {/* Price & WLTP Range */}
              <div className="pt-2 border-t border-surface-highlight/50 space-y-1">
                <div className="text-[9px] font-mono text-text-muted uppercase">
                  GIÁ NIÊM YẾT
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-text-primary">
                  {trim.priceFormatted}
                </div>
                <div className="text-[10px] font-mono text-accent-primary">
                  {trim.wltp}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
