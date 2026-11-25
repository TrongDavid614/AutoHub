import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, FileCheck2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CheckoutSuccessModalProps {
  isOpen: boolean;
  orderCode: string;
  grandTotal: number;
  recipientName: string;
  paymentMethod: 'vnpay' | 'cod' | 'sepay';
  onClose: () => void;
}

export const CheckoutSuccessModal: React.FC<CheckoutSuccessModalProps> = ({
  isOpen,
  orderCode,
  grandTotal,
  recipientName,
  paymentMethod,
  onClose,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45">
      <div className="w-full max-w-lg rounded-xl bg-[var(--surface)] border border-[var(--line)] p-7 shadow-xl text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tabular-nums">
            {paymentMethod === 'cod' ? 'Đặt hàng COD thành công' : 'Giao dịch VNPay-QR thành công'} • #{orderCode}
          </div>
          <h3 className="text-2xl font-bold text-[var(--text)]">
            Cảm ơn quý khách, {recipientName}!
          </h3>
          <p className="text-xs text-[var(--text-2)] leading-relaxed max-w-md mx-auto">
            Đơn hàng phụ kiện xe điện của bạn đã được tiếp nhận. Đội ngũ kỹ thuật viên AutoHub Logistics đang chuẩn bị thùng hàng niêm phong chuyên dụng và lên lịch bàn giao.
          </p>
        </div>

        <div className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] p-4 flex items-center justify-between text-xs">
          <span className="font-medium text-[var(--text-2)]">Tổng thanh toán:</span>
          <span className="text-lg font-bold tabular-nums text-[var(--accent)]">
            {(grandTotal ?? 0).toLocaleString('vi-VN')} đ
          </span>
        </div>

        <div className="grid grid-cols-2 border border-[var(--line)] rounded-lg bg-[var(--surface-subtle)] divide-x divide-[var(--line)] text-left">
          <div className="p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[var(--accent)] font-semibold text-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>Giao tiêu chuẩn</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Bàn giao ngày mai, kiểm tra niêm phong.</p>
          </div>
          <div className="p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bảo hiểm 100%</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Bảo hiểm an toàn pin cao áp 800V.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(`/order-success?orderCode=${encodeURIComponent(orderCode)}`);
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line-strong)] text-[var(--accent)] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Xem hóa đơn điện tử</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/customer/orders');
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Quản lý đơn hàng</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
