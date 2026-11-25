import React from 'react';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
  showDot?: boolean;
}

interface StatusConfig {
  label: string;
  variant: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple' | 'slate' | 'cyan';
}

const STATUS_DICTIONARY: Record<string, StatusConfig> = {
  // Deposit & Order payment
  PENDING_PAYMENT: { label: 'Chờ Thanh Toán', variant: 'amber' },
  PAID: { label: 'Đã Thanh Toán', variant: 'emerald' },
  COMPLETED: { label: 'Đã Hoàn Tất', variant: 'emerald' },
  EXPIRED: { label: 'Hết Hạn (Quá 72h)', variant: 'slate' },
  CANCELLED: { label: 'Đã Hủy Bỏ', variant: 'rose' },
  REFUND_REQUESTED: { label: 'Đang Xin Hoàn Cọc', variant: 'purple' },
  REFUNDED: { label: 'Đã Hoàn Tiền', variant: 'cyan' },
  REFUND_REQUIRED: { label: 'Cần Hoàn Tiền', variant: 'rose' },

  // Order Fulfillment
  PENDING: { label: 'Chờ Xử Lý', variant: 'amber' },
  PROCESSING: { label: 'Đang Đóng Gói', variant: 'blue' },
  SHIPPING: { label: 'Đang Giao Hàng', variant: 'purple' },
  DELIVERED: { label: 'Giao Thành Công', variant: 'emerald' },
  RETURNED: { label: 'Đã Đổi Trả', variant: 'slate' },

  // Test Drive
  CONFIRMED: { label: 'Đã Xác Nhận', variant: 'emerald' },

  // User & Master Data Status
  HOAT_DONG: { label: 'Đang Hoạt Động', variant: 'emerald' },
  ACTIVE: { label: 'Đang Hoạt Động', variant: 'emerald' },
  BI_KHOA: { label: 'Bị Khóa', variant: 'rose' },
  INACTIVE: { label: 'Ngừng Hoạt Động', variant: 'slate' },
  CHUA_KICH_HOAT: { label: 'Chưa Kích Hoạt', variant: 'amber' },

  // Cars & VIN Status
  CO_SAN: { label: 'Sẵn Sàng Gán VIN', variant: 'emerald' },
  IN_STOCK: { label: 'Còn Hàng', variant: 'emerald' },
  DA_GIU_CHO: { label: 'Đã Giữ Chỗ (72h)', variant: 'amber' },
  RESERVED_FOR_DEPOSIT: { label: 'Đã Khóa Suất Cọc', variant: 'amber' },
  DA_BAN: { label: 'Đã Bán Hợp Đồng', variant: 'slate' },
  SOLD: { label: 'Đã Bán', variant: 'slate' },

  // Demo Cars
  SAN_SANG: { label: 'Xe Demo Sẵn Sàng', variant: 'emerald' },
  AVAILABLE: { label: 'Khả Dụng', variant: 'emerald' },
  DANG_CHAY_THU: { label: 'Đang Lái Thử', variant: 'blue' },
  ON_TEST_DRIVING: { label: 'Đang Lái Thử', variant: 'blue' },
  BAO_DUONG: { label: 'Đang Bảo Dưỡng', variant: 'rose' },
  MAINTENANCE: { label: 'Đang Bảo Dưỡng', variant: 'rose' },

  // Moderation & Approval
  APPROVED: { label: 'Đã Phê Duyệt', variant: 'emerald' },
  VERIFIED: { label: 'Đã Thẩm Định (Chờ Admin)', variant: 'purple' },
  REJECTED: { label: 'Đã Bác Bỏ / Từ Chối', variant: 'rose' },
  CONTACTED: { label: 'Đã Tư Vấn', variant: 'blue' },
  CLOSED: { label: 'Đã Đóng Hồ Sơ', variant: 'slate' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className,
  showDot = true,
}) => {
  const normalizedKey = status.toUpperCase().trim();
  const config = STATUS_DICTIONARY[normalizedKey] || {
    label: label || status,
    variant: 'slate',
  };

  const displayText = label || config.label;

  const styleVariants = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    cyan: 'bg-sky-50 text-sky-700 border-sky-200',
    slate: 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border-[var(--line)]',
  };

  const dotVariants = {
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    cyan: 'bg-sky-600',
    slate: 'bg-[var(--text-muted)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors',
        styleVariants[config.variant],
        className
      )}
    >
      {showDot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full inline-block', dotVariants[config.variant])}
        />
      )}
      <span>{displayText}</span>
    </span>
  );
};
