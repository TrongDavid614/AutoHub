import React, { useState, useEffect } from 'react';
import { X, Clock, CreditCard } from 'lucide-react';
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
  const [showroom, setShowroom] = useState('Showroom Q7 TP.HCM');
  const [agreed, setAgreed] = useState(true);

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

  const handleVNPayPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Vui lòng đồng ý với điều khoản giữ xe trong 72 giờ.');
      return;
    }
    onClose();
    navigate('/customer/profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Đặt cọc giữ xe trực tuyến AutoHub GT-e
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hoàn tất giữ số thứ tự ưu tiên giao xe đợt đầu và hưởng trọn bộ quyền lợi độc quyền.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleVNPayPayment} className="p-6 space-y-4 text-xs">
          {/* Variant & Color Box */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">PHIÊN BẢN XE</div>
              <div className="font-bold text-white text-sm">{carVariant}</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">MÀU SẮC NGOẠI THẤT</div>
              <div className="font-bold text-cyan-400 text-sm">{exteriorColor}</div>
            </div>
            <div className="px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/40 rounded-lg text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tạm giữ suất: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Deposit Amount */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">MỨC TIỀN CỌC CỐ ĐỊNH</div>
              <div className="text-[11px] text-emerald-400 font-medium">Cam kết hoàn cọc 100% trong 72h</div>
            </div>
            <div className="text-2xl font-black text-cyan-400 font-mono tracking-tight">
              20.000.000 <span className="text-sm font-semibold text-slate-300">VNĐ</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                HỌ VÀ TÊN NGƯỜI ĐẶT CỌC *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                SỐ ĐIỆN THOẠI LIÊN HỆ *
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 font-semibold mb-1">
              SỐ CĂN CƯỚC CÔNG DÂN (CCCD) *
            </label>
            <input
              type="text"
              required
              value={identityCard}
              onChange={(e) => setIdentityCard(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <p className="text-[10px] text-slate-500 mt-1 italic">
              * Bắt buộc để đối soát pháp lý và lập hợp đồng cọc điện tử chính thức.
            </p>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 font-semibold mb-1">
              SHOWROOM NHẬN BÀN GIAO XE *
            </label>
            <select
              value={showroom}
              onChange={(e) => setShowroom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="Showroom Q7 TP.HCM">Showroom AutoHub Q7 Flagship (Crescent Mall, TP.HCM)</option>
              <option value="Showroom Mỹ Đình Hà Nội">Showroom AutoHub Mỹ Đình (Hà Nội)</option>
              <option value="Giao xe tận nhà">Giao xe tận nhà riêng (VIP Concierge)</option>
            </select>
          </div>

          {/* Commitment Checkbox */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-400"
              />
              <span className="text-[11px] text-slate-300 leading-relaxed">
                Tôi cam kết thông tin CCCD chính xác và đồng ý với <strong className="text-white">điều khoản giữ xe trong 72 giờ</strong> của AutoHub.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Tiến hành thanh toán VNPay (20.000.000 đ)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
