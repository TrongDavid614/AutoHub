import React from 'react';
import { Phone, ShieldCheck, Check, ArrowRight, Lock, Sparkles, Loader2 } from 'lucide-react';
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
      <div className="relative rounded-[4px] bg-[#171F33] border border-[#2D3449] p-6 shadow-2xl overflow-hidden space-y-6">
        {/* Ambient Gradient Glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#0EA5E9]/10 blur-[40px]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2D3449] relative z-10">
          <h3 className="text-xl font-bold text-[#DAE2FD]">Tóm tắt đơn hàng</h3>
          <span className="px-2.5 py-1 rounded-[2px] bg-[#0EA5E9]/10 text-[#89CEFF] font-mono text-[11px] font-bold tracking-wider uppercase border border-[#0EA5E9]/20">
            {orderId ? `ORDER #${orderId}` : 'GIỎ HÀNG'}
          </span>
        </div>

        {/* Voucher Promotion Field */}
        <div className="space-y-2.5 relative z-10">
          <label className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase block">
            MÃ ƯU ĐÃI VIP / ĐẶC QUYỀN CHỦ XE
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
              className="flex-1 px-3 py-2 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs font-mono font-bold text-[#DAE2FD] placeholder-[#88929B] focus:outline-none focus:border-[#89CEFF] uppercase disabled:opacity-75"
            />
            {isVoucherApplied ? (
              <button
                type="button"
                onClick={onRemoveVoucher}
                className="px-3 py-2 rounded-[2px] bg-[#222A3D] hover:bg-rose-950 text-rose-300 font-mono text-[10px] font-bold tracking-wider transition-colors cursor-pointer shrink-0"
              >
                GỠ BỎ
              </button>
            ) : (
              <button
                type="button"
                onClick={onApplyVoucher}
                disabled={isCheckingVoucher || !voucherCode.trim()}
                className="px-3 py-2 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-mono text-[10px] font-bold tracking-wider transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isCheckingVoucher ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>KIỂM TRA...</span>
                  </>
                ) : (
                  <span>ÁP DỤNG</span>
                )}
              </button>
            )}
          </div>

          {/* Quick Available Vouchers Chips */}
          {!isVoucherApplied && availableVouchers.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-[#88929B] flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-[#89CEFF]" />
                MÃ KHẢ DỤNG HÔM NAY:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableVouchers.slice(0, 3).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      onVoucherCodeChange(v.code);
                    }}
                    className="px-2 py-0.5 rounded-[2px] bg-[#060E20] border border-[#2D3449] hover:border-[#89CEFF] text-[10px] font-mono font-bold text-[#89CEFF] transition-colors cursor-pointer"
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
            <div className="flex items-center gap-1.5 text-xs text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/30 p-2 rounded-[2px]">
              <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
              <span>
                {voucherSuccess || `Đã áp dụng mã ${voucherCode}: Giảm -${formatPrice(discountAmount)} đ`}
              </span>
            </div>
          )}

          {voucherError && <p className="text-xs text-rose-400 font-medium">{voucherError}</p>}
        </div>

        {/* Detailed Cost Ledger */}
        <div className="space-y-3 pt-3 border-t border-[#2D3449] text-xs relative z-10">
          <div className="flex items-center justify-between text-[#BEC8D2]">
            <span>Tạm tính ({itemCount} phụ kiện)</span>
            <span className="font-mono text-[#DAE2FD]">{formatPrice(rawSubtotal)} đ</span>
          </div>

          <div className="flex items-center justify-between text-[#BEC8D2]">
            <span>Phí vận chuyển bọc chống sốc</span>
            <span className="font-mono text-[#89CEFF]">
              {shippingFee === 0 ? 'Miễn phí (0đ)' : `${formatPrice(shippingFee)} đ`}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#BEC8D2]">
            <span>Kỹ thuật viên khảo sát & gắn máy</span>
            <span className="font-mono text-[#89CEFF]">
              {installationFee === 0 ? 'Miễn phí (0đ)' : `${formatPrice(installationFee)} đ`}
            </span>
          </div>

          {isVoucherApplied && discountAmount > 0 && (
            <div className="flex items-center justify-between text-[#34D399]">
              <span>Ưu đãi Voucher ({voucherCode})</span>
              <span className="font-mono">-{formatPrice(discountAmount)} đ</span>
            </div>
          )}

          {/* Division Line & Total */}
          <div className="pt-4 mt-2 border-t border-[#2D3449] space-y-1">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-sm font-semibold text-[#DAE2FD]">Tổng thanh toán</div>
                <div className="text-[9px] font-mono text-[#88929B] uppercase">
                  ĐÃ BAO GỒM VAT 10% & HÓA ĐƠN GTGT
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-bold text-[#DAE2FD]">
                  {formatPrice(totalPayable)}
                </span>
                <span className="font-mono text-sm font-bold text-[#89CEFF] ml-1">đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Checkout CTA Button */}
        <div className="pt-2 relative z-10 space-y-2">
          {!isAuthenticated && (
            <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Cần đăng nhập tài khoản để tiến hành đặt hàng & giao nhận.</span>
            </div>
          )}

          <button
            type="button"
            onClick={onCheckout}
            disabled={isSubmitting || itemCount === 0}
            className={`w-full py-3.5 px-4 rounded-[2px] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              !isAuthenticated
                ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                : 'bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751]'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ĐANG XỬ LÝ ĐƠN HÀNG...</span>
              </span>
            ) : !isAuthenticated ? (
              <>
                <Lock className="w-4 h-4" />
                <span>ĐĂNG NHẬP ĐỂ ĐẶT HÀNG</span>
              </>
            ) : (
              <>
                <span>XÁC NHẬN ĐẶT HÀNG</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* VIP Concierge Hotline Box */}
        <div className="pt-3 border-t border-[#2D3449] flex items-center justify-between text-xs relative z-10">
          <span className="text-[#88929B]">Cần tư vấn hạ tầng điện?</span>
          <a
            href="tel:18008899"
            className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#89CEFF] hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>1800 8899 (Miễn phí)</span>
          </a>
        </div>
      </div>

      {/* Assurance Box */}
      <div className="rounded-[4px] bg-[#131B2E] border border-[#2D3449] p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#89CEFF] flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#88929B] leading-relaxed">
          <h4 className="font-bold text-[#DAE2FD] text-xs">
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
