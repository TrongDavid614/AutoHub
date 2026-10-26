import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  AlertCircle,
  Plus,
  X,
  CreditCard,
  ShieldCheck,
  User,
  Phone,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

export type TestDriveStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

export interface TestDriveItem {
  id: number;
  bookingCode: string;
  carModelName: string;
  carVariant: string;
  carImageUrl: string;
  showroomName: string;
  showroomAddress: string;
  locationType: 'SHOWROOM' | 'HOME';
  bookingDate: string;
  timeSlot: string;
  status: TestDriveStatus;
  hasDrivingLicense: boolean;
  demoCarPlate?: string;
  consultantName?: string;
  evaluationNote?: string;
  createdAt: string;
}

const INITIAL_TEST_DRIVES: TestDriveItem[] = [
  {
    id: 1,
    bookingCode: '#TD-GTE-2026-101',
    carModelName: 'AutoHub GT-e',
    carVariant: 'Performance Dual-Motor AWD (800V SiC)',
    carImageUrl:
      'https://api.builder.io/api/v1/image/assets/TEMP/f8563407750402a5ec748ad5da036903aa27d5e0?width=600',
    showroomName: 'Showroom AutoHub Flagship Thủ Đức',
    showroomAddress: 'Đại lộ Mai Chí Thọ, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh',
    locationType: 'SHOWROOM',
    bookingDate: '28/10/2026',
    timeSlot: '09:00 - 10:30',
    status: 'CONFIRMED',
    hasDrivingLicense: true,
    demoCarPlate: '51K-999.88 (Xe Demo)',
    consultantName: 'Kỹ sư Trịnh Hoài Nam',
    createdAt: '2026-10-25T10:00:00Z',
  },
  {
    id: 2,
    bookingCode: '#TD-SUV-2026-088',
    carModelName: 'AutoHub e-SUV Ultra',
    carVariant: 'Long Range 7-Chỗ (Pin 110 kWh)',
    carImageUrl:
      'https://api.builder.io/api/v1/image/assets/TEMP/3bea387701c2ccce27dbf0d9a6bf1b65ca48da5d?width=600',
    showroomName: 'Lái thử tại địa chỉ khách hàng',
    showroomAddress: 'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. HCM',
    locationType: 'HOME',
    bookingDate: '30/10/2026',
    timeSlot: '14:30 - 16:00',
    status: 'PENDING',
    hasDrivingLicense: true,
    createdAt: '2026-10-25T14:30:00Z',
  },
  {
    id: 3,
    bookingCode: '#TD-GTE-2026-042',
    carModelName: 'AutoHub GT-e',
    carVariant: 'Standard RWD City Commuter',
    carImageUrl:
      'https://api.builder.io/api/v1/image/assets/TEMP/f8563407750402a5ec748ad5da036903aa27d5e0?width=600',
    showroomName: 'Showroom AutoHub Quận 1',
    showroomAddress: 'Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    locationType: 'SHOWROOM',
    bookingDate: '18/10/2026',
    timeSlot: '10:00 - 11:30',
    status: 'COMPLETED',
    hasDrivingLicense: true,
    demoCarPlate: '51K-888.66 (Xe Demo)',
    consultantName: 'Chuyên viên Lê Minh Tuấn',
    evaluationNote:
      'Khách hàng đánh giá cảm giác lái thể thao xuất sắc, khả năng cách âm vòm lốp êm ái, quan tâm phiên bản Performance.',
    createdAt: '2026-10-15T08:00:00Z',
  },
];

