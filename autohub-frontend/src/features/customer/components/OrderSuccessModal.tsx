import React from 'react';
import { CheckCircle, Zap, ShieldCheck, ArrowRight, QrCode, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SepayPaymentInfo } from '@/types/cart.types';

export interface OrderSuccessModalProps {
  isOpen: boolean;
  orderId: string;
  totalPayable: number;
  recipientName: string;
  sepayData?: SepayPaymentInfo;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  orderId,
  totalPayable,
  recipientName,
  sepayData,
  onClose,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 overflow-y-auto">
      <div className="w-full max-w-lg rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 md:p-7 shadow-xl text-center space-y-5 my-8">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-block px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tabular-nums">
            Đặt hàng thành công • Mã đơn: #{orderId}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[var(--text)]">
            Cảm ơn quý khách, {recipientName}!
          </h3>
          <p className="text-xs text-[var(--text-2)] leading-relaxed max-w-md mx-auto">
            Đơn hàng phụ kiện đã được lưu trữ thành công trên hệ thống máy chủ AutoHub và sẵn sàng điều chuyển xuất kho.
          </p>
        </div>

        {/* SePay QR Code Payment Block */}
        {sepayData && (
          <div className="p-4 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
              <div className="flex items-center gap-1.5 text-[var(--accent)] text-xs font-semibold">
                <QrCode className="w-4 h-4" />
                <span>Quét mã VietQR thanh toán (SePay)</span>
              </div>
              <span className="text-xs text-emerald-700 font-semibold">Tự động xác nhận</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              <div className="p-2 bg-white border border-[var(--line)] rounded-lg shrink-0">
                <img
                  src={sepayData.qrUrl}
                  alt={`VietQR SePay ${sepayData.transferContent}`}
                  className="w-32 h-32 object-contain"
                />
              </div>

              <div className="space-y-1.5 text-xs flex-1 w-full">
                <div className="flex justify-between text-[var(--text-2)]">
                  <span>Ngân hàng:</span>
                  <span className="text-[var(--text)] font-semibold">{sepayData.bankBrandName}</span>
                </div>
                <div className="flex justify-between text-[var(--text-2)]">
                  <span>Số tài khoản:</span>
                  <span className="font-mono text-[var(--text)] font-semibold tabular-nums">{sepayData.accountNumber}</span>
                </div>
                <div className="flex justify-between text-[var(--text-2)]">
                  <span>Tổng tiền đơn hàng:</span>
                  <span className="text-[var(--text)] font-semibold tabular-nums">
                    {(totalPayable ?? 0).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-2)]">
                  <span>Số tiền quét mã test:</span>
                  <span className="text-[var(--accent)] font-semibold tabular-nums">
                    {sepayData.transferAmount.toLocaleString('vi-VN')} đ (Sandbox)
                  </span>
                </div>
                <div className="pt-1">
                  <div className="text-xs text-[var(--text-muted)]">Nội dung chuyển khoản:</div>
                  <div className="flex items-center justify-between bg-[var(--surface)] px-2.5 py-1.5 rounded-md mt-0.5 border border-[var(--line)]">
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      {sepayData.transferContent}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyContent(sepayData.transferContent)}
                      className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer p-0.5"
                      title="Sao chép nội dung"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] p-3.5 flex items-center justify-between text-xs">
          <span className="font-medium text-[var(--text-2)]">Tổng giá trị đơn hàng:</span>
          <span className="text-lg font-bold tabular-nums text-[var(--accent)]">
            {(totalPayable ?? 0).toLocaleString('vi-VN')} đ
          </span>
        </div>

        <div className="grid grid-cols-2 border border-[var(--line)] rounded-lg bg-[var(--surface-subtle)] divide-x divide-[var(--line)] text-left">
          <div className="p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[var(--accent)] font-semibold text-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>Lắp đặt 24h</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Kỹ sư liên hệ trước 30 phút theo lịch hẹn.</p>
          </div>
          <div className="p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bảo hành chính hãng</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Bảo hành 24–36 tháng tiêu chuẩn OEM.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/accessories');
            }}
            className="flex-1 py-2.5 px-4 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)] text-xs font-medium cursor-pointer transition-colors"
          >
            Tiếp tục mua sắm
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/customer/orders');
            }}
            className="flex-1 py-2.5 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Quản lý đơn hàng</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
