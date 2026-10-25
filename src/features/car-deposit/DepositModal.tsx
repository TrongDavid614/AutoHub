import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  QrCode
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  carVariant?: string;
  exteriorColor?: string;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  carVariant = 'Grand Touring',
  exteriorColor = 'Xanh Phantom',
}) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('Nguyễn Văn A');
  const [phoneNumber, setPhoneNumber] = useState('0912 345 678');
  const [identityCard, setIdentityCard] = useState('001201012345');
  const [selectedShowroom, setSelectedShowroom] = useState('Showroom Q7 TP.HCM');
  const [paymentMethod, setPaymentMethod] = useState<'VNPAY_QR' | 'ATM_CARD'>('VNPAY_QR');
  const [agreed, setAgreed] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // 15:00 countdown timer
  const [timerSeconds, setTimerSeconds] = useState(14 * 60 + 59);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Vui lòng đồng ý với điều khoản giữ xe trong 72 giờ.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      // Redirect to customer profile to see live telemetry deposit card
      navigate('/customer/profile');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans text-[#DAE2FD]">
      <div className="relative w-full max-w-[620px] bg-[#131D35] border border-[#06B6D4]/30 rounded-lg shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85),0_0_32px_-6px_rgba(14,165,233,0.25)] overflow-hidden my-6">
        {/* Top Ambient Highlight */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent opacity-80" />

        {/* Modal Header matching Figma: Modal Đặt cọc AutoHub GT-e */}
        <div className="flex justify-between items-start p-6 pb-3 border-b border-[#2D3449]/60">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Đặt cọc giữ xe trực tuyến AutoHub GT-e
            </h2>
            <p className="text-xs text-[#BEC8D2]">
              Hoàn tất giữ số thứ tự ưu tiên giao xe đợt đầu và hưởng trọn bộ quyền lợi độc quyền.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#88929B] hover:text-white bg-[#222A3D] hover:bg-[#2D3449] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleDepositSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto text-xs">
          
          {/* Reservation Summary Card */}
          <div className="p-4 rounded-lg bg-[#17223D] border border-[#06B6D4]/20 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2D3449]/60">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono text-[#88929B] uppercase">PHIÊN BẢN XE</div>
                <div className="font-semibold text-sm text-white">{carVariant}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono text-[#88929B] uppercase">MÀU SẮC NGOẠI THẤT</div>
                <div className="font-semibold text-sm text-[#7BD0FF]">{exteriorColor}</div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00A6E0]/20 border border-[#00A6E0]/40 text-[#7BD0FF] font-mono text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-[#00A6E0]" />
                <span>Tạm giữ suất: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Deposit Amount Callout */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#88929B] uppercase">MỨC TIỀN CỌC CỐ ĐỊNH</div>
                <div className="text-xs text-[#89CEFF] font-medium flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cam kết hoàn cọc 100% trong vòng 72h</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl font-extrabold text-[#89CEFF]">
                  20.000.000 <span className="text-xs text-[#DAE2FD] font-normal">VNĐ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Identity Fields */}
          <div className="space-y-3">
            {/* Họ và tên */}
            <div className="space-y-1">
              <label className="text-[#BEC8D2] font-semibold uppercase text-[10px] font-mono">
                HỌ VÀ TÊN NGƯỜI ĐẶT CỌC *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Nguyễn Văn A"
                className="w-full px-3.5 py-2.5 rounded bg-[#222A3D] border border-[#3E4850]/60 text-sm text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
              />
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1">
              <label className="text-[#BEC8D2] font-semibold uppercase text-[10px] font-mono">
                SỐ ĐIỆN THOẠI LIÊN HỆ *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="0912 345 678"
                className="w-full px-3.5 py-2.5 rounded bg-[#222A3D] border border-[#3E4850]/60 text-sm text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
              />
            </div>

            {/* Số CCCD */}
            <div className="space-y-1">
              <label className="text-[#BEC8D2] font-semibold uppercase text-[10px] font-mono">
                SỐ CĂN CƯỚC CÔNG DÂN (CCCD) *
              </label>
              <input
                type="text"
                value={identityCard}
                onChange={(e) => setIdentityCard(e.target.value)}
                required
                placeholder="001201012345"
                className="w-full px-3.5 py-2.5 rounded bg-[#222A3D] border border-[#3E4850]/60 text-sm text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
              />
              <div className="text-[11px] text-[#88929B] italic pt-0.5">
                * Bắt buộc để đối soát pháp lý và lập hợp đồng cọc điện tử chính thức.
              </div>
            </div>

            {/* Showroom nhận xe */}
            <div className="space-y-1">
              <label className="text-[#BEC8D2] font-semibold uppercase text-[10px] font-mono">
                SHOWROOM NHẬN BÀN GIAO XE *
              </label>
              <select
                value={selectedShowroom}
                onChange={(e) => setSelectedShowroom(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-[#222A3D] border border-[#3E4850]/60 text-sm text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
              >
                <option value="Showroom Q7 TP.HCM">Showroom Q7 TP.HCM</option>
                <option value="Showroom Landmark 81 TP.HCM">Showroom Landmark 81 TP.HCM</option>
                <option value="Showroom Hyperion Hà Nội">Showroom Hyperion Hà Nội</option>
              </select>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-mono font-bold text-[#DAE2FD] uppercase tracking-wider">
              CỔNG THANH TOÁN BẢO MẬT (VNPAY HMAC-SHA512)
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setPaymentMethod('VNPAY_QR')}
                className={`p-3 rounded border cursor-pointer transition-all flex items-center gap-2.5 ${
                  paymentMethod === 'VNPAY_QR'
                    ? 'bg-[#222A3D] border-[#0EA5E9] shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                    : 'bg-[#171F33] border-[#3E4850]/40'
                }`}
              >
                <QrCode className="w-5 h-5 text-[#89CEFF]" />
                <div>
                  <div className="font-bold text-[#DAE2FD]">VNPay-QR Siêu Tốc</div>
                  <div className="text-[10px] text-[#BEC8D2]">Quét mã tức thì</div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('ATM_CARD')}
                className={`p-3 rounded border cursor-pointer transition-all flex items-center gap-2.5 ${
                  paymentMethod === 'ATM_CARD'
                    ? 'bg-[#222A3D] border-[#0EA5E9] shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                    : 'bg-[#171F33] border-[#3E4850]/40'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#89CEFF]" />
                <div>
                  <div className="font-bold text-[#DAE2FD]">Thẻ ATM / Quốc tế</div>
                  <div className="text-[10px] text-[#BEC8D2]">Visa, Mastercard, JCB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Agreement */}
          <div className="p-3 rounded bg-[#171F33] border border-[#3E4850]/40 flex items-start gap-2.5 text-xs">
            <input
              type="checkbox"
              id="depositTermsAgreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 rounded border-[#3E4850] bg-[#222A3D] text-[#0EA5E9]"
            />
            <label htmlFor="depositTermsAgreement" className="text-[#BEC8D2] leading-relaxed cursor-pointer">
              Tôi xác nhận thông tin chính xác và đồng ý với <span className="text-[#89CEFF] font-semibold">Quy chế đặt cọc và chính sách hoàn tiền 100% trong 72 giờ</span> của AutoHub Việt Nam.
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#3E4850]/40">
            <div className="text-[11px] text-[#BEC8D2] flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>Bảo mật SSL 256-bit</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-[#3E4850]/60 text-xs font-semibold text-[#BEC8D2] hover:text-[#DAE2FD] hover:bg-[#222A3D]"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 rounded bg-gradient-to-r from-[#0EA5E9] to-[#89CEFF] text-[#00344D] font-bold text-xs shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:brightness-110 transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <span>Đang kết nối cổng VNPay...</span>
                ) : (
                  <>
                    <span>Tiến hành thanh toán VNPay 20.000.000 đ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
