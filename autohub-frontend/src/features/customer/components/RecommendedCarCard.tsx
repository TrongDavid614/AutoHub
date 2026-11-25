import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
  onSelectPrompt?: (prompt: string, contextCarId?: number, contextCarName?: string) => void;
  isSending?: boolean;
}

export const RecommendedCarCard: React.FC<RecommendedCarCardProps> = ({
  vehicle,
  onSelectPrompt,
  isSending = false
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full rounded-xl bg-[var(--surface)] border border-[var(--line)] overflow-hidden">
      {/* Studio Vehicle Image */}
      <div className="relative aspect-[16/10] max-h-80 w-full bg-[var(--surface-subtle)] overflow-hidden border-b border-[var(--line)]">
        <img
          src={vehicle.imageUrl}
          alt={vehicle.name}
          className="w-full h-full object-cover object-center"
        />

        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-[var(--accent)] text-white text-xs font-semibold">
            {vehicle.badge}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[var(--surface)]/95 border border-[var(--line)] text-[var(--text)] text-xs font-medium">
            {vehicle.availabilityBadge}
          </span>
        </div>
      </div>

      {/* Main Body Details */}
      <div className="p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">
              {vehicle.flagshipLabel} • {vehicle.categoryBadge}
            </p>
            <h3 className="text-xl font-bold text-[var(--text)] tracking-tight mt-0.5">
              {vehicle.name}
            </h3>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-[var(--text-muted)] block">
              Giá niêm yết đề xuất
            </span>
            <div className="flex items-baseline sm:justify-end gap-2">
              <span className="text-xl font-bold text-[var(--accent)] tabular-nums">
                {formatCurrencyVND(vehicle.listedPrice)}
              </span>
            </div>
            {vehicle.priceNote && (
              <span className="text-xs text-[var(--text-muted)]">{vehicle.priceNote}</span>
            )}
          </div>
        </div>

        {/* Unified Spec Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-[var(--line)] rounded-lg bg-[var(--surface-subtle)] divide-y md:divide-y-0 md:divide-x divide-[var(--line)]">
          <div className="p-3">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] mb-1">
              <Gauge className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-xs font-medium">Tăng tốc 0–100</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-[var(--text)] tabular-nums">
                {vehicle.acceleration0100}
              </span>
              <span className="text-xs text-[var(--text-muted)]">giây</span>
            </div>
          </div>

          <div className="p-3">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] mb-1">
              <BatteryCharging className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-xs font-medium">Tầm vận hành</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-[var(--text)] tabular-nums">
                {vehicle.rangeKm}
              </span>
              <span className="text-xs text-[var(--text-muted)]">km (WLTP)</span>
            </div>
          </div>

          <div className="p-3">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] mb-1">
              <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-xs font-medium">Khoang nội thất</span>
            </div>
            <p className="text-xs font-semibold text-[var(--text)] truncate">{vehicle.interior}</p>
            <p className="text-xs text-[var(--text-muted)]">{vehicle.seats}</p>
          </div>

          <div className="p-3">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-medium">An toàn quốc tế</span>
            </div>
            <p className="text-xs font-semibold text-[var(--text)]">{vehicle.safetyRating}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{vehicle.safetyOrg}</p>
          </div>
        </div>

        {/* Delivery Guarantee Note */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-2)]">
          <Truck className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
          <span>{vehicle.deliveryTime}</span>
        </div>

        {/* Actions: 1 Primary CTA + Secondary Outline Actions */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={() => navigate(`/cars/${vehicle.modelId}`)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <span>Xem chi tiết xe</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => navigate(`/deposit/${vehicle.variantId}`)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)] border border-[var(--line)] font-medium text-sm transition-colors cursor-pointer"
          >
            <BookmarkCheck className="w-4 h-4 text-[var(--accent)]" />
            <span className="tabular-nums">
              Đặt cọc giữ xe 72h ({formatCurrencyVND(vehicle.depositAmount)})
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSelectPrompt) {
                onSelectPrompt('Tôi muốn đăng ký lái thử xe', vehicle.variantId, vehicle.name);
              } else {
                navigate('/test-drive');
              }
            }}
            disabled={isSending}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--accent)] border border-[var(--line)] text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>Đăng ký lái thử</span>
          </button>
        </div>
      </div>
    </div>
  );
};
