import React from 'react';
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
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-xl bg-surface-container border border-surface-highlight p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-text-primary">Tiến độ đóng gói tại kho (UC24)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs">
          <div className="p-3 rounded bg-canvas-deep border border-surface-highlight space-y-1">
            <div className="text-text-muted">Kho phụ trách:</div>
            <div className="font-bold text-accent-primary">Trung tâm kho vận linh kiện điện giải TP. Thủ Đức</div>
          </div>
          <div className="space-y-2 text-text-secondary">
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-4 h-4" />
              <span>Xác thực tồn kho khả dụng (@Transactional)</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-300">
              <Clock className="w-4 h-4 animate-spin" />
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
    </div>
  );
};
