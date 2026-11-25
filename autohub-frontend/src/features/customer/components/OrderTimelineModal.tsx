import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Package, Check, Clock, Truck, X } from 'lucide-react';
import type { AccessoryOrder } from '@/types/order.types';

interface OrderTimelineModalProps {
  order: AccessoryOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTimelineModal: React.FC<OrderTimelineModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45"
    >
      <div className="w-full max-w-md rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 shadow-xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-base font-bold text-[var(--text)]">Tiến độ đóng gói tại kho</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-[var(--surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] space-y-1">
            <div className="text-[var(--text-muted)]">Kho phụ trách:</div>
            <div className="font-semibold text-[var(--accent)]">Trung tâm kho vận linh kiện điện giải TP. Thủ Đức</div>
          </div>
          <div className="space-y-2 text-[var(--text-2)]">
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <Check className="w-4 h-4" />
              <span>Xác thực tồn kho khả dụng (@Transactional)</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--accent)] font-medium">
              <Clock className="w-4 h-4" />
              <span>Đang gắn chip định danh RFID & kiểm tra thông mạch SiC</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <Truck className="w-4 h-4" />
              <span>Dự kiến bàn giao xe chuyên dụng trong 2 - 4 giờ tới</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-surface-highlight">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-surface-elevated text-xs text-text-primary hover:bg-surface-interactive cursor-pointer transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
