import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  ShieldCheck,
  Headphones,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  RotateCcw,
  Plus,
  Camera,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MOCK_CUSTOMER_PROFILE, type MockAddressItem } from '@/mock/mockData';
import { DepositReceiptModal } from './DepositReceiptModal';
import { ContractTermsModal } from './ContractTermsModal';
import { DepositRefundModal } from './DepositRefundModal';
import { TestDriveModal } from '@/features/test-drive/TestDriveModal';

type ProfileTab =
  | 'overview'
  | 'personal'
  | 'addresses'
  | 'deposits'
  | 'test-drives'
  | 'documents'
  | 'security';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isChangeScheduleOpen, setIsChangeScheduleOpen] = useState(false);

  // Live countdown state for 72h deposit (58:14:21)
  const [hours, setHours] = useState(58);
  const [minutes, setMinutes] = useState(14);
  const [seconds, setSeconds] = useState(21);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSec) => {
        if (prevSec > 0) return prevSec - 1;
        setMinutes((prevMin) => {
          if (prevMin > 0) return prevMin - 1;
          setHours((prevH) => (prevH > 0 ? prevH - 1 : 0));
          return 59;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deposit = MOCK_CUSTOMER_PROFILE.activeDeposit;
  const testDrive = MOCK_CUSTOMER_PROFILE.upcomingTestDrive;
  const [addresses] = useState<MockAddressItem[]>(MOCK_CUSTOMER_PROFILE.savedAddresses);

  // Tab navigation items matching Figma mockup
  const menuItems = [
    { id: 'overview', label: 'Trung tâm quản lý giao dịch', icon: CreditCard, count: undefined },
    { id: 'personal', label: 'Thông tin cá nhân & CCCD', icon: User, count: undefined },
    { id: 'addresses', label: 'Sổ địa chỉ giao hàng (UC03)', icon: MapPin, count: 2 },
    { id: 'deposits', label: 'Phiếu đặt cọc xe (72h)', icon: CreditCard, count: 1, highlight: true },
    { id: 'test-drives', label: 'Lịch hẹn lái thử', icon: Calendar, count: 1 },
    { id: 'documents', label: 'Tài liệu & Hợp đồng số', icon: FileText, count: undefined },
    { id: 'security', label: 'Cài đặt & Bảo mật 2FA', icon: ShieldCheck, count: undefined },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-slate-400">Tài khoản khách hàng</span>
            <span>/</span>
            <span className="text-slate-200 font-semibold">Trung tâm quản lý giao dịch</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Trung Tâm Quản Lý Giao Dịch & Tài Khoản
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi trạng thái đặt cọc xe 72h, lịch hẹn lái thử và quản lý sổ địa chỉ giao nhận phụ kiện
          </p>
        </div>

        {/* Live Telemetry Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Telemetry Hub</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PROFILE CARD & MENU (Col 4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* User Profile Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Vehicle Backdrop Cover */}
            <div className="relative h-28 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80"
                alt="Cover"
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                {MOCK_CUSTOMER_PROFILE.code}
              </div>
            </div>

            {/* Avatar & Details */}
            <div className="px-5 pb-5 pt-0 relative">
              <div className="relative -mt-10 mb-3 inline-block">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-white text-2xl font-black">
                    A
                  </div>
                </div>
                <button
                  className="absolute bottom-0 right-0 p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 shadow-md transition-colors"
                  title="Thay đổi ảnh đại diện"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {MOCK_CUSTOMER_PROFILE.fullName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{MOCK_CUSTOMER_PROFILE.vipTier}</span>
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-0.5 mt-2">
                  <div>Email: <span className="text-slate-200">{MOCK_CUSTOMER_PROFILE.email}</span></div>
                  <div>SĐT: <span className="text-slate-200">{MOCK_CUSTOMER_PROFILE.phoneNumber}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-xl space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ProfileTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        item.highlight
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* VIP Concierge Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Headphones className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Trợ Lý Riêng VIP Concierge 24/7</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Quý khách có yêu cầu riêng về giao xe, lái thử tận nhà hoặc hợp đồng ủy quyền, vui lòng liên hệ trực tiếp:
            </p>
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Hotline VIP:</span>
                <span className="font-bold text-white font-mono">1900 8888</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CVTV Phụ trách:</span>
                <span className="font-bold text-cyan-300">{deposit.consultantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Showroom:</span>
                <span className="text-slate-300">AutoHub Flagship Q7</span>
              </div>
            </div>
            <button
              onClick={() => alert(`Đang kết nối đến Chuyên viên tư vấn: ${deposit.consultantName} (${deposit.consultantPhone})...`)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi Trợ Lý Riêng ({deposit.consultantPhone})</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT PANELS (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: OVERVIEW / DEFAULT HUB VIEW */}
          {(activeTab === 'overview' || activeTab === 'deposits') && (
            <div className="space-y-6">
              {/* 3 Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Metric 1 */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Phiếu Đặt Cọc</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400">
                      72H LIVE
                    </span>
                  </div>
                  <div className="text-xl font-black text-white">01 Xe GT-e</div>
                  <p className="text-[11px] text-slate-400">Khóa VIN giữ chỗ • Hạn 28/10</p>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Lịch Lái Thử</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400">
                      ĐÃ HẸN
                    </span>
                  </div>
                  <div className="text-xl font-black text-cyan-300">09:30 AM</div>
                  <p className="text-[11px] text-slate-400">Thứ Bảy 27/10 • Showroom Q7</p>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Tổng Cọc Đã Nộp</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-400">
                      VNPAY IPN
                    </span>
                  </div>
                  <div className="text-xl font-black text-emerald-400">20.000.000 đ</div>
                  <p className="text-[11px] text-slate-400">Bảo lưu 100% hoàn lại</p>
                </div>
              </div>

              {/* ACTIVE 72H DEPOSIT CARD */}
              <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
                {/* Glowing border highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500" />

                {/* Card Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                      {deposit.contractCode}
                    </span>
                    <h3 className="text-base font-black text-white mt-0.5">
                      PHIẾU ĐẶT CỌC GIỮ XE 72H ĐANG HIỆU LỰC
                    </h3>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>KHÓA VIN THÀNH CÔNG</span>
                  </span>
                </div>

                {/* Car Banner & Countdown Bar */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-5 relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-36">
                    <img
                      src={deposit.carImage}
                      alt={deposit.carName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-slate-950/80 backdrop-blur-md rounded text-[10px] text-slate-300">
                      {deposit.carVariant}
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <div>
                      <div className="text-xs text-slate-400">Dòng xe đặt cọc:</div>
                      <h4 className="text-lg font-black text-white">{deposit.carName}</h4>
                      <div className="text-xs text-cyan-400 font-mono mt-0.5">{deposit.vinNumber}</div>
                    </div>

                    {/* Live Countdown Box */}
                    <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Thời gian giữ chỗ còn lại:</span>
                        </span>
                        <span className="font-mono font-black text-amber-300 text-sm">
                          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </span>
                      </div>
                      {/* Progress Bar (approx 58 / 72 hours = ~80%) */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                          style={{ width: `${(hours / 72) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Số VIN xe của quý khách đã được hệ thống phân bổ độc quyền trên kho toàn quốc.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Columns of Info Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Số tiền đặt cọc:</span>
                    <div className="text-sm font-black text-emerald-400">
                      {deposit.depositAmount.toLocaleString('vi-VN')} đ
                    </div>
                    <span className="text-[10px] text-slate-400">Mã GD: {deposit.paymentRef}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px]">Thời điểm cọc:</span>
                    <div className="font-bold text-white">{deposit.depositTimestamp}</div>
                    <span className="text-[10px] text-slate-400">{deposit.paymentGateway}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px]">CVTV hỗ trợ:</span>
                    <div className="font-bold text-cyan-300">{deposit.consultantName}</div>
                    <span className="text-[10px] text-slate-400">Flagship Showroom Q7</span>
                  </div>
                </div>

                {/* 3 Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* BUTTON: TẢI BIÊN LAI (PDF) */}
                  <button
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải Biên Lai (PDF)</span>
                  </button>

                  {/* BUTTON: XEM HỢP ĐỒNG NGUYÊN TẮC */}
                  <button
                    onClick={() => setIsContractModalOpen(true)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Xem Hợp Đồng Nguyên Tắc</span>
                  </button>

                  {/* BUTTON: YÊU CẦU HOÀN CỌC */}
                  <button
                    onClick={() => setIsRefundModalOpen(true)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Yêu Cầu Hoàn Cọc</span>
                  </button>
                </div>
              </div>

              {/* UPCOMING TEST DRIVE CARD */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Phiếu Lái Thử: {testDrive.ticketCode}
                      </span>
                      <h3 className="text-sm font-bold text-white">LỊCH HẸN LÁI THỬ SẮP DIỄN RA</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-extrabold uppercase">
                    {testDrive.status === 'CONFIRMED' ? 'ĐÃ XÁC NHẬN' : 'CHỜ DUYỆT'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400">Dòng xe & Thời gian:</span>
                    <div className="font-bold text-white text-sm">{testDrive.carName}</div>
                    <div className="text-cyan-300 font-semibold">
                      {testDrive.scheduledTime} - {testDrive.scheduledDate}
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400">Địa điểm & Chuyên viên phụ trách:</span>
                    <div className="font-bold text-white">{testDrive.locationName}</div>
                    <div className="text-slate-300 text-[11px]">{testDrive.locationAddress}</div>
                    <div className="text-cyan-300 font-semibold pt-1">
                      Kỹ thuật viên: {testDrive.instructorName} ({testDrive.instructorPhone})
                    </div>
                  </div>
                </div>

                {/* Safe drive warning */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-amber-300 text-xs">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Vui lòng mang theo <strong>CCCD bản gốc</strong> và <strong>GPLX Hạng B2 còn hiệu lực</strong> khi đến nhận xe lái thử. Chuyên viên sẽ đón quý khách tại sảnh tiếp đón VIP.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Xem Lộ Trình Di Chuyển</span>
                  </a>
                  <button
                    onClick={() => alert('Đã tạo liên kết lịch hẹn vào Google Calendar của bạn!')}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Thêm Vào Google Calendar</span>
                  </button>
                  <button
                    onClick={() => setIsChangeScheduleOpen(true)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Đổi Lịch Hẹn</span>
                  </button>
                  <button
                    onClick={() => alert(`Đang gọi đến Kỹ thuật viên ${testDrive.instructorName} (${testDrive.instructorPhone})...`)}
                    className="px-3.5 py-2 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Liên Hệ KTV</span>
                  </button>
                </div>
              </div>

              {/* ADDRESS BOOK OVERVIEW SECTION */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white">SỔ ĐỊA CHỈ GIAO NHẬN (UC03)</h3>
                  </div>
                  <Link
                    to="/customer/addresses"
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <span>Quản lý tất cả</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{addr.title}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                            Mặc Định
                          </span>
                        )}
                      </div>
                      <div className="text-slate-300 font-semibold">
                        {addr.recipientName} • {addr.phoneNumber}
                      </div>
                      <p className="text-slate-400 text-[11px]">{addr.fullAddress}</p>
                      {addr.note && (
                        <div className="text-[10px] text-cyan-400 bg-cyan-950/30 p-1.5 rounded border border-cyan-500/20">
                          {addr.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL IDENTITY & CCCD */}
          {activeTab === 'personal' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Thông Tin Định Danh Khách Hàng (KYC)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Quản lý số Căn cước công dân gắn chip và Giấy phép lái xe để làm thủ tục đăng ký xe và giao nhận.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400">Họ và tên đầy đủ</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.fullName}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Số Căn cước công dân (CCCD)</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.identityCardNumber}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Ngày cấp CCCD</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.identityCardIssuedDate}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Nơi cấp</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.identityCardIssuedPlace}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Số Giấy phép lái xe (GPLX Hạng B2)</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.drivingLicenseNumber}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Thời hạn GPLX</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.drivingLicenseExpiry}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Số điện thoại chính</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.phoneNumber}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Địa chỉ Email</label>
                  <input
                    type="email"
                    defaultValue={MOCK_CUSTOMER_PROFILE.email}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Identity Verification Badges */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-white">Định Danh Điện Tử Đã Được Xác Thực (Level 2)</div>
                  <p className="text-emerald-300/80 text-[11px]">
                    Hồ sơ CCCD gắn chip và bằng lái xe của quý khách đã khớp với cơ sở dữ liệu VNeID.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => alert('Thông tin hồ sơ cá nhân đã được lưu thành công!')}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ADDRESS BOOK TAB */}
          {activeTab === 'addresses' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Sổ Địa Chỉ Giao Hàng & Trạm Sạc (UC03)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Quản lý danh sách địa chỉ nhận phụ kiện và vị trí lắp đặt trụ sạc HubWall 22kW.
                  </p>
                </div>
                <button
                  onClick={() => alert('Chức năng thêm địa chỉ mới đã sẵn sàng.')}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Địa Chỉ</span>
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{addr.title}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                            Mặc Định
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <button className="hover:text-cyan-400 text-xs font-semibold">Chỉnh sửa</button>
                        <span>•</span>
                        <button className="hover:text-rose-400 text-xs font-semibold">Xóa</button>
                      </div>
                    </div>
                    <div className="text-slate-300 font-semibold">
                      {addr.recipientName} ({addr.phoneNumber})
                    </div>
                    <p className="text-slate-400 leading-relaxed">{addr.fullAddress}</p>
                    {addr.note && (
                      <div className="text-cyan-400 bg-cyan-950/30 p-2 rounded border border-cyan-500/20 text-[11px]">
                        ★ {addr.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEST DRIVES TAB */}
          {activeTab === 'test-drives' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Quản Lý Lịch Hẹn Lái Thử Xe</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Danh sách các lượt hẹn lái thử đã đăng ký</p>
                </div>
                <Link
                  to="/test-drive"
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Đăng Ký Thêm</span>
                </Link>
              </div>

              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{testDrive.carName}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                    {testDrive.ticketCode}
                  </span>
                </div>
                <div className="text-cyan-300 font-semibold">
                  Thời gian: {testDrive.scheduledTime} - {testDrive.scheduledDate}
                </div>
                <div className="text-slate-400">
                  Địa điểm: {testDrive.locationName} ({testDrive.locationAddress})
                </div>
                <div className="text-slate-300">
                  Kỹ thuật viên đồng hành: <strong>{testDrive.instructorName}</strong> ({testDrive.instructorPhone})
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS & CONTRACTS */}
          {(activeTab === 'documents' || activeTab === 'security') && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Tài Liệu Pháp Lý & Hợp Đồng Điện Tử</h3>
                <p className="text-xs text-slate-400 mt-0.5">Toàn bộ hồ sơ số hóa đã ký kết cùng AutoHub</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="font-bold text-white">Hợp đồng nguyên tắc đặt cọc khóa VIN (#AH-HDNT-2026/8899-GTE)</div>
                      <div className="text-[11px] text-slate-400">Ký ngày 25/10/2026 • Đã xác thực chữ ký điện tử</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsContractModalOpen(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold"
                  >
                    Xem Chi Tiết
                  </button>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white">Biên lai điện tử thu tiền cọc 20 triệu (#BL-2026-VNP8899)</div>
                      <div className="text-[11px] text-slate-400">Cổng thanh toán VNPay IPN • Đã đóng dấu mộc đỏ công ty</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Tải PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3 Interactive Action Modals */}
      <DepositReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      <ContractTermsModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
      />

      <DepositRefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
      />

      <TestDriveModal
        isOpen={isChangeScheduleOpen}
        onClose={() => setIsChangeScheduleOpen(false)}
        initialCarName={testDrive.carName}
      />
    </div>
  );
};