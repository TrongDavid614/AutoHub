import React from 'react';
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
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl bg-surface-container border border-surface-highlight p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-text-primary">Hành trình vận chuyển (Bưu chính VIP)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className="p-3 rounded bg-canvas-deep border border-surface-highlight flex items-center justify-between text-xs">
            <div>
              <span className="text-text-muted">Mã vận đơn: </span>
              <span className="font-mono font-bold text-accent-primary">{order.trackingNumber}</span>
            </div>
            <div className="text-emerald-400 font-bold">AutoHub Logistics VIP</div>
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
    </div>
  );
};
