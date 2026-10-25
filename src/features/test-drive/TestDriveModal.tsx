import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertTriangle, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCarName?: string;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  initialCarName = 'AutoHub GT-e Grand Touring',
}) => {
  const [experienceType, setExperienceType] = useState<'SHOWROOM' | 'HOME'>('SHOWROOM');
  const [selectedDate, setSelectedDate] = useState('Thứ Bảy 26/10');
  const [selectedSlot, setSelectedSlot] = useState('09:30 - 10:30');
  const [fullName, setFullName] = useState('Nguyễn Văn A');
  const [phoneNumber, setPhoneNumber] = useState('0912 345 678');
  const [email, setEmail] = useState('nguyenvana@gmail.com');
  const [licenseAgreed, setLicenseAgreed] = useState(true);
  const [notes, setNotes] = useState('Trải nghiệm đường thử sa hình & tính năng hỗ trợ tự lái AutoPilot trên cao tốc');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const dates = [
    { label: 'Thứ Sáu', date: '25/10' },
    { label: 'Thứ Bảy', date: '26/10' },
    { label: 'Chủ Nhật', date: '27/10' },
    { label: 'Thứ Hai', date: '28/10' },
    { label: 'Thứ Ba', date: '29/10' },
    { label: 'Thứ Tư', date: '30/10' },
  ];

  const timeSlots = [
    '08:30 - 09:30',
    '09:30 - 10:30',
    '10:30 - 11:30',
    '14:00 - 15:00',
    '15:30 - 16:30',
    '17:00 - 18:00',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseAgreed) {
      alert('Vui lòng xác nhận cam kết có bằng lái xe Hạng B2 trở lên còn hiệu lực.');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">
                Đăng Ký Trải Nghiệm & Lái Thử Xe
              </h3>
              <p className="text-xs text-slate-400">Đặt lịch hẹn trực tiếp cùng Kỹ thuật viên AutoHub Flagship</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
            {/* Car Preview Banner */}
            <div className="p-3.5 bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Mẫu xe lái thử</span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">{initialCarName}</h4>
                <p className="text-[11px] text-slate-400">680 HP • 3.2s (0-100) • 680 km (CLTC) • Khóa vi sai điện tử</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                Xe Sẵn Sàng
              </span>
            </div>

            {/* Experience Location */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Hình thức & Địa điểm trải nghiệm
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setExperienceType('SHOWROOM')}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                    experienceType === 'SHOWROOM'
                      ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500'
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="expType"
                      checked={experienceType === 'SHOWROOM'}
                      onChange={() => setExperienceType('SHOWROOM')}
                      className="text-cyan-500"
                    />
                    <span className="font-bold text-white text-xs">Flagship Showroom Q7</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5">
                    Đường thử sa hình chuyên nghiệp, thử nghiệm tăng tốc 0-100 km/h và AutoPilot.
                  </p>
                </div>

                <div
                  onClick={() => setExperienceType('HOME')}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                    experienceType === 'HOME'
                      ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500'
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="expType"
                      checked={experienceType === 'HOME'}
                      onChange={() => setExperienceType('HOME')}
                      className="text-cyan-500"
                    />
                    <span className="font-bold text-white text-xs">Lái thử tận nơi (VIP)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5">
                    Kỹ thuật viên giao xe tận nhà riêng hoặc công ty trong bán kính 30km.
                  </p>
                </div>
              </div>
            </div>

            {/* Notice Callout */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-amber-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <span className="font-bold">Lưu ý quan trọng:</span> Quý khách vui lòng đặt lịch trước tối thiểu 24 giờ.
                Khi tham gia lái thử, bắt buộc xuất trình <span className="font-semibold underline">GPLX Hạng B2</span> còn hiệu lực và CCCD gắn chip gốc.
              </p>
            </div>

            {/* Date Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. Chọn ngày lái thử</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {dates.map((d) => {
                  const fullVal = `${d.label} ${d.date}`;
                  const isSelected = selectedDate === fullVal;
                  return (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setSelectedDate(fullVal)}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-cyan-600 to-blue-600 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/30'
                          : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">{d.label}</div>
                      <div className="text-sm font-black mt-0.5">{d.date}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>3. Khung giờ khả dụng</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 ring-1 ring-cyan-500'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Information */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                4. Thông tin người đăng ký lái thử
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400">Họ và tên</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Địa chỉ Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Ghi chú / Yêu cầu thêm</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ví dụ: Thử khả năng đỗ xe tự động..."
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Mandatory B2 License Checkbox */}
            <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={licenseAgreed}
                  onChange={(e) => setLicenseAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-400"
                />
                <span className="text-[11px] text-slate-300 leading-relaxed">
                  Tôi cam đoan đã sở hữu <strong className="text-white">Giấy phép lái xe hạng B2 trở lên</strong> còn hạn sử dụng,
                  sức khỏe tốt và đồng ý tuân thủ toàn bộ quy định an toàn khi điều khiển xe lái thử của AutoHub.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={!licenseAgreed}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
              >
                Xác Nhận Đăng Ký Lái Thử
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Đăng ký thành công</span>
              <h4 className="text-xl font-black text-white mt-1">Mã Phiếu Hẹn: #TD-2026-881</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
                Hệ thống đã ghi nhận lịch lái thử xe <span className="text-white font-semibold">{initialCarName}</span> vào lúc{' '}
                <span className="text-cyan-400 font-bold">{selectedSlot}</span> ngày{' '}
                <span className="text-cyan-400 font-bold">{selectedDate}</span>.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Người lái thử:</span>
                <span className="font-semibold text-white">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kỹ thuật viên đồng hành:</span>
                <span className="font-semibold text-cyan-300">KTV Phạm Hùng (0918 888 999)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Địa điểm:</span>
                <span className="font-semibold text-white">Flagship Showroom Quận 7</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                to="/customer/profile"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
              >
                Xem Trong Trung Tâm Giao Dịch
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Hoàn Tất
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
