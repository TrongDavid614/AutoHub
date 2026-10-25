import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { MOCK_CARS } from '@/mock/mockData';

export const TestDriveBookingPage: React.FC = () => {
  const [selectedCarId, setSelectedCarId] = useState<string>('gt-e-grand-touring');
  const [experienceType, setExperienceType] = useState<'SHOWROOM' | 'HOME'>('SHOWROOM');
  const [selectedDate, setSelectedDate] = useState<string>('Thứ Bảy 26/10');
  const [selectedSlot, setSelectedSlot] = useState<string>('09:30 - 10:30');
  const [fullName, setFullName] = useState<string>('Nguyễn Văn A');
  const [phoneNumber, setPhoneNumber] = useState<string>('0912 345 678');
  const [email, setEmail] = useState<string>('nguyenvana@gmail.com');
  const [identityCard, setIdentityCard] = useState<string>('079090001234');
  const [licenseAgreed, setLicenseAgreed] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('Trải nghiệm đường thử sa hình & tính năng hỗ trợ tự lái AutoPilot trên cao tốc');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const selectedCar = MOCK_CARS.find((c) => c.id === selectedCarId) || MOCK_CARS[0];

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
      alert('Vui lòng xác nhận cam kết sở hữu GPLX Hạng B2 trở lên còn hiệu lực.');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-cyan-400 transition-colors">Trang chủ</Link>
        <span>/</span>
        <span className="text-slate-200 font-semibold">Đăng ký lái thử ô tô điện AutoHub</span>
      </nav>

      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-extrabold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Trải Nghiệm Đẳng Cấp Thượng Lưu</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          Đăng Ký Trải Nghiệm & Lái Thử Xe AutoHub GT-e
        </h1>
        <p className="text-xs text-slate-400">
          Cảm nhận gia tốc tức thì của động cơ điện SiC và hệ thống treo khí nén bán chủ động cùng chuyên gia kỹ thuật AutoHub.
        </p>
      </div>

      {!isSubmitted ? (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Step 1: Car Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Chọn phiên bản xe lái thử
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MOCK_CARS.map((car) => {
                const isSelected = selectedCarId === car.id;
                return (
                  <div
                    key={car.id}
                    onClick={() => setSelectedCarId(car.id)}
                    className={`cursor-pointer p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">{car.segment}</span>
                      <h4 className="text-xs font-black text-white mt-0.5">{car.name}</h4>
                      <div className="text-[10px] text-slate-400 mt-1">{car.power} • {car.acceleration}</div>
                    </div>
                    <div className="text-xs font-extrabold text-cyan-300 mt-2">
                      {car.listedPrice.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Car Highlight */}
          <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-800/40 border border-slate-700 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedCar.image}
                alt={selectedCar.name}
                className="w-20 h-14 object-cover rounded-lg border border-slate-700"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Phiên bản đang chọn</span>
                <h3 className="text-sm font-extrabold text-white">{selectedCar.name}</h3>
                <p className="text-[11px] text-slate-400">
                  {selectedCar.power} • {selectedCar.acceleration} (0-100) • {selectedCar.range}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              Xe Demo Sẵn Sàng Tại Q7
            </span>
          </div>

          {/* Step 2: Experience Location */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. Hình thức & Địa điểm trải nghiệm
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setExperienceType('SHOWROOM')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  experienceType === 'SHOWROOM'
                    ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500'
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="expTypeFull"
                    checked={experienceType === 'SHOWROOM'}
                    onChange={() => setExperienceType('SHOWROOM')}
                    className="text-cyan-500"
                  />
                  <span className="font-bold text-white text-xs">Flagship Showroom Quận 7</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5">
                  Đại lộ Huỳnh Tấn Phát, Q7. Trải nghiệm đường thử sa hình độc quyền và tính năng tự lái.
                </p>
              </div>

              <div
                onClick={() => setExperienceType('HOME')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  experienceType === 'HOME'
                    ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500'
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="expTypeFull"
                    checked={experienceType === 'HOME'}
                    onChange={() => setExperienceType('HOME')}
                    className="text-cyan-500"
                  />
                  <span className="font-bold text-white text-xs">Lái thử tận nơi (VIP Concierge)</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5">
                  Chuyên viên đưa xe trực tiếp đến tận nhà riêng hoặc cơ quan trong bán kính 30km.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-amber-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <span className="font-bold">Lưu ý quan trọng:</span> Quý khách vui lòng đặt lịch trước tối thiểu 24 giờ.
              Khi nhận bàn giao xe lái thử, vui lòng mang theo <span className="font-semibold underline">GPLX Hạng B2</span> bản gốc và CCCD gắn chip để đối soát an toàn.
            </p>
          </div>

          {/* Step 3: Date & Time Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>3. Chọn ngày lái thử</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {dates.map((d) => {
                  const fullVal = `${d.label} ${d.date}`;
                  const isSelected = selectedDate === fullVal;
                  return (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setSelectedDate(fullVal)}
                      className={`p-2.5 rounded-xl text-center border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-cyan-600 to-blue-600 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">{d.label}</div>
                      <div className="text-sm font-black mt-0.5">{d.date}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>4. Khung giờ khả dụng</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
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
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 4: Customer Contact Info */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              5. Thông tin cá nhân người lái thử
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400">Họ và tên</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full mt-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Số điện thoại</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full mt-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Email nhận vé điện tử</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Số Căn cước công dân (CCCD)</label>
                <input
                  type="text"
                  value={identityCard}
                  onChange={(e) => setIdentityCard(e.target.value)}
                  required
                  className="w-full mt-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400">Yêu cầu trải nghiệm đặc biệt</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Mandatory Checkbox */}
          <div className="p-3.5 bg-slate-800/60 border border-slate-700 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={licenseAgreed}
                onChange={(e) => setLicenseAgreed(e.target.checked)}
                className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-400"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                Tôi xác nhận đã có <strong className="text-white">Giấy phép lái xe hạng B2 trở lên</strong> còn hiệu lực,
                sức khỏe đảm bảo và cam kết tuân thủ hướng dẫn kỹ thuật an toàn của chuyên viên AutoHub.
              </span>
            </label>
          </div>

          {/* CTA Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/cars"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Quay Lại Showroom
            </Link>
            <button
              type="submit"
              disabled={!licenseAgreed}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all"
            >
              Xác Nhận Đăng Ký Lái Thử
            </button>
          </div>
        </form>
      ) : (
        /* Confirmation Screen */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Đăng Ký Thành Công • Vé Điện Tử Đã Phát Hành
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Mã Phiếu: #TD-2026-881</h2>
            <p className="text-xs text-slate-400 mt-2">
              Chuyên viên tư vấn và Kỹ thuật viên phụ trách sẽ liên hệ xác nhận lộ trình với quý khách trước 12 giờ.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl text-left text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Dòng xe trải nghiệm:</span>
              <span className="font-bold text-white">{selectedCar.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Thời gian lái thử:</span>
              <span className="font-bold text-cyan-400">{selectedSlot} - {selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kỹ thuật viên đồng hành:</span>
              <span className="font-semibold text-cyan-300">KTV Phạm Hùng (0918 888 999)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Địa điểm:</span>
              <span className="font-semibold text-white">AutoHub Flagship Showroom Quận 7</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              to="/customer/profile"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <span>Xem Trong Trung Tâm Quản Lý Giao Dịch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};