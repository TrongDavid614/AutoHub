import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Zap, ShieldCheck, ArrowRight, QrCode, Copy, Check, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SepayPaymentInfo } from '@/types/cart.types';
import { orderService } from '@/features/customer/services/order.service';

export interface OrderSuccessModalProps {
  isOpen: boolean;
  orderId: string;
  totalPayable: number;
  recipientName: string;
  sepayData?: SepayPaymentInfo;
  initialPaid?: boolean;
  onPaymentSuccess?: () => void;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  orderId,
  totalPayable,
  recipientName,
  sepayData,
  initialPaid = false,
  onPaymentSuccess,
  onClose,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState<boolean>(initialPaid);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkStatusMessage, setCheckStatusMessage] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsPaid(initialPaid);
      setIsChecking(false);
      setCheckStatusMessage(null);
    }
  }, [isOpen, initialPaid]);

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkPaymentStatus = useCallback(
    async (isAuto = false) => {
      if (!orderId || isPaid) return;
      if (!isAuto) {
        setIsChecking(true);
        setCheckStatusMessage(null);
      }

      try {
        const cleanId = orderId.replace(/^#/, '');
        const order = await orderService.getOrderDetail(cleanId);
        if (order && (order.status === 'PAID' || order.status === 'PROCESSING')) {
          setIsPaid(true);
          setCheckStatusMessage('Thanh toán SePay đã được hệ thống ghi nhận thành công!');
          onPaymentSuccess?.();
        } else if (!isAuto) {
          setCheckStatusMessage(
            'Hệ thống chưa ghi nhận tiền vào tài khoản. Quý khách vui lòng kiểm tra lại ngân hàng hoặc chờ 5-10 giây để SePay khớp lệnh tự động.'
          );
        }
      } catch {
        if (!isAuto) {
          setCheckStatusMessage('Không thể kết nối máy chủ để kiểm tra. Vui lòng thử lại sau.');
        }
      } finally {
        if (!isAuto) {
          setIsChecking(false);
        }
      }
    },
    [orderId, isPaid, onPaymentSuccess]
  );

  // Auto-polling kiểm tra trạng thái thanh toán mỗi 4 giây
  useEffect(() => {
    if (!isOpen || isPaid || !orderId || !sepayData) return;

    const interval = setInterval(() => {
      checkPaymentStatus(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, isPaid, orderId, sepayData, checkPaymentStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 overflow-y-auto">
      <div className="w-full max-w-lg rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 md:p-7 shadow-xl text-center space-y-5 my-8">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-block px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tabular-nums">
            {isPaid ? 'Đã thanh toán thành công' : 'Đặt hàng thành công'} • Mã đơn: #{orderId}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[var(--text)]">
            Cảm ơn quý khách, {recipientName}!
          </h3>
          <p className="text-xs text-[var(--text-2)] leading-relaxed max-w-md mx-auto">
            {isPaid
              ? 'Thanh toán SePay đã được xác nhận. AutoHub đang chuẩn bị đóng gói và điều phối giao hàng.'
              : 'Đơn hàng phụ kiện đã được lưu trữ thành công trên hệ thống máy chủ AutoHub và sẵn sàng điều chuyển xuất kho.'}
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
              <div>
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Đã thanh toán
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Chờ chuyển khoản
                  </span>
                )}
              </div>
            </div>

            {isPaid ? (
              <div className="py-5 px-4 bg-emerald-50/80 border border-emerald-200 rounded-lg text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-emerald-800">
                  Xác nhận thanh toán thành công!
                </h4>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
                  AutoHub đã nhận được thanh toán qua cổng SePay BIDV. Đơn hàng đang được kỹ thuật viên chuẩn bị đóng gói chuyên dụng.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                  <div className="p-2 bg-white border border-[var(--line)] rounded-lg shrink-0 shadow-sm">
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

                {/* NÚT REFRESH KIỂM TRA THANH TOÁN */}
                <div className="pt-2 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span>Hệ thống tự động kiểm tra mỗi 4 giây</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => checkPaymentStatus(false)}
                    disabled={isChecking}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line-strong)] text-xs font-semibold text-[var(--accent)] transition-all cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                    <span>{isChecking ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}</span>
                  </button>
                </div>

                {checkStatusMessage && (
                  <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                    <span className="font-medium">{checkStatusMessage}</span>
                  </div>
                )}
              </>
            )}
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
