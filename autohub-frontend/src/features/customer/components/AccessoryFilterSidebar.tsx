import React from 'react';
import { SlidersHorizontal, Zap, Camera, Sun, Layers, ShieldCheck, Check } from 'lucide-react';
import type { AccessoryCategory } from '@/types/accessory.types';

export interface AccessoryFilterSidebarProps {
  categories: AccessoryCategory[];
  selectedCategoryId?: number;
  onSelectCategory: (categoryId?: number) => void;
  selectedPriceRange: string | null;
  onSelectPriceRange: (range: string | null) => void;
  readyInShowroom: boolean;
  onToggleReadyInShowroom: () => void;
  homeInstallation: boolean;
  onToggleHomeInstallation: () => void;
  isGenuine: boolean;
  onToggleIsGenuine: () => void;
  warrantyYears?: number;
  onToggleWarrantyYears: (years?: number) => void;
  onClearAll: () => void;
}

export const AccessoryFilterSidebar: React.FC<AccessoryFilterSidebarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  selectedPriceRange,
  onSelectPriceRange,
  readyInShowroom,
  onToggleReadyInShowroom,
  homeInstallation,
  onToggleHomeInstallation,
  isGenuine,
  onToggleIsGenuine,
  warrantyYears,
  onToggleWarrantyYears,
  onClearAll,
}) => {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'charging-energy':
        return <Zap className="w-4 h-4 text-[var(--accent)]" />;
      case 'camera-sensors':
        return <Camera className="w-4 h-4 text-[var(--accent)]" />;
      case 'window-films':
        return <Sun className="w-4 h-4 text-[var(--accent)]" />;
      case 'floor-mats':
      default:
        return <Layers className="w-4 h-4 text-[var(--accent)]" />;
    }
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-5 space-y-5">
        {/* Header & Reset */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--text-secondary)]" />
            <h2 className="text-sm font-semibold text-[var(--text)]">Bộ lọc phụ kiện</h2>
          </div>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-[var(--accent)] hover:underline cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Category Group */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)]">Danh mục phụ kiện</h3>
          <div className="space-y-1">
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(isSelected ? undefined : cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {getCategoryIcon(cat.slug)}
                    <span>{cat.categoryName}</span>
                  </div>
                  {cat.count !== undefined && (
                    <span className="text-xs text-[var(--text-muted)] tabular-nums">{cat.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-2.5 pt-4 border-t border-[var(--line)]">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)]">Mức giá dự kiến</h3>
          <div className="space-y-1.5">
            {[
              { id: 'under-5m', label: 'Dưới 5 triệu đ' },
              { id: '5m-20m', label: '5 – 20 triệu đ' },
              { id: 'above-20m', label: 'Trên 20 triệu đ' },
            ].map((p) => {
              const isSelected = selectedPriceRange === p.id;
              return (
                <label
                  key={p.id}
                  onClick={() => onSelectPriceRange(isSelected ? null : p.id)}
                  className="flex items-center gap-2.5 py-1 cursor-pointer text-[13px] text-[var(--text)] select-none"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                        : 'border-[var(--line-strong)] bg-[var(--surface)]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{p.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Stock / Delivery Status */}
        <div className="space-y-2.5 pt-4 border-t border-[var(--line)]">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)]">Tình trạng & giao hàng</h3>
          <div className="space-y-1.5">
            <label
              onClick={onToggleReadyInShowroom}
              className="flex items-center gap-2.5 py-1 cursor-pointer text-[13px] text-[var(--text)] select-none"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  readyInShowroom
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                    : 'border-[var(--line-strong)] bg-[var(--surface)]'
                }`}
              >
                {readyInShowroom && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Sẵn hàng tại showroom</span>
            </label>

            <label
              onClick={onToggleHomeInstallation}
              className="flex items-center gap-2.5 py-1 cursor-pointer text-[13px] text-[var(--text)] select-none"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  homeInstallation
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                    : 'border-[var(--line-strong)] bg-[var(--surface)]'
                }`}
              >
                {homeInstallation && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Giao lắp tận nhà 24h</span>
            </label>
          </div>
        </div>

        {/* Certification Standard */}
        <div className="space-y-2.5 pt-4 border-t border-[var(--line)]">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)]">Tiêu chuẩn kỹ thuật</h3>
          <div className="space-y-1.5">
            <label
              onClick={onToggleIsGenuine}
              className="flex items-center gap-2.5 py-1 cursor-pointer text-[13px] text-[var(--text)] select-none"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  isGenuine
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                    : 'border-[var(--line-strong)] bg-[var(--surface)]'
                }`}
              >
                {isGenuine && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Chính hãng AutoHub</span>
            </label>

            <label
              onClick={() => onToggleWarrantyYears(warrantyYears === 3 ? undefined : 3)}
              className="flex items-center gap-2.5 py-1 cursor-pointer text-[13px] text-[var(--text)] select-none"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  warrantyYears === 3
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                    : 'border-[var(--line-strong)] bg-[var(--surface)]'
                }`}
              >
                {warrantyYears === 3 && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Bảo hành 3 năm</span>
            </label>
          </div>
        </div>

        {/* Warranty Note (plain divider, no nested card) */}
        <div className="pt-4 border-t border-[var(--line)] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Lắp đặt phụ kiện chính hãng giữ nguyên điều kiện bảo hành xe và cụm pin cao áp.
          </p>
        </div>
      </div>
    </aside>
  );
};
