import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface SuccessHeroBannerProps {
  orderCode: string;
  transactionTime: string;
  transactionId: string;
}

export const SuccessHeroBanner: React.FC<SuccessHeroBannerProps> = ({
  orderCode,
  transactionTime,
  transactionId,
}) => {
  return (
    <section className="text-center space-y-5 pt-4 pb-2">
      {/* Status Check Icon */}
      <div className="flex justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9" />
        </div>
      </div>

      {/* Status Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-600" />
        <span>Đã thanh toán • SePay Secured</span>
      </div>

      {/* Heading */}
      <div className="space-y-2.5 max-w-[672px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)] tracking-tight leading-tight">
          Đặt hàng & Thanh toán phụ kiện
          <br className="hidden sm:inline" /> thành công!
        </h1>

        <p className="text-sm text-[var(--text-2)] max-w-[576px] mx-auto leading-relaxed">
          Mã đơn hàng:{' '}
          <strong className="font-mono text-[var(--accent)] font-bold tabular-nums">{orderCode}</strong>
          . Hệ thống AutoHub đã nhận thanh toán SePay và tự động chuyển thông tin sang trung tâm kho vận.
        </p>
      </div>

      {/* Transaction Summary Strip */}
      <div className="max-w-[460px] mx-auto rounded-lg bg-[var(--surface)] border border-[var(--line)] p-3.5 grid grid-cols-3 divide-x divide-[var(--line)] text-center text-xs">
        <div className="px-2">
          <div className="text-xs text-[var(--text-muted)]">Thời gian</div>
          <div className="font-semibold text-[var(--text)] tabular-nums mt-0.5">{transactionTime}</div>
        </div>
        <div className="px-2">
          <div className="text-xs text-[var(--text-muted)]">Giao dịch</div>
          <div className="font-semibold text-[var(--accent)] font-mono tabular-nums mt-0.5">{transactionId}</div>
        </div>
        <div className="px-2">
          <div className="text-xs text-[var(--text-muted)]">Trạng thái</div>
          <div className="font-semibold text-emerald-700 mt-0.5">Đã duyệt</div>
        </div>
      </div>
    </section>
  );
};
