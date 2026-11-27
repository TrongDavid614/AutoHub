import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { VehicleDemoCard } from './VehicleDemoCard';
import { LocationSelector, type LocationType } from './LocationSelector';
import { DateTimeSelector, getFirstValidBookingDateAndSlot } from './DateTimeSelector';
import { CustomerInfoForm } from './CustomerInfoForm';
import { useAuthStore } from '@/store/useAuthStore';
import { engagementService } from '@/features/customer/services/engagement.service';
import { carService } from '@/features/customer/services/car.service';
import type { MockCar } from '@/types/car.types';

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

  const [cars, setCars] = useState<MockCar[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string>('1');

  const initialBooking = useMemo(() => getFirstValidBookingDateAndSlot(), []);

  const [selectedLocation, setSelectedLocation] = useState<LocationType>('SHOWROOM');
  const [selectedDate, setSelectedDate] = useState<string>(initialBooking.date);
  const [selectedSlot, setSelectedSlot] = useState<string>(initialBooking.slot);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const [fullName, setFullName] = useState<string>(user?.fullName || 'Nguyễn Văn A');
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || '0912345678');
  const [note, setNote] = useState<string>(
    'Muốn trải nghiệm tính năng tự hành ADAS LiDAR trên cao tốc Long Thành.'
  );
  const [licenseAgreed, setLicenseAgreed] = useState<boolean>(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    carService
      .getAllCars()
      .then((list) => {
        if (isMounted && list && list.length > 0) {
          setCars(list);
        }
      })
      .catch(() => {
        if (isMounted) {
          setErrorMessage('Chưa kết nối được Backend để tải danh sách xe.');
        }
      });
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const selectedCar = useMemo(() => {
    return cars.find((c) => String(c.id) === String(selectedCarId)) || cars[0];
  }, [cars, selectedCarId]);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    const variantId = selectedCar ? Number(selectedCar.id) : undefined;
    engagementService.getBookedSlots(selectedDate, variantId, user?.id).then((slots) => {
      if (isMounted) {
        setBookedSlots(slots || []);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedDate, selectedCar?.id, user?.id]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (bookedSlots.includes(selectedSlot)) {
      setErrorMessage(
        `Khung giờ ${selectedSlot} ngày ${selectedDate} đã có khách đăng ký kín lịch hoặc bạn đã có lịch khác. Vui lòng chọn khung giờ khác!`
      );
      return;
    }

    setIsSubmitting(true);
    const startTime = selectedSlot.split(' - ')[0] || '09:00';
    const fullIso = `${selectedDate}T${startTime}:00`;

    const res = await engagementService.bookTestDrive({
      customerId: user?.id || 5,
      phienBanId: selectedCar ? Number(selectedCar.id) : 1,
      showroomId: 2,
      hoTenKhach: fullName.trim(),
      soDienThoaiKhach: phoneNumber.replace(/\s/g, ''),
      diaDiemLaiThu: selectedLocation === 'SHOWROOM' ? 'Showroom AutoHub Flagship Thủ Đức' : 'Tại địa chỉ nhà riêng khách hàng',
      thoiGianHen: fullIso,
      camKetGplx: licenseAgreed,
      ghiChu: `${note} - Đăng ký lái thử ${selectedCar?.name || carModelName} ngày ${selectedDate} khung giờ ${selectedSlot}`,
    });

    if (!res.success) {
      setErrorMessage(res.message || 'Không thể đăng ký lịch lái thử do trùng lịch hoặc vi phạm quy định.');
      setIsSubmitting(false);
      return;
    }

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
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/45 overflow-y-auto"
    >
      {/* MODAL DIALOG CONTAINER */}
      <div className="w-full max-w-4xl my-auto rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-xl relative overflow-hidden">
        {/* Top Cobalt Accent Line */}
        <div className="h-1 w-full bg-[var(--accent)]" />

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
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text)]">
                Đặt lịch lái thử xe Demo thành công!
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                Chuyên viên kỹ thuật AutoHub sẽ liên hệ qua SMS/Cuộc gọi để xác nhận lộ trình trước 24 giờ.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message if any */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* SECTION 2: VEHICLE DEMO SELECTION CARD */}
              <VehicleDemoCard
                modelName={selectedCar?.name || carModelName}
                variantName={selectedCar?.subtitle || selectedCar?.name || variantName}
                year="MY 2026"
                power={selectedCar?.power ? selectedCar.power.replace(/[^0-9]/g, '') : '680'}
                acceleration={selectedCar?.acceleration ? selectedCar.acceleration.replace(/[^0-9.]/g, '') : '3.2'}
                range={selectedCar?.range ? selectedCar.range.replace(/[^0-9]/g, '') : '680'}
                imageUrl={selectedCar?.images?.[0]}
                availableCars={cars.map((c) => ({
                  id: c.id,
                  name: c.name,
                  subtitle: c.subtitle,
                  power: c.power,
                  acceleration: c.acceleration,
                  range: c.range,
                  image: c.images?.[0],
                }))}
                selectedCarId={selectedCarId}
                onSelectCar={setSelectedCarId}
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
                bookedSlots={bookedSlots}
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
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
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
                    className="flex-1 sm:flex-none py-3 px-6 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
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
    </div>,
    document.body
  );
};
