import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  Copy,
  MapPin,
  Download,
  FileCheck2,
  Sparkles,
  RefreshCcw,
  X,
  Building,
} from 'lucide-react';

export type CarDepositStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'RESERVED'
  | 'COMPLETED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface CarDepositItem {
  id: number;
  depositCode: string;
  carModelName: string;
  carVariant: string;
  exteriorColor: string;
  colorHex: string;
  carImageUrl: string;
  depositAmount: number;
  identityCardNumber: string;
  customerName: string;
  customerPhone: string;
  showroomName: string;
  showroomAddress: string;
  status: CarDepositStatus;
  vinNumber?: string;
  vnpayTransactionId?: string;
  paidAt?: string;
  expireAt?: string; // 72 giờ tính từ paidAt
  refundReason?: string;
  createdAt: string;
}

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
    paidAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // Đã cọc cách đây 14h
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
  const [refundBankReason, setRefundBankReason] = useState('Ngân hàng đối tác từ chối cấp tín dụng mua xe (kèm văn bản)');
  const [refundBankDoc, setRefundBankDoc] = useState('');
  const [refundBankAcc, setRefundBankAcc] = useState('19034567890011 - Techcombank (Nguyễn Văn A)');
  const [refundSubmitted, setRefundSubmitted] = useState(false);

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
  const handleSubmitRefund = (e: React.FormEvent) => {
    e.preventDefault();
    setRefundSubmitted(true);
    setTimeout(() => {
      setRefundSubmitted(false);
      setShowRefundModal(false);
      if (refundTarget) {
        setDeposits((prev) =>
          prev.map((d) =>
            d.id === refundTarget.id
              ? {
                  ...d,
                  status: 'REFUND_REQUESTED' as CarDepositStatus,
                  refundReason: refundBankReason,
                }
              : d
          )
        );
      }
      showToast('Đã gửi yêu cầu hoàn cọc thành công! Nhân viên đối soát và Admin sẽ thẩm định theo quy định BR05.');
      setRefundTarget(null);
    }, 1500);
  };

  const filteredDeposits =
    activeTab === 'ALL' ? deposits : deposits.filter((d) => d.status === activeTab);

  const renderStatusBadge = (status: CarDepositStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ĐÃ ĐẶT CỌC (GIỮ SUẤT 72H)</span>
          </span>
        );
      case 'RESERVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#0EA5E9]/15 border border-[#0EA5E9]/40 text-[#89CEFF] font-mono text-[11px] font-bold uppercase tracking-wider">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>ĐÃ GÁN SỐ KHUNG VIN (RESERVED)</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-purple-500/15 border border-purple-500/40 text-purple-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>ĐÃ KÝ HỢP ĐỒNG (COMPLETED)</span>
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>CHỜ THANH TOÁN (15 PHÚT)</span>
          </span>
        );
      case 'REFUND_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-orange-500/15 border border-orange-500/40 text-orange-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
            <span>ĐANG THẨM ĐỊNH HOÀN CỌC</span>
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-slate-500/15 border border-slate-500/40 text-slate-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Check className="w-3.5 h-3.5" />
            <span>ĐÃ HOÀN TIỀN CỌC (REFUNDED)</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>HẾT HẠN 72H (ĐÃ NHẢ SUẤT)</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <X className="w-3.5 h-3.5" />
            <span>ĐÃ HỦY (CANCELLED)</span>
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
            <CreditCard className="w-6 h-6 text-[#FFB86E]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#DAE2FD]">Phiếu Đặt Cọc Giữ Xe 72H (UC17)</h1>
          </div>
          <p className="text-xs text-[#88929B] mt-1">
            Theo dõi trạng thái tạm khóa suất xe trong kho trong thời hạn 72 giờ liên tục, đối soát số khung VIN và trích xuất biên lai điện tử.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#171F33] border border-[#2D3449] text-xs text-[#88929B]">
          <ShieldCheck className="w-4 h-4 text-[#89CEFF]" />
          <span>Bảo mật giao dịch VNPay HMAC-SHA512</span>
        </div>
      </div>

      {/* 2. Tabs lọc theo Enum TrangThaiPhieuCoc */}
      <div className="bg-[#171F33]/60 p-1.5 rounded-[6px] border border-[#2D3449] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {(
            [
              { key: 'ALL', label: 'TẤT CẢ' },
              { key: 'PAID', label: 'ĐÃ ĐẶT CỌC (72H)' },
              { key: 'RESERVED', label: 'ĐÃ GÁN SỐ VIN' },
              { key: 'COMPLETED', label: 'HOÀN TẤT HỢP ĐỒNG' },
              { key: 'PENDING_PAYMENT', label: 'CHỜ THANH TOÁN' },
              { key: 'REFUND_REQUESTED', label: 'XIN HOÀN CỌC' },
              { key: 'REFUNDED', label: 'ĐÃ HOÀN TIỀN' },
              { key: 'EXPIRED', label: 'HẾT HẠN' },
            ] as const
          ).map((tab) => {
            const count = tab.key === 'ALL' ? deposits.length : deposits.filter((d) => d.status === tab.key).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-[4px] text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFB86E] text-[#060E20] shadow-[0_0_15px_rgba(255,184,110,0.35)]'
                    : 'text-[#BEC8D2] hover:text-[#DAE2FD] hover:bg-[#131B2E]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-[#060E20] text-[#FFB86E]' : 'bg-[#222A3D] text-[#88929B]'
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

      {/* 3. Danh sách phiếu cọc xe dạng ROW */}
      <div className="space-y-4">
        {filteredDeposits.length === 0 ? (
          <div className="py-16 text-center rounded-[4px] bg-[#171F33]/30 border border-[#2D3449] space-y-3">
            <CreditCard className="w-12 h-12 text-[#88929B] mx-auto opacity-50" />
            <h3 className="text-base font-semibold text-[#DAE2FD]">Không có phiếu cọc xe nào trong mục này</h3>
            <p className="text-xs text-[#88929B] max-w-sm mx-auto">
              Chưa phát sinh phiếu đặt cọc giữ chỗ ô tô thuộc trạng thái này.
            </p>
          </div>
        ) : (
          filteredDeposits.map((item) => (
            <div
              key={item.id}
              className="rounded-[6px] bg-[#171F33]/80 border border-[#2D3449] hover:border-[#FFB86E]/40 shadow-xl overflow-hidden transition-all duration-200"
            >
              {/* Header của Row: Mã cọc, Ngày đặt, Badge trạng thái */}
              <div className="p-4 bg-[#131B2E] border-b border-[#2D3449] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#88929B] font-mono">MÃ PHIẾU CỌC:</span>
                    <span className="font-mono text-sm font-bold text-[#FFB86E]">{item.depositCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.depositCode)}
                      className="p-1 rounded hover:bg-[#222A3D] text-[#88929B] hover:text-[#FFB86E] transition-colors"
                      title="Sao chép mã phiếu cọc"
                    >
                      {copiedCode === item.depositCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <span className="text-[#3E4850]">•</span>
                  <div className="text-xs text-[#BEC8D2]">
                    Định danh CCCD:{' '}
                    <span className="font-mono text-[#DAE2FD] font-bold">{item.identityCardNumber}</span>
                  </div>

                  <span className="text-[#3E4850]">•</span>
                  <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[10px] font-mono text-[#89CEFF]">
                    VNPay Cọc Trực Tuyến
                  </span>
                </div>

                <div>{renderStatusBadge(item.status)}</div>
              </div>

              {/* Body của Row: Xe ô tô & Thông tin suất cọc */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Thông tin mẫu xe */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={item.carImageUrl}
                    alt={item.carModelName}
                    className="w-28 h-20 rounded-[4px] bg-[#060E20] border border-[#2D3449] object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#FFB86E]/15 text-[#FFB86E] font-mono text-[10px] font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>SUẤT GIỮ XE ĐIỆN 72H LIÊN TỤC</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#DAE2FD]">{item.carModelName}</h3>
                    <p className="text-xs text-[#BEC8D2]">{item.carVariant}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-xs text-[#88929B]">Màu sơn: {item.exteriorColor}</span>
                    </div>
                  </div>
                </div>

                {/* Showroom nhận xe & Đồng hồ đếm ngược 72h */}
                <div className="space-y-2 text-xs text-[#BEC8D2] border-l border-[#2D3449]/80 pl-4 min-w-[300px]">
                  {/* Số khung VIN nếu đã được Staff gán sau đối soát */}
                  {item.vinNumber ? (
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                      <div className="text-[10px] uppercase font-bold text-emerald-400">Số khung (VIN) gán giữ chỗ:</div>
                      <div className="font-bold text-sm tracking-wider">{item.vinNumber}</div>
                    </div>
                  ) : item.status === 'PAID' ? (
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs">
                      <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-pulse" />
                        <span>Thời hạn giữ chỗ 72h còn lại:</span>
                      </div>
                      <div className="font-bold text-sm tracking-wide mt-0.5">
                        {format72hCountdown(remainingSeconds)}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#89CEFF] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#DAE2FD]">{item.showroomName}</div>
                      <div className="text-[11px] text-[#88929B] leading-tight">{item.showroomAddress}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer của Row: Tiền cọc & Nút hành động */}
              <div className="p-3 bg-[#131B2E]/90 border-t border-[#2D3449] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-[#88929B] font-mono uppercase">Tiền cọc giữ chỗ (DR08):</div>
                  <div className="font-mono text-lg font-bold text-[#FFB86E]">
                    {item.depositAmount.toLocaleString('vi-VN')} VNĐ
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Nút Xem biên nhận cọc điện tử */}
                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(item)}
                    className="px-3.5 py-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] hover:border-[#FFB86E]/50 text-xs font-semibold text-[#DAE2FD] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FFB86E]" />
                    <span>Biên nhận điện tử</span>
                  </button>

                  {/* Nút Xin hoàn cọc (nếu ngân hàng từ chối tín dụng theo BR05 & UC18) */}
                  {(item.status === 'PAID' || item.status === 'RESERVED') && (
                    <button
                      type="button"
                      onClick={() => {
                        setRefundTarget(item);
                        setShowRefundModal(true);
                      }}
                      className="px-3 py-2 rounded-[2px] bg-[#171F33] hover:bg-orange-950/40 border border-[#2D3449] hover:border-orange-500/50 text-xs font-semibold text-orange-400 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span>Yêu cầu hoàn cọc</span>
                    </button>
                  )}

                  {/* Nút Đến Showroom Ký Hợp Đồng */}
                  {(item.status === 'PAID' || item.status === 'RESERVED') && (
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-[2px] bg-[#0EA5E9] hover:bg-[#38BDF8] text-xs font-bold text-[#00344D] flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Building className="w-3.5 h-3.5 text-[#00344D]" />
                      <span>Ký hợp đồng tại showroom</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Modal Biên Nhận Cọc Xe Điện Tử (E-Invoice / Receipt) */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl rounded-xl bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#FFB86E]" />
                <h3 className="text-base font-bold text-[#DAE2FD]">Biên Nhận Đặt Cọc Xe Ô Tô Điện Tử</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="w-7 h-7 rounded bg-[#171F33] text-[#BEC8D2] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-4 rounded bg-[#060E20] border border-[#2D3449] space-y-2">
                <div className="flex justify-between items-center text-[#88929B]">
                  <span>MÃ PHIẾU CỌC:</span>
                  <span className="font-mono font-bold text-[#FFB86E] text-sm">{selectedReceipt.depositCode}</span>
                </div>
                <div className="flex justify-between items-center text-[#88929B]">
                  <span>MÃ ĐỐI SOÁT VNPAY:</span>
                  <span className="font-mono text-[#89CEFF]">{selectedReceipt.vnpayTransactionId || 'VNP-DEP-88992'}</span>
                </div>
                <div className="flex justify-between items-center text-[#88929B]">
                  <span>NGƯỜI ĐỨNG TÊN:</span>
                  <span className="font-bold text-[#DAE2FD]">{selectedReceipt.customerName}</span>
                </div>
                <div className="flex justify-between items-center text-[#88929B]">
                  <span>ĐỊNH DANH CCCD:</span>
                  <span className="font-mono text-[#DAE2FD]">{selectedReceipt.identityCardNumber}</span>
                </div>
                <div className="flex justify-between items-center text-[#88929B]">
                  <span>DÒNG XE & PHIÊN BẢN:</span>
                  <span className="font-bold text-[#DAE2FD]">{selectedReceipt.carModelName} - {selectedReceipt.carVariant}</span>
                </div>
                {selectedReceipt.vinNumber && (
                  <div className="flex justify-between items-center text-emerald-400 font-bold">
                    <span>SỐ KHUNG (VIN):</span>
                    <span className="font-mono text-sm">{selectedReceipt.vinNumber}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#2D3449] flex justify-between items-baseline">
                  <span className="text-[#DAE2FD] font-bold">TIỀN CỌC ĐÃ THANH TOÁN:</span>
                  <span className="font-mono text-lg font-bold text-[#FFB86E]">
                    {selectedReceipt.depositAmount.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>

              <div className="p-3 rounded bg-[#171F33] border border-[#2D3449] text-[11px] text-[#88929B] leading-relaxed">
                Biên nhận có giá trị pháp lý tạm khóa suất xe trong thời hạn 72 giờ liên tục. Tiền cọc sẽ được khấu trừ trực tiếp vào hợp đồng mua bán chính thức tại showroom AutoHub.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#2D3449]">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded bg-[#0EA5E9] hover:bg-[#38BDF8] text-xs font-bold text-[#00344D] flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>In Biên Nhận (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded bg-[#171F33] text-xs text-[#DAE2FD]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Yêu Cầu Hoàn Cọc Trực Tuyến (UC18 & UC23) */}
      {showRefundModal && refundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-xl bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]">
              <div className="flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-[#DAE2FD]">Yêu Cầu Hoàn Tiền Cọc Xe (UC18)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRefundModal(false)}
                className="w-7 h-7 rounded bg-[#171F33] text-[#BEC8D2] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {refundSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <Check className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-[#DAE2FD]">Đã gửi hồ sơ xin hoàn tiền cọc!</h4>
                <p className="text-xs text-[#88929B]">
                  Hồ sơ sẽ đi qua các bước: Staff đối soát chứng từ ngân hàng (VERIFIED) và Admin phê duyệt giải ngân (APPROVED) theo quy định BR05.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRefund} className="pt-4 space-y-4 text-xs">
                <div className="p-3 rounded bg-[#060E20] border border-[#2D3449] space-y-1">
                  <div className="text-[#88929B]">Quy chế hoàn cọc AutoHub (BR05 & DR14):</div>
                  <div className="text-[#89CEFF] font-semibold leading-relaxed">
                    Chỉ xét hoàn tiền cọc khi (a) Ngân hàng đối tác từ chối cấp tín dụng mua xe có văn bản xác nhận hợp lệ, hoặc (b) Quản trị viên phê duyệt ngoại lệ trước thời điểm ký hợp đồng.
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#88929B]">Lý do xin rút tiền cọc *</label>
                  <select
                    value={refundBankReason}
                    onChange={(e) => setRefundBankReason(e.target.value)}
                    className="w-full h-10 px-2.5 bg-[#060E20] border border-[#2D3449] rounded text-xs text-[#DAE2FD] focus:outline-none"
                  >
                    <option value="Ngân hàng đối tác từ chối cấp tín dụng mua xe (kèm văn bản)">
                      Ngân hàng đối tác từ chối cấp tín dụng mua xe (kèm văn bản)
                    </option>
                    <option value="Ngoại lệ khách hàng đề nghị Admin xem xét">
                      Ngoại lệ khách hàng đề nghị Admin xem xét
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#88929B]">Văn bản / Thông báo từ chối cấp tín dụng của ngân hàng *</label>
                  <input
                    type="text"
                    required
                    value={refundBankDoc}
                    onChange={(e) => setRefundBankDoc(e.target.value)}
                    placeholder="Nhập tên tệp / đường dẫn văn bản xác nhận ngân hàng..."
                    className="w-full h-10 px-3 bg-[#060E20] border border-[#2D3449] rounded text-xs text-[#DAE2FD] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#88929B]">Tài khoản ngân hàng thụ hưởng nhận tiền hoàn *</label>
                  <input
                    type="text"
                    required
                    value={refundBankAcc}
                    onChange={(e) => setRefundBankAcc(e.target.value)}
                    placeholder="Số tài khoản - Tên ngân hàng - Chủ tài khoản"
                    className="w-full h-10 px-3 bg-[#060E20] border border-[#2D3449] rounded text-xs text-[#DAE2FD] font-mono focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2D3449]">
                  <button
                    type="button"
                    onClick={() => setShowRefundModal(false)}
                    className="px-4 py-2 rounded bg-[#171F33] text-xs text-[#BEC8D2] hover:text-white"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-orange-500 hover:bg-orange-400 text-xs font-bold text-[#060E20]"
                  >
                    Gửi Hồ Sơ Xin Hoàn Cọc
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
