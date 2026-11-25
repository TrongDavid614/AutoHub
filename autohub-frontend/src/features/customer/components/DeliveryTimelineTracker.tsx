import React from 'react';
import { Check, Truck, Wrench, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { AccessoryOrder } from '@/types/order.types';

export interface DeliveryTimelineTrackerProps {
  order?: AccessoryOrder | null;
}

export const DeliveryTimelineTracker: React.FC<DeliveryTimelineTrackerProps> = ({ order }) => {
  const orderTimeStr = order?.createdAt ? formatDate(order.createdAt) : 'Vừa cập nhật';
  const trackingNumber = order?.trackingNumber || (order?.id ? `AH-EXP-${order.id}` : 'VIN-ACC-LOGISTICS');

  // Xác định trạng thái tiến độ dựa trên status của đơn hàng
  const status = order?.status;
  const isShipping = status === 'SHIPPING';
  const isDelivered = status === 'DELIVERED';
  const isProcessing = status === 'PROCESSING' || (!isShipping && !isDelivered);

  return (
    <section className="rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 space-y-8">
      {/* 1. Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--text)]">
            Tiến độ xử lý & Dự kiến giao hàng
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Mã vận đơn: <span className="font-mono text-[var(--accent)] font-semibold">{trackingNumber}</span> •{' '}
            <span className="font-medium text-[var(--accent)]">
              {order?.donViVanChuyen || 'Trung tâm Phụ kiện AutoHub Logistics'}
            </span>
          </p>
        </div>
      </div>

      {/* 2. 4-Step Horizontal Timeline */}
      <div className="relative pt-4 pb-2">
        {/* Track Line for Desktop */}
        <div className="absolute top-8 left-6 right-6 h-0.5 bg-[var(--line)] -translate-y-1/2 z-0 hidden md:block">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-500"
            style={{
              width: isDelivered ? '100%' : isShipping ? '66%' : isProcessing ? '33%' : '15%',
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {/* Step 1: Completed */}
          <div className="flex md:flex-col items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shrink-0">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[var(--text-muted)] tabular-nums block">{orderTimeStr}</span>
              <h4 className="text-sm font-semibold text-[var(--text)]">Đã tiếp nhận đơn</h4>
              <p className="text-xs text-[var(--text-muted)]">Hệ thống đã lưu thông tin</p>
            </div>
          </div>

          {/* Step 2: In-Progress or Done */}
          <div className="flex md:flex-col items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isShipping || isDelivered
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--surface)] border-2 border-[var(--accent)] text-[var(--accent)]'
              }`}
            >
              {isShipping || isDelivered ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
              )}
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[var(--accent)] font-semibold block">
                {isShipping || isDelivered ? 'Đã hoàn tất' : 'Đang xử lý'}
              </span>
              <h4 className="text-sm font-semibold text-[var(--text)]">Đóng gói & Kiểm định</h4>
              <p className="text-xs text-[var(--text-muted)]">Kiểm định chuẩn SiC & dán tem</p>
            </div>
          </div>

          {/* Step 3: Pending or Done */}
          <div className={`flex md:flex-col items-start gap-3 ${!isShipping && !isDelivered ? 'opacity-65' : ''}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isDelivered
                  ? 'bg-[var(--accent)] text-white'
                  : isShipping
                  ? 'bg-[var(--surface)] border-2 border-[var(--accent)] text-[var(--accent)]'
                  : 'bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text-muted)]'
              }`}
            >
              {isDelivered ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Truck className="w-4 h-4" />
              )}
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[var(--text-muted)] tabular-nums block">
                {isShipping ? 'Đang giao' : 'Dự kiến 24–48h'}
              </span>
              <h4 className="text-sm font-semibold text-[var(--text)]">Bàn giao vận chuyển</h4>
              <p className="text-xs text-[var(--text-muted)]">Xe chuyên dụng hạ tầng phụ kiện</p>
            </div>
          </div>

          {/* Step 4: Pending or Done */}
          <div className={`flex md:flex-col items-start gap-3 ${!isDelivered ? 'opacity-65' : ''}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isDelivered
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text-muted)]'
              }`}
            >
              {isDelivered ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Wrench className="w-4 h-4" />}
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[var(--text-muted)] tabular-nums block">
                {isDelivered ? 'Đã nhận hàng' : 'Bàn giao'}
              </span>
              <h4 className="text-sm font-semibold text-[var(--text)]">Giao hàng thành công</h4>
              <p className="text-xs text-[var(--text-muted)]">Kỹ thuật viên hỗ trợ kiểm tra</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Delivery Promise Bar */}
      <div className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] p-4 space-y-1">
        <div className="text-xs font-semibold text-[var(--accent)]">
          Cam kết dịch vụ hậu mãi AutoHub
        </div>
        <p className="text-xs text-[var(--text-2)] leading-relaxed">
          Đơn hàng được giao tới <strong className="text-[var(--text)]">{order?.shippingAddress || 'địa chỉ quý khách đã chọn'}</strong>. Quý khách được quyền đồng kiểm ngoại quan và kích hoạt bảo hành điện tử chính hãng AutoHub OEM ngay khi nhận kiện hàng.
        </p>
      </div>
    </section>
  );
};
