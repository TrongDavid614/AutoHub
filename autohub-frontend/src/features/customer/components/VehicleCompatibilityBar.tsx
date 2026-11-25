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
    <section className="w-full bg-[var(--surface)] border-b border-[var(--line)] py-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Info Cluster */}
          <div className="flex items-center gap-3.5">
            {carModel ? (
              <>
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--surface-subtle)] border border-[var(--line)] flex-shrink-0 flex items-center justify-center">
                  <img
                    src={carModel.thumbnailUrl}
                    alt={carModel.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-[var(--accent)]">
                      Phụ kiện chính hãng tương thích theo xe
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">· {carModel.architecture}</span>
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap text-sm md:text-base">
                    <span className="text-[var(--text-secondary)]">Đang lọc cho:</span>
                    <span className="font-semibold text-[var(--text)]">{carModel.name}</span>
                    <span className="text-xs text-[var(--text-muted)]">({carModel.yearRange})</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] flex-shrink-0 flex items-center justify-center text-[var(--accent)]">
                  <Layers className="w-5 h-5" />
                </div>

                <div className="flex flex-col gap-0.5">
                  <h2 className="text-base md:text-lg font-semibold text-[var(--text)]">
                    Phụ kiện chính hãng AutoHub
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Bộ sạc tại nhà, camera hành trình, thảm sàn và phụ kiện lắp vừa theo từng dòng xe.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-2.5 self-start lg:self-center">
            {carModel && onClearCarClick && (
              <button
                type="button"
                onClick={onClearCarClick}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] border border-[var(--line)] text-xs font-medium transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Xem tất cả</span>
              </button>
            )}

            <button
              type="button"
              onClick={onChangeCarClick}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)] border border-[var(--line-strong)] text-xs font-medium transition-colors cursor-pointer"
            >
              {carModel ? (
                <>
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Đổi dòng xe</span>
                </>
              ) : (
                <>
                  <Car className="w-3.5 h-3.5 text-[var(--accent)]" />
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
