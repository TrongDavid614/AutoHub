import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  X,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  Building,
  User,
  Phone,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface CarDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  carName?: string;
  trimName?: string;
  colorName?: string;
  depositAmount?: number;
}

export const CarDepositModal: React.FC<CarDepositModalProps> = ({
  isOpen,
  onClose,
  carName = 'AutoHub GT-e',
  trimName = 'GT-e Performance',
  colorName = 'Xanh Công Nghệ Hyper Tech Blue',
  depositAmount = 20000000,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [fullName, setFullName] = useState(user?.fullName || 'Nguyễn Văn A');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '0912345678');
  const [identityCard, setIdentityCard] = useState(user?.identityCardNumber || '001201012345');
  const [showroom, setShowroom] = useState('Showroom Flagship Q7, TP.HCM');
  const [isAgreed, setIsAgreed] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 15-minute reservation timer (14:59 downwards)
  const [remainingSeconds, setRemainingSeconds] = useState(14 * 60 + 59);

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên người đứng tên cọc.');
      return;
    }

    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phoneNumber.replace(/\s/g, ''))) {
      setErrorMessage('Số điện thoại không hợp lệ (yêu cầu 10 chữ số).');
      return;
    }

    // BR01 & CCCD 12 số
    if (!/^[0-9]{12}$/.test(identityCard.trim())) {
      setErrorMessage('Số Căn cước công dân (CCCD) phải bao gồm đúng 12 chữ số theo quy chế BR01.');
      return;
    }

    if (!isAgreed) {
      setErrorMessage('Quý khách vui lòng đồng ý với điều khoản giữ xe trong 72 giờ.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        navigate('/customer/deposits');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl bg-surface-container border border-accent-primary/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
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
              Hoàn tất giữ số thứ tự ưu tiên giao xe đợt đầu và hưởng trọn bộ quyền lợi độc quyền.
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

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3] animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              Khởi tạo giao dịch cọc VNPay thành công!
            </h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Hệ thống đang chuyển hướng bạn tới Phiếu Đặt Cọc Giữ Xe 72H để đối soát số khung VIN...
            </p>
          </div>
        ) : (
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
                    ? 'Đang kết nối cổng VNPay...'
                    : `Tiến hành thanh toán VNPay (${depositAmount.toLocaleString('vi-VN')} đ)`}
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
