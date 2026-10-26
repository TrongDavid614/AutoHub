import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Check, Plus } from 'lucide-react';
import type { TestDriveStatus, TestDriveItem } from '../types';
import { TestDriveFilterTabs } from '../components/TestDriveFilterTabs';
import { TestDriveRowCard } from '../components/TestDriveRowCard';
import { TestDriveBookingModal } from '../components/TestDriveBookingModal';
import { TestDriveEvaluationModal } from '../components/TestDriveEvaluationModal';

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
  const handleCreateBooking = (data: {
    selectedCarModel: string;
    selectedLocation: string;
    bookingDate: string;
    timeSlot: string;
    customerName: string;
    customerPhone: string;
    licenseAgreed: boolean;
  }) => {
    const newItem: TestDriveItem = {
      id: Math.floor(1000 + Math.random() * 9000),
      bookingCode: `#TD-${Math.floor(100 + Math.random() * 900)}`,
      carModelName: data.selectedCarModel,
      carVariant:
        data.selectedCarModel === 'AutoHub GT-e'
          ? 'Performance Dual-Motor AWD (800V SiC)'
          : 'Long Range 7-Chỗ (Pin 110 kWh)',
      carImageUrl:
        'https://api.builder.io/api/v1/image/assets/TEMP/f8563407750402a5ec748ad5da036903aa27d5e0?width=600',
      showroomName: data.selectedLocation,
      showroomAddress:
        data.selectedLocation.includes('Thủ Đức')
          ? 'Đại lộ Mai Chí Thọ, Phường An Phú, TP. Thủ Đức'
          : 'Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1',
      locationType: 'SHOWROOM',
      bookingDate: data.bookingDate,
      timeSlot: data.timeSlot,
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

  return (
    <div className="space-y-6">
      {/* 1. Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-highlight">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-accent-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Lịch Hẹn Lái Thử Xe Demo (UC16)</h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Trải nghiệm thực tế công nghệ thuần điện 800V, cảm giác lái và các tính năng an toàn LiDAR tại showroom hoặc tại nhà.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBookingModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast transition-all cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng Ký Lịch Lái Thử Mới</span>
        </button>
      </div>

      {/* 2. Tabs lọc theo Enum TrangThaiLichHen */}
      <TestDriveFilterTabs
        activeTab={activeTab}
        testDrives={testDrives}
        onSelectTab={setActiveTab}
      />

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
          <div className="py-16 text-center rounded-[4px] bg-surface-elevated/30 border border-surface-highlight space-y-3">
            <Calendar className="w-12 h-12 text-text-muted mx-auto opacity-50" />
            <h3 className="text-base font-semibold text-text-primary">Không có lịch hẹn lái thử nào</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Chưa phát sinh lịch hẹn trải nghiệm xe Demo ở trạng thái này. Quý khách có thể đăng ký lái thử bất kỳ dòng xe nào.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <TestDriveRowCard
              key={item.id}
              item={item}
              onOpenEvaluation={setSelectedEvaluation}
              onCancelBooking={handleCancelBooking}
              onNavigateToDeposit={() => navigate('/customer/deposits')}
            />
          ))
        )}
      </div>

      {/* 4. Modal Đăng ký lịch hẹn lái thử mới (UC16) */}
      <TestDriveBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleCreateBooking}
      />

      {/* 5. Modal Biên bản đánh giá trải nghiệm lái thử (COMPLETED) */}
      <TestDriveEvaluationModal
        evaluation={selectedEvaluation}
        onClose={() => setSelectedEvaluation(null)}
      />
    </div>
  );
};
