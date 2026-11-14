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
      <section className="rounded-[2px] bg-[#171F33] border border-[#2D3449] p-6 shadow-xl space-y-6">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-[1.5px] text-[#89CEFF] uppercase">
              01 / THIẾT BỊ ĐÃ CHỌN
            </span>
            <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[10px] font-mono font-semibold text-[#BEC8D2]">
              {validItems.length} MỤC
            </span>
          </div>

          {validItems.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="text-xs text-[#88929B] hover:text-rose-400 transition-colors cursor-pointer"
            >
              Xóa toàn bộ
            </button>
          )}
        </div>

        {/* Item List */}
        <div className="space-y-6">
          {validItems.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#060E20] border border-[#2D3449] flex items-center justify-center mx-auto text-[#88929B]">
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-[#DAE2FD] text-sm font-semibold">Giỏ hàng của bạn đang trống</p>
              <p className="text-[#88929B] text-xs max-w-sm mx-auto">
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
                  <article className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#2D3449]/60">
                    {/* Left: Thumbnail & Specs */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-24 h-24 rounded-[2px] bg-[#060E20] border border-[#2D3449] overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img
                          src={accessory.thumbnailUrl}
                          alt={accessory.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Dynamic Tags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] font-mono text-[9px] font-bold uppercase">
                            {accessory.brand || 'AutoHub OEM'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-[2px] bg-[#31394D] text-[#DAE2FD] font-mono text-[9px] font-bold uppercase">
                            {accessory.categoryName || 'PHỤ KIỆN CHÍNH HÃNG'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-[2px] bg-[#222A3D] text-[#88929B] font-mono text-[9px] font-bold uppercase">
                            100% MATCH GT-E
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-base font-semibold text-[#DAE2FD] leading-snug">
                          {accessory.name}
                        </h2>

                        {/* SKU & Extra specs */}
                        <p className="text-xs text-[#88929B] line-clamp-1">
                          Mã SKU: <span className="font-mono text-[#BEC8D2]">{itemSku}</span>
                          {accessory.description ? ` • ${accessory.description}` : ''}
                        </p>

                        {/* Stock note */}
                        <div className="flex items-center gap-1.5 text-xs text-[#34D399]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                          <span>Còn {stock} bộ sẵn kho AutoHub</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Price & Counter & Actions */}
                    <div className="flex flex-col md:items-end gap-3 self-stretch md:self-center">
                      <div className="text-left md:text-right">
                        <div className="text-[10px] font-mono font-bold tracking-wider text-[#88929B] uppercase">
                          ĐƠN GIÁ NIÊM YẾT
                        </div>
                        <div className="flex items-baseline md:justify-end gap-2">
                          <span className="font-mono text-xl font-bold text-[#DAE2FD]">
                            {formatPrice(displayPrice)} <span className="text-sm text-[#89CEFF]">đ</span>
                          </span>
                          {hasDiscount && (
                            <span className="font-mono text-xs text-[#88929B] line-through">
                              {formatPrice(accessory.price)} đ
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Counter Control */}
                        <div className="inline-flex items-center border border-[#2D3449] rounded-[2px] bg-[#060E20]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(accessory.id, quantity - 1)}
                            className="p-1.5 text-[#88929B] hover:text-[#DAE2FD] hover:bg-[#222A3D] transition-colors cursor-pointer"
                            title="Giảm số lượng"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-mono text-xs font-bold text-[#DAE2FD]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(accessory.id, quantity + 1)}
                            disabled={quantity >= stock}
                            className="p-1.5 text-[#88929B] hover:text-[#DAE2FD] hover:bg-[#222A3D] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Tăng số lượng"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Actions */}
                        <div className="flex items-center gap-2 text-xs text-[#88929B]">
                          <button
                            type="button"
                            onClick={() => onSaveForLater?.(accessory.id)}
                            className="hover:text-[#89CEFF] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Lưu vào danh sách mua sau"
                          >
                            <Heart className="w-3.5 h-3.5" />
                            <span>Lưu</span>
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(accessory.id)}
                            className="hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
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
                  <div className="rounded-[2px] bg-[#060E20] border border-[#2D3449] p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-[2px] bg-[#0EA5E9]/20 flex items-center justify-center text-[#89CEFF] flex-shrink-0">
                        <Zap className="w-3.5 h-3.5 text-[#89CEFF]" />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-[#DAE2FD]">
                          Dịch vụ kỹ thuật viên lắp đặt tiêu chuẩn AutoHub Mobile Service
                        </h3>
                        <p className="text-[11px] text-[#88929B]">
                          Kỹ thuật viên chứng chỉ OEM hỗ trợ khảo sát và đấu nối lắp đặt tận nơi trong 24h.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#34D399] flex-shrink-0">
                      MIỄN PHÍ
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
        <section className="rounded-[2px] bg-[#171F33] border border-[#2D3449] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]">
            <div className="flex items-center gap-2">
              <BookmarkPlus className="w-4 h-4 text-[#89CEFF]" />
              <span className="font-mono text-xs font-bold tracking-[1.5px] text-[#89CEFF] uppercase">
                DANH SÁCH MUA SAU / YÊU THÍCH ({validSavedItems.length})
              </span>
            </div>
            <span className="text-xs text-[#88929B]">Đã lưu để mua sau</span>
          </div>

          <div className="space-y-3">
            {validSavedItems.map(({ accessory, quantity }) => (
              <div
                key={accessory.id}
                className="flex items-center justify-between gap-4 p-3 rounded-[2px] bg-[#060E20] border border-[#2D3449]/60 hover:border-[#89CEFF]/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-[2px] overflow-hidden bg-[#171F33] shrink-0 border border-[#2D3449]">
                    <img
                      src={accessory.thumbnailUrl}
                      alt={accessory.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-[#DAE2FD] truncate">{accessory.name}</h4>
                    <p className="font-mono text-xs text-[#89CEFF]">
                      {formatPrice(accessory.discountPrice || accessory.price)} đ • SL: {quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onMoveToCart?.(accessory.id)}
                    className="px-3 py-1.5 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-mono text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>CHUYỂN VÀO GIỎ</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveSavedItem?.(accessory.id)}
                    className="p-1.5 text-[#88929B] hover:text-rose-400 transition-colors cursor-pointer"
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
