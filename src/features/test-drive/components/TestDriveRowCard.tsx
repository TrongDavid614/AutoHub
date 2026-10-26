import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  AlertCircle,
  X,
  CreditCard,
  ShieldCheck,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import type { TestDriveItem, TestDriveStatus } from '../types';

interface TestDriveRowCardProps {
  item: TestDriveItem;
  onOpenEvaluation: (item: TestDriveItem) => void;
  onCancelBooking: (id: number) => void;
  onNavigateToDeposit: () => void;
}

export const TestDriveRowCard: React.FC<TestDriveRowCardProps> = ({
  item,
  onOpenEvaluation,
  onCancelBooking,
  onNavigateToDeposit,
}) => {
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-accent-action/15 border border-accent-action/40 text-accent-primary font-mono text-[11px] font-bold uppercase tracking-wider">
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
    <div className="rounded-[6px] bg-surface-elevated/80 border border-surface-highlight hover:border-accent-primary/40 shadow-xl overflow-hidden transition-all duration-200">
      {/* Header của Row: Mã hẹn, Ngày đặt, Badge trạng thái */}
      <div className="p-4 bg-surface-container border-b border-surface-highlight flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-muted font-mono">MÃ LỊCH HẸN:</span>
            <span className="font-mono text-sm font-bold text-accent-primary">{item.bookingCode}</span>
          </div>
          <span className="text-border-subtle">•</span>
          <div className="text-xs text-text-secondary">
            Đăng ký ngày:{' '}
            <span className="font-mono text-text-primary">
              {new Date(item.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <span className="text-border-subtle">•</span>
          <span className="px-2 py-0.5 rounded-[2px] bg-surface-interactive text-[10px] font-mono text-emerald-400 font-bold">
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
            className="w-24 h-16 rounded-[4px] bg-canvas-deep border border-surface-highlight object-cover shrink-0"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-accent-action/15 text-accent-primary font-mono text-[10px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>XE LÁI THỬ SHOWROOM (DEMO CAR)</span>
            </div>
            <h3 className="text-base font-bold text-text-primary">{item.carModelName}</h3>
            <p className="text-xs text-text-secondary">{item.carVariant}</p>
          </div>
        </div>

        {/* Thời gian & Địa điểm */}
        <div className="space-y-1.5 text-xs text-text-secondary border-l border-surface-highlight/80 pl-4 min-w-[280px]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent-primary shrink-0" />
            <span className="font-bold text-text-primary font-mono text-sm">{item.bookingDate}</span>
            <span className="text-accent-primary font-mono font-bold">({item.timeSlot})</span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-text-primary">{item.showroomName}</div>
              <div className="text-[11px] text-text-muted leading-tight">{item.showroomAddress}</div>
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
      <div className="p-3 bg-surface-container/90 border-t border-surface-highlight flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-text-muted flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-accent-primary" />
          <span>
            Quy chế BR06: Quý khách vui lòng xuất trình Giấy phép lái xe (GPLX) bản gốc khi nhận bàn giao vô lăng tại showroom.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Nếu đã hoàn thành -> Xem biên bản đánh giá */}
          {item.status === 'COMPLETED' && (
            <button
              type="button"
              onClick={() => onOpenEvaluation(item)}
              className="px-3.5 py-1.5 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-accent-primary font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Biên bản trải nghiệm</span>
            </button>
          )}

          {/* Nút Đặt cọc giữ xe 72h */}
          <button
            type="button"
            onClick={onNavigateToDeposit}
            className="px-3.5 py-1.5 rounded-[2px] bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-accent-contrast" />
            <span>Đặt cọc xe 72h</span>
          </button>

          {/* Nút Hủy lịch hẹn (Nếu PENDING hoặc CONFIRMED) */}
          {(item.status === 'PENDING' || item.status === 'CONFIRMED') && (
            <button
              type="button"
              onClick={() => onCancelBooking(item.id)}
              className="px-3 py-1.5 rounded-[2px] bg-surface-elevated hover:bg-rose-950/40 border border-surface-highlight hover:border-rose-500/50 text-rose-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Hủy lịch</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
