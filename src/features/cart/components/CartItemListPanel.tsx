import React from 'react';
import { Trash2, Heart, Plus, Minus, Zap } from 'lucide-react';
import type { CartItem } from '@/store/useCartStore';

export interface CartItemListPanelProps {
  items: CartItem[];
  onUpdateQuantity: (accessoryId: number, quantity: number) => void;
  onRemoveItem: (accessoryId: number) => void;
  onClearCart: () => void;
}

export const CartItemListPanel: React.FC<CartItemListPanelProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const formatPrice = (val: number) => val.toLocaleString('vi-VN');

  return (
    <section className="rounded-[2px] bg-[#171F33] border border-[#2D3449] p-6 shadow-xl space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-[1.5px] text-[#89CEFF] uppercase">
            01 / THIẾT BỊ ĐÃ CHỌN
          </span>
          <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[10px] font-mono font-semibold text-[#BEC8D2]">
            {items.length} MỤC
          </span>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-[#88929B] hover:text-rose-400 transition-colors cursor-pointer"
          >
            Xóa toàn bộ
          </button>
        )}
      </div>

      {/* Item List */}
      <div className="space-y-6">
        {items.length === 0 ? (
          <div className="text-center py-8 text-[#88929B] text-xs">
            Giỏ hàng của bạn đang trống.
          </div>
        ) : (
          items.map(({ accessory, quantity }) => (
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
                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] font-mono text-[9px] font-bold uppercase">
                        22kW AC
                      </span>
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-[#31394D] text-[#DAE2FD] font-mono text-[9px] font-bold uppercase">
                        100% MATCH GT-E
                      </span>
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-[#222A3D] text-[#88929B] font-mono text-[9px] font-bold uppercase">
                        KIẾN TRÚC 800V
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-base font-semibold text-[#DAE2FD] leading-snug">
                      {accessory.name}
                    </h2>

                    {/* SKU & Extra specs */}
                    <p className="text-xs text-[#88929B]">
                      Mã SKU: <span className="font-mono text-[#BEC8D2]">{accessory.sku}</span> • Cáp Type 2 dài 7.5m chuẩn IP65 chống nước
                    </p>

                    {/* Stock note */}
                    <div className="flex items-center gap-1.5 text-xs text-[#34D399]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                      <span>Còn {accessory.stockQuantity} bộ sẵn kho Tân Cảng</span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Counter & Actions */}
                <div className="flex flex-col md:items-end gap-3 self-stretch md:self-center">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] font-mono font-bold tracking-wider text-[#88929B] uppercase">
                      ĐƠN GIÁ NIÊM YẾT
                    </div>
                    <div className="font-mono text-xl font-bold text-[#DAE2FD]">
                      {formatPrice(accessory.price)} <span className="text-sm text-[#89CEFF]">đ</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Counter Control */}
                    <div className="inline-flex items-center border border-[#2D3449] rounded-[2px] bg-[#060E20]">
                      <button
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
                        onClick={() => onUpdateQuantity(accessory.id, quantity + 1)}
                        className="p-1.5 text-[#88929B] hover:text-[#DAE2FD] hover:bg-[#222A3D] transition-colors cursor-pointer"
                        title="Tăng số lượng"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Item Actions */}
                    <div className="flex items-center gap-2 text-xs text-[#88929B]">
                      <button className="hover:text-[#89CEFF] flex items-center gap-1 transition-colors cursor-pointer">
                        <Heart className="w-3.5 h-3.5" />
                        <span>Lưu</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => onRemoveItem(accessory.id)}
                        className="hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              {/* Attached Complementary Engineering Service Strip */}
              <div className="rounded-[2px] bg-[#060E20] border border-[#2D3449] p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[2px] bg-[#0EA5E9]/20 flex items-center justify-center text-[#89CEFF] flex-shrink-0">
                    <Zap className="w-3.5 h-3.5 text-[#89CEFF]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#DAE2FD]">
                      Gói kiểm tra hạ tầng điện cao áp 3 pha tại nhà miễn phí
                    </h3>
                    <p className="text-[11px] text-[#88929B]">
                      Kỹ sư trạm sạc AutoHub đo kiểm trở kháng, CB tải và hệ thống tiếp địa an toàn.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#89CEFF] shrink-0">0 đ</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
