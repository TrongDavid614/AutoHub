import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Truck, X } from 'lucide-react';
import type { AccessoryOrder } from '@/types/order.types';

interface OrderTrackingModalProps {
  order: AccessoryOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
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
      <div className="w-full max-w-lg rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 shadow-xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-violet-600" />
            <h3 className="text-base font-bold text-[var(--text)]">Hành trình vận chuyển (Bưu chính VIP)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-[var(--surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] flex items-center justify-between text-xs">
            <div>
              <span className="text-[var(--text-muted)]">Mã vận đơn: </span>
              <span className="font-mono font-bold text-[var(--accent)]">{order.trackingNumber}</span>
            </div>
            <div className="text-emerald-700 font-semibold">AutoHub Logistics VIP</div>
          </div>

          {/* Lộ trình bưu cục */}
          <div className="space-y-4 pl-4 border-l-2 border-accent-action ml-2 text-xs">
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-accent-action ring-4 ring-accent-action/20" />
              <div className="font-mono text-accent-primary">14:30 • Hôm nay</div>
              <div className="font-bold text-text-primary">Đang giao hàng tới người nhận</div>
              <div className="text-text-muted">Bưu tá chuyên trách xe điện đang di chuyển tới địa chỉ nhận</div>
            </div>

            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-surface-highlight" />
              <div className="font-mono text-text-muted">08:15 • Hôm nay</div>
              <div className="font-bold text-text-primary">Đã đến bưu cục phát Quận Bình Thạnh</div>
            </div>

            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-surface-highlight" />
              <div className="font-mono text-text-muted">19:00 • Hôm qua</div>
              <div className="font-bold text-text-primary">Xuất kho trung tâm linh kiện TP. Thủ Đức</div>
              <div className="text-text-muted">Đóng gói bọc đệm SiC chống sốc hoàn tất</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-surface-highlight">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-surface-elevated hover:bg-surface-interactive text-xs text-text-primary cursor-pointer transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
