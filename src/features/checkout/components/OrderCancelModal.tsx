import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { AccessoryOrder } from '@/types/order.types';

interface OrderCancelModalProps {
  order: AccessoryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
}

export const OrderCancelModal: React.FC<OrderCancelModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirmCancel,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-xl bg-surface-container border border-surface-highlight p-6 shadow-2xl relative">
        <div className="flex items-center gap-3 text-rose-400 pb-3 border-b border-surface-highlight">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <h3 className="text-base font-bold text-text-primary">Xác nhận hủy đơn hàng</h3>
        </div>

        <div className="py-4 space-y-2 text-xs text-text-secondary">
          <p>
            Bạn có chắc chắn muốn hủy đơn hàng <strong className="text-accent-primary">{order.orderCode}</strong> không?
          </p>
          <p className="text-text-muted">
            Hệ thống sẽ giải phóng suất giữ hàng và hoàn lại số lượng tồn kho theo quy tắc nghiệp vụ BR04 & UC34.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-highlight">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-surface-elevated text-xs text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
          >
            Không, giữ đơn
          </button>
          <button
            type="button"
            onClick={onConfirmCancel}
            className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md cursor-pointer transition-colors"
          >
            Xác nhận hủy đơn
          </button>
        </div>
      </div>
    </div>
  );
};
