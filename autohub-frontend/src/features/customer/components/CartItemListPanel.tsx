import React from 'react';
import { Trash2, Heart, Plus, Minus, Zap, BookmarkPlus, ArrowRight } from 'lucide-react';
import type { CartItem } from '@/store/useCartStore';

export interface CartItemListPanelProps {
  items: CartItem[];
  savedItems?: CartItem[];
  onUpdateQuantity: (accessoryId: number, quantity: number) => void;
  onRemoveItem: (accessoryId: number) => void;
  onClearCart: () => void;
  onSaveForLater?: (accessoryId: number) => void;
  onMoveToCart?: (accessoryId: number) => void;
  onRemoveSavedItem?: (accessoryId: number) => void;
}

export const CartItemListPanel: React.FC<CartItemListPanelProps> = ({
  items,
  savedItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSaveForLater,
  onMoveToCart,
  onRemoveSavedItem,
}) => {
  const formatPrice = (val: number) => val.toLocaleString('vi-VN');

  const validItems = (items ?? []).filter((item): item is typeof item & { accessory: NonNullable<typeof item.accessory> } => Boolean(item?.accessory));
  const validSavedItems = (savedItems ?? []).filter((item): item is typeof item & { accessory: NonNullable<typeof item.accessory> } => Boolean(item?.accessory));

  return (
    <div className="space-y-6">
      {/* 1. Active Cart Items Panel */}
      <section className="rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 space-y-6">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[var(--text)]">
              01 · Thiết bị đã chọn
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[var(--surface-subtle)] text-xs font-medium text-[var(--text-2)] tabular-nums">
              {validItems.length} mục
            </span>
          </div>

          {validItems.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="text-xs font-medium text-[var(--text-muted)] hover:text-red-700 transition-colors cursor-pointer"
            >
              Xóa toàn bộ
            </button>
          )}
        </div>

        {/* Item List */}
        <div className="space-y-6">
          {validItems.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-subtle)] border border-[var(--line)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-[var(--text)] text-sm font-semibold">Giỏ hàng của bạn đang trống</p>
              <p className="text-[var(--text-muted)] text-xs max-w-sm mx-auto">
                Khám phá các phụ kiện sạc cao cấp, thảm lót sàn nguyên khối và công nghệ hỗ trợ lái xe an toàn cho xe của bạn.
              </p>
            </div>
          ) : (
            validItems.map(({ accessory, quantity }) => {
              const displayPrice = accessory.discountPrice || accessory.price;
              const hasDiscount = accessory.discountPrice && accessory.discountPrice < accessory.price;
              const itemSku = accessory.sku || `AH-ACC-${String(accessory.id).padStart(3, '0')}`;
              const stock = accessory.stockQuantity !== undefined ? accessory.stockQuantity : 15;

              return (
                <div key={accessory.id} className="space-y-4">
                  <article className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[var(--line)]">
                    {/* Left: Thumbnail & Specs */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-24 h-24 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img
                          src={accessory.thumbnailUrl}
                          alt={accessory.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Dynamic Tags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-medium">
                            {accessory.brand || 'AutoHub OEM'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[var(--surface-subtle)] text-[var(--text-2)] text-xs font-medium">
                            {accessory.categoryName || 'Phụ kiện chính hãng'}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-base font-semibold text-[var(--text)] leading-snug">
                          {accessory.name}
                        </h2>

                        {/* SKU & Extra specs */}
                        <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                          Mã SKU: <span className="font-mono text-[var(--text-2)] tabular-nums">{itemSku}</span>
                          {accessory.description ? ` • ${accessory.description}` : ''}
                        </p>

                        {/* Stock note */}
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span className="tabular-nums">Còn {stock} bộ sẵn kho AutoHub</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Price & Counter & Actions */}
                    <div className="flex flex-col md:items-end gap-3 self-stretch md:self-center">
                      <div className="text-left md:text-right">
                        <div className="text-xs text-[var(--text-muted)]">
                          Đơn giá niêm yết
                        </div>
                        <div className="flex items-baseline md:justify-end gap-2">
                          <span className="text-xl font-bold tabular-nums text-[var(--text)]">
                            {formatPrice(displayPrice)} <span className="text-sm text-[var(--accent)]">đ</span>
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-[var(--text-muted)] line-through tabular-nums">
                              {formatPrice(accessory.price)} đ
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Counter Control */}
                        <div className="inline-flex items-center border border-[var(--line)] rounded-lg bg-[var(--surface-subtle)]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(accessory.id, quantity - 1)}
                            className="p-1.5 text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-l-lg transition-colors cursor-pointer"
                            title="Giảm số lượng"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold tabular-nums text-[var(--text)]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(accessory.id, quantity + 1)}
                            disabled={quantity >= stock}
                            className="p-1.5 text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-r-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Tăng số lượng"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Actions */}
                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                          <button
                            type="button"
                            onClick={() => onSaveForLater?.(accessory.id)}
                            className="hover:text-[var(--accent)] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Lưu vào danh sách mua sau"
                          >
                            <Heart className="w-3.5 h-3.5" />
                            <span>Lưu</span>
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(accessory.id)}
                            className="hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Xóa khỏi giỏ hàng"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Complementary Engineering Service Strip */}
                  <div className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-[var(--text)]">
                          Dịch vụ kỹ thuật viên lắp đặt tiêu chuẩn AutoHub Mobile Service
                        </h3>
                        <p className="text-xs text-[var(--text-muted)]">
                          Kỹ thuật viên chứng chỉ OEM hỗ trợ khảo sát và đấu nối lắp đặt tận nơi trong 24h.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 flex-shrink-0">
                      Miễn phí
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 2. Wishlist / Saved For Later Section */}
      {validSavedItems.length > 0 && (
        <section className="rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div className="flex items-center gap-2">
              <BookmarkPlus className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm font-semibold text-[var(--text)] tabular-nums">
                Danh sách mua sau / Yêu thích ({validSavedItems.length})
              </span>
            </div>
            <span className="text-xs text-[var(--text-muted)]">Đã lưu để mua sau</span>
          </div>

          <div className="space-y-3">
            {validSavedItems.map(({ accessory, quantity }) => (
              <div
                key={accessory.id}
                className="flex items-center justify-between gap-4 p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] hover:border-[var(--accent)]/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--surface)] shrink-0 border border-[var(--line)]">
                    <img
                      src={accessory.thumbnailUrl}
                      alt={accessory.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-[var(--text)] truncate">{accessory.name}</h4>
                    <p className="text-xs font-medium text-[var(--accent)] tabular-nums">
                      {formatPrice(accessory.discountPrice || accessory.price)} đ • SL: {quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onMoveToCart?.(accessory.id)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Chuyển vào giỏ</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveSavedItem?.(accessory.id)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-red-700 transition-colors cursor-pointer"
                    title="Xóa khỏi danh sách lưu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
