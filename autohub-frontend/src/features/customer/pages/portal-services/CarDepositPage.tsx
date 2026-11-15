import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Check,
  RefreshCw,
  QrCode,
  Copy,
  Clock,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  RotateCw,
  X,
} from 'lucide-react';
import type { CarDepositStatus, CarDepositItem } from '@/features/customer/types/car-deposit.types';
import { CarDepositFilterTabs } from '@/features/customer/components/CarDepositFilterTabs';
import { CarDepositRowCard } from '@/features/customer/components/CarDepositRowCard';
import { CarDepositReceiptModal } from '@/features/customer/components/CarDepositReceiptModal';
import { CarDepositRefundModal } from '@/features/customer/components/CarDepositRefundModal';
import { depositService } from '@/features/customer/services/deposit.service';
import { carService } from '@/features/customer/services/car.service';
import { useAuthStore } from '@/store/useAuthStore';
import type { MockCar } from '@/features/customer/mocks/car.mock';

export const CarDepositPage: React.FC = () => {
  const { variantId } = useParams<{ variantId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const queryVariantId = variantId || searchParams.get('variantId');
  const queryColor = searchParams.get('color');
  const queryColorHex = searchParams.get('colorHex');

  // Mode: DIRECT_CHECKOUT (khi có variantId) vs MANAGEMENT (danh sách phiếu cọc)
  const isDirectCheckout = Boolean(queryVariantId);

  // Dữ liệu xe đang đặt cọc
  const [targetCar, setTargetCar] = useState<MockCar | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(queryColor || 'Xanh Băng Apex Cyan');
  const [selectedColorHex, setSelectedColorHex] = useState<string>(queryColorHex || '#0284C7');

  // Trạng thái của luồng đặt cọc trực tiếp: 'FORM' | 'PAYMENT_QR' | 'SUCCESS'
  const [checkoutStep, setCheckoutStep] = useState<'FORM' | 'PAYMENT_QR' | 'SUCCESS'>('FORM');
  const [activeDeposit, setActiveDeposit] = useState<CarDepositItem | null>(null);

  // Form fields
  const [fullName, setFullName] = useState(() => user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(() => user?.phoneNumber || '');
  const [identityCard, setIdentityCard] = useState(() => user?.identityCardNumber || '079201009988');
  const [showroom, setShowroom] = useState('Showroom AutoHub Flagship Q7, TP.HCM');
  const [isAgreed, setIsAgreed] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quản lý sao chép & đếm ngược QR (15 phút)
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrCountdown, setQrCountdown] = useState(14 * 60 + 59);

  // Polling thanh toán SePay
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Quản lý danh sách phiếu cọc (Management mode)
  const [deposits, setDeposits] = useState<CarDepositItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'ALL' | CarDepositStatus>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal biên nhận & hoàn cọc
  const [selectedReceipt, setSelectedReceipt] = useState<CarDepositItem | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundTarget, setRefundTarget] = useState<CarDepositItem | null>(null);

  // Modal QR SePay cho phiếu cọc PENDING từ danh sách
  const [qrModalDeposit, setQrModalDeposit] = useState<CarDepositItem | null>(null);

  // Đồng hồ đếm ngược 72 giờ cho phiếu đã cọc
  const [remainingSeconds, setRemainingSeconds] = useState(57 * 3600 + 42 * 60 + 15);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch chi tiết xe nếu ở chế độ DIRECT_CHECKOUT
  useEffect(() => {
    if (queryVariantId) {
      carService.getCarById(queryVariantId).then((car) => {
        if (car) {
          setTargetCar(car);
          if (!queryColor && car.availableColors && car.availableColors.length > 0) {
            setSelectedColor(car.availableColors[0].name);
            setSelectedColorHex(car.availableColors[0].hex);
          }
        }
      });
    }
  }, [queryVariantId, queryColor]);

  // Đồng bộ user info vào form
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.fullName || '');
      if (!phoneNumber) setPhoneNumber(user.phoneNumber || '');
      if (!identityCard) setIdentityCard(user.identityCardNumber || '079201009988');
    }
  }, [user]);

  // Load danh sách phiếu cọc
  const loadDeposits = async () => {
    setIsLoading(true);
    try {
      const data = await depositService.getMyDeposits(user?.id);
      setDeposits(data || []);
    } catch {
      // offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeposits();
  }, [user?.id]);

  // Đếm ngược 15 phút cho mã QR SePay
  useEffect(() => {
    if (checkoutStep !== 'PAYMENT_QR' && !qrModalDeposit) return;
    const interval = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [checkoutStep, qrModalDeposit]);

  // Cơ chế Polling tự động kiểm tra trạng thái thanh toán từ SePay Webhook
  useEffect(() => {
    const currentWatchingId = activeDeposit?.id || qrModalDeposit?.id;
    const isWatching = (checkoutStep === 'PAYMENT_QR' && activeDeposit) || qrModalDeposit !== null;

    if (!isWatching || !currentWatchingId) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }

    // Polling mỗi 2.5 giây
    pollingRef.current = setInterval(async () => {
      try {
        const statusRes = await depositService.getDepositStatus(currentWatchingId);
        if (statusRes && (statusRes.isPaid || statusRes.status === 'PAID')) {
          if (pollingRef.current) clearInterval(pollingRef.current);

          // Cập nhật state thành công
          if (checkoutStep === 'PAYMENT_QR') {
            setCheckoutStep('SUCCESS');
            setActiveDeposit((prev) => (prev ? { ...prev, status: 'PAID', paidAt: statusRes.paidAt || new Date().toISOString() } : null));
          }
          if (qrModalDeposit) {
            setQrModalDeposit(null);
            showToast(`Giao dịch SePay đã đối soát thành công cho phiếu cọc ${statusRes.depositCode}!`);
            loadDeposits();
          }
        }
      } catch {
        // Tiếp tục polling
      }
    }, 2500);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [checkoutStep, activeDeposit?.id, qrModalDeposit?.id]);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const format72hCountdown = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h} giờ ${m.toString().padStart(2, '0')} phút ${s.toString().padStart(2, '0')} giây`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Bước 1: Khởi tạo phiếu cọc xe -> Tạo SePay QR
  const handleCreateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ tên người đứng tên cọc.');
      return;
    }

    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phoneNumber.replace(/\s/g, ''))) {
      setErrorMessage('Số điện thoại không hợp lệ (yêu cầu 10 chữ số).');
      return;
    }

    if (!/^[0-9]{12}$/.test(identityCard.trim())) {
      setErrorMessage('Số Căn cước công dân (CCCD) phải bao gồm đúng 12 chữ số theo quy chế BR01.');
      return;
    }

    if (!isAgreed) {
      setErrorMessage('Quý khách vui lòng đồng ý với điều khoản giữ xe 72h theo quy chế BR05.');
      return;
    }

    setIsSubmitting(true);

    try {
      const depositAmount = targetCar?.depositAmount || 20000000;
      const created = await depositService.createDeposit({
        customerId: user?.id,
        phienBanId: queryVariantId ? Number(queryVariantId) : undefined,
        soCCCD: identityCard.trim(),
        hoTen: fullName.trim(),
        soDienThoai: phoneNumber.trim(),
        showroom,
        soTienCoc: depositAmount,
      });

      if (created) {
        setActiveDeposit(created);
        setCheckoutStep('PAYMENT_QR');
        setQrCountdown(14 * 60 + 59);
      } else {
        setErrorMessage('Không thể tạo phiếu đặt cọc trên máy chủ vào lúc này. Vui lòng kiểm tra lại thông tin và thử lại!');
      }
    } catch {
      setErrorMessage('Không thể tạo phiếu đặt cọc vào lúc này. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kiểm tra trạng thái thanh toán từ DB (chỉ đọc qua GET, không tự ghi PAID)
  const handleManualConfirm = async (item: CarDepositItem) => {
    setIsCheckingPayment(true);
    try {
      const statusRes = await depositService.getDepositStatus(item.id);
      if (statusRes?.isPaid || statusRes?.status === 'PAID') {
        if (checkoutStep === 'PAYMENT_QR') {
          setCheckoutStep('SUCCESS');
          setActiveDeposit((prev) => (prev ? { ...prev, status: 'PAID', paidAt: statusRes.paidAt || new Date().toISOString() } : null));
        }
        if (qrModalDeposit) {
          setQrModalDeposit(null);
          showToast(`Đã xác nhận thanh toán thành công cho phiếu cọc ${item.depositCode}! Suất giữ xe 72h đã kích hoạt.`);
          loadDeposits();
        }
      } else {
        showToast('Hệ thống chưa ghi nhận giao dịch chuyển khoản. Vui lòng chờ 10–30 giây sau khi chuyển hoặc kiểm tra lại nội dung chuyển khoản.');
      }
    } catch {
      showToast('Không thể kiểm tra trạng thái thanh toán lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsCheckingPayment(false);
    }
  };

  // Xử lý gửi yêu cầu hoàn cọc theo BR05
  const handleRefundSubmit = async (data: { reason: string; document: string; bankAccount: string }) => {
    setShowRefundModal(false);
    if (refundTarget) {
      await depositService.requestRefund(refundTarget.id, data);
      setDeposits((prev) =>
        prev.map((d) =>
          d.id === refundTarget.id
            ? { ...d, status: 'REFUND_REQUESTED' as CarDepositStatus, refundReason: data.reason }
            : d
        )
      );
    }
    showToast('Đã gửi yêu cầu hoàn cọc thành công! Nhân viên đối soát và Admin sẽ thẩm định theo quy chế BR05.');
    setRefundTarget(null);
  };

  const filteredDeposits =
    activeTab === 'ALL' ? deposits : deposits.filter((d) => d.status === activeTab);

  // =========================================================================
  // VIEW MODE 1: DIRECT CHECKOUT (ĐẶT CỌC & THANH TOÁN SEPAY QR)
  // =========================================================================
  if (isDirectCheckout) {
    const depositAmount = targetCar?.depositAmount || 20000000;
    const cleanDepositCode = activeDeposit?.depositCode?.replace('#', '') || 'DEP-8812';
    const activeTransferContent = activeDeposit?.transferContent || `AH DEP ${cleanDepositCode}`;
    const activeQrUrl =
      activeDeposit?.qrImageUrl ||
      `https://img.vietqr.io/image/bidv-5811676579-compact2.png?amount=${depositAmount}&addInfo=${encodeURIComponent(
        activeTransferContent
      )}&accountName=CONG%20TY%20CO%20PHAN%20AUTOHUB%20VIETNAM`;

    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fadeIn text-[#DAE2FD]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-text-muted">
          <Link to="/" className="hover:text-accent-primary transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />
          <Link to="/cars" className="hover:text-accent-primary transition-colors">Dòng xe</Link>
          <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />
          <span className="text-accent-primary font-semibold">Đặt Cọc Giữ Xe 72H (SePay QR)</span>
        </nav>

        {/* Stepper Header */}
        <div className="p-4 rounded-lg bg-surface-elevated/70 border border-surface-highlight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-action/20 border border-accent-primary/40 flex items-center justify-center text-accent-primary">
              <CreditCard className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-text-primary">
                Đặt Cọc Giữ Suất Xe 72 Giờ Trực Tuyến
              </h1>
              <p className="text-xs text-text-muted">
                Cổng thanh toán quét mã SePay VietQR ngân hàng BIDV • Tự động kích hoạt giữ xe 72h trong 3-5 giây
              </p>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className={`px-2.5 py-1 rounded-[2px] font-bold ${
              checkoutStep === 'FORM'
                ? 'bg-accent-action text-accent-contrast'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              1. Thông tin
            </span>
            <span className="text-border-subtle">›</span>
            <span className={`px-2.5 py-1 rounded-[2px] font-bold ${
              checkoutStep === 'PAYMENT_QR'
                ? 'bg-accent-action text-accent-contrast shadow-[0_0_12px_rgba(14,165,233,0.4)]'
                : checkoutStep === 'SUCCESS'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-surface-elevated text-text-muted'
            }`}>
              2. Quét SePay QR
            </span>
            <span className="text-border-subtle">›</span>
            <span className={`px-2.5 py-1 rounded-[2px] font-bold ${
              checkoutStep === 'SUCCESS'
                ? 'bg-emerald-500 text-white'
                : 'bg-surface-elevated text-text-muted'
            }`}>
              3. Giữ xe 72h
            </span>
          </div>
        </div>

        {/* BƯỚC 1: ĐIỀN THÔNG TIN ĐỨNG TÊN CỌC */}
        {checkoutStep === 'FORM' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Cột trái: Thông tin xe đặt cọc (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-lg bg-surface-elevated/70 border border-surface-highlight space-y-4 shadow-xl">
              <div className="relative aspect-[16/10] w-full rounded bg-canvas-deep border border-surface-highlight overflow-hidden">
                <img
                  src={targetCar?.image || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200'}
                  alt={targetCar?.name || 'Xe AutoHub'}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-[2px] bg-canvas-deep/80 backdrop-blur-md border border-accent-primary/40 text-[10px] font-mono text-accent-primary font-bold">
                  BẢO LƯU 72 GIỜ
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-text-primary">
                  {targetCar?.name || 'AutoHub GT-e Grand Touring'}
                </h3>
                <p className="text-xs text-text-muted">{targetCar?.subtitle || 'Tự động điện tử Dual-Motor'}</p>
              </div>

              <div className="p-3.5 rounded bg-canvas-deep border border-surface-highlight space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Màu ngoại thất:</span>
                  <div className="flex items-center gap-1.5 font-semibold text-accent-primary">
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: selectedColorHex }} />
                    <span>{selectedColor}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Giá niêm yết xe:</span>
                  <span className="font-mono font-bold text-text-primary">
                    {(targetCar?.listedPrice || 2890000000).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-surface-highlight">
                  <span className="font-bold text-text-primary uppercase text-[11px] font-mono">TIỀN CỌC GIỮ XE 72H:</span>
                  <span className="font-mono font-black text-base text-accent-primary">
                    {depositAmount.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>

              {/* Cam kết quy chế BR05 */}
              <div className="p-3.5 rounded bg-accent-action/10 border border-accent-primary/30 space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-accent-primary">
                  <ShieldCheck className="w-4 h-4 text-accent-primary" />
                  <span>Cam kết quy chế BR05 & UC18:</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Cam kết hoàn cọc 100% trong 72 giờ nếu khách hàng đổi ý hoặc ngân hàng từ chối giải ngân tín dụng.
                </p>
              </div>
            </div>

            {/* Cột phải: Form thông tin cá nhân (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-lg bg-surface-elevated/70 border border-surface-highlight shadow-xl space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary font-mono pb-2 border-b border-surface-highlight">
                THÔNG TIN CHỦ XE & ĐỊA ĐIỂM BÀN GIAO
              </h2>

              {errorMessage && (
                <div className="p-3.5 rounded bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleCreateDeposit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-text-secondary block">
                      HỌ VÀ TÊN CHỦ XE <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 rounded bg-canvas-deep border border-surface-highlight text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-text-secondary block">
                      SỐ ĐIỆN THOẠI LIÊN HỆ <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full px-3.5 py-2.5 rounded bg-canvas-deep border border-surface-highlight text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-text-secondary block">
                    SỐ CĂN CƯỚC CÔNG DÂN (CCCD 12 SỐ) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={identityCard}
                    onChange={(e) => setIdentityCard(e.target.value.replace(/\D/g, ''))}
                    placeholder="079201009988"
                    className="w-full px-3.5 py-2.5 rounded bg-canvas-deep border border-surface-highlight text-xs font-mono tracking-widest text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                  />
                  <p className="text-[10px] text-text-muted">
                    Bắt buộc 12 chữ số theo quy chế BR01 để lập phiếu đặt cọc và đăng ký biển số sau này.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-text-secondary block">
                    SHOWROOM BÀN GIAO XE TIẾP NHẬN <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={showroom}
                    onChange={(e) => setShowroom(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded bg-canvas-deep border border-surface-highlight text-xs text-text-primary focus:outline-none focus:border-accent-primary transition-colors cursor-pointer"
                  >
                    <option value="Showroom AutoHub Flagship Q7, TP.HCM">Showroom Flagship Quận 7 - 104 Nguyễn Thị Thập, TP.HCM</option>
                    <option value="Showroom AutoHub Flagship Thủ Đức">Showroom Flagship Thủ Đức - Đại lộ Mai Chí Thọ, TP. Thủ Đức</option>
                    <option value="Showroom AutoHub Landmark Cầu Giấy, Hà Nội">Showroom Cầu Giấy - Toà nhà Keangnam, Hà Nội</option>
                    <option value="Showroom AutoHub Hải Châu, Đà Nẵng">Showroom Hải Châu - 280 đường 2/9, TP. Đà Nẵng</option>
                  </select>
                </div>

                <div className="pt-2 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="agreeCheck"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-surface-highlight text-accent-primary focus:ring-accent-primary cursor-pointer"
                  />
                  <label htmlFor="agreeCheck" className="text-[11px] text-text-secondary leading-relaxed cursor-pointer">
                    Tôi xác nhận thông tin trên là chính xác và đồng ý với điều khoản tạm khóa suất xe trong <strong>72 giờ</strong>. Tiền cọc được hoàn 100% theo quy chế BR05 nếu không thể nhận xe.
                  </label>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-[2px] bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.35)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Đang khởi tạo phiếu cọc...</span>
                      </>
                    ) : (
                      <>
                        <span>TIẾN HÀNH THANH TOÁN SEPAY QR (20.000.000 Đ)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto py-3.5 px-5 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    Quay lại
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* BƯỚC 2: GIAO DIỆN THANH TOÁN CHUYỂN KHOẢN QR QUA SEPAY */}
        {checkoutStep === 'PAYMENT_QR' && (
          <div className="p-6 sm:p-8 rounded-lg bg-surface-elevated/80 border border-accent-primary/40 shadow-2xl space-y-6">
            {/* Top Alert Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded bg-accent-action/10 border border-accent-primary/30">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-ping" />
                <span className="text-xs sm:text-sm font-bold text-accent-primary uppercase font-mono">
                  CHỜ THANH TOÁN SEPAY QR • HIỆU LỰC GIỮ SUẤT:
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-base font-bold text-accent-primary">
                <Clock className="w-4 h-4" />
                <span>{formatCountdown(qrCountdown)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* VietQR Code BIDV Container (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-canvas-deep border border-surface-highlight text-center space-y-3">
                <div className="relative group">
                  <img
                    src={activeQrUrl}
                    alt="SePay VietQR BIDV AutoHub"
                    className="w-64 h-64 mx-auto object-contain rounded-lg bg-white p-2 shadow-2xl border border-surface-highlight"
                  />
                  <div className="absolute inset-0 rounded-lg ring-2 ring-accent-primary/50 pointer-events-none" />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-accent-primary">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>MÃ VIETQR TỰ ĐỘNG KHỚP LỆNH SEPAY</span>
                  </div>
                  <p className="text-[11px] text-text-muted">
                    Mở ứng dụng bất kỳ của 54 ngân hàng Việt Nam để quét mã tức thì.
                  </p>
                </div>
              </div>

              {/* Bảng thông tin chuyển khoản SePay BIDV (7 Cols) */}
              <div className="lg:col-span-7 space-y-3 text-xs">
                <div className="p-3.5 rounded bg-canvas-deep/80 border border-surface-highlight flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-text-muted uppercase block">NGÂN HÀNG THỤ HƯỞNG</span>
                    <span className="font-bold text-sm text-text-primary">BIDV (Ngân hàng TMCP Đầu tư và Phát triển VN)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-[2px] bg-accent-action/20 text-accent-primary text-[10px] font-mono font-bold">
                    BIDV 24/7
                  </span>
                </div>

                <div className="p-3.5 rounded bg-canvas-deep/80 border border-surface-highlight flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-text-muted uppercase block">SỐ TÀI KHOẢN THỤ HƯỞNG</span>
                    <span className="font-mono font-bold text-base text-accent-primary">5811676579</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('5811676579', 'accNum')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-[11px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {copiedField === 'accNum' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'accNum' ? 'Đã chép' : 'Sao chép STK'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded bg-canvas-deep/80 border border-surface-highlight flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-text-muted uppercase block">CHỦ TÀI KHOẢN</span>
                    <span className="font-bold text-text-primary uppercase">CONG TY CO PHAN AUTOHUB VIETNAM</span>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-canvas-deep/80 border border-surface-highlight flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-text-muted uppercase block">SỐ TIỀN CỌC CHÍNH XÁC</span>
                    <span className="font-mono font-black text-lg text-emerald-400">
                      {depositAmount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(depositAmount.toString(), 'amount')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-[11px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'amount' ? 'Đã chép' : 'Sao chép số tiền'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded bg-accent-action/10 border border-accent-primary/40 flex items-center justify-between">
                  <div className="truncate pr-3">
                    <span className="text-[10px] font-mono text-accent-primary uppercase font-bold block">
                      NỘI DUNG CHUYỂN KHOẢN (BẮT BUỘC CHÍNH XÁC)
                    </span>
                    <span className="font-mono font-black text-sm text-accent-primary tracking-wide block truncate">
                      {activeTransferContent}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeTransferContent, 'content')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[2px] bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs uppercase transition-colors cursor-pointer shrink-0"
                  >
                    {copiedField === 'content' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'content' ? 'Đã sao chép' : 'Sao chép nội dung'}</span>
                  </button>
                </div>

                {/* Hướng dẫn SePay */}
                <div className="p-3 rounded bg-surface-container border border-surface-highlight flex items-start gap-2.5 text-[11px] text-text-muted">
                  <RotateCw className="w-4 h-4 text-accent-primary shrink-0 mt-0.5 animate-spin" />
                  <span>
                    Hệ thống SePay đang tự động quét biến động số dư ngân hàng BIDV. Ngay khi chuyển khoản thành công, màn hình sẽ tự động chuyển sang trang xác nhận bảo lưu suất xe 72h trong vòng 3 giây mà không cần thao tác thêm.
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-surface-highlight flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-text-muted">
                Mã phiếu cọc tạm thời: <strong className="font-mono text-accent-primary">{activeDeposit?.depositCode}</strong>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => activeDeposit && handleManualConfirm(activeDeposit)}
                  disabled={isCheckingPayment}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-[2px] bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCheckingPayment ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Đang kiểm tra giao dịch...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Kiểm tra trạng thái thanh toán</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutStep('FORM')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  Sửa thông tin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BƯỚC 3: MÀN HÌNH XÁC NHẬN GIỮ XE 72H THÀNH CÔNG */}
        {checkoutStep === 'SUCCESS' && (
          <div className="p-8 rounded-lg bg-surface-elevated/80 border border-emerald-500/40 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_35px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>THANH TOÁN SEPAY THÀNH CÔNG • KÍCH HOẠT GIỮ XE 72H</span>
              </div>
              <h2 className="text-2xl font-black text-text-primary tracking-tight mt-2">
                Chúc mừng {fullName}! Bạn đã đặt cọc giữ xe thành công
              </h2>
              <p className="text-xs text-text-muted max-w-xl mx-auto">
                Hệ thống AutoHub đã xác nhận tiền cọc qua cổng SePay BIDV và tự động khóa suất xe tại showroom trong 72 giờ liên tục.
              </p>
            </div>

            {/* Chi tiết phiếu cọc thành công */}
            <div className="max-w-2xl mx-auto p-5 rounded-xl bg-canvas-deep border border-surface-highlight text-left space-y-3">
              <div className="flex justify-between items-center pb-2.5 border-b border-surface-highlight">
                <span className="text-[10px] font-mono text-text-muted uppercase">MÃ PHIẾU CỌC ĐIỆN TỬ</span>
                <span className="font-mono font-bold text-accent-primary text-sm">{activeDeposit?.depositCode}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase block">MẪU XE</span>
                  <span className="font-semibold text-text-primary">{targetCar?.name || 'AutoHub GT-e'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase block">MÀU NGOẠI THẤT</span>
                  <span className="font-semibold text-accent-primary">{selectedColor}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase block">TIỀN CỌC ĐÃ THANH TOÁN</span>
                  <span className="font-mono font-bold text-emerald-400">{depositAmount.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase block">SHOWROOM NHẬN XE</span>
                  <span className="font-semibold text-text-primary truncate block">{showroom}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-highlight p-3 rounded bg-accent-action/10 border border-accent-primary/20 flex items-center justify-between text-xs">
                <span className="font-mono text-accent-primary flex items-center gap-1.5 font-bold">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>THỜI HẠN GIỮ SUẤT XE:</span>
                </span>
                <span className="font-mono font-black text-emerald-400">72 GIỜ LIÊN TỤC</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (activeDeposit) setSelectedReceipt(activeDeposit);
                }}
                className="w-full sm:w-auto py-3 px-6 rounded-[2px] bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Xem biên nhận cọc điện tử
              </button>

              <button
                type="button"
                onClick={() => navigate('/customer/deposits')}
                className="w-full sm:w-auto py-3 px-6 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                Quản lý phiếu cọc của tôi
              </button>

              <Link
                to="/cars"
                className="w-full sm:w-auto py-3 px-6 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors text-center"
              >
                Về danh mục xe
              </Link>
            </div>
          </div>
        )}

        {/* Modal Biên Nhận Cọc Điện Tử */}
        <CarDepositReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 2: MANAGEMENT PORTAL (DANH SÁCH PHIẾU CỌC XE CỦA TÔI)
  // =========================================================================
  return (
    <div className="space-y-6 animate-fadeIn text-[#DAE2FD]">
      {/* 1. Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-highlight">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-accent-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">Phiếu Đặt Cọc Giữ Xe 72H</h1>
          </div>
          <p className="text-sm text-text-muted mt-0.5">
            Theo dõi trạng thái tạm khóa suất xe trong kho trong thời hạn 72 giờ liên tục qua cổng SePay BIDV, đối soát số khung VIN và trích xuất biên lai điện tử.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDeposits}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-accent-primary' : ''}`} />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {/* 2. Tabs lọc theo Enum TrangThaiPhieuCoc */}
      <CarDepositFilterTabs
        activeTab={activeTab}
        deposits={deposits}
        onSelectTab={setActiveTab}
      />

      {/* Toast notification */}
      {toastMessage && (
        <div className="p-3.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn shadow-lg">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Danh sách phiếu cọc xe dạng ROW */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 rounded-[4px] bg-surface-elevated/40 border border-surface-highlight animate-pulse h-48" />
            ))}
          </div>
        ) : filteredDeposits.length === 0 ? (
          <div className="py-16 text-center rounded-[4px] bg-surface-elevated/30 border border-surface-highlight space-y-3">
            <CreditCard className="w-12 h-12 text-text-muted mx-auto opacity-50" />
            <h3 className="text-base font-semibold text-text-primary">Không có phiếu cọc xe nào trong mục này</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Chưa phát sinh phiếu đặt cọc giữ chỗ ô tô thuộc trạng thái này.
            </p>
          </div>
        ) : (
          filteredDeposits.map((item) => (
            <CarDepositRowCard
              key={item.id}
              item={item}
              copiedCode={copiedCode}
              remainingSeconds={remainingSeconds}
              format72hCountdown={format72hCountdown}
              onCopy={(code) => {
                navigator.clipboard.writeText(code);
                setCopiedCode(code);
                setTimeout(() => setCopiedCode(null), 2000);
              }}
              onSelectReceipt={setSelectedReceipt}
              onRequestRefund={(target) => {
                setRefundTarget(target);
                setShowRefundModal(true);
              }}
              onPayDeposit={(target) => {
                setQrModalDeposit(target);
                setQrCountdown(14 * 60 + 59);
              }}
            />
          ))
        )}
      </div>

      {/* 4. Modal Quét Mã SePay VietQR BIDV cho phiếu PENDING_PAYMENT */}
      {qrModalDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-xl bg-surface-container border border-accent-primary/40 p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
              <div className="flex items-center gap-2 font-bold text-text-primary text-sm">
                <QrCode className="w-5 h-5 text-accent-primary" />
                <span>Thanh Toán Cọc SePay VietQR (BIDV)</span>
              </div>
              <button
                type="button"
                onClick={() => setQrModalDeposit(null)}
                className="w-7 h-7 rounded bg-surface-elevated text-text-muted hover:text-text-primary flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded bg-accent-action/10 border border-accent-primary/30 flex items-center justify-between text-xs font-mono text-accent-primary font-bold">
              <span>HIỆU LỰC MÃ QR:</span>
              <span>{formatCountdown(qrCountdown)}</span>
            </div>

            <div className="p-4 rounded-lg bg-canvas-deep border border-surface-highlight text-center space-y-3">
              <img
                src={
                  qrModalDeposit.qrImageUrl ||
                  `https://img.vietqr.io/image/bidv-5811676579-compact2.png?amount=${qrModalDeposit.depositAmount}&addInfo=${encodeURIComponent(
                    qrModalDeposit.transferContent || `AH DEP ${qrModalDeposit.depositCode.replace('#', '')}`
                  )}&accountName=CONG%20TY%20CO%20PHAN%20AUTOHUB%20VIETNAM`
                }
                alt="SePay VietQR BIDV"
                className="w-52 h-52 mx-auto rounded-lg bg-white p-2 shadow-lg"
              />
              <div className="text-[11px] text-text-muted">
                Quét mã bằng bất kỳ App Ngân Hàng hoặc Chuyển khoản BIDV 24/7
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-surface-elevated border border-surface-highlight flex justify-between">
                <span className="text-text-muted">Ngân hàng:</span>
                <span className="font-bold text-text-primary">BIDV (5811676579)</span>
              </div>
              <div className="p-2.5 rounded bg-surface-elevated border border-surface-highlight flex justify-between">
                <span className="text-text-muted">Số tiền cọc:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {qrModalDeposit.depositAmount.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div className="p-2.5 rounded bg-accent-action/15 border border-accent-primary/40 flex justify-between items-center">
                <div className="truncate pr-2">
                  <span className="text-[10px] text-accent-primary uppercase font-bold block">NỘI DUNG CHUYỂN KHOẢN</span>
                  <span className="font-mono font-black text-accent-primary text-xs truncate block">
                    {qrModalDeposit.transferContent || `AH DEP ${qrModalDeposit.depositCode.replace('#', '')}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      qrModalDeposit.transferContent || `AH DEP ${qrModalDeposit.depositCode.replace('#', '')}`,
                      'modalContent'
                    )
                  }
                  className="px-2.5 py-1 rounded-[2px] bg-accent-action text-accent-contrast font-bold text-[11px] cursor-pointer"
                >
                  {copiedField === 'modalContent' ? 'Đã sao chép' : 'Sao chép'}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleManualConfirm(qrModalDeposit)}
                disabled={isCheckingPayment}
                className="flex-1 py-2.5 px-4 rounded-[2px] bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isCheckingPayment ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Đang kiểm tra giao dịch...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Kiểm tra trạng thái thanh toán</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setQrModalDeposit(null)}
                className="py-2.5 px-4 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive text-text-secondary text-xs font-semibold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Biên Nhận Cọc Xe Điện Tử (E-Invoice / Receipt) */}
      <CarDepositReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* 6. Modal Yêu Cầu Hoàn Cọc Trực Tuyến (UC18 & UC23) */}
      <CarDepositRefundModal
        isOpen={showRefundModal}
        refundTarget={refundTarget}
        onClose={() => {
          setShowRefundModal(false);
          setRefundTarget(null);
        }}
        onSubmit={handleRefundSubmit}
      />
    </div>
  );
};
