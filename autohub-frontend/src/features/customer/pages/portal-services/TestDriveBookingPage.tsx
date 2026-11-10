import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Check, Plus, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import type { TestDriveStatus, TestDriveItem } from '@/features/customer/types/test-drive.types';
import { TestDriveFilterTabs } from '@/features/customer/components/TestDriveFilterTabs';
import { TestDriveRowCard } from '@/features/customer/components/TestDriveRowCard';
import { TestDriveEvaluationModal } from '@/features/customer/components/TestDriveEvaluationModal';
import { TestDriveBookingModal } from '@/features/customer/components/TestDriveBookingModal';
import { engagementService } from '@/features/customer/services/engagement.service';

export const TestDriveBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [testDrives, setTestDrives] = useState<TestDriveItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | TestDriveStatus>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  // Modal xem biên bản đánh giá lái thử
  const [selectedEvaluation, setSelectedEvaluation] = useState<TestDriveItem | null>(null);

  const loadTestDrives = async () => {
    setIsLoading(true);
    try {
      const data = await engagementService.getMyTestDrives(user?.id);
      setTestDrives(data || []);
    } catch {
      // offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTestDrives();
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Hủy lịch hẹn lái thử (UC21)
  const handleCancelBooking = async (id: number) => {
    await engagementService.cancelTestDrive(id);
    setTestDrives((prev) =>
      prev.map((td) => (td.id === id ? { ...td, status: 'CANCELLED' as TestDriveStatus } : td))
    );
    showToast('Đã hủy lịch hẹn lái thử thành công. Xe Demo đã được giải phóng khung giờ.');
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
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">Lịch Hẹn Lái Thử Xe Demo</h1>
          </div>
          <p className="text-sm text-text-muted mt-0.5">
            Quản lý lịch hẹn trải nghiệm xe Demo trực tiếp tại showroom hoặc địa điểm yêu cầu, đối soát bằng lái và khảo sát đánh giá.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadTestDrives}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-accent-primary' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            type="button"
            onClick={() => setIsBookingModalOpen(true)}
            className="py-2.5 px-4 rounded-lg bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(137,206,255,0.4)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent-contrast" />
            <span>Đăng ký lái thử mới</span>
          </button>
        </div>
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

      {/* 4. Modal Biên bản đánh giá trải nghiệm lái thử (COMPLETED) */}
      <TestDriveEvaluationModal
        evaluation={selectedEvaluation}
        onClose={() => setSelectedEvaluation(null)}
      />

      {/* 5. Modal Đăng ký lái thử mới (High-fidelity từ Figma) */}
      <TestDriveBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmitSuccess={() => {
          setIsBookingModalOpen(false);
          showToast('Đăng ký lái thử xe Demo thành công! Lịch hẹn mới đã được ghi nhận.');
        }}
      />
    </div>
  );
};
