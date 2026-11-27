import React from 'react';
import {
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  Copy,
  MapPin,
  FileCheck2,
  RefreshCcw,
  X,
  Building,
  CreditCard,
  FileText,
} from 'lucide-react';
import { getRemainingSeconds } from '@/lib/utils';

import type { CarDepositItem, CarDepositStatus } from '@/features/customer/types/car-deposit.types';

interface CarDepositRowCardProps {
  item: CarDepositItem;
  copiedCode: string | null;
  nowMs: number;
  formatCountdown: (secs: number) => string;
  format72hCountdown: (secs: number) => string;
  onCopy: (code: string) => void;
  onSelectReceipt: (item: CarDepositItem) => void;
  onRequestRefund: (item: CarDepositItem) => void;
  onPayDeposit?: (item: CarDepositItem) => void;
}

export const CarDepositRowCard: React.FC<CarDepositRowCardProps> = ({
  item,
  copiedCode,
  nowMs,
  formatCountdown,
  format72hCountdown,
  onCopy,
  onSelectReceipt,
  onRequestRefund,
  onPayDeposit,
}) => {
  const paymentRemainingSeconds = getRemainingSeconds(
    item.paymentDeadline || item.expireAt,
    nowMs,
    item.createdAt,
    15 * 60
  );
  const holdingRemainingSeconds = getRemainingSeconds(
    item.expireAt,
    nowMs,
    item.paidAt || item.createdAt,
    72 * 3600
  );

  const renderStatusBadge = (status: CarDepositStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Đã đặt cọc (Giữ suất 72h)</span>
          </span>
        );
      case 'RESERVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--accent-soft)] border border-[var(--accent)]/25 text-[var(--accent)] text-xs font-semibold">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Đã gán số khung VIN</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Đã ký hợp đồng</span>
          </span>
        );
      case 'PENDING_PAYMENT':
        if (paymentRemainingSeconds <= 0) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-semibold tabular-nums">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Hết hạn thanh toán (00:00)</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold tabular-nums">
            <Clock className="w-3.5 h-3.5" />
            <span>Chờ thanh toán ({formatCountdown(paymentRemainingSeconds)})</span>
          </span>
        );
      case 'REFUND_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Đang thẩm định hoàn cọc</span>
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <Check className="w-3.5 h-3.5" />
            <span>Đã hoàn tiền cọc</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Hết hạn 72h</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            <X className="w-3.5 h-3.5" />
            <span>Đã hủy</span>
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
                <Check className="w-3.5 h-3.5 text-emerald-600" />
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
            SePay Cọc Trực Tuyến
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
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-medium">
              <span>Suất giữ xe điện 72h liên tục</span>
            </div>
            <h3
              onClick={() => onSelectReceipt(item)}
              className="text-lg font-bold text-text-primary hover:text-[var(--accent)] cursor-pointer transition-colors"
            >
              {item.carModelName}
            </h3>
            <p className="text-xs text-text-secondary">{item.carVariant}</p>
            <div className="flex items-center gap-2 pt-1">
              <span
                className="w-3 h-3 rounded-full border border-black/15"
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
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs">
              <div className="text-xs font-sans font-semibold text-emerald-700">Số khung (VIN) gán giữ chỗ:</div>
              <div className="font-bold text-sm tracking-wider tabular-nums">{item.vinNumber}</div>
            </div>
          ) : item.status === 'PAID' ? (
            <div className="p-2.5 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/25 text-[var(--accent)] text-xs">
              <div className="text-xs font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Thời hạn giữ chỗ 72h còn lại:</span>
              </div>
              <div className="font-mono font-bold text-sm tabular-nums mt-0.5">
                {holdingRemainingSeconds > 0
                  ? format72hCountdown(holdingRemainingSeconds)
                  : 'Đã hết hạn 72h'}
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
          {/* Nút Xác nhận đặt cọc SePay VietQR nếu chưa thanh toán */}
          {item.status === 'PENDING_PAYMENT' && onPayDeposit && (
            <button
              type="button"
              onClick={() => onPayDeposit(item)}
              disabled={paymentRemainingSeconds <= 0}
              title={
                paymentRemainingSeconds <= 0
                  ? 'Phiếu cọc đã quá thời hạn thanh toán 15 phút'
                  : 'Mở mã QR thanh toán SePay'
              }
              className="px-4 py-2 rounded-[2px] bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-3.5 h-3.5 text-accent-contrast" />
              <span>{paymentRemainingSeconds <= 0 ? 'Đã quá hạn thanh toán' : 'Thanh toán SePay VietQR'}</span>
            </button>
          )}

          {/* Nút Xem chi tiết & Biên nhận cọc điện tử */}
          <button
            type="button"
            onClick={() => onSelectReceipt(item)}
            className="px-3.5 py-2 rounded-lg bg-[var(--accent-soft)] hover:bg-[var(--accent)]/15 border border-[var(--accent)]/25 text-xs font-semibold text-[var(--accent)] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Chi tiết & Biên nhận</span>
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
