import React from 'react';
import {
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
import type { CarDepositItem, CarDepositStatus } from '../types';

interface CarDepositRowCardProps {
  item: CarDepositItem;
  copiedCode: string | null;
  remainingSeconds: number;
  format72hCountdown: (secs: number) => string;
  onCopy: (code: string) => void;
  onSelectReceipt: (item: CarDepositItem) => void;
  onRequestRefund: (item: CarDepositItem) => void;
}

export const CarDepositRowCard: React.FC<CarDepositRowCardProps> = ({
  item,
  copiedCode,
  remainingSeconds,
  format72hCountdown,
  onCopy,
  onSelectReceipt,
  onRequestRefund,
}) => {
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-accent-action/15 border border-accent-action/40 text-accent-primary font-mono text-[11px] font-bold uppercase tracking-wider">
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-sky-500/15 border border-sky-500/40 text-sky-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>CHỜ THANH TOÁN (15 PHÚT)</span>
          </span>
        );
      case 'REFUND_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-sky-500/15 border border-sky-500/40 text-sky-300 font-mono text-[11px] font-bold uppercase tracking-wider">
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
    <div className="rounded-[6px] bg-surface-elevated/80 border border-surface-highlight hover:border-accent-primary/40 shadow-xl overflow-hidden transition-all duration-200">
      {/* Header của Row: Mã cọc, Ngày đặt, Badge trạng thái */}
      <div className="p-4 bg-surface-container border-b border-surface-highlight flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-muted font-mono">MÃ PHIẾU CỌC:</span>
            <span className="font-mono text-sm font-bold text-accent-primary">{item.depositCode}</span>
            <button
              type="button"
              onClick={() => onCopy(item.depositCode)}
              className="p-1 rounded hover:bg-surface-interactive text-text-muted hover:text-accent-primary transition-colors cursor-pointer"
              title="Sao chép mã phiếu cọc"
            >
              {copiedCode === item.depositCode ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <span className="text-border-subtle">•</span>
          <div className="text-xs text-text-secondary">
            Định danh CCCD:{' '}
            <span className="font-mono text-text-primary font-bold">{item.identityCardNumber}</span>
          </div>

          <span className="text-border-subtle">•</span>
          <span className="px-2 py-0.5 rounded-[2px] bg-surface-interactive text-[10px] font-mono text-accent-primary">
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
            className="w-28 h-20 rounded-[4px] bg-canvas-deep border border-surface-highlight object-cover shrink-0"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-accent-action/15 text-accent-primary font-mono text-[10px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>SUẤT GIỮ XE ĐIỆN 72H LIÊN TỤC</span>
            </div>
            <h3 className="text-lg font-bold text-text-primary">{item.carModelName}</h3>
            <p className="text-xs text-text-secondary">{item.carVariant}</p>
            <div className="flex items-center gap-2 pt-1">
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: item.colorHex }}
              />
              <span className="text-xs text-text-muted">Màu sơn: {item.exteriorColor}</span>
            </div>
          </div>
        </div>

        {/* Showroom nhận xe & Đồng hồ đếm ngược 72h */}
        <div className="space-y-2 text-xs text-text-secondary border-l border-surface-highlight/80 pl-4 min-w-[300px]">
          {/* Số khung VIN nếu đã được Staff gán sau đối soát */}
          {item.vinNumber ? (
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
              <div className="text-[10px] uppercase font-bold text-emerald-400">Số khung (VIN) gán giữ chỗ:</div>
              <div className="font-bold text-sm tracking-wider">{item.vinNumber}</div>
            </div>
          ) : item.status === 'PAID' ? (
            <div className="p-2 rounded bg-accent-action/10 border border-accent-primary/30 text-accent-primary font-mono text-xs">
              <div className="text-[10px] uppercase font-bold text-accent-primary flex items-center gap-1">
                <Clock className="w-3 h-3 animate-pulse text-accent-primary" />
                <span>Thời hạn giữ chỗ 72h còn lại:</span>
              </div>
              <div className="font-bold text-sm tracking-wide mt-0.5 text-accent-primary">
                {format72hCountdown(remainingSeconds)}
              </div>
            </div>
          ) : null}

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-text-primary">{item.showroomName}</div>
              <div className="text-[11px] text-text-muted leading-tight">{item.showroomAddress}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer của Row: Tiền cọc & Nút hành động */}
      <div className="p-3 bg-surface-container/90 border-t border-surface-highlight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] text-text-muted font-mono uppercase">Tiền cọc giữ chỗ (DR08):</div>
          <div className="font-mono text-lg font-bold text-accent-primary">
            {item.depositAmount.toLocaleString('vi-VN')} VNĐ
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Nút Xem biên nhận cọc điện tử */}
          <button
            type="button"
            onClick={() => onSelectReceipt(item)}
            className="px-3.5 py-2 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight hover:border-accent-primary/50 text-xs font-semibold text-text-primary flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-accent-primary" />
            <span>Biên nhận điện tử</span>
          </button>

          {/* Nút Xin hoàn cọc (nếu ngân hàng từ chối tín dụng theo BR05 & UC18) */}
          {(item.status === 'PAID' || item.status === 'RESERVED') && (
            <button
              type="button"
              onClick={() => onRequestRefund(item)}
              className="px-3 py-2 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight hover:border-accent-primary/50 text-xs font-semibold text-accent-primary flex items-center gap-1 cursor-pointer transition-colors"
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
              className="px-4 py-2 rounded-[2px] bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-accent-contrast" />
              <span>Ký hợp đồng tại showroom</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
