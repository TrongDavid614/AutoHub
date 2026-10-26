import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, Check } from 'lucide-react';
import type { CarDepositStatus, CarDepositItem } from '../types';
import { CarDepositFilterTabs } from '../components/CarDepositFilterTabs';
import { CarDepositRowCard } from '../components/CarDepositRowCard';
import { CarDepositReceiptModal } from '../components/CarDepositReceiptModal';
import { CarDepositRefundModal } from '../components/CarDepositRefundModal';

const INITIAL_DEPOSITS: CarDepositItem[] = [
  // 1. Phiếu cọc đã thanh toán và đang giữ suất xe 72h (PAID)
  {
    id: 1,
    depositCode: '#DEP-GTE-2026-8812',
    carModelName: 'AutoHub GT-e',
    carVariant: 'Performance Dual-Motor AWD (800V SiC)',
    exteriorColor: 'Xanh Băng Apex Cyan',
    colorHex: '#89CEFF',
    carImageUrl:
      'https://api.builder.io/api/v1/image/assets/TEMP/f8563407750402a5ec748ad5da036903aa27d5e0?width=600',
    depositAmount: 20000000,
    identityCardNumber: '079204001234',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912345678',
    showroomName: 'Showroom AutoHub Flagship Thủ Đức',
    showroomAddress: 'Đại lộ Mai Chí Thọ, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh',
    status: 'PAID',
    vnpayTransactionId: 'vnp_9921448',
    paidAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
  },

  // 2. Phiếu cọc đã được Staff đối soát và gán số khung VIN (RESERVED)
  {
    id: 2,
    depositCode: '#DEP-SUV-2026-7733',
    carModelName: 'AutoHub e-SUV Ultra',
    carVariant: 'Long Range 7-Chỗ (Pin 110 kWh)',
    exteriorColor: 'Đen Huyền Bí Obsidian',
    colorHex: '#1E293B',
    carImageUrl:
      'https://api.builder.io/api/v1/image/assets/TEMP/3bea387701c2ccce27dbf0d9a6bf1b65ca48da5d?width=600',
    depositAmount: 20000000,
    identityCardNumber: '079204001234',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912345678',
    showroomName: 'Showroom AutoHub Quận 1',
    showroomAddress: 'Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    status: 'RESERVED',
    vinNumber: 'VF8-AUTOHUB-2026-VN-009921',
    vnpayTransactionId: 'vnp_8812001',
    paidAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
  },

  // 3. Phiếu cọc đã ký hợp đồng mua bán hoàn tất (COMPLETED)
  {
    id: 3,
    depositCode: '#DEP-GTE-2026-3301',
    carModelName: 'AutoHub GT-e',
    carVariant: 'Standard RWD City Commuter',
    exteriorColor: 'Trắng Ngọc Trai Alpine White',
    colorHex: '#FFFFFF',
    carImageUrl:
      'https://api.builder.io/api/v1/image/assets/TEMP/f8563407750402a5ec748ad5da036903aa27d5e0?width=600',
    depositAmount: 10000000,
    identityCardNumber: '079204001234',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912345678',
    showroomName: 'Showroom AutoHub Flagship Thủ Đức',
    showroomAddress: 'Đại lộ Mai Chí Thọ, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh',
    status: 'COMPLETED',
    vinNumber: 'VF8-AUTOHUB-2026-VN-003310',
    vnpayTransactionId: 'vnp_1120934',
    paidAt: '2026-09-10T10:00:00Z',
    createdAt: '2026-09-10T10:00:00Z',
  },
];

export const CarDepositPage: React.FC = () => {
  const [deposits, setDeposits] = useState<CarDepositItem[]>(INITIAL_DEPOSITS);
  const [activeTab, setActiveTab] = useState<'ALL' | CarDepositStatus>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal biên nhận cọc xe điện tử
  const [selectedReceipt, setSelectedReceipt] = useState<CarDepositItem | null>(null);

  // Modal yêu cầu hoàn cọc (UC18 & UC23)
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundTarget, setRefundTarget] = useState<CarDepositItem | null>(null);

  // Giả lập đồng hồ đếm ngược 72 giờ (còn lại khoảng 57 giờ 42 phút cho đơn 1)
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
  const handleRefundSubmit = (data: { reason: string; document: string; bankAccount: string }) => {
    setShowRefundModal(false);
    if (refundTarget) {
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
    <div className="space-y-6">
      {/* 1. Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-highlight">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Phiếu Đặt Cọc Giữ Xe 72H (UC17)</h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Theo dõi trạng thái tạm khóa suất xe trong kho trong thời hạn 72 giờ liên tục, đối soát số khung VIN và trích xuất biên lai điện tử.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-surface-elevated border border-surface-highlight text-xs text-text-muted">
          <ShieldCheck className="w-4 h-4 text-accent-primary" />
          <span>Bảo mật giao dịch VNPay HMAC-SHA512</span>
        </div>
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
