import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';
import { VehicleDemoCard } from './VehicleDemoCard';
import { LocationSelector, type LocationType } from './LocationSelector';
import { DateTimeSelector } from './DateTimeSelector';
import { CustomerInfoForm } from './CustomerInfoForm';
import { useAuthStore } from '@/store/useAuthStore';

export interface TestDriveBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  carModelName?: string;
  variantName?: string;
  onSubmitSuccess?: () => void;
}

export const TestDriveBookingModal: React.FC<TestDriveBookingModalProps> = ({
  isOpen,
  onClose,
  carModelName = 'AutoHub GT-e',
  variantName = 'AutoHub GT-e Grand Touring',
  onSubmitSuccess,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [selectedLocation, setSelectedLocation] = useState<LocationType>('SHOWROOM');
  const [selectedDate, setSelectedDate] = useState<string>('25/10');
  const [selectedSlot, setSelectedSlot] = useState<string>('09:00 - 10:00');

  const [fullName, setFullName] = useState<string>(user?.fullName || 'Nguyễn Văn A');
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || '0912345678');
  const [note, setNote] = useState<string>(
    'Muốn trải nghiệm tính năng tự hành ADAS LiDAR trên cao tốc Long Thành.'
  );
  const [licenseAgreed, setLicenseAgreed] = useState<boolean>(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Quý khách vui lòng nhập họ và tên.');
      return;
    }

    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phoneNumber.replace(/\s/g, ''))) {
      setErrorMessage('Số điện thoại không hợp lệ (yêu cầu 10 chữ số).');
      return;
    }

    if (!licenseAgreed) {
      setErrorMessage(
        'Quý khách bắt buộc phải cam kết có Giấy phép lái xe (GPLX) ô tô Hạng B2 trở lên còn hiệu lực.'
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onSubmitSuccess) {
          onSubmitSuccess();
        } else {
          navigate('/customer/test-drives');
        }
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-canvas-deep/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* MODAL DIALOG CONTAINER */}
      <div className="w-full max-w-4xl my-auto rounded-xl bg-surface-container/95 border border-surface-highlight shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85),0_0_32px_-6px_rgba(14,165,233,0.18)] relative overflow-hidden">
        {/* Top Specular Ambient Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-accent-primary to-transparent" />

        {/* Modal Interior Container */}
        <div className="p-5 sm:p-7 space-y-5">
          {/* SECTION 1: MODAL HEADER */}
          <div className="flex items-start justify-between pb-3.5 border-b border-surface-highlight/60 gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-accent-primary uppercase">
                  TRẢI NGHIỆM ĐẶC QUYỀN VIP • AUTO-CONNECTED 800V
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-accent-action/20 border border-accent-primary/30 text-accent-primary font-mono text-[9px] font-bold">
                  STAGE: DEMO PILOT
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Đăng ký lái thử trải nghiệm {carModelName}
              </h2>

              <p className="text-xs text-text-muted leading-relaxed max-w-2xl">
                Cảm nhận gia tốc thuần điện 3.2s, kiến trúc sạc siêu nhanh 800V và công nghệ lái tự hành LiDAR cùng chuyên viên AutoHub.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer transition-colors shrink-0"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isSuccess ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3] animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Đặt lịch lái thử xe Demo thành công!
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                Chuyên viên kỹ thuật AutoHub sẽ liên hệ qua SMS/Cuộc gọi để xác nhận lộ trình trước 24 giờ.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message if any */}
              {errorMessage && (
                <div className="p-3 rounded bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* SECTION 2: VEHICLE DEMO SELECTION CARD */}
              <VehicleDemoCard
                modelName={carModelName}
                variantName={variantName}
                year="MY 2025"
                power="680"
                acceleration="3.2"
                range="680"
              />

              {/* SECTION 3: TEST DRIVE LOCATION SELECTION */}
              <LocationSelector
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
              />

              {/* SECTION 4: DATE & TIME SELECTION */}
              <DateTimeSelector
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />

              {/* SECTION 5: CUSTOMER INFORMATION FORM & SECTION 6: COMPLIANCE CHECKBOX */}
              <CustomerInfoForm
                fullName={fullName}
                setFullName={setFullName}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                note={note}
                setNote={setNote}
                licenseAgreed={licenseAgreed}
                setLicenseAgreed={setLicenseAgreed}
              />

              {/* SECTION 7: MODAL FOOTER & ACTION BUTTONS */}
              <div className="pt-3 border-t border-surface-highlight flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Miễn phí trải nghiệm 100% • Bảo hiểm trách nhiệm lái thử toàn diện từ AutoHub.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none py-3 px-5 rounded-lg bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none py-3 px-6 rounded-lg bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.35)] hover:shadow-[0_0_30px_rgba(137,206,255,0.5)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-accent-contrast" />
                    <span>
                      {isSubmitting ? 'Đang xác nhận lịch...' : 'Xác nhận đăng ký lái thử'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
