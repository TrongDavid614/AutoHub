import React from 'react';
import { Phone, Check, ArrowRight } from 'lucide-react';
import type { CheckoutOrderItem } from '../mocks/checkout.mock';

export interface CheckoutOrderReviewSidebarProps {
  items: CheckoutOrderItem[];
  rawSubtotal: number;
  shippingFee: number;
  discountAmount: number;
  grandTotal: number;
  voucherCode: string;
  isVoucherApplied: boolean;
  voucherError: string;
  onVoucherCodeChange: (code: string) => void;
  onApplyVoucher: () => void;
  onRemoveVoucher: () => void;
  onProcessCheckout: () => void;
  isSubmitting: boolean;
}

export const CheckoutOrderReviewSidebar: React.FC<CheckoutOrderReviewSidebarProps> = ({
  items,
  rawSubtotal,
  shippingFee,
  discountAmount,
  grandTotal,
  voucherCode,
  isVoucherApplied,
  voucherError,
  onVoucherCodeChange,
  onApplyVoucher,
  onRemoveVoucher,
  onProcessCheckout,
  isSubmitting,
}) => {
  const formatPrice = (val: number) => val.toLocaleString('vi-VN');

  return (
    <aside className="w-full lg:w-[440px] flex-shrink-0 space-y-4 sticky top-24">
      <div className="rounded-[4px] bg-[#171F33] border border-[#2D3449] p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#0EA5E9]/10 blur-[50px]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2D3449] relative z-10">
          <h3 className="text-xl font-bold text-[#DAE2FD]">Đơn hàng của bạn</h3>
          <span className="px-2.5 py-0.5 rounded-[2px] bg-[#222A3D] text-[#89CEFF] font-mono text-xs font-bold">
            {items.length} SP
          </span>
        </div>

        {/* Product Items List */}
        <div className="space-y-4 max-h-72 overflow-y-auto pr-1 relative z-10">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-[#2D3449]/50">
              <div className="w-16 h-16 rounded-[2px] bg-[#060E20] border border-[#2D3449] overflow-hidden shrink-0 flex items-center justify-center">
                <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-xs font-semibold text-[#DAE2FD] leading-tight line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-[11px] text-[#88929B] line-clamp-1">{item.subtitle}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[11px] text-[#88929B]">
                    SL: {item.quantity.toString().padStart(2, '0')}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#DAE2FD]">
                    {formatPrice(item.price * item.quantity)} đ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voucher Promo Section */}
        <div className="space-y-2.5 pt-1 border-t border-[#2D3449] relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
              MÃ ƯU ĐÃI AUTOHUB VIP
            </span>
            <span className="px-1.5 py-0.5 rounded-[2px] bg-[#34D399]/20 text-[#34D399] font-mono text-[9px] font-bold">
              TIẾT KIỆM 500K
            </span>
          </div>

          {isVoucherApplied ? (
            <div className="p-3 rounded-[2px] bg-[#060E20] border border-[#34D399]/40 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#34D399]" />
                  <span className="font-mono text-xs font-bold text-[#34D399]">{voucherCode}</span>
                </div>
                <p className="text-[10px] text-[#88929B] mt-0.5">
                  Đã áp dụng mã giảm giá phụ kiện cao cấp
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#34D399]">
                  -{formatPrice(discountAmount)} đ
                </span>
                <button
                  type="button"
                  onClick={onRemoveVoucher}
                  className="block text-[10px] text-rose-400 hover:underline mt-0.5 cursor-pointer ml-auto"
                >
                  Gỡ bỏ
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => onVoucherCodeChange(e.target.value)}
                placeholder="NHẬP MÃ VOUCHER KHÁC"
                className="flex-1 px-3 py-2 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs font-mono font-bold text-[#DAE2FD] placeholder-[#88929B] uppercase focus:outline-none focus:border-[#89CEFF]"
              />
              <button
                type="button"
                onClick={onApplyVoucher}
                className="px-3.5 py-2 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-mono text-xs font-bold uppercase transition-colors cursor-pointer shrink-0"
              >
                Áp dụng
              </button>
            </div>
          )}

          {voucherError && <p className="text-xs text-rose-400">{voucherError}</p>}
        </div>

        {/* Price Breakdown Calculation */}
        <div className="space-y-2.5 pt-3 border-t border-[#2D3449] text-xs relative z-10">
          <div className="flex items-center justify-between text-[#BEC8D2]">
            <span>Tạm tính</span>
            <span className="font-mono text-[#DAE2FD]">{formatPrice(rawSubtotal)} đ</span>
          </div>

          <div className="flex items-center justify-between text-[#BEC8D2]">
            <span>Phí vận chuyển</span>
            <span className="font-mono text-[#89CEFF]">
              {shippingFee === 0 ? 'MIỄN PHÍ (0 Đ)' : `+${formatPrice(shippingFee)} đ`}
            </span>
          </div>

          {isVoucherApplied && discountAmount > 0 && (
            <div className="flex items-center justify-between text-[#34D399]">
              <span>Giảm giá voucher ({voucherCode})</span>
              <span className="font-mono">-{formatPrice(discountAmount)} đ</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[#88929B] text-[11px]">
            <span>Thuế giá trị gia tăng (VAT 8%)</span>
            <span>Đã gồm VAT</span>
          </div>

          {/* Grand Total */}
          <div className="pt-4 border-t border-[#2D3449] space-y-1">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-[#DAE2FD]">Tổng thanh toán</span>
                <p className="text-[10px] text-[#88929B]">Đã bao gồm đầy đủ thuế và phí bàn giao</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-bold text-[#89CEFF]">
                  {formatPrice(grandTotal)}
                </span>
                <span className="font-mono text-sm font-bold text-[#89CEFF] ml-1">đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action CTA */}
        <div className="pt-2 relative z-10">
          <button
            type="button"
            onClick={onProcessCheckout}
            disabled={isSubmitting || items.length === 0}
            className="w-full py-4 px-4 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>ĐANG XỬ LÝ GIAO DỊCH VNPAY...</span>
            ) : (
              <>
                <span>THANH TOÁN ĐƠN HÀNG ({formatPrice(grandTotal)} Đ)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Buyer Guarantee Badges */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-[#88929B] border-t border-[#2D3449]/60 relative z-10">
          <div>✓ 100% Chính hãng OEM</div>
          <div>✓ Đổi trả 7 ngày</div>
          <div>✓ Bảo hành toàn quốc</div>
        </div>

        {/* VIP Concierge Support Footer */}
        <div className="pt-3 border-t border-[#2D3449] flex items-center justify-between text-xs relative z-10">
          <span className="text-[#88929B]">Hỗ trợ kỹ thuật đơn hàng</span>
          <a
            href="tel:19008888"
            className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#89CEFF] hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>1900 8888 (24/7)</span>
          </a>
        </div>
      </div>
    </aside>
  );
};
