import React from 'react';
import { ShieldCheck, Clock } from 'lucide-react';

export interface StepPaymentMethodProps {
  selectedPaymentMethod: 'vnpay' | 'cod' | 'sepay';
  onSelectPaymentMethod: (method: 'vnpay' | 'cod') => void;
  timeLeftFormatted: string;
}

export const StepPaymentMethod: React.FC<StepPaymentMethodProps> = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
  timeLeftFormatted,
}) => {
  const isVnPaySelected = selectedPaymentMethod === 'vnpay' || selectedPaymentMethod === 'sepay';

  return (
    <section className="rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 space-y-5">
      {/* Step Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--line)]">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center text-xs font-bold tabular-nums">
            03
          </span>
          <h2 className="text-lg font-bold text-[var(--text)]">Phương thức thanh toán</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-2)]">
          <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
          <span>Cổng thanh toán bảo vệ 100%</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Option 1: VNPAY */}
        <div
          onClick={() => onSelectPaymentMethod('vnpay')}
          className={`rounded-lg border p-5 cursor-pointer transition-colors space-y-3.5 ${
            isVnPaySelected
              ? 'bg-[var(--accent-soft)]/50 border-[var(--accent)] ring-1 ring-[var(--accent)]/20'
              : 'bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--surface-subtle)]'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                  isVnPaySelected
                    ? 'border-[var(--accent)] bg-[var(--accent)]'
                    : 'border-[var(--line)] bg-[var(--surface)]'
                }`}
              >
                {isVnPaySelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[var(--text)]">
                    Thanh toán trực tuyến VNPAY-QR (MB Bank / VietQR)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[var(--accent)] text-white text-xs font-semibold">
                    Khuyên dùng
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium tabular-nums">
                    Ưu đãi giảm 500.000 đ
                  </span>
                </div>

                <p className="text-xs text-[var(--text-2)] leading-relaxed">
                  Hiển thị mã QR thanh toán nhanh qua ứng dụng ngân hàng. Mã QR tự động làm mới và đóng sau mỗi 1 phút để bảo đảm an toàn giao dịch.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info Pills */}
          <div className="flex items-center gap-2 pl-7 flex-wrap">
            {['VNPAY-QR', 'Tự động khớp lệnh', 'MB Bank / VCB / Techcombank'].map((badge) => (
              <span
                key={badge}
                className="px-2.5 py-0.5 rounded-md bg-[var(--surface-subtle)] border border-[var(--line)] text-xs font-medium text-[var(--text-2)]"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* VNPay Benefit Ribbon */}
          <div className="ml-7 p-3 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--text-2)]">
            <p className="leading-relaxed">
              <strong className="text-[var(--accent)]">Ưu đãi thanh toán: </strong>
              Tự động áp dụng voucher <strong className="font-mono text-[var(--text)]">VNPAYAUTOHUB</strong> giảm thêm <strong className="text-[var(--accent)] tabular-nums">500.000 đ</strong> khi quét mã VNPAY QR thanh toán thành công.
            </p>
          </div>
        </div>

        {/* Option 2: COD */}
        <div
          onClick={() => onSelectPaymentMethod('cod')}
          className={`rounded-lg border p-5 cursor-pointer transition-colors ${
            selectedPaymentMethod === 'cod'
              ? 'bg-[var(--accent-soft)]/50 border-[var(--accent)] ring-1 ring-[var(--accent)]/20'
              : 'bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--surface-subtle)]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                selectedPaymentMethod === 'cod'
                  ? 'border-[var(--accent)] bg-[var(--accent)]'
                  : 'border-[var(--line)] bg-[var(--surface)]'
              }`}
            >
              {selectedPaymentMethod === 'cod' && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[var(--text)]">
                  Thanh toán khi nhận hàng (COD)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text-2)] text-xs font-medium">
                  Thu hộ
                </span>
              </div>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
                Áp dụng cho đơn hàng phụ kiện xe điện dưới 50.000.000 đ. Kiểm tra niêm phong, kiểm đếm linh kiện nguyên vẹn trước khi thanh toán tiền mặt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Notice Callout with Live Countdown */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
        <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="text-amber-950">Lưu ý quan trọng: </strong>
          Đơn hàng thanh toán VNPay sẽ có thời hạn giữ kho{' '}
          <span className="font-bold tabular-nums text-sm px-2 py-0.5 rounded bg-white border border-amber-200 text-amber-800">
            {timeLeftFormatted}
          </span>{' '}
          phút. Quý khách vui lòng chuẩn bị sẵn ứng dụng ngân hàng hoặc thẻ thanh toán để xác thực giao dịch nhanh chóng và an toàn.
        </div>
      </div>
    </section>
  );
};
