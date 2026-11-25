import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

export interface PaymentMethodSelectorProps {
  selectedMethod: 'vnpay' | 'cod' | 'sepay';
  onSelectMethod: (method: 'vnpay' | 'cod') => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  return (
    <section className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
        <span className="text-sm font-semibold text-[var(--text)]">
          03. Phương thức thanh toán
        </span>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Cổng thanh toán VNPAY</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Option 1: VNPAY */}
        <label
          onClick={() => onSelectMethod('vnpay')}
          className={`block rounded-lg border p-4 cursor-pointer transition-colors ${
            selectedMethod === 'vnpay' || selectedMethod === 'sepay'
              ? 'bg-[var(--accent-soft)] border-[var(--accent)]'
              : 'bg-[var(--surface)] border-[var(--line)] hover:border-[var(--line-strong)]'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                  selectedMethod === 'vnpay' || selectedMethod === 'sepay'
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                    : 'border-[var(--line-strong)] bg-[var(--surface)]'
                }`}
              >
                {(selectedMethod === 'vnpay' || selectedMethod === 'sepay') && (
                  <Check className="w-3 h-3 stroke-[3]" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[var(--text)]">
                    Thanh toán trực tuyến VNPAY (QR ngân hàng)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)] text-[11px] font-medium text-[var(--accent)]">
                    Xác nhận tự động
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Quét mã QR qua ứng dụng ngân hàng hoặc ví VNPAY để xác nhận đơn hàng ngay lập tức.
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)] text-[11px] font-semibold text-[var(--accent)] shrink-0">
              VNPAY
            </span>
          </div>
        </label>

        {/* Option 2: COD */}
        <label
          onClick={() => onSelectMethod('cod')}
          className={`block rounded-lg border p-4 cursor-pointer transition-colors ${
            selectedMethod === 'cod'
              ? 'bg-[var(--accent-soft)] border-[var(--accent)]'
              : 'bg-[var(--surface)] border-[var(--line)] hover:border-[var(--line-strong)]'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                  selectedMethod === 'cod'
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                    : 'border-[var(--line-strong)] bg-[var(--surface)]'
                }`}
              >
                {selectedMethod === 'cod' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[var(--text)]">
                    Thanh toán khi nhận hàng / nghiệm thu lắp đặt (COD)
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Kỹ thuật viên bàn giao, kiểm tra và lắp đặt hoàn chỉnh trước khi thanh toán.
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Chấp nhận tiền mặt hoặc quẹt thẻ POS không phụ phí (kèm hóa đơn VAT).
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--line)] text-[11px] font-medium text-[var(--text-secondary)] shrink-0">
              COD
            </span>
          </div>
        </label>
      </div>
    </section>
  );
};
