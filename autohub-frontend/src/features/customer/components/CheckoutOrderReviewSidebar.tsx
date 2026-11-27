import React from 'react';
import { Phone, Check, ArrowRight, MapPin } from 'lucide-react';
import type { CheckoutOrderItem } from '@/features/customer/mocks/checkout.mock';

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
  hasAddress?: boolean;
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
  hasAddress = true,
}) => {
  const formatPrice = (val: number) => val.toLocaleString('vi-VN');
  const safeItems = items ?? [];

  return (
    <aside className="w-full lg:w-[440px] flex-shrink-0 space-y-4 sticky top-24">
      <div className="rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <h3 className="text-lg font-bold text-[var(--text)]">Đơn hàng của bạn</h3>
          <span className="px-2.5 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold tabular-nums">
            {safeItems.length} SP
          </span>
        </div>

        {/* Product Items List */}
        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
          {safeItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-[var(--line)]">
              <div className="w-16 h-16 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] overflow-hidden shrink-0 flex items-center justify-center">
                <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-xs font-semibold text-[var(--text)] leading-tight line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-xs text-[var(--text-muted)] line-clamp-1">{item.subtitle}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-[var(--text-muted)] tabular-nums">
                    SL: {item.quantity.toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-[var(--text)]">
                    {formatPrice(item.price * item.quantity)} đ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voucher Promo Section */}
        <div className="space-y-2.5 pt-1 border-t border-[var(--line)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-2)]">
              Mã ưu đãi AutoHub VIP
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold tabular-nums">
              Tiết kiệm 500k
            </span>
          </div>

          {isVoucherApplied ? (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-mono text-xs font-bold text-emerald-800">{voucherCode}</span>
                </div>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Đã áp dụng mã giảm giá phụ kiện cao cấp
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold tabular-nums text-emerald-700">
                  -{formatPrice(discountAmount)} đ
                </span>
                <button
                  type="button"
                  onClick={onRemoveVoucher}
                  className="block text-xs text-red-700 hover:underline mt-0.5 cursor-pointer ml-auto"
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
                placeholder="Nhập mã voucher khác"
                className="flex-1 px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--line)] rounded-lg text-xs font-medium text-[var(--text)] placeholder-[var(--text-muted)] uppercase focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={onApplyVoucher}
                className="px-3.5 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                Áp dụng
              </button>
            </div>
          )}

          {voucherError && <p className="text-xs text-red-700 font-medium">{voucherError}</p>}
        </div>

        {/* Price Breakdown Calculation */}
        <div className="space-y-2.5 pt-3 border-t border-[var(--line)] text-xs">
          <div className="flex items-center justify-between text-[var(--text-2)]">
            <span>Tạm tính</span>
            <span className="font-medium tabular-nums text-[var(--text)]">{formatPrice(rawSubtotal)} đ</span>
          </div>

          <div className="flex items-center justify-between text-[var(--text-2)]">
            <span>Phí vận chuyển</span>
            <span className="font-medium tabular-nums text-emerald-700">
              {shippingFee === 0 ? 'Miễn phí (0 đ)' : `+${formatPrice(shippingFee)} đ`}
            </span>
          </div>

          {isVoucherApplied && discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-700">
              <span>Giảm giá voucher ({voucherCode})</span>
              <span className="font-medium tabular-nums">-{formatPrice(discountAmount)} đ</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs">
            <span>Thuế giá trị gia tăng (VAT 8%)</span>
            <span>Đã gồm VAT</span>
          </div>

          {/* Grand Total */}
          <div className="pt-4 border-t border-[var(--line)] space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <span className="text-sm font-bold text-[var(--text)]">Tổng thanh toán</span>
                <p className="text-xs text-[var(--text-muted)]">Đã bao gồm đầy đủ thuế và phí bàn giao</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold tabular-nums text-[var(--accent)]">
                  {formatPrice(grandTotal)}
                </span>
                <span className="text-sm font-bold text-[var(--accent)] ml-1">đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action CTA */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onProcessCheckout}
            disabled={isSubmitting || items.length === 0}
            className={`w-full py-3.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              !hasAddress
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white'
            }`}
          >
            {isSubmitting ? (
              <span>Đang xử lý giao dịch...</span>
            ) : !hasAddress ? (
              <>
                <MapPin className="w-4 h-4" />
                <span>Thêm địa chỉ để thanh toán</span>
              </>
            ) : (
              <>
                <span className="tabular-nums">Thanh toán đơn hàng ({formatPrice(grandTotal)} đ)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Buyer Guarantee Badges */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-[var(--text-muted)] border-t border-[var(--line)]">
          <div>✓ Chính hãng OEM</div>
          <div>✓ Đổi trả 7 ngày</div>
          <div>✓ Bảo hành toàn quốc</div>
        </div>

        {/* Support Footer */}
        <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">Hỗ trợ kỹ thuật đơn hàng</span>
          <a
            href="tel:19008888"
            className="flex items-center gap-1.5 text-xs font-semibold tabular-nums text-[var(--accent)] hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>1900 8888 (24/7)</span>
          </a>
        </div>
      </div>
    </aside>
  );
};
