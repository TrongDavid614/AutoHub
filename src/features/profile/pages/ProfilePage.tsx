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
  Camera,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MOCK_CUSTOMER_PROFILE, type MockAddressItem } from '../mocks/profile.mock';
import { DepositReceiptModal } from '../components/DepositReceiptModal';
import { ContractTermsModal } from '../components/ContractTermsModal';
import { DepositRefundModal } from '../components/DepositRefundModal';

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
    <div className="w-full space-y-6 text-[#DAE2FD] antialiased">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#3E4850]/40">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#88929B] uppercase tracking-wider mb-2">
            <Link to="/" className="hover:text-[#89CEFF] transition-colors">TRANG CHỦ</Link>
            <span className="text-[#2D3449]">/</span>
            <span className="text-[#88929B]">TÀI KHOẢN KHÁCH HÀNG</span>
            <span className="text-[#2D3449]">/</span>
            <span className="text-[#89CEFF]">TRUNG TÂM QUẢN LÝ GIAO DỊCH</span>
          </nav>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
            <span className="text-[10px] font-mono font-bold text-[#89CEFF] tracking-wider uppercase">
              LIVE TRANSACTION TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#DAE2FD] tracking-tight mt-1">
            Trung Tâm Quản Lý & Theo Dõi Giao Dịch
          </h1>
          <p className="text-xs text-[#BEC8D2] mt-1">
            Theo dõi trạng thái phiếu giữ chỗ 72h, quản lý lịch lái thử và thông tin hợp đồng điện tử của Quý khách.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#131B2E] border border-[#3E4850]/50 text-[#89CEFF] text-xs font-mono font-bold self-start md:self-auto shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#0EA5E9] animate-pulse" />
          <span>CONNECTED • 800V HUB</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PROFILE CARD & MENU (Col 4 / 260px Equivalent) */}
        <div className="lg:col-span-4 space-y-4">
          {/* User Profile Card */}
          <div className="bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] overflow-hidden shadow-xl">
            {/* Vehicle Backdrop Cover */}
            <div className="relative h-28 bg-gradient-to-r from-[#060E20] via-[#131B2E] to-[#171F33] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80"
                alt="Cover"
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              />
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-[2px] bg-[#060E20]/80 text-[10px] font-mono text-[#89CEFF] border border-[#89CEFF]/30">
                {MOCK_CUSTOMER_PROFILE.code}
              </div>
            </div>

            {/* Avatar & Details */}
            <div className="px-5 pb-5 pt-0 relative">
              <div className="relative -mt-10 mb-3 inline-block">
                <div className="w-16 h-16 rounded-[12px] bg-[#0B1326] p-0.5 border border-[#0EA5E9] shadow-[0_0_16px_rgba(14,165,233,0.35)] flex items-center justify-center text-white text-xl font-bold">
                  A
                </div>
                <button
                  className="absolute bottom-0 right-0 p-1 bg-[#171F33] hover:bg-[#222A3D] text-[#DAE2FD] rounded-[4px] border border-[#3E4850] shadow transition-colors"
                  title="Thay đổi ảnh đại diện"
                >
                  <Camera className="w-3 h-3 text-[#89CEFF]" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#DAE2FD] tracking-tight">
                  {MOCK_CUSTOMER_PROFILE.fullName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-[12px] bg-[#222A3D] text-[#FFB86E] border border-[#FFB86E]/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FFB86E]" />
                    <span>{MOCK_CUSTOMER_PROFILE.vipTier}</span>
                  </span>
                </div>
                <div className="text-xs text-[#BEC8D2] space-y-1 mt-3 p-2.5 rounded-[2px] bg-[#060E20] border border-[#3E4850]/40 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#88929B]">MÃ SỐ:</span>
                    <span className="text-[#89CEFF] font-bold">{MOCK_CUSTOMER_PROFILE.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#88929B]">EMAIL:</span>
                    <span className="text-[#DAE2FD]">{MOCK_CUSTOMER_PROFILE.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#88929B]">HOTLINE:</span>
                    <span className="text-[#DAE2FD]">{MOCK_CUSTOMER_PROFILE.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu List */}
          <div className="bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] p-2 shadow-xl space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ProfileTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[2px] text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#222A3D] text-[#89CEFF] border border-[#89CEFF]/40 shadow-sm'
                      : 'text-[#BEC8D2] hover:bg-[#171F33] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#89CEFF]' : 'text-[#88929B]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                        item.highlight
                          ? 'bg-[#0EA5E9] text-[#00344D]'
                          : 'bg-[#2D3449] text-[#DAE2FD]'
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
          <div className="p-4 rounded-[4px] bg-gradient-to-br from-[#171F33] to-[#131B2E] border border-[#3E4850]/50 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-[#89CEFF]">
              <Headphones className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">VIP CONCIERGE 24/7</span>
            </div>
            <p className="text-[11px] text-[#BEC8D2] leading-relaxed">
              Kênh hỗ trợ quản lý hồ sơ riêng dành cho chủ xe Diamond.
            </p>
            <div className="p-2.5 bg-[#060E20] rounded-[2px] border border-[#3E4850]/40 text-xs space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-[#88929B]">HOTLINE TRỰC TUYẾN:</span>
                <span className="font-bold text-[#89CEFF] text-sm">1900 8888</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#88929B]">CVTV Phụ trách:</span>
                <span className="font-bold text-[#DAE2FD]">{deposit.consultantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#88929B]">Showroom:</span>
                <span className="text-[#BEC8D2]">AutoHub Flagship Q7</span>
              </div>
            </div>
            <button
              onClick={() => alert(`Đang kết nối đến Chuyên viên tư vấn: ${deposit.consultantName} (${deposit.consultantPhone})...`)}
              className="w-full py-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-[#003751] text-xs font-bold rounded-[2px] flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(14,165,233,0.35)] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi Trợ Lý Riêng ({deposit.consultantPhone})</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT PANELS (Col 8) */}
        <div className="lg:col-span-8 space-y-5">
          {/* TAB 1: OVERVIEW / DEFAULT HUB VIEW */}
          {(activeTab === 'overview' || activeTab === 'deposits') && (
            <div className="space-y-5">
              {/* 3 Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Metric 1 */}
                <div className="p-4 rounded-[4px] bg-[#131B2E] border border-[#3E4850]/50 shadow-xl space-y-1">
                  <div className="flex items-center justify-between text-[#88929B]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">XE ĐANG GIỮ CHỖ</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#89CEFF]/20 text-[#89CEFF]">
                      72H LIVE
                    </span>
                  </div>
                  <div className="text-lg font-bold text-[#DAE2FD]">01 xe AutoHub GT-e</div>
                  <p className="text-[11px] text-[#89CEFF] font-medium">Khóa VIN giữ chỗ • Hạn 28/10</p>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-[4px] bg-[#131B2E] border border-[#3E4850]/50 shadow-xl space-y-1">
                  <div className="flex items-center justify-between text-[#88929B]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">LỊCH HẸN LÁI THỬ</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0EA5E9]/20 text-[#89CEFF]">
                      ĐÃ HẸN
                    </span>
                  </div>
                  <div className="text-lg font-bold text-[#89CEFF] font-mono">09:30 AM</div>
                  <p className="text-[11px] text-[#BEC8D2]">Thứ Bảy 27/10 • Showroom Q7</p>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-[4px] bg-[#131B2E] border border-[#3E4850]/50 shadow-xl space-y-1">
                  <div className="flex items-center justify-between text-[#88929B]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">TỔNG CỌC ĐÃ NỘP</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#89CEFF]/20 text-[#89CEFF]">
                      VNPAY IPN
                    </span>
                  </div>
                  <div className="text-lg font-bold text-[#89CEFF] font-mono">20.000.000 đ</div>
                  <p className="text-[11px] text-[#BEC8D2]">Bảo lưu 100% hoàn lại</p>
                </div>
              </div>

              {/* ACTIVE 72H DEPOSIT CARD */}
              <div className="bg-[#131B2E] border border-[#3E4850]/60 rounded-[4px] p-5 shadow-2xl space-y-4 relative overflow-hidden">
                {/* Glowing border highlight */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#89CEFF]/0 via-[#89CEFF] to-[#89CEFF]/0" />

                {/* Card Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#3E4850]/50">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#89CEFF]">
                      {deposit.contractCode}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      PHIẾU ĐẶT CỌC GIỮ XE 72H ĐANG HIỆU LỰC
                    </h3>
                  </div>
                  <span className="self-start sm:self-auto px-2.5 py-1 rounded-[2px] bg-[rgba(137,206,255,0.2)] text-[#89CEFF] border border-[#89CEFF]/30 text-xs font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>KHÓA VIN THÀNH CÔNG</span>
                  </span>
                </div>

                {/* Car Banner & Countdown Bar */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-5 relative rounded-[2px] overflow-hidden bg-[#060E20] border border-[#3E4850]/50 h-36">
                    <img
                      src={deposit.carImage}
                      alt={deposit.carName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-[#060E20]/90 backdrop-blur-md rounded-[2px] text-[10px] text-[#BEC8D2]">
                      {deposit.carVariant}
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-2.5">
                    <div>
                      <div className="text-xs text-[#88929B]">Dòng xe đặt cọc:</div>
                      <h4 className="text-lg font-bold text-[#DAE2FD]">{deposit.carName}</h4>
                      <div className="text-xs text-[#89CEFF] font-mono mt-0.5">{deposit.vinNumber}</div>
                    </div>

                    {/* Live Countdown Box */}
                    <div className="p-3 bg-[#060E20] border border-[#3E4850]/50 rounded-[4px] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#BEC8D2] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#89CEFF]" />
                          <span>Thời gian giữ chỗ còn lại:</span>
                        </span>
                        <span className="font-mono font-bold text-[#89CEFF] text-sm">
                          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#171F33] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#89CEFF] rounded-full"
                          style={{ width: `${(hours / 72) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#88929B]">
                        Số VIN xe của quý khách đã được hệ thống phân bổ độc quyền trên kho toàn quốc.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Columns of Info Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#060E20] border border-[#3E4850]/40 rounded-[2px] text-xs">
                  <div>
                    <span className="text-[#88929B] text-[10px] font-mono uppercase">Số tiền đặt cọc:</span>
                    <div className="text-sm font-mono font-bold text-[#89CEFF]">
                      {deposit.depositAmount.toLocaleString('vi-VN')} đ
                    </div>
                    <span className="text-[10px] text-[#88929B] font-mono">Mã GD: {deposit.paymentRef}</span>
                  </div>

                  <div>
                    <span className="text-[#88929B] text-[10px] font-mono uppercase">Thời điểm cọc:</span>
                    <div className="font-bold text-[#DAE2FD]">{deposit.depositTimestamp}</div>
                    <span className="text-[10px] text-[#88929B]">{deposit.paymentGateway}</span>
                  </div>

                  <div>
                    <span className="text-[#88929B] text-[10px] font-mono uppercase">CVTV hỗ trợ:</span>
                    <div className="font-bold text-[#DAE2FD]">{deposit.consultantName}</div>
                    <span className="text-[10px] text-[#88929B]">Flagship Showroom Q7</span>
                  </div>
                </div>

                {/* 3 Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="flex-1 py-2.5 px-3 rounded-[2px] bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-[#00344D] font-bold text-xs uppercase tracking-wider shadow-[0_0_14px_rgba(14,165,233,0.35)] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải Biên Lai (PDF)</span>
                  </button>

                  <button
                    onClick={() => setIsContractModalOpen(true)}
                    className="py-2.5 px-3 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#3E4850]/60 text-[#DAE2FD] font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4 text-[#89CEFF]" />
                    <span>Xem Hợp Đồng Nguyên Tắc</span>
                  </button>

                  <button
                    onClick={() => setIsRefundModalOpen(true)}
                    className="py-2.5 px-3 rounded-[2px] bg-[#171F33] hover:bg-rose-950/40 border border-[#3E4850]/60 hover:border-rose-500/40 text-[#BEC8D2] hover:text-rose-400 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Yêu Cầu Hoàn Cọc</span>
                  </button>
                </div>
              </div>

              {/* UPCOMING TEST DRIVE CARD */}
              <div className="bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#3E4850]/50">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-[2px] bg-[#171F33] text-[#89CEFF]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#88929B]">
                        Phiếu Lái Thử: {testDrive.ticketCode}
                      </span>
                      <h3 className="text-sm font-bold text-white">LỊCH HẸN LÁI THỬ SẮP DIỄN RA</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-[2px] bg-[rgba(137,206,255,0.2)] text-[#89CEFF] border border-[#89CEFF]/30 text-[10px] font-mono font-bold uppercase">
                    {testDrive.status === 'CONFIRMED' ? 'ĐÃ XÁC NHẬN' : 'CHỜ DUYỆT'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1 p-3 bg-[#060E20] rounded-[2px] border border-[#3E4850]/40">
                    <span className="text-[10px] font-mono uppercase text-[#88929B]">Dòng xe & Thời gian:</span>
                    <div className="font-bold text-[#DAE2FD] text-sm">{testDrive.carName}</div>
                    <div className="text-[#89CEFF] font-semibold font-mono">
                      {testDrive.scheduledTime} - {testDrive.scheduledDate}
                    </div>
                  </div>

                  <div className="space-y-1 p-3 bg-[#060E20] rounded-[2px] border border-[#3E4850]/40">
                    <span className="text-[10px] font-mono uppercase text-[#88929B]">Địa điểm & Kỹ thuật viên:</span>
                    <div className="font-bold text-[#DAE2FD]">{testDrive.locationName}</div>
                    <div className="text-[#BEC8D2] text-[11px]">{testDrive.locationAddress}</div>
                    <div className="text-[#89CEFF] font-semibold pt-1">
                      KTV: {testDrive.instructorName} ({testDrive.instructorPhone})
                    </div>
                  </div>
                </div>

                {/* Safe drive warning */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-[2px] flex items-start gap-2.5 text-amber-300 text-xs">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Vui lòng mang theo <strong>CCCD bản gốc</strong> và <strong>GPLX Hạng B2 còn hiệu lực</strong> khi đến nhận xe lái thử. Chuyên viên sẽ đón quý khách tại sảnh tiếp đón VIP.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-[#171F33] hover:bg-[#222A3D] border border-[#3E4850]/60 text-[#DAE2FD] rounded-[2px] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#89CEFF]" />
                    <span>Xem Lộ Trình Cung Đường</span>
                  </a>
                  <button
                    onClick={() => alert('Đã tạo liên kết lịch hẹn vào Google Calendar của bạn!')}
                    className="px-3 py-2 bg-[#171F33] hover:bg-[#222A3D] border border-[#3E4850]/60 text-[#DAE2FD] rounded-[2px] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#89CEFF]" />
                    <span>Thêm Vào Google Calendar</span>
                  </button>
                  <button
                    onClick={() => alert('Vui lòng liên hệ Kỹ thuật viên để điều chỉnh giờ lái thử')}
                    className="px-3 py-2 bg-[#171F33] hover:bg-[#222A3D] border border-[#89CEFF]/30 text-[#89CEFF] rounded-[2px] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#89CEFF]" />
                    <span>Đổi Lịch Hẹn</span>
                  </button>
                  <button
                    onClick={() => alert(`Đang gọi đến Kỹ thuật viên ${testDrive.instructorName} (${testDrive.instructorPhone})...`)}
                    className="px-3 py-2 bg-[#0EA5E9]/15 hover:bg-[#0EA5E9]/30 border border-[#0EA5E9]/40 text-[#89CEFF] rounded-[2px] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Liên Hệ KTV</span>
                  </button>
                </div>
              </div>

              {/* ADDRESS BOOK OVERVIEW SECTION */}
              <div className="bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#3E4850]/50">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-[2px] bg-[#171F33] text-[#89CEFF]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase font-mono">SỔ ĐỊA CHỈ GIAO NHẬN (UC03)</h3>
                  </div>
                  <Link
                    to="/customer/addresses"
                    className="text-xs text-[#89CEFF] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Quản lý tất cả</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-3.5 bg-[#060E20] border border-[#3E4850]/40 rounded-[2px] space-y-1.5 text-xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#DAE2FD]">{addr.title}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-[2px] bg-[#0EA5E9] text-[#00344D] font-mono text-[10px] font-bold">
                            Mặc Định
                          </span>
                        )}
                      </div>
                      <div className="text-[#BEC8D2] font-semibold">
                        {addr.recipientName} • {addr.phoneNumber}
                      </div>
                      <p className="text-[#88929B] text-[11px]">{addr.fullAddress}</p>
                      {addr.note && (
                        <div className="text-[10px] text-[#89CEFF] bg-[#171F33] p-1.5 rounded border border-[#89CEFF]/20">
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
            <div className="bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] p-6 shadow-xl space-y-5">
              <div className="pb-3 border-b border-[#3E4850]/50">
                <h3 className="text-base font-bold text-white font-mono uppercase">Thông Tin Định Danh Khách Hàng (KYC)</h3>
                <p className="text-xs text-[#BEC8D2] mt-0.5">
                  Quản lý số Căn cước công dân gắn chip và Giấy phép lái xe để làm thủ tục đăng ký xe và giao nhận.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[#88929B] text-[11px] font-mono">Họ và tên đầy đủ</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.fullName}
                    className="w-full mt-1 px-3 py-2 bg-[#060E20] border border-[#3E4850]/60 rounded-[2px] text-[#DAE2FD] font-semibold focus:outline-none focus:border-[#89CEFF]"
                  />
                </div>
                <div>
                  <label className="text-[#88929B] text-[11px] font-mono">Số Căn cước công dân (CCCD)</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.identityCardNumber}
                    className="w-full mt-1 px-3 py-2 bg-[#060E20] border border-[#3E4850]/60 rounded-[2px] text-[#DAE2FD] font-mono font-semibold focus:outline-none focus:border-[#89CEFF]"
                  />
                </div>
                <div>
                  <label className="text-[#88929B] text-[11px] font-mono">Ngày cấp CCCD</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.identityCardIssuedDate}
                    className="w-full mt-1 px-3 py-2 bg-[#060E20] border border-[#3E4850]/60 rounded-[2px] text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
                  />
                </div>
                <div>
                  <label className="text-[#88929B] text-[11px] font-mono">Nơi cấp</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.identityCardIssuedPlace}
                    className="w-full mt-1 px-3 py-2 bg-[#060E20] border border-[#3E4850]/60 rounded-[2px] text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
                  />
                </div>
                <div>
                  <label className="text-[#88929B] text-[11px] font-mono">Số Giấy phép lái xe (GPLX Hạng B2)</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.drivingLicenseNumber}
                    className="w-full mt-1 px-3 py-2 bg-[#060E20] border border-[#3E4850]/60 rounded-[2px] text-[#DAE2FD] font-mono font-semibold focus:outline-none focus:border-[#89CEFF]"
                  />
                </div>
                <div>
                  <label className="text-[#88929B] text-[11px] font-mono">Thời hạn GPLX</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.drivingLicenseExpiry}
                    className="w-full mt-1 px-3 py-2 bg-[#060E20] border border-[#3E4850]/60 rounded-[2px] text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
                  />
                </div>
                <div>
                  <label className="text-[#88929B] text-[11px] font-mono">Số điện thoại chính</label>
                  <input
                    type="text"
                    defaultValue={MOCK_CUSTOMER_PROFILE.phoneNumber}
                    className="w-full mt-1 px-3 py-2 bg-[#060E20] border border-[#3E4850]/60 rounded-[2px] text-[#DAE2FD] font-semibold focus:outline-none focus:border-[#89CEFF]"
                  />
                </div>
                <div>
                  <label className="text-[#88929B] text-[11px] font-mono">Địa chỉ Email</label>
                  <input
                    type="email"
                    defaultValue={MOCK_CUSTOMER_PROFILE.email}
                    className="w-full mt-1 px-3 py-2 bg-[#060E20] border border-[#3E4850]/60 rounded-[2px] text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
                  />
                </div>
              </div>

              {/* Identity Verification Badges */}
              <div className="p-3.5 bg-[#171F33] border border-[#89CEFF]/30 rounded-[2px] flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#89CEFF] flex-shrink-0" />
                <div className="text-xs">
                  <strong className="text-white">Định danh Căn cước công dân gắn chip cấp độ 2 thành công</strong>
                  <p className="text-[11px] text-[#BEC8D2] mt-0.5">
                    Hồ sơ của Quý khách đã đủ điều kiện hợp đồng số và nhận bàn giao xe tự động.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS */}
          {activeTab === 'addresses' && (
            <div className="p-6 bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] text-center text-xs space-y-3">
              <MapPin className="w-8 h-8 text-[#89CEFF] mx-auto" />
              <h3 className="text-base font-bold text-white">Quản Lý Sổ Địa Chỉ Giao Nhận</h3>
              <p className="text-[#BEC8D2]">Xem chi tiết và chỉnh sửa sổ địa chỉ giao hàng tại trang Sổ Địa Chỉ.</p>
              <Link
                to="/customer/addresses"
                className="inline-block px-4 py-2 bg-[#0EA5E9] text-[#00344D] font-bold rounded-[2px]"
              >
                Đến Sổ Địa Chỉ
              </Link>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="p-6 bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] text-center text-xs space-y-3">
              <FileText className="w-8 h-8 text-[#89CEFF] mx-auto" />
              <h3 className="text-base font-bold text-white">Tài Liệu & Hợp Đồng Số</h3>
              <p className="text-[#BEC8D2]">Các hợp đồng nguyên tắc và biên lai cọc điện tử đã lưu trữ an toàn.</p>
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="px-4 py-2 bg-[#171F33] border border-[#89CEFF]/40 text-[#89CEFF] font-semibold rounded-[2px]"
              >
                Mở Biên Lai Cọc Số Gần Nhất
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-6 bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] text-center text-xs space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#89CEFF] mx-auto" />
              <h3 className="text-base font-bold text-white">Cài Đặt & Bảo Mật 2FA</h3>
              <p className="text-[#BEC8D2]">Tài khoản đã kích hoạt mã OTP qua SMS và Email an toàn đa tầng.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
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
    </div>
  );
};

