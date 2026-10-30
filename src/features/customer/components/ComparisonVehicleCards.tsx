import React from 'react';
import { CreditCard, Calendar, Sliders } from 'lucide-react';
import type { VehicleComparisonTrim } from '@/features/customer/types/comparison.types';

interface ComparisonVehicleCardsProps {
  trims: VehicleComparisonTrim[];
  onOpenDeposit: (trimName: string, price: number) => void;
  onOpenTestDrive: (trimName: string) => void;
}

export const ComparisonVehicleCards: React.FC<ComparisonVehicleCardsProps> = ({
  trims,
  onOpenDeposit,
  onOpenTestDrive,
}) => {
  return (
    <div className="rounded-xl bg-surface-container/95 border border-surface-highlight p-4 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Col 1-3: Label Header Column */}
        <div className="md:col-span-3 flex flex-col justify-end p-2 pb-4 space-y-2 border-b md:border-b-0 md:border-r border-surface-highlight/60">
          <div className="flex items-center gap-1.5 text-accent-primary">
            <Sliders className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              THÔNG SỐ & CẤU HÌNH
            </span>
          </div>

          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            3 Phiên Bản Trực Diện
          </h2>

          <p className="text-xs text-text-muted leading-relaxed">
            Cuộn bảng ma trận bên dưới để đối chiếu chi tiết từng trang bị và hiệu năng công nghệ.
          </p>
        </div>

        {/* Col 4-12: The 3 Version Cards (each span 3) */}
        {trims.map((trim) => {
          const isRecommended = trim.badgeVariant === 'accent';
          return (
            <div
              key={trim.id}
              className={`md:col-span-3 p-4 rounded-lg flex flex-col justify-between gap-4 border transition-all relative ${
                isRecommended
                  ? 'bg-surface-elevated border-accent-primary ring-1 ring-accent-primary/60 shadow-[0_0_20px_rgba(14,165,233,0.2)]'
                  : 'bg-surface-elevated/70 border-surface-highlight hover:border-surface-interactive'
              }`}
            >
              {/* Badge if recommended */}
              {trim.badge && (
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-[2px] bg-accent-action text-accent-contrast font-mono text-[9px] font-black uppercase tracking-wider shadow">
                  {trim.badge}
                </div>
              )}

              {/* Visual & Titles */}
              <div className="space-y-3">
                <div className="relative aspect-[16/10] w-full rounded overflow-hidden bg-canvas-deep border border-surface-highlight/70 group">
                  <img
                    src={trim.imageUrl}
                    alt={trim.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas-deep/80 via-transparent to-transparent pointer-events-none" />

                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-[2px] bg-canvas-deep/80 backdrop-blur-md border border-surface-highlight text-[9px] font-mono text-accent-primary font-bold">
                    {trim.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-text-primary tracking-tight">
                    {trim.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-black font-mono text-text-primary">
                      {trim.priceFormatted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-surface-highlight/50">
                <button
                  type="button"
                  onClick={() => onOpenDeposit(trim.name, trim.price)}
                  className={`w-full py-2.5 px-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isRecommended
                      ? 'bg-accent-action hover:bg-accent-primary text-accent-contrast shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                      : 'bg-surface-interactive hover:bg-accent-action text-text-primary hover:text-accent-contrast'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Đặt cọc 72h</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenTestDrive(trim.name)}
                  className="w-full py-2 px-3 rounded bg-surface-container hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-accent-primary" />
                  <span>Lái thử</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
