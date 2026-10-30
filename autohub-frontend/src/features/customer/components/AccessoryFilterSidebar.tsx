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
        return <Zap className="w-4 h-4 text-[#89CEFF]" />;
      case 'camera-sensors':
        return <Camera className="w-4 h-4 text-[#89CEFF]" />;
      case 'window-films':
        return <Sun className="w-4 h-4 text-[#89CEFF]" />;
      case 'floor-mats':
        return <Layers className="w-4 h-4 text-[#89CEFF]" />;
      default:
        return <Layers className="w-4 h-4 text-[#89CEFF]" />;
    }
  };

  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="rounded-[2px] bg-[#171F33] border border-[#2D3449] p-6 shadow-xl space-y-6">
        {/* Header & Reset */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#89CEFF]" />
            <h2 className="text-lg font-semibold text-[#DAE2FD]">Bộ lọc phụ kiện</h2>
          </div>
          <button
            onClick={onClearAll}
            className="text-[10px] font-mono font-bold tracking-wider text-[#88929B] hover:text-[#89CEFF] transition-colors uppercase cursor-pointer"
          >
            XÓA TẤT CẢ LỌC
          </button>
        </div>

        {/* Category Group */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
            DANH MỤC PHỤ KIỆN
          </h3>
          <div className="space-y-1.5">
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(isSelected ? undefined : cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#222A3D] text-[#89CEFF] border border-[#89CEFF]/50 shadow-inner'
                      : 'text-[#DAE2FD] hover:bg-[#222A3D]/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {getCategoryIcon(cat.slug)}
                    <span>{cat.categoryName}</span>
                  </div>
                  {cat.count !== undefined && (
                    <span className="font-mono text-[11px] text-[#88929B]">{cat.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3 pt-3 border-t border-[#2D3449]">
          <h3 className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
            MỨC GIÁ DỰ KIẾN
          </h3>
          <div className="space-y-2">
            {[
              { id: 'under-5m', label: 'Dưới 5 triệu VNĐ' },
              { id: '5m-20m', label: '5 – 20 triệu VNĐ' },
              { id: 'above-20m', label: 'Trên 20 triệu VNĐ' },
            ].map((p) => {
              const isSelected = selectedPriceRange === p.id;
              return (
                <label
                  key={p.id}
                  onClick={() => onSelectPriceRange(isSelected ? null : p.id)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-[2px] hover:bg-[#222A3D]/50 cursor-pointer text-xs text-[#DAE2FD] transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#89CEFF] border-[#89CEFF] text-[#060E20]'
                        : 'border-[#3E4850] bg-[#060E20]'
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
        <div className="space-y-3 pt-3 border-t border-[#2D3449]">
          <h3 className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
            TÌNH TRẠNG & GIAO HÀNG
          </h3>
          <div className="space-y-2">
            <label
              onClick={onToggleReadyInShowroom}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-[2px] hover:bg-[#222A3D]/50 cursor-pointer text-xs text-[#DAE2FD] transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-colors ${
                  readyInShowroom
                    ? 'bg-[#89CEFF] border-[#89CEFF] text-[#060E20]'
                    : 'border-[#3E4850] bg-[#060E20]'
                }`}
              >
                {readyInShowroom && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Sẵn hàng tại Showroom</span>
            </label>

            <label
              onClick={onToggleHomeInstallation}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-[2px] hover:bg-[#222A3D]/50 cursor-pointer text-xs text-[#DAE2FD] transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-colors ${
                  homeInstallation
                    ? 'bg-[#89CEFF] border-[#89CEFF] text-[#060E20]'
                    : 'border-[#3E4850] bg-[#060E20]'
                }`}
              >
                {homeInstallation && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Giao lắp tận nhà 24h</span>
            </label>
          </div>
        </div>

        {/* Certification Standard */}
        <div className="space-y-3 pt-3 border-t border-[#2D3449]">
          <h3 className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
            TIÊU CHUẨN KỸ NGHỆ
          </h3>
          <div className="space-y-2">
            <label
              onClick={onToggleIsGenuine}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-[2px] hover:bg-[#222A3D]/50 cursor-pointer text-xs text-[#DAE2FD] transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-colors ${
                  isGenuine
                    ? 'bg-[#89CEFF] border-[#89CEFF] text-[#060E20]'
                    : 'border-[#3E4850] bg-[#060E20]'
                }`}
              >
                {isGenuine && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>AutoHub Genuine Parts</span>
            </label>

            <label
              onClick={() => onToggleWarrantyYears(warrantyYears === 3 ? undefined : 3)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-[2px] hover:bg-[#222A3D]/50 cursor-pointer text-xs text-[#DAE2FD] transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-colors ${
                  warrantyYears === 3
                    ? 'bg-[#89CEFF] border-[#89CEFF] text-[#060E20]'
                    : 'border-[#3E4850] bg-[#060E20]'
                }`}
              >
                {warrantyYears === 3 && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Bảo hành chính hãng 3 năm</span>
            </label>
          </div>
        </div>

        {/* Sidebar Callout: Safety Card */}
        <div className="rounded-[2px] bg-[#060E20] border border-[#2D3449] p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#89CEFF] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#89CEFF] uppercase">
              AN TOÀN BẢO HÀNH PIN
            </h4>
            <p className="text-[13px] text-[#88929B] leading-[18px]">
              Lắp đặt phụ kiện chính hãng không ảnh hưởng đến điều kiện bảo hành cụm pin cao áp 800V.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
