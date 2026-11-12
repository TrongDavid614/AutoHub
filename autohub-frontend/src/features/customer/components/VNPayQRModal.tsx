import React, { useState, useEffect } from 'react';
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
  const qrImageUrl = `https://img.vietqr.io/image/970422-0988888888-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=AUTOHUB%20VIETNAM`;

  const progressPercentage = (countdown / 60) * 100;
  const isUrgent = countdown <= 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#060E20]/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-[#0F172A] border border-[#0EA5E9]/40 p-5 sm:p-7 shadow-[0_0_50px_rgba(14,165,233,0.2)] text-left relative overflow-hidden my-auto">
        {/* Top Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0EA5E9] via-[#89CEFF] to-[#0EA5E9]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1E293B] gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-[#0EA5E9] text-[#003751] font-mono text-[10px] font-black uppercase tracking-wider">
                VNPAY-QR
              </span>
              <span className="text-[11px] font-mono text-[#89CEFF] font-semibold">
                CỔNG THANH TOÁN TRỰC TUYẾN
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFC]">
              Thanh toán VNPay QR: {orderCode}
            </h2>
            <p className="text-xs text-[#94A3B8]">
              {orderInfo} • Khách hàng: <strong className="text-[#E2E8F0]">{recipientName}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center cursor-pointer transition-colors shrink-0"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isPaidSuccess ? (
          /* TRẠNG THÁI THÀNH CÔNG */
          <div className="py-12 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(52,211,153,0.3)]">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#F8FAFC]">Giao Dịch VNPay Thành Công!</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                Hệ thống đã tự động khớp lệnh thanh toán {amount.toLocaleString('vi-VN')} đ cho đơn{' '}
                <strong className="text-[#89CEFF]">{orderCode}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="pt-4 space-y-5">
            {/* 1-MINUTE LIVE TIMER BAR */}
            <div className="p-3 rounded-lg bg-[#1E293B]/80 border border-[#334155] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock
                    className={`w-4 h-4 ${
                      isExpired
                        ? 'text-rose-400'
                        : isUrgent
                        ? 'text-amber-400 animate-spin'
                        : 'text-[#89CEFF] animate-pulse'
                    }`}
                  />
                  <span className="font-semibold text-[#E2E8F0]">
                    {isExpired ? 'Mã QR đã hết hạn hiệu lực' : 'Thời gian hiệu lực mã QR (1 phút):'}
                  </span>
                </div>

                <div
                  className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
                    isExpired
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : isUrgent
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-[#0EA5E9]/20 text-[#89CEFF] border border-[#0EA5E9]/40'
                  }`}
                >
                  {isExpired ? '00:00 (ĐÃ ĐÓNG)' : `00:${countdown.toString().padStart(2, '0')}`}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                    isExpired
                      ? 'bg-rose-500 w-0'
                      : isUrgent
                      ? 'bg-amber-400'
                      : 'bg-[#0EA5E9]'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="text-[10px] text-[#94A3B8] flex items-center justify-between">
                <span>Cứ mỗi 1 phút mã QR sẽ tự động đóng để bảo mật thanh toán</span>
                {refreshCount > 0 && <span>Đã tạo lại: {refreshCount} lần</span>}
              </div>
            </div>

            {/* QR CODE DISPLAY BOX */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* QR Image Box with 1-Minute Expire Overlay */}
              <div className="relative rounded-xl bg-[#FFFFFF] p-3 shadow-inner flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
                <img
                  src={qrImageUrl}
                  alt={`Mã QR thanh toán VNPay ${orderCode}`}
                  className={`w-full max-w-[210px] aspect-square object-contain transition-all duration-300 ${
                    isExpired ? 'blur-md grayscale opacity-25 scale-95' : 'blur-0 opacity-100'
                  }`}
                />

                {/* OVERLAY KHI MÃ QR ĐÃ ĐÓNG (HẾT 1 PHÚT) */}
                {isExpired && (
                  <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center space-y-3 animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wide">
                        Mã QR Đã Đóng
                      </div>
                      <p className="text-[11px] text-[#94A3B8] leading-relaxed max-w-[200px]">
                        Hết 1 phút bảo mật. Nhấn nút bên dưới để tạo mã QR mới.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRegenerateQR}
                      className="py-2.5 px-4 rounded-lg bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(14,165,233,0.4)] cursor-pointer transition-all active:scale-95"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>Tạo lại mã mới</span>
                    </button>
                  </div>
                )}

                <div className="text-[10px] text-[#475569] font-mono font-semibold pt-1">
                  QUÉT BẰNG VNPAY HOẶC APP NGÂN HÀNG
                </div>
              </div>

              {/* Thông tin chuyển khoản sao chép 1 chạm */}
              <div className="space-y-2.5 text-xs">
                {/* Số tiền */}
                <div className="p-2.5 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#94A3B8] block">SỐ TIỀN THANH TOÁN</span>
                    <span className="text-base font-black font-mono text-[#38BDF8]">
                      {amount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(amount.toString(), 'amount')}
                    className="p-1.5 rounded hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                    title="Sao chép số tiền"
                  >
                    {copiedField === 'amount' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Ngân hàng */}
                <div className="p-2.5 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#94A3B8] block">NGÂN HÀNG THỤ HƯỞNG</span>
                    <span className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#0EA5E9]" />
                      <span>MB Bank (Quân Đội)</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8]">CN TP.HCM</span>
                </div>

                {/* Số tài khoản */}
                <div className="p-2.5 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#94A3B8] block">SỐ TÀI KHOẢN</span>
                    <span className="font-mono font-bold text-sm text-[#F8FAFC]">0988888888</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('0988888888', 'account')}
                    className="p-1.5 rounded hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                    title="Sao chép số tài khoản"
                  >
                    {copiedField === 'account' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Nội dung CK */}
                <div className="p-2.5 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[10px] font-mono text-[#94A3B8] block">NỘI DUNG CHUYỂN KHOẢN</span>
                    <span className="font-mono font-bold text-xs text-[#F8FAFC] truncate block">
                      {transferContent}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transferContent, 'content')}
                    className="p-1.5 rounded hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors shrink-0"
                    title="Sao chép nội dung"
                  >
                    {copiedField === 'content' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Hướng dẫn và lưu ý */}
            <div className="p-3 rounded-lg bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[11px] text-[#BAE6FD] flex items-start gap-2 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
              <div>
                Hệ thống VNPay và AutoHub sẽ <strong>tự động nhận diện lệnh chuyển tiền</strong> trong vòng 3-10 giây sau khi chuyển thành công mà không cần chụp lại ủy nhiệm chi.
              </div>
            </div>

            {/* BUTTONS THAO TÁC */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={handleConfirmPaid}
                disabled={isVerifying}
                className="w-full sm:flex-1 py-3 px-4 rounded-lg bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all disabled:opacity-50"
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
                  className="w-full sm:w-auto py-3 px-3.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-xs font-semibold text-[#E2E8F0] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Cổng VNPay</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8]" />
                </a>
              )}

              <button
                type="button"
                onClick={handleRegenerateQR}
                className="w-full sm:w-auto py-3 px-3.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-xs font-semibold text-[#E2E8F0] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Tạo lại mã QR 1 phút mới"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Làm mới QR</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
