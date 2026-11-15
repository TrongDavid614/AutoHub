import React from 'react';
import { ArrowLeftRight, Car, Layers, X } from 'lucide-react';
import type { CarModelInfo } from '@/features/customer/mocks/accessory.mock';

export interface VehicleCompatibilityBarProps {
  carModel?: CarModelInfo | null;
  accessoryCount?: number;
  onChangeCarClick: () => void;
  onClearCarClick?: () => void;
}

export const VehicleCompatibilityBar: React.FC<VehicleCompatibilityBarProps> = ({
  carModel,
  onChangeCarClick,
  onClearCarClick,
}) => {
  return (
    <section className="w-full bg-[#060E20] border-b border-[#2D3449]/80 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2px] bg-[#131B2E] border border-[#2D3449] p-5 md:p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Subtle Electric Ambient Glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#89CEFF]/10 via-transparent to-[#89CEFF]/5" />

          {/* Left Info Cluster */}
          <div className="relative flex items-center gap-4 z-10">
            {carModel ? (
              <>
                {/* Car Thumbnail */}
                <div className="w-12 h-12 rounded-[2px] overflow-hidden bg-[#060E20] border border-[#2D3449] flex-shrink-0 flex items-center justify-center shadow-md">
                  <img
                    src={carModel.thumbnailUrl}
                    alt={carModel.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1.5">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] font-mono text-[10px] font-bold tracking-wider uppercase border border-[#0EA5E9]/30">
                      XÁC THỰC OEM 100%
                    </span>
                    <span className="text-[#88929B] font-mono text-[10px] font-bold tracking-[1.5px] uppercase">
                      VIN COMPLIANT: {carModel.architecture}
                    </span>
                  </div>

                  {/* Title & Year */}
                  <div className="flex items-baseline gap-2 flex-wrap text-base md:text-lg">
                    <span className="font-semibold text-[#DAE2FD]">Đang chọn phụ kiện cho:</span>
                    <span className="font-bold text-[#89CEFF]">{carModel.name}</span>
                    <span className="text-xs md:text-sm text-[#BEC8D2] font-medium">({carModel.yearRange})</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* All Cars Icon */}
                <div className="w-12 h-12 rounded-[2px] bg-[#0EA5E9]/15 border border-[#0EA5E9]/40 flex-shrink-0 flex items-center justify-center text-[#89CEFF] shadow-md">
                  <Layers className="w-6 h-6 text-[#89CEFF]" />
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] font-mono text-[10px] font-bold tracking-wider uppercase border border-[#0EA5E9]/30">
                      XÁC THỰC OEM 100%
                    </span>
                    <span className="text-[#88929B] font-mono text-[10px] font-bold tracking-[1.5px] uppercase">
                      TẤT CẢ DÒNG XE AUTOHUB
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 flex-wrap text-base md:text-lg">
                    <span className="font-bold text-white">Toàn Bộ Phụ Kiện Chính Hãng AutoHub</span>
                    <span className="text-xs text-[#88929B] font-medium">
                      (Trạm sạc, camera LiDAR, thảm sàn, phụ kiện nâng cấp)
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Action: Change or Clear Vehicle */}
          <div className="relative z-10 flex items-center gap-3 self-start lg:self-center">
            {carModel && onClearCarClick && (
              <button
                type="button"
                onClick={onClearCarClick}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] text-[#88929B] hover:text-[#DAE2FD] border border-[#2D3449] text-xs font-semibold transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Xem tất cả phụ kiện</span>
              </button>
            )}

            <button
              type="button"
              onClick={onChangeCarClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3449] text-[#DAE2FD] hover:text-[#89CEFF] border border-[#3E4850]/80 hover:border-[#89CEFF]/60 text-sm font-medium transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {carModel ? (
                <>
                  <ArrowLeftRight className="w-4 h-4 text-[#89CEFF]" />
                  <span>Đổi dòng xe</span>
                </>
              ) : (
                <>
                  <Car className="w-4 h-4 text-[#89CEFF]" />
                  <span>Lọc theo dòng xe của bạn</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