export const TestDriveBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [testDrives, setTestDrives] = useState<TestDriveItem[]>(INITIAL_TEST_DRIVES);
  const [activeTab, setActiveTab] = useState<'ALL' | TestDriveStatus>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal đăng ký lịch lái thử mới
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCarModel, setSelectedCarModel] = useState('AutoHub GT-e');
  const [selectedLocation, setSelectedLocation] = useState('Showroom AutoHub Flagship Thủ Đức');
  const [bookingDate, setBookingDate] = useState('29/10/2026');
  const [timeSlot, setTimeSlot] = useState('09:00 - 10:30');
  const [licenseAgreed, setLicenseAgreed] = useState(true);
  const [customerName, setCustomerName] = useState('Nguyễn Văn A');
  const [customerPhone, setCustomerPhone] = useState('0912345678');

  // Modal xem biên bản đánh giá lái thử
  const [selectedEvaluation, setSelectedEvaluation] = useState<TestDriveItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Hủy lịch hẹn lái thử (UC21)
  const handleCancelBooking = (id: number) => {
    setTestDrives((prev) =>
      prev.map((td) => (td.id === id ? { ...td, status: 'CANCELLED' as TestDriveStatus } : td))
    );
    showToast('Đã hủy lịch hẹn lái thử thành công. Xe Demo đã được giải phóng khung giờ.');
  };

  // 2. Tạo lịch hẹn lái thử mới (UC16)
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseAgreed) {
      alert('Quý khách bắt buộc phải cam kết có Giấy phép lái xe (GPLX) hợp lệ theo quy chế BR06.');
      return;
    }

    const newItem: TestDriveItem = {
      id: Math.floor(1000 + Math.random() * 9000),
      bookingCode: `#TD-${Math.floor(100 + Math.random() * 900)}`,
      carModelName: selectedCarModel,
      carVariant:
        selectedCarModel === 'AutoHub GT-e'
          ? 'Performance Dual-Motor AWD (800V SiC)'
          : 'Long Range 7-Chỗ (Pin 110 kWh)',
      carImageUrl:
        'https://api.builder.io/api/v1/image/assets/TEMP/f8563407750402a5ec748ad5da036903aa27d5e0?width=600',
      showroomName: selectedLocation,
      showroomAddress:
        selectedLocation.includes('Thủ Đức')
          ? 'Đại lộ Mai Chí Thọ, Phường An Phú, TP. Thủ Đức'
          : 'Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1',
      locationType: 'SHOWROOM',
      bookingDate,
      timeSlot,
      status: 'PENDING',
      hasDrivingLicense: true,
      createdAt: new Date().toISOString(),
    };

    setTestDrives((prev) => [newItem, ...prev]);
    setShowBookingModal(false);
    showToast('Đăng ký lịch lái thử thành công! Cố vấn showroom sẽ đối soát xe Demo và xác nhận trong 24h.');
  };

  const filteredItems =
    activeTab === 'ALL' ? testDrives : testDrives.filter((td) => td.status === activeTab);

  const renderStatusBadge = (status: TestDriveStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>ĐÃ XÁC NHẬN (CONFIRMED)</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>CHỜ DUYỆT XE DEMO (PENDING)</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#0EA5E9]/15 border border-[#0EA5E9]/40 text-[#89CEFF] font-mono text-[11px] font-bold uppercase tracking-wider">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>ĐÃ HOÀN THÀNH (COMPLETED)</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <X className="w-3.5 h-3.5" />
            <span>ĐÃ HỦY (CANCELLED)</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-slate-500/15 border border-slate-500/40 text-slate-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>HẾT HẠN DUYỆT (EXPIRED 12H)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2D3449]">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#89CEFF]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#DAE2FD]">Lịch Hẹn Lái Thử Xe Demo (UC16)</h1>
          </div>
          <p className="text-xs text-[#88929B] mt-1">
            Trải nghiệm thực tế công nghệ thuần điện 800V, cảm giác lái và các tính năng an toàn LiDAR tại showroom hoặc tại nhà.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBookingModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#0EA5E9] hover:bg-[#38BDF8] text-xs font-bold text-[#00344D] transition-all cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng Ký Lịch Lái Thử Mới</span>
        </button>
      </div>

      {/* 2. Tabs lọc theo Enum TrangThaiLichHen */}
      <div className="bg-[#171F33]/60 p-1.5 rounded-[6px] border border-[#2D3449] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {(
            [
              { key: 'ALL', label: 'TẤT CẢ' },
              { key: 'PENDING', label: 'CHỜ DUYỆT' },
              { key: 'CONFIRMED', label: 'ĐÃ XÁC NHẬN' },
              { key: 'COMPLETED', label: 'HOÀN THÀNH' },
              { key: 'CANCELLED', label: 'ĐÃ HỦY' },
              { key: 'EXPIRED', label: 'HẾT HẠN' },
            ] as const
          ).map((tab) => {
            const count = tab.key === 'ALL' ? testDrives.length : testDrives.filter((t) => t.status === tab.key).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-[4px] text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0EA5E9] text-[#00344D] shadow-[0_0_15px_rgba(14,165,233,0.35)]'
                    : 'text-[#BEC8D2] hover:text-[#DAE2FD] hover:bg-[#131B2E]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-[#00344D] text-[#89CEFF]' : 'bg-[#222A3D] text-[#88929B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div className="p-3.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn shadow-lg">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Danh sách lịch hẹn dạng ROW */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center rounded-[4px] bg-[#171F33]/30 border border-[#2D3449] space-y-3">
            <Calendar className="w-12 h-12 text-[#88929B] mx-auto opacity-50" />
            <h3 className="text-base font-semibold text-[#DAE2FD]">Không có lịch hẹn lái thử nào</h3>
            <p className="text-xs text-[#88929B] max-w-sm mx-auto">
              Chưa phát sinh lịch hẹn trải nghiệm xe Demo ở trạng thái này. Quý khách có thể đăng ký lái thử bất kỳ dòng xe nào.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-[6px] bg-[#171F33]/80 border border-[#2D3449] hover:border-[#89CEFF]/40 shadow-xl overflow-hidden transition-all duration-200"
            >
              {/* Header của Row: Mã hẹn, Ngày đặt, Badge trạng thái */}
              <div className="p-4 bg-[#131B2E] border-b border-[#2D3449] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#88929B] font-mono">MÃ LỊCH HẸN:</span>
                    <span className="font-mono text-sm font-bold text-[#89CEFF]">{item.bookingCode}</span>
                  </div>
                  <span className="text-[#3E4850]">•</span>
                  <div className="text-xs text-[#BEC8D2]">
                    Đăng ký ngày:{' '}
                    <span className="font-mono text-[#DAE2FD]">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <span className="text-[#3E4850]">•</span>
                  <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[10px] font-mono text-emerald-400 font-bold">
                    ✓ ĐÃ CAM KẾT GPLX
                  </span>
                </div>

                <div>{renderStatusBadge(item.status)}</div>
              </div>

              {/* Body của Row: Mẫu xe & Thông tin lịch lái thử */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Xe Demo */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={item.carImageUrl}
                    alt={item.carModelName}
                    className="w-24 h-16 rounded-[4px] bg-[#060E20] border border-[#2D3449] object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#0EA5E9]/15 text-[#89CEFF] font-mono text-[10px] font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>XE LÁI THỬ SHOWROOM (DEMO CAR)</span>
                    </div>
                    <h3 className="text-base font-bold text-[#DAE2FD]">{item.carModelName}</h3>
                    <p className="text-xs text-[#BEC8D2]">{item.carVariant}</p>
                  </div>
                </div>

                {/* Thời gian & Địa điểm */}
                <div className="space-y-1.5 text-xs text-[#BEC8D2] border-l border-[#2D3449]/80 pl-4 min-w-[280px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#89CEFF] shrink-0" />
                    <span className="font-bold text-[#DAE2FD] font-mono text-sm">{item.bookingDate}</span>
                    <span className="text-[#89CEFF] font-mono font-bold">({item.timeSlot})</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#89CEFF] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#DAE2FD]">{item.showroomName}</div>
                      <div className="text-[11px] text-[#88929B] leading-tight">{item.showroomAddress}</div>
                    </div>
                  </div>

                  {item.demoCarPlate && (
                    <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Biển số xe Demo: {item.demoCarPlate} • Cố vấn: {item.consultantName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer của Row: Các nút hành động nghiệp vụ */}
              <div className="p-3 bg-[#131B2E]/90 border-t border-[#2D3449] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-[#88929B] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#89CEFF]" />
                  <span>
                    Quy chế BR06: Quý khách vui lòng xuất trình Giấy phép lái xe (GPLX) bản gốc khi nhận bàn giao vô lăng tại showroom.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Nếu đã hoàn thành -> Xem biên bản đánh giá */}
                  {item.status === 'COMPLETED' && (
                    <button
                      type="button"
                      onClick={() => setSelectedEvaluation(item)}
                      className="px-3.5 py-1.5 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] text-[#89CEFF] font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Biên bản trải nghiệm</span>
                    </button>
                  )}

                  {/* Nút Đặt cọc giữ xe 72h */}
                  <button
                    type="button"
                    onClick={() => navigate('/customer/deposits')}
                    className="px-3.5 py-1.5 rounded-[2px] bg-[#0EA5E9] hover:bg-[#38BDF8] text-[#00344D] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#00344D]" />
                    <span>Đặt cọc xe 72h</span>
                  </button>

                  {/* Nút Hủy lịch hẹn (Nếu PENDING hoặc CONFIRMED) */}
                  {(item.status === 'PENDING' || item.status === 'CONFIRMED') && (
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(item.id)}
                      className="px-3 py-1.5 rounded-[2px] bg-[#171F33] hover:bg-rose-950/40 border border-[#2D3449] hover:border-rose-500/50 text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Hủy lịch</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Modal Đăng ký lịch hẹn lái thử mới (UC16) */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-xl bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#89CEFF]" />
                <h3 className="text-base font-bold text-[#DAE2FD]">Đăng Ký Trải Nghiệm Lái Thử Xe Demo (UC16)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="w-7 h-7 rounded bg-[#171F33] text-[#BEC8D2] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="pt-4 space-y-4">
              {/* Chọn mẫu xe */}
              <div className="space-y-1">
                <label className="text-xs text-[#88929B]">Mẫu xe thuần điện muốn trải nghiệm *</label>
                <select
                  value={selectedCarModel}
                  onChange={(e) => setSelectedCarModel(e.target.value)}
                  className="w-full h-10 px-3 bg-[#060E20] border border-[#2D3449] focus:border-[#89CEFF] rounded text-xs text-[#DAE2FD] focus:outline-none"
                >
                  <option value="AutoHub GT-e">AutoHub GT-e (Sedan Thể Thao 800V SiC - 650 HP)</option>
                  <option value="AutoHub e-SUV Ultra">AutoHub e-SUV Ultra (SUV 7 Chỗ Gia Đình - Pin 110 kWh)</option>
                </select>
              </div>

              {/* Showroom & Địa điểm */}
              <div className="space-y-1">
                <label className="text-xs text-[#88929B]">Địa điểm nhận xe lái thử *</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full h-10 px-3 bg-[#060E20] border border-[#2D3449] focus:border-[#89CEFF] rounded text-xs text-[#DAE2FD] focus:outline-none"
                >
                  <option value="Showroom AutoHub Flagship Thủ Đức">Showroom AutoHub Flagship Thủ Đức (Đại lộ Mai Chí Thọ)</option>
                  <option value="Showroom AutoHub Quận 1">Showroom AutoHub Quận 1 (Số 2 Tôn Đức Thắng)</option>
                  <option value="Lái thử tại nhà (Khu vực nội thành TP. HCM)">Lái thử tại địa chỉ nhà riêng</option>
                </select>
              </div>

              {/* Ngày & Khung giờ (Yêu cầu trước 24h theo BR06) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#88929B]">Ngày hẹn (cách ít nhất 24h) *</label>
                  <input
                    type="text"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    placeholder="29/10/2026"
                    className="w-full h-10 px-3 bg-[#060E20] border border-[#2D3449] rounded text-xs text-[#DAE2FD] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#88929B]">Khung giờ slot trống *</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full h-10 px-3 bg-[#060E20] border border-[#2D3449] rounded text-xs text-[#DAE2FD] font-mono"
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
                  <label className="text-xs text-[#88929B]">Họ tên người lái thử *</label>
                  <div className="relative flex items-center">
                    <User className="w-3.5 h-3.5 text-[#88929B] absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full h-10 pl-8 pr-3 bg-[#060E20] border border-[#2D3449] rounded text-xs text-[#DAE2FD]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#88929B]">Số điện thoại liên hệ *</label>
                  <div className="relative flex items-center">
                    <Phone className="w-3.5 h-3.5 text-[#88929B] absolute left-3 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full h-10 pl-8 pr-3 bg-[#060E20] border border-[#2D3449] rounded text-xs text-[#DAE2FD] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Cam kết có GPLX theo BR06 */}
              <div className="p-3 rounded bg-[#060E20] border border-[#2D3449] space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={licenseAgreed}
                    onChange={(e) => setLicenseAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#0EA5E9] bg-[#060E20] border-[#2D3449]"
                  />
                  <span className="text-xs text-[#DAE2FD] leading-relaxed">
                    Tôi cam kết hiện đang sở hữu Giấy phép lái xe (GPLX) hạng B2 trở lên còn thời hạn hiệu lực và sẽ xuất trình bản gốc cho nhân viên trước khi nhận xe lái thử (Quy định bắt buộc BR06).
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2D3449]">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 rounded bg-[#171F33] text-xs text-[#BEC8D2] hover:text-white"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#0EA5E9] hover:bg-[#38BDF8] text-xs font-bold text-[#00344D]"
                >
                  Xác Nhận Đặt Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Biên bản đánh giá trải nghiệm lái thử (COMPLETED) */}
      {selectedEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-xl bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-[#DAE2FD]">Biên Bản Trải Nghiệm Lái Thử</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvaluation(null)}
                className="w-7 h-7 rounded bg-[#171F33] text-[#BEC8D2] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded bg-[#060E20] border border-[#2D3449] space-y-1">
                <div className="text-[#88929B]">Mẫu xe trải nghiệm:</div>
                <div className="font-bold text-[#89CEFF]">{selectedEvaluation.carModelName} - {selectedEvaluation.carVariant}</div>
                <div className="text-[#BEC8D2] font-mono">Xe Demo: {selectedEvaluation.demoCarPlate}</div>
              </div>

              <div className="p-3 rounded bg-[#060E20] border border-[#2D3449] space-y-1">
                <div className="text-[#88929B]">Ghi chú của chuyên viên kỹ thuật ({selectedEvaluation.consultantName}):</div>
                <p className="text-[#DAE2FD] italic leading-relaxed">
                  "{selectedEvaluation.evaluationNote}"
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#2D3449]">
              <button
                type="button"
                onClick={() => setSelectedEvaluation(null)}
                className="px-4 py-2 rounded bg-[#171F33] text-xs text-[#DAE2FD]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
