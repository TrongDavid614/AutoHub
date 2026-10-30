import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShieldCheck, Check, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { VehicleDemoCard } from '@/features/customer/components/VehicleDemoCard';
import { LocationSelector, type LocationType } from '@/features/customer/components/LocationSelector';
import { DateTimeSelector } from '@/features/customer/components/DateTimeSelector';
import { CustomerInfoForm } from '@/features/customer/components/CustomerInfoForm';
import { useAuthStore } from '@/store/useAuthStore';

export const TestDriveCanvasPage: React.FC = () => {
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
        navigate('/customer/test-drives');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full bg-canvas-deep flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden">
      {/* 1. Ambient Showroom Scene Background (Simulating underlying showroom canvas) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/a01482ef6cb81ce110e4a578644fa711837413b0?width=2560"
          alt="AutoHub Showroom Background Canvas"
          className="w-full h-full object-cover object-center filter blur-[6px] scale-105 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas-deep/80 via-canvas-deep/90 to-canvas-deep" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-action/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* 2. Top floating back link */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="fixed top-5 left-5 z-20 px-3.5 py-2 rounded-lg bg-surface-container/90 hover:bg-surface-elevated border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center gap-2 backdrop-blur-md transition-colors cursor-pointer shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 text-accent-primary" />
        <span>Quay lại</span>
      </button>

      {/* 3. MODAL DIALOG CONTAINER */}
      <div className="relative z-10 w-full max-w-4xl rounded-xl bg-surface-container/95 border border-surface-highlight shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85),0_0_32px_-6px_rgba(14,165,233,0.18)] backdrop-blur-xl overflow-hidden my-6">
        {/* Top Specular Ambient Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-accent-primary to-transparent" />

        {/* Interior Container */}
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

              <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
                Đăng ký lái thử trải nghiệm AutoHub GT-e
              </h1>

              <p className="text-sm text-text-muted leading-relaxed max-w-2xl">
                Cảm nhận gia tốc thuần điện 3.2s, kiến trúc sạc siêu nhanh 800V và công nghệ lái tự hành LiDAR cùng chuyên viên AutoHub.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/cars')}
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
              <h2 className="text-lg font-bold text-text-primary">
                Đặt lịch lái thử xe Demo thành công!
              </h2>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                Hệ thống đang chuyển bạn đến trang quản lý Lịch hẹn lái thử cá nhân để theo dõi chuyên viên tư vấn...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* SECTION 2: VEHICLE DEMO SELECTION CARD */}
              <VehicleDemoCard
                modelName="AutoHub GT-e"
                variantName="AutoHub GT-e Grand Touring"
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
                    onClick={() => navigate('/cars')}
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

export default TestDriveCanvasPage;
