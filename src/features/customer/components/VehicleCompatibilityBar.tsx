import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import type { CarModelInfo } from '@/features/customer/mocks/accessory.mock';

export interface VehicleCompatibilityBarProps {
  carModel: CarModelInfo;
  accessoryCount?: number;
  onChangeCarClick: () => void;
}

export const VehicleCompatibilityBar: React.FC<VehicleCompatibilityBarProps> = ({
  carModel,
  onChangeCarClick,
}) => {
  return (
    <section className="w-full bg-[#060E20] border-b border-[#2D3449]/80 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2px] bg-[#131B2E] border border-[#2D3449] p-5 md:p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Subtle Electric Ambient Glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#89CEFF]/10 via-transparent to-[#89CEFF]/5" />

          {/* Left Info Cluster */}
          <div className="relative flex items-center gap-4 z-10">
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
          </div>

          {/* Right Action: Change Vehicle */}
          <div className="relative z-10 self-start lg:self-center">
            <button
              onClick={onChangeCarClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3449] text-[#DAE2FD] hover:text-[#89CEFF] border border-[#3E4850]/80 hover:border-[#89CEFF]/60 text-sm font-medium transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4 text-[#89CEFF]" />
              <span>Đổi dòng xe</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
