import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Calendar, Sliders, RefreshCw, X, Plus, ExternalLink } from 'lucide-react';
import type { VehicleComparisonTrim } from '@/features/customer/types/comparison.types';

export interface ComparisonVehicleCardsProps {
  trims: VehicleComparisonTrim[];
  onOpenDeposit: (trim: VehicleComparisonTrim) => void;
  onOpenTestDrive: (trim: VehicleComparisonTrim) => void;
  onRemoveTrim?: (trimId: string | number) => void;
  onChangeTrim?: (trim: VehicleComparisonTrim) => void;
  onAddTrim?: () => void;
}

export const ComparisonVehicleCards: React.FC<ComparisonVehicleCardsProps> = ({
  trims,
  onOpenDeposit,
  onOpenTestDrive,
  onRemoveTrim,
  onChangeTrim,
  onAddTrim,
}) => {
  const maxCars = 3;
  const emptySlotsCount = Math.max(0, maxCars - trims.length);

  return (
    <div className="rounded-xl bg-surface-container/95 border border-surface-highlight p-4 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Col 1-3: Label Header Column */}
        <div className="md:col-span-3 flex flex-col justify-between p-2 pb-4 space-y-3 border-b md:border-b-0 md:border-r border-surface-highlight/60">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-accent-primary">
              <Sliders className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                THÔNG SỐ & CẤU HÌNH
              </span>
            </div>

            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              {trims.length} Mẫu Xe Trực Diện
            </h2>

            <p className="text-xs text-text-muted leading-relaxed">
              Đối chiếu chi tiết từng trang bị công nghệ, hiệu năng động cơ và tiện nghi giữa các phiên bản xe.
            </p>
          </div>

          {onAddTrim && trims.length < maxCars && (
            <button
              type="button"
              onClick={onAddTrim}
              className="no-print w-full py-2 px-3 rounded border border-dashed border-accent-primary/50 hover:border-accent-primary text-accent-primary hover:bg-accent-primary/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm xe vào slot ({trims.length}/3)</span>
            </button>
          )}
        </div>

        {/* Col 4-12: Vehicle Cards */}
        {trims.map((trim) => {
          const isRecommended = trim.badgeVariant === 'accent' || trim.badge === 'KHUYÊN DÙNG';

          return (
            <div
              key={trim.id}
              className={`md:col-span-3 p-4 rounded-lg flex flex-col justify-between gap-4 border transition-all relative ${
                isRecommended
                  ? 'bg-surface-elevated border-accent-primary ring-1 ring-accent-primary/60 shadow-[0_0_20px_rgba(14,165,233,0.2)]'
                  : 'bg-surface-elevated/70 border-surface-highlight hover:border-surface-interactive'
              }`}
            >
              {/* Badge if present */}
              {trim.badge && (
                <div
                  className={`absolute -top-2.5 left-4 px-2 py-0.5 rounded-[2px] font-mono text-[9px] font-black uppercase tracking-wider shadow z-10 ${
                    isRecommended
                      ? 'bg-accent-action text-accent-contrast'
                      : 'bg-[#1E293B] text-accent-primary border border-accent-primary/40'
                  }`}
                >
                  {trim.badge}
                </div>
              )}

              {/* Action tools: Swap and Remove */}
              <div className="no-print absolute top-3 right-3 flex items-center gap-1.5 z-10">
                {onChangeTrim && (
                  <button
                    type="button"
                    onClick={() => onChangeTrim(trim)}
                    className="p-1.5 rounded-full bg-black/60 hover:bg-accent-action text-text-muted hover:text-white border border-surface-highlight transition-colors cursor-pointer"
                    title="Đổi sang mẫu xe khác"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
                {onRemoveTrim && trims.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveTrim(trim.id)}
                    className="p-1.5 rounded-full bg-black/60 hover:bg-red-600 text-text-muted hover:text-white border border-surface-highlight transition-colors cursor-pointer"
                    title="Xóa mẫu xe khỏi bảng so sánh"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Visual & Titles */}
              <div className="space-y-3">
                <div className="relative aspect-[16/10] w-full rounded overflow-hidden bg-canvas-deep border border-surface-highlight/70 group">
                  <img
                    src={trim.imageUrl}
                    alt={trim.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas-deep/80 via-transparent to-transparent pointer-events-none" />

                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-[2px] bg-canvas-deep/80 backdrop-blur-md border border-surface-highlight text-[9px] font-mono text-accent-primary font-bold">
                    {trim.tag}
                  </span>
                </div>

                <div>
                  {trim.brandName && (
                    <span className="text-[10px] font-mono font-bold text-accent-primary uppercase tracking-wider block">
                      {trim.brandName}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-text-primary tracking-tight line-clamp-1" title={trim.name}>
                    {trim.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-black font-mono text-text-primary">
                      {trim.priceFormatted}
                    </span>
                  </div>
                  {trim.depositFormatted && (
                    <span className="text-[11px] font-mono text-text-muted block mt-0.5">
                      Cọc 72h: {trim.depositFormatted}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-surface-highlight/50">
                <button
                  type="button"
                  onClick={() => onOpenDeposit(trim)}
                  className={`w-full py-2.5 px-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isRecommended
                      ? 'bg-accent-action hover:bg-accent-primary text-accent-contrast shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                      : 'bg-surface-interactive hover:bg-accent-action text-text-primary hover:text-accent-contrast'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Đặt cọc 72h</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenTestDrive(trim)}
                    className="py-2 px-2 rounded bg-surface-container hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-accent-primary" />
                    <span>Lái thử</span>
                  </button>

                  <Link
                    to={`/cars/${trim.id}`}
                    className="py-2 px-2 rounded bg-surface-container hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5 transition-colors text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-accent-primary" />
                    <span>Chi tiết</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty Slots if less than 3 cars */}
        {Array.from({ length: emptySlotsCount }).map((_, index) => (
          <div
            key={`empty-slot-${index}`}
            onClick={onAddTrim}
            className="no-print md:col-span-3 p-6 rounded-lg border-2 border-dashed border-surface-highlight hover:border-accent-primary/60 bg-surface-elevated/30 hover:bg-surface-elevated/50 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer group min-h-[320px]"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container border border-surface-highlight group-hover:border-accent-primary flex items-center justify-center text-text-muted group-hover:text-accent-primary transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                + Thêm Mẫu Xe Khác
              </h4>
              <p className="text-xs text-text-muted max-w-[180px] leading-relaxed">
                Chọn thêm từ danh mục showroom để đối đầu trực diện 3 phiên bản.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
