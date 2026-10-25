import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  BatteryCharging,
  Users,
  ShieldCheck,
  Truck,
  ArrowRight,
  BookmarkCheck,
  Gauge,
} from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';
import type { AiRecommendedVehicle } from '@/types/ai.types';

export interface RecommendedCarCardProps {
  vehicle: AiRecommendedVehicle;
}

export const RecommendedCarCard: React.FC<RecommendedCarCardProps> = ({ vehicle }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full rounded-lg bg-[#131B2E] border border-[#3E4850]/60 shadow-2xl overflow-hidden space-y-6">
      {/* Top Image Visual Showcase */}
      <div className="relative h-72 sm:h-80 md:h-96 w-full bg-[#060E20] overflow-hidden group">
        <img
          src={vehicle.imageUrl}
          alt={vehicle.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        {/* Ambient Dark Gradient on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-[#131B2E]/30 to-transparent" />

        {/* Floating Glow Badges */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#89CEFF] text-[#00344D] font-mono text-[10px] font-bold tracking-[1px] shadow-[0_10px_15px_-3px_rgba(137,206,255,0.3)]">
            <Sparkles className="w-3 h-3 text-[#00344D]" />
            <span>{vehicle.badge}</span>
          </div>

          <div className="inline-flex items-center px-3 py-1 rounded-[2px] bg-[#2D3449]/90 backdrop-blur-md text-[#DAE2FD] font-mono text-[10px] font-bold tracking-[1.5px]">
            <span>{vehicle.categoryBadge}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#222A3D]/90 backdrop-blur-md text-[#89CEFF] font-mono text-[10px] font-bold tracking-[1.5px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#89CEFF] animate-pulse" />
            <span>{vehicle.availabilityBadge}</span>
          </div>
        </div>

        {/* Bottom Model Name & Price on Hero */}
        <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold text-[#88929B] tracking-[1.5px] uppercase block">
              {vehicle.flagshipLabel}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#DAE2FD] tracking-tight">
              {vehicle.name}
            </h3>
          </div>

          <div className="text-right">
            <span className="font-mono text-[10px] font-bold text-[#88929B] tracking-[1.5px] uppercase block">
              GIÁ NIÊM YẾT ĐỀ XUẤT
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-[#89CEFF] font-mono">
                {formatCurrencyVND(vehicle.listedPrice)}
              </span>
              <span className="text-[11px] text-[#88929B] font-normal">
                {vehicle.priceNote}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Details */}
      <div className="px-6 pb-6 space-y-6">
        {/* Vehicle Spec Grid (4 Stat Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* 1. TĂNG TỐC 0-100 */}
          <div className="p-3.5 rounded-[4px] bg-[#171F33] border border-[#3E4850]/40">
            <div className="flex items-center gap-2 text-[#88929B] mb-1">
              <Gauge className="w-3.5 h-3.5 text-[#89CEFF]" />
              <span className="font-mono text-[10px] uppercase tracking-[1.5px]">
                TĂNG TỐC 0-100
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#DAE2FD] font-mono">
                {vehicle.acceleration0100}
              </span>
              <span className="text-[10px] text-[#88929B] font-mono">GIÂY</span>
            </div>
          </div>

          {/* 2. TẦM VẬN HÀNH */}
          <div className="p-3.5 rounded-[4px] bg-[#171F33] border border-[#3E4850]/40">
            <div className="flex items-center gap-2 text-[#88929B] mb-1">
              <BatteryCharging className="w-3.5 h-3.5 text-[#89CEFF]" />
              <span className="font-mono text-[10px] uppercase tracking-[1.5px]">
                TẦM VẬN HÀNH
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#DAE2FD] font-mono">
                {vehicle.rangeKm}
              </span>
              <span className="text-[10px] text-[#88929B] font-mono">KM (WLTP)</span>
            </div>
          </div>

          {/* 3. KHOANG NỘI THẤT */}
          <div className="p-3.5 rounded-[4px] bg-[#171F33] border border-[#3E4850]/40">
            <div className="flex items-center gap-2 text-[#88929B] mb-1">
              <Users className="w-3.5 h-3.5 text-[#89CEFF]" />
              <span className="font-mono text-[10px] uppercase tracking-[1.5px]">
                KHOANG NỘI THẤT
              </span>
            </div>
            <p className="text-xs font-bold text-[#DAE2FD] truncate">{vehicle.interior}</p>
            <p className="text-[10px] text-[#88929B]">{vehicle.seats}</p>
          </div>

          {/* 4. AN TOÀN QUỐC TẾ */}
          <div className="p-3.5 rounded-[4px] bg-[#171F33] border border-[#3E4850]/40">
            <div className="flex items-center gap-2 text-[#88929B] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#89CEFF]" />
              <span className="font-mono text-[10px] uppercase tracking-[1.5px]">
                AN TOÀN QUỐC TẾ
              </span>
            </div>
            <p className="text-xs font-bold text-[#DAE2FD]">{vehicle.safetyRating}</p>
            <p className="text-[10px] text-[#88929B] truncate">{vehicle.safetyOrg}</p>
          </div>
        </div>

        {/* Delivery Guarantee Banner */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-[2px] bg-[#171F33] border border-[#3E4850]/40 text-[13px] text-[#BEC8D2]">
          <Truck className="w-4 h-4 text-[#89CEFF] flex-shrink-0" />
          <span>{vehicle.deliveryTime}</span>
        </div>

        {/* Interactive CTA Buttons Cluster Matching Figma */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* 1. Deposit 72h */}
          <button
            type="button"
            onClick={() => navigate(`/deposit/${vehicle.variantId}`)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] text-[#DAE2FD] border border-[#3E4850]/80 font-medium text-[13px] transition-colors"
          >
            <BookmarkCheck className="w-4 h-4 text-[#89CEFF]" />
            <span>
              Đặt cọc giữ xe 72h ({formatCurrencyVND(vehicle.depositAmount)})
            </span>
          </button>

          {/* 2. Primary CTA: Xem chi tiết xe (Figma #89CEFF button) */}
          <button
            type="button"
            onClick={() => navigate(`/cars/${vehicle.modelId}`)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[2px] bg-[#89CEFF] hover:bg-[#89CEFF]/90 text-[#00344D] font-bold text-[13px] shadow-[0_4px_6px_-1px_rgba(137,206,255,0.25)] transition-all"
          >
            <span>Xem chi tiết xe</span>
            <ArrowRight className="w-4 h-4 text-[#00344D]" />
          </button>

          {/* 3. Lái thử xe */}
          <button
            type="button"
            onClick={() => navigate('/test-drive')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] text-[#89CEFF] border border-[#3E4850]/80 text-[13px] font-medium transition-colors"
          >
            <Zap className="w-4 h-4 text-[#89CEFF]" />
            <span>Đăng ký lái thử</span>
          </button>
        </div>
      </div>
    </div>
  );
};
