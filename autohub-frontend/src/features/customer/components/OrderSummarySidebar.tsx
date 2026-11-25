import React from 'react';
import { Phone, ShieldCheck, Check, ArrowRight, Lock, Loader2 } from 'lucide-react';
import type { AvailableVoucher } from '@/types/cart.types';

export interface OrderSummarySidebarProps {
  orderId?: string;
  itemCount: number;
  rawSubtotal: number;
  discountAmount: number;
  shippingFee: number;
  installationFee: number;
  totalPayable: number;
  voucherCode: string;
  isVoucherApplied: boolean;
  voucherError?: string;
  voucherSuccess?: string;
  isCheckingVoucher?: boolean;
  availableVouchers?: AvailableVoucher[];
  onVoucherCodeChange: (code: string) => void;
  onApplyVoucher: () => void;
  onRemoveVoucher: () => void;
  onCheckout: () => void;
  isSubmitting: boolean;
  isAuthenticated?: boolean;
}

export const OrderSummarySidebar: React.FC<OrderSummarySidebarProps> = ({
  orderId,
  itemCount,
  rawSubtotal,
  discountAmount,
  shippingFee,
  installationFee,
  totalPayable,
  voucherCode,
  isVoucherApplied,
  voucherError,
  voucherSuccess,
  isCheckingVoucher = false,
  availableVouchers = [],
  onVoucherCodeChange,
  onApplyVoucher,
  onRemoveVoucher,
  onCheckout,
  isSubmitting,
  isAuthenticated = true,
}) => {
  const formatPrice = (val: number) => val.toLocaleString('vi-VN');

  return (
    <aside className="w-full lg:w-96 flex-shrink-0 space-y-4 sticky top-24">
      {/* Main Card */}
      <div className="rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <h3 className="text-lg font-bold text-[var(--text)]">Tóm tắt đơn hàng</h3>
          <span className="px-2.5 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold tabular-nums">
            {orderId ? `Đơn #${orderId}` : 'Giỏ hàng'}
          </span>
        </div>

        {/* Voucher Promotion Field */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-[var(--text-2)] block">
            Mã ưu đãi VIP / Đặc quyền chủ xe
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => onVoucherCodeChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isVoucherApplied && !isCheckingVoucher) {
                  onApplyVoucher();
                }
              }}
              placeholder="Nhập mã voucher (VD: AUTOHUBGT500)..."
              disabled={isVoucherApplied || isCheckingVoucher}
              className="flex-1 px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--line)] rounded-lg text-xs font-medium text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] uppercase disabled:opacity-60"
            />
            {isVoucherApplied ? (
              <button
                type="button"
                onClick={onRemoveVoucher}
                className="px-3 py-2 rounded-lg bg-[var(--surface-subtle)] hover:bg-red-50 text-red-700 border border-[var(--line)] text-xs font-medium transition-colors cursor-pointer shrink-0"
              >
                Gỡ bỏ
              </button>
            ) : (
              <button
                type="button"
                onClick={onApplyVoucher}
                disabled={isCheckingVoucher || !voucherCode.trim()}
                className="px-3.5 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isCheckingVoucher ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Kiểm tra...</span>
                  </>
                ) : (
                  <span>Áp dụng</span>
                )}
              </button>
            )}
          </div>

          {/* Quick Available Vouchers Chips */}
          {!isVoucherApplied && (availableVouchers ?? []).length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-xs text-[var(--text-muted)] block">
                Mã khả dụng hôm nay:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(availableVouchers ?? []).slice(0, 3).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      onVoucherCodeChange(v.code);
                    }}
                    className="px-2.5 py-1 rounded-md bg-[var(--surface-subtle)] border border-[var(--line)] hover:border-[var(--accent)] text-xs font-mono font-medium text-[var(--accent)] transition-colors cursor-pointer"
                    title={v.description}
                  >
                    {v.code}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Applied Status */}
          {isVoucherApplied && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
              <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
              <span>
                {voucherSuccess || `Đã áp dụng mã ${voucherCode}: Giảm -${formatPrice(discountAmount)} đ`}
              </span>
            </div>
          )}

          {voucherError && <p className="text-xs text-red-700 font-medium">{voucherError}</p>}
        </div>

        {/* Detailed Cost Ledger */}
        <div className="space-y-2.5 pt-3 border-t border-[var(--line)] text-xs">
          <div className="flex items-center justify-between text-[var(--text-2)]">
            <span>Tạm tính ({itemCount} phụ kiện)</span>
            <span className="font-medium tabular-nums text-[var(--text)]">{formatPrice(rawSubtotal)} đ</span>
          </div>

          <div className="flex items-center justify-between text-[var(--text-2)]">
            <span>Phí vận chuyển bọc chống sốc</span>
            <span className="font-medium tabular-nums text-emerald-700">
              {shippingFee === 0 ? 'Miễn phí (0 đ)' : `${formatPrice(shippingFee)} đ`}
            </span>
          </div>

          <div className="flex items-center justify-between text-[var(--text-2)]">
            <span>Kỹ thuật viên khảo sát & gắn máy</span>
            <span className="font-medium tabular-nums text-emerald-700">
              {installationFee === 0 ? 'Miễn phí (0 đ)' : `${formatPrice(installationFee)} đ`}
            </span>
          </div>

          {isVoucherApplied && discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-700">
              <span>Ưu đãi Voucher ({voucherCode})</span>
              <span className="font-medium tabular-nums">-{formatPrice(discountAmount)} đ</span>
            </div>
          )}

          {/* Division Line & Total */}
          <div className="pt-4 mt-2 border-t border-[var(--line)] space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-[var(--text)]">Tổng thanh toán</div>
                <div className="text-xs text-[var(--text-muted)]">
                  Đã bao gồm VAT 10% & hóa đơn GTGT
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold tabular-nums text-[var(--accent)]">
                  {formatPrice(totalPayable)}
                </span>
                <span className="text-sm font-bold text-[var(--accent)] ml-1">đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Checkout CTA Button */}
        <div className="pt-1 space-y-2.5">
          {!isAuthenticated && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Cần đăng nhập tài khoản để tiến hành đặt hàng & giao nhận.</span>
            </div>
          )}

          <button
            type="button"
            onClick={onCheckout}
            disabled={isSubmitting || itemCount === 0}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              !isAuthenticated
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý đơn hàng...</span>
              </span>
            ) : !isAuthenticated ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Đăng nhập để đặt hàng</span>
              </>
            ) : (
              <>
                <span>Xác nhận đặt hàng</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Concierge Hotline Box */}
        <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">Cần tư vấn hạ tầng điện?</span>
          <a
            href="tel:18008899"
            className="flex items-center gap-1.5 text-xs font-semibold tabular-nums text-[var(--accent)] hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>1800 8899 (Miễn phí)</span>
          </a>
        </div>
      </div>

      {/* Assurance Box */}
      <div className="rounded-xl bg-[var(--surface)] border border-[var(--line)] p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[var(--text-2)] leading-relaxed">
          <h4 className="font-semibold text-[var(--text)] text-xs">
            Bảo chứng đồng bộ hệ sinh thái AutoHub
          </h4>
          <p>
            Tất cả phụ kiện sạc Wallbox và phụ kiện chính hãng mua tại AutoHub tự động đồng bộ hồ sơ dịch vụ kỹ thuật số trên hệ thống AutoOS xe của bạn.
          </p>
        </div>
      </div>
    </aside>
  );
};
