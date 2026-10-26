import React from 'react';
import { Building2, Home, Check } from 'lucide-react';

export type LocationType = 'SHOWROOM' | 'HOME';

interface LocationSelectorProps {
  selectedLocation: LocationType;
  onSelectLocation: (loc: LocationType) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onSelectLocation,
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-primary">
          ĐỊA ĐIỂM TRẢI NGHIỆM
        </span>
        <span className="text-xs text-accent-primary font-medium">
          2 hình thức linh hoạt
        </span>
      </div>

      {/* 2 Option Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Option 1: Showroom Flagship Q7 */}
        <button
          type="button"
          onClick={() => onSelectLocation('SHOWROOM')}
          className={`p-4 rounded border text-left transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
            selectedLocation === 'SHOWROOM'
              ? 'bg-surface-elevated border-accent-primary ring-1 ring-accent-primary/60 shadow-[0_0_20px_rgba(14,165,233,0.18)]'
              : 'bg-surface-container/60 border-surface-highlight hover:border-surface-interactive hover:bg-surface-container'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedLocation === 'SHOWROOM'
                      ? 'border-accent-primary bg-accent-action'
                      : 'border-surface-highlight bg-canvas-deep'
                  }`}
                >
                  {selectedLocation === 'SHOWROOM' && (
                    <Check className="w-3 h-3 text-accent-contrast stroke-[3]" />
                  )}
                </div>
                <h4 className="text-sm sm:text-base font-bold text-text-primary">
                  Showroom AutoHub Q7 Flagship
                </h4>
              </div>

              <span className="px-2 py-0.5 rounded-[2px] bg-accent-action text-accent-contrast font-mono text-[9px] font-black uppercase tracking-wider shrink-0 shadow">
                ƯU TIÊN
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed pl-6">
              Tầng G, Crescent Mall / Phú Mỹ Hưng, Nguyễn Văn Linh, Q.7, TP.HCM
            </p>
          </div>

          <div className="pt-2 border-t border-surface-highlight/50 flex items-center gap-1.5 text-[11px] text-text-muted pl-6">
            <Building2 className="w-3.5 h-3.5 text-accent-primary shrink-0" />
            <span>Cung đường cao tốc thử nghiệm & trạm sạc SuperCharge 800V độc quyền.</span>
          </div>
        </button>

        {/* Option 2: Lái thử tại nhà */}
        <button
          type="button"
          onClick={() => onSelectLocation('HOME')}
          className={`p-4 rounded border text-left transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
            selectedLocation === 'HOME'
              ? 'bg-surface-elevated border-accent-primary ring-1 ring-accent-primary/60 shadow-[0_0_20px_rgba(14,165,233,0.18)]'
              : 'bg-surface-container/60 border-surface-highlight hover:border-surface-interactive hover:bg-surface-container'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  selectedLocation === 'HOME'
                    ? 'border-accent-primary bg-accent-action'
                    : 'border-surface-highlight bg-canvas-deep'
                }`}
              >
                {selectedLocation === 'HOME' && (
                  <Check className="w-3 h-3 text-accent-contrast stroke-[3]" />
                )}
              </div>
              <h4 className="text-sm sm:text-base font-bold text-text-primary">
                Lái thử tại Nhà / Nơi làm việc
              </h4>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed pl-6">
              Bàn giao xe demo và chuyên viên kỹ thuật viên phục vụ tận nơi trong bán kính 20km nội thành.
            </p>
          </div>

          <div className="pt-2 border-t border-surface-highlight/50 flex items-center gap-1.5 text-[11px] text-text-muted pl-6">
            <Home className="w-3.5 h-3.5 text-accent-primary shrink-0" />
            <span>Hỗ trợ xác nhận lộ trình riêng tư phù hợp thói quen di chuyển hàng ngày.</span>
          </div>
        </button>
      </div>
    </div>
  );
};
