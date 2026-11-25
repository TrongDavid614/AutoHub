import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingCart, Check, ExternalLink } from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import type { AiRecommendedAccessory } from '@/types/ai.types';
import type { Accessory } from '@/types/accessory.types';

export interface RecommendedAccessoryCardProps {
  accessory: AiRecommendedAccessory;
}

export const RecommendedAccessoryCard: React.FC<RecommendedAccessoryCardProps> = ({ accessory }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addToCart);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    const accessoryItem: Accessory = {
      id: accessory.accessoryId,
      categoryId: 1,
      categoryName: 'Hạ tầng sạc & Phụ kiện cao cấp',
      name: accessory.name,
      sku: accessory.sku,
      brand: 'AutoHub Official',
      price: accessory.price,
      stockQuantity: 20,
      thumbnailUrl:
        accessory.imageUrl ||
        'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=400&q=80',
      images: [
        accessory.imageUrl ||
          'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=400&q=80',
      ],
      description: accessory.description,
      specifications: {
        'Công suất': '22kW 3-Phase',
        'Chuẩn sạc': 'Type-2 IEC 62196',
        'Chuẩn chống nước': 'IP65',
      },
      compatibilities: [
        {
          carModelId: 1,
          carModelName: 'AutoHub GT-e',
          manufactureYearStart: 2024,
          manufactureYearEnd: 2026,
        },
      ],
      isActive: true,
    };

    addToCart(accessoryItem, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <div className="w-full rounded-xl bg-[var(--surface)] border border-[var(--line)] p-5 space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
        <div className="inline-flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold tabular-nums">
            {accessory.matchPercentage}% phù hợp
          </span>
          <span className="text-xs font-semibold text-[var(--text)]">
            {accessory.badgeTitle}
          </span>
        </div>

        <span className="font-mono text-xs text-[var(--text-muted)] bg-[var(--surface-subtle)] px-2.5 py-1 rounded-md border border-[var(--line)] tabular-nums">
          Mã: {accessory.sku}
        </span>
      </div>

      {/* Main Content & Image */}
      <div className="flex flex-col md:flex-row gap-5 items-start">
        {accessory.imageUrl && (
          <div className="w-full md:w-44 h-36 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] overflow-hidden flex-shrink-0">
            <img
              src={accessory.imageUrl}
              alt={accessory.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        <div className="flex-1 space-y-2.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-base sm:text-lg font-bold text-[var(--text)] tracking-tight">
              {accessory.name}
            </h4>
            <span className="text-lg font-bold text-[var(--accent)] tabular-nums">
              {formatCurrencyVND(accessory.price)}
            </span>
          </div>

          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            {accessory.description}
          </p>

          {/* Benefits list */}
          <div className="space-y-1.5 pt-1">
            {accessory.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-2)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--line)]">
        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm transition-colors cursor-pointer min-w-[170px]"
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Đã thêm vào giỏ!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Thêm vào giỏ hàng</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate('/accessories')}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)] border border-[var(--line)] text-sm font-medium transition-colors cursor-pointer"
        >
          <span>Xem danh mục phụ kiện cho xe này</span>
          <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        </button>
      </div>
    </div>
  );
};
