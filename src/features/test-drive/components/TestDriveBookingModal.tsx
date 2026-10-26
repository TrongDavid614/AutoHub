import React, { useState } from 'react';
import { Calendar, X, User, Phone } from 'lucide-react';

interface TestDriveBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    selectedCarModel: string;
    selectedLocation: string;
    bookingDate: string;
    timeSlot: string;
    customerName: string;
    customerPhone: string;
    licenseAgreed: boolean;
  }) => void;
}

export const TestDriveBookingModal: React.FC<TestDriveBookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedCarModel, setSelectedCarModel] = useState('AutoHub GT-e');
  const [selectedLocation, setSelectedLocation] = useState('Showroom AutoHub Flagship Thủ Đức');
  const [bookingDate, setBookingDate] = useState('29/10/2026');
  const [timeSlot, setTimeSlot] = useState('09:00 - 10:30');
  const [licenseAgreed, setLicenseAgreed] = useState(true);
  const [customerName, setCustomerName] = useState('Nguyễn Văn A');
  const [customerPhone, setCustomerPhone] = useState('0912345678');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseAgreed) {
      alert('Quý khách bắt buộc phải cam kết có Giấy phép lái xe (GPLX) hợp lệ theo quy chế BR06.');
      return;
    }
    onSubmit({
      selectedCarModel,
      selectedLocation,
      bookingDate,
      timeSlot,
      customerName,
      customerPhone,
      licenseAgreed,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl bg-surface-container border border-surface-highlight p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent-primary" />
            <h3 className="text-base font-bold text-text-primary">Đăng Ký Trải Nghiệm Lái Thử Xe Demo (UC16)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          {/* Chọn mẫu xe */}
          <div className="space-y-1">
            <label className="text-xs text-text-muted">Mẫu xe thuần điện muốn trải nghiệm *</label>
            <select
              value={selectedCarModel}
              onChange={(e) => setSelectedCarModel(e.target.value)}
              className="w-full h-10 px-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary focus:outline-none"
            >
              <option value="AutoHub GT-e">AutoHub GT-e (Sedan Thể Thao 800V SiC - 650 HP)</option>
              <option value="AutoHub e-SUV Ultra">AutoHub e-SUV Ultra (SUV 7 Chỗ Gia Đình - Pin 110 kWh)</option>
            </select>
          </div>

          {/* Showroom & Địa điểm */}
          <div className="space-y-1">
            <label className="text-xs text-text-muted">Địa điểm nhận xe lái thử *</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-10 px-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary focus:outline-none"
            >
              <option value="Showroom AutoHub Flagship Thủ Đức">Showroom AutoHub Flagship Thủ Đức (Đại lộ Mai Chí Thọ)</option>
              <option value="Showroom AutoHub Quận 1">Showroom AutoHub Quận 1 (Số 2 Tôn Đức Thắng)</option>
              <option value="Lái thử tại địa chỉ nhà riêng">Lái thử tại địa chỉ nhà riêng</option>
            </select>
          </div>

          {/* Ngày & Khung giờ (Yêu cầu trước 24h theo BR06) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Ngày hẹn (cách ít nhất 24h) *</label>
              <input
                type="text"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                placeholder="29/10/2026"
                className="w-full h-10 px-3 bg-canvas-deep border border-surface-highlight rounded text-xs text-text-primary font-mono focus:border-accent-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Khung giờ slot trống *</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full h-10 px-3 bg-canvas-deep border border-surface-highlight rounded text-xs text-text-primary font-mono focus:border-accent-primary focus:outline-none"
              >
                <option value="09:00 - 10:30">09:00 - 10:30 (Sáng)</option>
                <option value="10:30 - 12:00">10:30 - 12:00 (Sáng)</option>
                <option value="14:00 - 15:30">14:00 - 15:30 (Chiều)</option>
                <option value="15:30 - 17:00">15:30 - 17:00 (Chiều)</option>
              </select>
            </div>
          </div>

          {/* Thông tin khách hàng */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Họ tên người lái thử *</label>
              <div className="relative flex items-center">
                <User className="w-3.5 h-3.5 text-text-muted absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-10 pl-8 pr-3 bg-canvas-deep border border-surface-highlight rounded text-xs text-text-primary focus:border-accent-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Số điện thoại liên hệ *</label>
              <div className="relative flex items-center">
                <Phone className="w-3.5 h-3.5 text-text-muted absolute left-3 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full h-10 pl-8 pr-3 bg-canvas-deep border border-surface-highlight rounded text-xs text-text-primary font-mono focus:border-accent-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Cam kết có GPLX theo BR06 */}
          <div className="p-3 rounded bg-canvas-deep border border-surface-highlight space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={licenseAgreed}
                onChange={(e) => setLicenseAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-accent-action bg-canvas-deep border-surface-highlight"
              />
              <span className="text-xs text-text-primary leading-relaxed">
                Tôi cam kết hiện đang sở hữu Giấy phép lái xe (GPLX) hạng B2 trở lên còn thời hạn hiệu lực và sẽ xuất trình bản gốc cho nhân viên trước khi nhận xe lái thử (Quy định bắt buộc BR06).
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-highlight">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-surface-elevated text-xs text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast cursor-pointer transition-colors"
            >
              Xác Nhận Đặt Lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
