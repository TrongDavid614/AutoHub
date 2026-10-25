import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import type { Accessory } from '@/types/accessory.types';
import { useCartStore } from '@/store/useCartStore';

export interface AccessoryProductCardProps {
  accessory: Accessory;
}

export const AccessoryProductCard: React.FC<AccessoryProductCardProps> = ({ accessory }) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(accessory, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1600);
  };

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN');
  };

  return (
    <article className="group flex flex-col justify-between rounded-[2px] bg-[#171F33] border border-[#2D3449] hover:border-[#89CEFF]/60 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
      {/* Top Part: Image & Badges */}
      <div>
        <div className="relative aspect-[8/5] w-full bg-[#060E20] overflow-hidden">
          <img
            src={accessory.thumbnailUrl}
            alt={accessory.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Bottom Gradient Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171F33] via-[#171F33]/20 to-transparent opacity-80" />

          {/* Floating Top-Left Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
            {accessory.tags && accessory.tags.length > 0 ? (
              accessory.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-[2px] font-mono text-[9px] font-bold tracking-wider shadow-sm uppercase ${
                    idx === 0
                      ? 'bg-[#0EA5E9] text-[#003751]'
                      : 'bg-[#31394D] text-[#DAE2FD]'
                  }`}
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="px-2 py-0.5 rounded-[2px] bg-[#0EA5E9] text-[#003751] font-mono text-[9px] font-bold tracking-wider uppercase">
                100% MATCH GT-E
              </span>
            )}
          </div>

          {/* Floating Bottom-Right Stock Pill */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#060E20]/90 backdrop-blur-md border border-[#2D3449]/60 shadow-md z-10">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span className="font-mono text-[11px] text-[#DAE2FD] tracking-[1.32px] uppercase">
              TỒN KHO: {accessory.stockQuantity} BỘ
            </span>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-6 space-y-4">
          {/* Category Tag & Title */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#89CEFF] uppercase">
              {accessory.categoryBadge || accessory.categoryName.toUpperCase()}
            </div>
            <h3 className="text-lg font-semibold text-[#DAE2FD] leading-snug line-clamp-2 min-h-[52px]">
              {accessory.name}
            </h3>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="font-mono text-2xl font-bold text-[#DAE2FD]">
              {formatPrice(accessory.price)}
            </span>
            <span className="font-mono text-sm font-bold text-[#89CEFF]">VNĐ</span>
          </div>

          {/* Technical Specs List (2x2 Grid) */}
          {accessory.specPills && accessory.specPills.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              {accessory.specPills.slice(0, 4).map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="px-2.5 py-1.5 rounded-[2px] bg-[#222A3D] border border-[#2D3449] text-[11px] text-[#BEC8D2] truncate"
                  title={spec}
                >
                  {spec}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="p-6 pt-0">
        <button
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 rounded-[2px] font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
            isAdded
              ? 'bg-[#34D399] text-[#060E20]'
              : 'bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] hover:text-[#002738] active:scale-[0.98]'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>ĐÃ THÊM VÀO GIỎ</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>THÊM VÀO GIỎ HÀNG</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
