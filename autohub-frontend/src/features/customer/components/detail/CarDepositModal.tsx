import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  X,
  Clock,
  ShieldCheck,
  AlertCircle,
  Building,
  User,
  Phone,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  Copy,
  Check,
  RotateCw,
  RefreshCw,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { depositService } from '@/features/customer/services/deposit.service';
import type { CarDepositItem } from '@/features/customer/types/car-deposit.types';

export interface CarDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  variantId?: number | string;
  carName?: string;
  trimName?: string;
  colorName?: string;
  depositAmount?: number;
}

export const CarDepositModal: React.FC<CarDepositModalProps> = ({
  isOpen,
  onClose,
  variantId,
  carName = 'AutoHub GT-e',
  trimName = 'GT-e Performance',
  colorName = 'Xanh Công Nghệ Hyper Tech Blue',
  depositAmount = 20000000,
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [fullName, setFullName] = useState(() => user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(() => user?.phoneNumber || '');
  const [identityCard, setIdentityCard] = useState(() => user?.identityCardNumber || '079201009988');
  const [showroom, setShowroom] = useState('Showroom Flagship Q7, TP.HCM');
  const [isAgreed, setIsAgreed] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [paymentPendingMsg, setPaymentPendingMsg] = useState<string | null>(null);

  // Flow states: 1. Form -> 2. Pending Payment (QR 15p) -> 3. Paid Success (72h)
  const [currentDeposit, setCurrentDeposit] = useState<CarDepositItem | null>(null);
  const [isPendingPayment, setIsPendingPayment] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  // 15-minute reservation timer (14:59 downwards)
  const [remainingSeconds, setRemainingSeconds] = useState(14 * 60 + 59);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isOpen) return null;

  // Bước 1: Khởi tạo phiếu cọc xe (Trạng thái PENDING_PAYMENT - 15 phút)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage('Quý khách cần đăng nhập để thực hiện đặt cọc xe.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên người đứng tên cọc.');
      return;
    }

    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phoneNumber.replace(/\s/g, ''))) {
      setErrorMessage('Số điện thoại không hợp lệ (yêu cầu 10 chữ số).');
      return;
    }

    // CCCD 12 số theo quy chế BR01
    if (!/^[0-9]{12}$/.test(identityCard.trim())) {
      setErrorMessage('Số Căn cước công dân (CCCD) phải bao gồm đúng 12 chữ số theo quy chế BR01.');
      return;
    }

    if (!isAgreed) {
      setErrorMessage('Quý khách vui lòng đồng ý với điều khoản giữ xe trong 72 giờ.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await depositService.createDeposit({
        customerId: user?.id,
        phienBanId: variantId ? Number(variantId) : undefined,
        soCCCD: identityCard.trim(),
        hoTen: fullName.trim(),
        soDienThoai: phoneNumber.trim(),
        showroom: showroom,
        soTienCoc: depositAmount,
      });

      if (created) {
        setCurrentDeposit(created);
        setIsPendingPayment(true);
      } else {
        // Fallback giả lập offline
        const mockItem: CarDepositItem = {
          id: Date.now(),
          depositCode: `#DEP-GTE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          carModelName: carName,
          carVariant: trimName,
          exteriorColor: colorName,
          colorHex: '#0EA5E9',
          carImageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200',
          depositAmount: depositAmount,
          identityCardNumber: identityCard.trim(),
          customerName: fullName.trim(),
          customerPhone: phoneNumber.trim(),
          showroomName: showroom,
          showroomAddress: showroom,
          status: 'PENDING_PAYMENT',
          createdAt: new Date().toISOString(),
        };
        setCurrentDeposit(mockItem);
        setIsPendingPayment(true);
      }
    } catch {
      setErrorMessage('Có lỗi xảy ra khi tạo phiếu đặt cọc. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bước 2: Kiểm tra trạng thái thanh toán từ DB (chỉ đọc qua GET, không tự ghi PAID)
  const handleCheckPaymentStatus = async () => {
    if (!currentDeposit) return;
    setIsCheckingStatus(true);
    setPaymentPendingMsg(null);
    try {
      const statusRes = await depositService.getDepositStatus(currentDeposit.id);
      if (statusRes?.isPaid || statusRes?.status === 'PAID') {
        setIsPendingPayment(false);
        setDepositSuccess(true);
      } else {
        setPaymentPendingMsg(
          'Hệ thống chưa ghi nhận giao dịch chuyển khoản. Vui lòng chờ 10–30 giây sau khi chuyển hoặc kiểm tra lại nội dung chuyển khoản.'
        );
      }
    } catch {
      setPaymentPendingMsg('Không thể kiểm tra trạng thái thanh toán lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const depositCode = currentDeposit?.depositCode || `#DEP-GTE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const transferContent = currentDeposit?.transferContent || `AH DEP ${depositCode.replace('#', '')}`;
  const bankAccount = currentDeposit?.bankAccountNumber || '5811676579';
  const bankBrand = currentDeposit?.bankBrandName || 'BIDV';
  const bankAccountName = currentDeposit?.bankAccountName || 'CONG TY CO PHAN AUTOHUB VIETNAM';
  const qrImageUrl = currentDeposit?.qrImageUrl || `https://img.vietqr.io/image/bidv-5811676579-compact2.png?amount=${depositAmount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=CONG%20TY%20CO%20PHAN%20AUTOHUB%20VIETNAM`;

  // Auto-polling trạng thái thanh toán từ webhook SePay
  useEffect(() => {
    if (!isPendingPayment || !currentDeposit?.id) return;
    const interval = setInterval(async () => {
      try {
        const res = await depositService.getDepositStatus(currentDeposit.id);
        if (res?.isPaid) {
          setIsPendingPayment(false);
          setDepositSuccess(true);
        }
      } catch {
        // giữ nhịp polling
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [isPendingPayment, currentDeposit?.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl bg-surface-container border border-accent-primary/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top Accent Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-primary to-transparent" />

        {/* 1. Header Modal */}
        <div className="flex items-start justify-between pb-4 border-b border-surface-highlight gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent-primary" />
              <h2 className="text-xl font-bold text-text-primary tracking-tight">
                Đặt cọc giữ xe trực tuyến {carName}
              </h2>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Bảo lưu số thứ tự ưu tiên giao xe và giữ suất số khung trong 72 giờ.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer transition-colors shrink-0"
            aria-label="Đóng modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP -> YÊU CẦU ĐĂNG NHẬP */}
        {!isAuthenticated ? (
          <div className="py-8 px-4 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent-action/15 border border-accent-primary/40 flex items-center justify-center text-accent-primary shadow-[0_0_25px_rgba(14,165,233,0.2)]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-text-primary">Yêu cầu đăng nhập tài khoản</h3>
              <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                Để bảo vệ quyền lợi pháp lý và xác lập phiếu cọc giữ chỗ 72h theo đúng quy chế BR01, quý khách vui lòng đăng nhập tài khoản trước khi đặt cọc xe.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-surface-elevated/80 border border-surface-highlight text-left max-w-md mx-auto space-y-1.5 text-xs text-text-secondary">
              <div className="flex items-center gap-2 text-accent-primary font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Quyền lợi chủ xe khi đăng nhập:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-text-muted">
                <li>Tự động đối soát CCCD và lưu trữ hợp đồng cọc điện tử.</li>
                <li>Theo dõi tiến độ bàn giao số khung VIN trên cổng portal.</li>
                <li>Hưởng chính sách cam kết hoàn cọc 100% trong 72 giờ.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-surface-elevated border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                Để sau
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <span>ĐĂNG NHẬP ĐỂ ĐẶT CỌC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : isPendingPayment ? (
          /* TRƯỜNG HỢP 2: BƯỚC THANH TOÁN QR (PENDING_PAYMENT - 15 PHÚT) */
          <div className="py-4 space-y-4 animate-fadeIn text-left">
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent-action/10 border border-accent-primary/30">
              <div className="flex items-center gap-2 text-xs font-bold text-accent-primary">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>THỜI HẠN GIỮ SUẤT THANH TOÁN (15 PHÚT):</span>
              </div>
              <span className="font-mono font-bold text-sm text-accent-primary">{formatTimer(remainingSeconds)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* VietQR Code */}
              <div className="p-3 rounded-xl bg-canvas-deep border border-surface-highlight text-center space-y-2">
                <img
                  src={qrImageUrl}
                  alt="Mã QR thanh toán cọc xe AutoHub"
                  className="w-44 h-44 mx-auto object-contain rounded-lg shadow-md bg-white p-1"
                />
                <span className="text-[10px] text-text-muted block">Quét mã bằng App Ngân Hàng bất kỳ</span>
              </div>

              {/* Thông tin chuyển khoản */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-elevated border border-surface-highlight space-y-0.5">
                  <span className="text-[10px] text-text-muted font-mono block">NGÂN HÀNG THỤ HƯỞNG</span>
                  <span className="font-bold text-text-primary">{bankBrand} - {bankAccountName}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-elevated border border-surface-highlight flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-text-muted font-mono block">SỐ TÀI KHOẢN (SEPAY VIETQR)</span>
                    <span className="font-mono font-bold text-sm text-text-primary">{bankAccount}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bankAccount, 'stk')}
                    className="p-1 rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {copiedField === 'stk' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-elevated border border-surface-highlight flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[10px] text-text-muted font-mono block">NỘI DUNG CHUYỂN KHOẢN</span>
                    <span className="font-mono font-bold text-xs text-accent-primary truncate block">{transferContent}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transferContent, 'content')}
                    className="p-1 rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer shrink-0"
                  >
                    {copiedField === 'content' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-elevated border border-surface-highlight flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-text-muted font-mono block">SỐ TIỀN CỌC</span>
                    <span className="font-mono font-black text-sm text-emerald-400">{depositAmount.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              </div>
            </div>

            {paymentPendingMsg && (
              <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/40 text-xs text-amber-300 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{paymentPendingMsg}</span>
              </div>
            )}

            <div className="p-3 rounded-lg bg-surface-elevated/70 border border-surface-highlight text-[11px] text-text-muted flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
              <span>Hệ thống tự động kiểm tra giao dịch sau mỗi 2.5 giây qua cổng SePay. Sau khi chuyển tiền, bạn có thể chờ hệ thống tự nhận diện hoặc bấm nút bên dưới để kiểm tra ngay.</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-surface-highlight">
              <button
                type="button"
                onClick={handleCheckPaymentStatus}
                disabled={isCheckingStatus}
                className="w-full sm:flex-1 py-3 px-5 rounded-lg bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isCheckingStatus ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Đang kiểm tra giao dịch...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>KIỂM TRA TRẠNG THÁI THANH TOÁN</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 rounded-lg bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                Để sau
              </button>
            </div>
          </div>
        ) : depositSuccess ? (
          /* TRƯỜNG HỢP 3: ĐÃ ĐẶT CỌC THÀNH CÔNG VÀ KÍCH HOẠT 72H */
          <div className="py-6 space-y-5 text-center animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-text-primary">Đặt cọc xe thành công!</h3>
              <p className="text-xs text-text-muted">
                Hệ thống đã xác nhận phiếu đặt cọc và kích hoạt bảo lưu số khung xe trong 72 giờ.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-surface-highlight text-left space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-surface-highlight text-xs">
                <span className="text-text-muted uppercase text-[10px] font-mono">MÃ PHIẾU CỌC</span>
                <span className="font-mono font-bold text-accent-primary">{depositCode}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase block">XE ĐẶT CỌC</span>
                  <span className="font-semibold text-text-primary">{carName} - {trimName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase block">MÀU NGOẠI THẤT</span>
                  <span className="font-semibold text-accent-primary">{colorName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase block">TIỀN CỌC ĐÃ XÁC NHẬN</span>
                  <span className="font-mono font-bold text-emerald-400">{depositAmount.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase block">SHOWROOM NHẬN XE</span>
                  <span className="font-semibold text-text-primary truncate block">{showroom}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-highlight flex items-center gap-2 text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded">
                <CalendarCheck className="w-4 h-4 shrink-0" />
                <span>Suất giữ xe có hiệu lực trong <strong>72 giờ</strong>. Chuyên viên tư vấn AutoHub sẽ liên hệ trong 30 phút để bàn giao hợp đồng.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/customer/deposits');
                }}
                className="w-full sm:flex-1 py-3 px-5 rounded-lg bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <span>XEM PHIẾU CỌC CỦA TÔI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 rounded-lg bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          /* TRƯỜNG HỢP 4: FORM ĐIỀN THÔNG TIN CỌC XE */
          <form onSubmit={handleSubmit} className="pt-4 space-y-4">
            {/* 2. Car Summary & Deposit Details Card */}
            <div className="p-4 rounded-lg bg-surface-elevated/70 border border-surface-highlight space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-surface-highlight/60">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-text-muted uppercase block">PHIÊN BẢN XE</span>
                    <span className="font-bold text-text-primary">{trimName}</span>
                  </div>
                  <span className="text-border-subtle">•</span>
                  <div>
                    <span className="text-[10px] font-mono text-text-muted uppercase block">MÀU SẮC NGOẠI THẤT</span>
                    <span className="font-bold text-accent-primary">{colorName}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-accent-action/15 border border-accent-primary/30 text-accent-primary font-mono text-[11px] font-bold">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>Tạm giữ suất: {formatTimer(remainingSeconds)}</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-0.5">
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase block">MỨC TIỀN CỌC CỐ ĐỊNH</span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cam kết hoàn cọc 100% trong 72h (BR05)</span>
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black font-mono text-accent-primary">
                    {depositAmount.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs font-mono font-bold text-text-muted">VNĐ</span>
                </div>
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="p-3 rounded bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 3. Form Information Fields */}
            <div className="space-y-3">
              {/* Họ tên & SĐT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary">
                    HỌ VÀ TÊN NGƯỜI ĐẶT CỌC <span className="text-accent-primary">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-3.5 h-3.5 text-text-muted absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary">
                    SỐ ĐIỆN THOẠI LIÊN HỆ <span className="text-accent-primary">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-3.5 h-3.5 text-text-muted absolute left-3 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Số CCCD 12 số */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">
                  SỐ CĂN CƯỚC CÔNG DÂN (CCCD) <span className="text-accent-primary">*</span>
                </label>
                <div className="relative flex items-center">
                  <CreditCard className="w-3.5 h-3.5 text-text-muted absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    maxLength={12}
                    required
                    value={identityCard}
                    onChange={(e) => setIdentityCard(e.target.value)}
                    placeholder="001201012345"
                    className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary font-mono tracking-wider focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-text-muted">
                  * Bắt buộc để đối soát pháp lý và lập hợp đồng cọc điện tử chính thức (Quy chế BR01).
                </p>
              </div>

              {/* Showroom nhận bàn giao xe */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">
                  SHOWROOM NHẬN BÀN GIAO XE <span className="text-accent-primary">*</span>
                </label>
                <div className="relative flex items-center">
                  <Building className="w-3.5 h-3.5 text-text-muted absolute left-3 pointer-events-none" />
                  <select
                    value={showroom}
                    onChange={(e) => setShowroom(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary focus:outline-none"
                  >
                    <option value="Showroom Flagship Q7, TP.HCM">Showroom Flagship Q7, TP.HCM (Đại lộ Nguyễn Văn Linh)</option>
                    <option value="Showroom AutoHub Thủ Đức, TP.HCM">Showroom AutoHub Thủ Đức (Đại lộ Mai Chí Thọ)</option>
                    <option value="Showroom AutoHub Quận 1, TP.HCM">Showroom AutoHub Quận 1 (Số 2 Tôn Đức Thắng)</option>
                    <option value="Showroom AutoHub Hoàn Kiếm, Hà Nội">Showroom AutoHub Hoàn Kiếm (Lý Thường Kiệt, Hà Nội)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Checkbox Cam Kết Điều Khoản 72H */}
            <div className="p-3 rounded bg-canvas-deep border border-surface-highlight">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-accent-action bg-canvas-deep border-surface-highlight focus:ring-accent-primary"
                />
                <span className="text-xs text-text-secondary leading-relaxed">
                  Tôi cam kết thông tin CCCD chính xác và đồng ý với điều khoản giữ xe trong 72 giờ theo quy định bảo mật pháp lý AutoHub.
                </span>
              </label>
            </div>

            {/* 5. Cụm nút thao tác */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-surface-highlight">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3 px-5 rounded-lg bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.35)] hover:shadow-[0_0_30px_rgba(137,206,255,0.5)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-accent-contrast" />
                <span>
                  {isSubmitting
                    ? 'Đang khởi tạo phiếu cọc...'
                    : `XÁC NHẬN ĐẶT CỌC GIỮ XE 72H (${depositAmount.toLocaleString('vi-VN')} đ)`}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 rounded-lg bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
