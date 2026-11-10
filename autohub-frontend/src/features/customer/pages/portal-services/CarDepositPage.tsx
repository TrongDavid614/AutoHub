import React, { useState, useEffect } from 'react';
import { CreditCard, Check, RefreshCw } from 'lucide-react';
import type { CarDepositStatus, CarDepositItem } from '@/features/customer/types/car-deposit.types';
import { CarDepositFilterTabs } from '@/features/customer/components/CarDepositFilterTabs';
import { CarDepositRowCard } from '@/features/customer/components/CarDepositRowCard';
import { CarDepositReceiptModal } from '@/features/customer/components/CarDepositReceiptModal';
import { CarDepositRefundModal } from '@/features/customer/components/CarDepositRefundModal';
import { depositService } from '@/features/customer/services/deposit.service';
import { useAuthStore } from '@/store/useAuthStore';

export const CarDepositPage: React.FC = () => {
  const { user } = useAuthStore();
  const [deposits, setDeposits] = useState<CarDepositItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'ALL' | CarDepositStatus>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal biên nhận cọc xe điện tử
  const [selectedReceipt, setSelectedReceipt] = useState<CarDepositItem | null>(null);

  // Modal yêu cầu hoàn cọc (UC18 & UC23)
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundTarget, setRefundTarget] = useState<CarDepositItem | null>(null);

  // Fetch real deposits from database
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

  const handleDirectConfirmDeposit = async (item: CarDepositItem) => {
    await depositService.confirmPayment(item.id);
    setDeposits((prev) =>
      prev.map((d) =>
        d.id === item.id
          ? {
              ...d,
              status: 'PAID' as CarDepositStatus,
              paidAt: new Date().toISOString(),
              expireAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
            }
          : d
      )
    );
    showToast(`Đã xác nhận thanh toán cọc thành công cho phiếu cọc ${item.depositCode}!`);
  };

  // Đồng hồ đếm ngược 72 giờ
  const [remainingSeconds, setRemainingSeconds] = useState(57 * 3600 + 42 * 60 + 15);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Xử lý gửi yêu cầu hoàn cọc theo quy tắc BR05 & UC18
  const handleRefundSubmit = async (data: { reason: string; document: string; bankAccount: string }) => {
    setShowRefundModal(false);
    if (refundTarget) {
      await depositService.requestRefund(refundTarget.id, data.reason);
      setDeposits((prev) =>
        prev.map((d) =>
          d.id === refundTarget.id
            ? {
                ...d,
                status: 'REFUND_REQUESTED' as CarDepositStatus,
                refundReason: data.reason,
              }
            : d
        )
      );
    }
    showToast('Đã gửi yêu cầu hoàn cọc thành công! Nhân viên đối soát và Admin sẽ thẩm định theo quy định BR05.');
    setRefundTarget(null);
  };

  const filteredDeposits =
    activeTab === 'ALL' ? deposits : deposits.filter((d) => d.status === activeTab);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-highlight">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-accent-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">Phiếu Đặt Cọc Giữ Xe 72H</h1>
          </div>
          <p className="text-sm text-text-muted mt-0.5">
            Theo dõi trạng thái tạm khóa suất xe trong kho trong thời hạn 72 giờ liên tục, đối soát số khung VIN và trích xuất biên lai điện tử.
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
        {filteredDeposits.length === 0 ? (
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
              onCopy={handleCopy}
              onSelectReceipt={setSelectedReceipt}
              onRequestRefund={(target) => {
                setRefundTarget(target);
                setShowRefundModal(true);
              }}
              onPayDeposit={handleDirectConfirmDeposit}
            />
          ))
        )}
      </div>

      {/* 4. Modal Biên Nhận Cọc Xe Điện Tử (E-Invoice / Receipt) */}
      <CarDepositReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* 5. Modal Yêu Cầu Hoàn Cọc Trực Tuyến (UC18 & UC23) */}
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
