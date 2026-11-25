import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, ArrowRight } from 'lucide-react';
import type { Accessory } from '@/types/accessory.types';
import { useCartStore } from '@/store/useCartStore';

export interface AccessoryProductCardProps {
  accessory: Accessory;
}

export const AccessoryProductCard: React.FC<AccessoryProductCardProps> = ({ accessory }) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <article className="group flex flex-col justify-between rounded-lg bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--line-strong)] overflow-hidden transition-colors">
      {/* Top Part: Image & Content */}
      <div>
        <Link
          to={`/accessories/${accessory.id}`}
          className="relative aspect-[8/5] w-full bg-[var(--surface-subtle)] overflow-hidden block cursor-pointer"
          title={`Xem chi tiết ${accessory.name}`}
        >
          <img
            src={accessory.thumbnailUrl}
            alt={accessory.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Max 1 Subtle Top-Left Tag */}
          {accessory.tags && accessory.tags.length > 0 && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[var(--surface)]/95 border border-[var(--line)] text-[11px] font-medium text-[var(--text)]">
              {accessory.tags[0]}
            </span>
          )}
        </Link>

        {/* Content Info */}
        <div className="p-5 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
              <span>{accessory.categoryBadge || accessory.categoryName}</span>
              <span className="tabular-nums">
                {accessory.stockQuantity > 0 ? `Còn ${accessory.stockQuantity} bộ` : 'Tạm hết hàng'}
              </span>
            </div>
            <h3 className="text-base font-semibold text-[var(--text)] leading-snug line-clamp-2 min-h-[44px]">
              <Link
                to={`/accessories/${accessory.id}`}
                className="group-hover:text-[var(--accent)] transition-colors"
                title={accessory.name}
              >
                {accessory.name}
              </Link>
            </h3>
          </div>

          {/* Concise Spec Summary (no card-in-card pills) */}
          {accessory.specPills && accessory.specPills.length > 0 && (
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
              {accessory.specPills.slice(0, 3).join(' · ')}
            </p>
          )}

          {/* Price */}
          <div className="pt-2 border-t border-[var(--line)]">
            <span className="text-xl font-bold text-[var(--text)] tabular-nums">
              {formatPrice(accessory.price)} ₫
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA Row */}
      <div className="px-5 pb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            isAdded
              ? 'bg-[var(--success)] text-white'
              : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Đã thêm vào giỏ</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
        <Link
          to={`/accessories/${accessory.id}`}
          className="px-2.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] inline-flex items-center gap-1 transition-colors shrink-0"
          title="Xem chi tiết phụ kiện"
        >
          <span>Chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
