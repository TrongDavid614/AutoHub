import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Clock,
  RotateCw,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Lock,
  Building2,
} from 'lucide-react';
import { calculateTestPaymentAmount } from '@/lib/utils';

export interface VNPayQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  orderCode: string;
  orderInfo: string;
  recipientName?: string;
  txnRef?: string;
  paymentUrl?: string;
}

export const VNPayQRModal: React.FC<VNPayQRModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  orderCode,
  orderInfo,
  recipientName = 'Khách hàng AutoHub',
  txnRef,
  paymentUrl,
}) => {
  // 1-phút (60 giây) countdown timer
  const [countdown, setCountdown] = useState<number>(60);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  // Trạng thái copy thông tin
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Trạng thái đang xác nhận thanh toán
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState<boolean>(false);

  // Nội dung chuyển khoản động gắn liền với lần refresh
  const currentTxnRef = txnRef || `VNP_${orderCode.replace(/[^a-zA-Z0-9]/g, '')}_${refreshCount}`;
  const transferContent = `AH VNP ${orderCode.replace('#', '')}`;

  // Đếm ngược 60 giây và tự động đóng/hết hạn mã QR
  useEffect(() => {
    if (!isOpen || isPaidSuccess) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, refreshCount, isPaidSuccess]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Xử lý tạo lại mã QR mới
  const handleRegenerateQR = () => {
    setRefreshCount((prev) => prev + 1);
    setCountdown(60);
    setIsExpired(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Xác nhận đã thanh toán
  const handleConfirmPaid = async () => {
    setIsVerifying(true);
    try {
      // Gọi API giả lập xác nhận thanh toán thành công nếu có txnRef
      await fetch(`http://localhost:8080/api/payment/vnpay/simulate-success/${currentTxnRef}`, {
        method: 'POST',
      }).catch(() => null);
    } catch {
      // Fallback nếu chạy độc lập
    }
    setTimeout(() => {
      setIsVerifying(false);
      setIsPaidSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 1000);
  };

  // URL VietQR tiêu chuẩn ngân hàng MB Bank
  const testPaymentAmount = calculateTestPaymentAmount(amount, false);
  const qrImageUrl = `https://img.vietqr.io/image/970422-0988888888-compact2.png?amount=${testPaymentAmount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=AUTOHUB%20VIETNAM`;

  const progressPercentage = (countdown / 60) * 100;
  const isUrgent = countdown <= 15;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 overflow-y-auto"
    >
      <div className="w-full max-w-xl rounded-xl bg-[var(--surface)] border border-[var(--line)] p-5 sm:p-7 shadow-xl text-left relative overflow-hidden my-auto">
        {/* Top Cobalt Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--line)] gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-[var(--accent)] text-white text-xs font-semibold">
                VNPAY-QR
              </span>
              <span className="text-xs text-[var(--accent)] font-medium">
                Cổng thanh toán trực tuyến
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text)]">
              Thanh toán VNPay QR: {orderCode}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {orderInfo} • Khách hàng: <strong className="text-[var(--text)]">{recipientName}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--line)] flex items-center justify-center cursor-pointer transition-colors shrink-0"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isPaidSuccess ? (
          /* TRẠNG THÁI THÀNH CÔNG */
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[var(--text)]">Giao dịch VNPay thành công!</h3>
              <p className="text-xs text-[var(--text-2)] max-w-sm mx-auto">
                Hệ thống đã tự động khớp lệnh thanh toán{' '}
                <span className="tabular-nums font-medium">{amount.toLocaleString('vi-VN')} đ</span> cho đơn{' '}
                <strong className="text-[var(--accent)] font-mono">{orderCode}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="pt-4 space-y-5">
            {/* 1-MINUTE LIVE TIMER BAR */}
            <div className="p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock
                    className={`w-4 h-4 ${
                      isExpired
                        ? 'text-red-700'
                        : isUrgent
                        ? 'text-amber-700'
                        : 'text-[var(--accent)]'
                    }`}
                  />
                  <span className="font-semibold text-[var(--text)]">
                    {isExpired ? 'Mã QR đã hết hạn hiệu lực' : 'Thời gian hiệu lực mã QR (1 phút):'}
                  </span>
                </div>

                <div
                  className={`font-mono text-sm font-bold tabular-nums px-2 py-0.5 rounded-md border ${
                    isExpired
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : isUrgent
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/20'
                  }`}
                >
                  {isExpired ? '00:00 (Đã đóng)' : `00:${countdown.toString().padStart(2, '0')}`}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                    isExpired
                      ? 'bg-red-600 w-0'
                      : isUrgent
                      ? 'bg-amber-600'
                      : 'bg-[var(--accent)]'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="text-xs text-[var(--text-muted)] flex items-center justify-between">
                <span>Cứ mỗi 1 phút mã QR sẽ tự động đóng để bảo mật thanh toán</span>
                {refreshCount > 0 && <span className="tabular-nums">Đã tạo lại: {refreshCount} lần</span>}
              </div>
            </div>

            {/* QR CODE DISPLAY BOX */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* QR Image Box with 1-Minute Expire Overlay */}
              <div className="relative rounded-xl bg-white border border-[var(--line)] p-3 flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
                <img
                  src={qrImageUrl}
                  alt={`Mã QR thanh toán VNPay ${orderCode}`}
                  className={`w-full max-w-[210px] aspect-square object-contain transition-opacity duration-300 ${
                    isExpired ? 'grayscale opacity-15' : 'opacity-100'
                  }`}
                />

                {/* OVERLAY KHI MÃ QR ĐÃ ĐÓNG (HẾT 1 PHÚT) */}
                {isExpired && (
                  <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-4 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 text-red-700 flex items-center justify-center">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-red-700">
                        Mã QR đã đóng
                      </div>
                      <p className="text-xs text-[var(--text-2)] leading-relaxed max-w-[200px]">
                        Hết 1 phút bảo mật. Nhấn nút bên dưới để tạo mã QR mới.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRegenerateQR}
                      className="py-2.5 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>Tạo lại mã mới</span>
                    </button>
                  </div>
                )}

                <div className="text-xs text-[var(--text-2)] font-medium pt-1">
                  Quét bằng VNPay hoặc App ngân hàng
                </div>
              </div>

              {/* Thông tin chuyển khoản sao chép 1 chạm */}
              <div className="space-y-2.5 text-xs">
                {/* Số tiền */}
                <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[var(--text-muted)] block">Số tiền pháp lý</span>
                    <span className="text-base font-bold tabular-nums text-[var(--text)]">
                      {amount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[var(--accent)] font-medium block">
                      Mã QR test
                    </span>
                    <span className="text-xs font-bold tabular-nums text-[var(--accent)]">
                      {testPaymentAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* Ngân hàng */}
                <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-[var(--text-muted)] block">Ngân hàng thụ hưởng</span>
                    <span className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>MB Bank (Quân Đội)</span>
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">CN TP.HCM</span>
                </div>

                {/* Số tài khoản */}
                <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[var(--text-muted)] block">Số tài khoản</span>
                    <span className="font-mono font-bold text-sm tabular-nums text-[var(--text)]">0988888888</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('0988888888', 'account')}
                    className="p-1.5 rounded-md hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                    title="Sao chép số tài khoản"
                  >
                    {copiedField === 'account' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Nội dung CK */}
                <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-xs text-[var(--text-muted)] block">Nội dung chuyển khoản</span>
                    <span className="font-mono font-bold text-xs text-[var(--text)] truncate block">
                      {transferContent}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transferContent, 'content')}
                    className="p-1.5 rounded-md hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shrink-0 cursor-pointer"
                    title="Sao chép nội dung"
                  >
                    {copiedField === 'content' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Hướng dẫn và lưu ý */}
            <div className="p-3 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/20 text-xs text-[var(--text-2)] flex items-start gap-2 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
              <div>
                Hệ thống VNPay và AutoHub sẽ <strong className="text-[var(--text)]">tự động nhận diện lệnh chuyển tiền</strong> trong vòng 3–10 giây sau khi chuyển thành công mà không cần chụp lại ủy nhiệm chi.
              </div>
            </div>

            {/* BUTTONS THAO TÁC */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={handleConfirmPaid}
                disabled={isVerifying}
                className="w-full sm:flex-1 py-3 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Đang kiểm tra khớp lệnh VNPay...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tôi đã chuyển khoản / Quét QR thành công</span>
                  </>
                )}
              </button>

              {paymentUrl && (
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto py-3 px-3.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] text-xs font-medium text-[var(--text)] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Cổng VNPay</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </a>
              )}

              <button
                type="button"
                onClick={handleRegenerateQR}
                className="w-full sm:w-auto py-3 px-3.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] text-xs font-medium text-[var(--text)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Tạo lại mã QR 1 phút mới"
              >
                <RotateCw className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Làm mới QR</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
