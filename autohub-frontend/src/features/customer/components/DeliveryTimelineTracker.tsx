import React from 'react';
import { Check, Truck, Wrench, Clock } from 'lucide-react';

export const DeliveryTimelineTracker: React.FC = () => {
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
            Theo dõi theo mã định danh linh kiện VIN-ACC •{' '}
            <span className="font-medium text-[var(--accent)]">Kho vận: Trung tâm Phụ kiện TP. Thủ Đức</span>
          </p>
        </div>
      </div>

      {/* 2. 4-Step Horizontal Timeline */}
      <div className="relative pt-4 pb-2">
        {/* Track Line for Desktop */}
        <div className="absolute top-8 left-6 right-6 h-0.5 bg-[var(--line)] -translate-y-1/2 z-0 hidden md:block">
          {/* Active completed segment */}
          <div className="h-full bg-[var(--accent)] w-1/3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {/* Step 1: Completed */}
          <div className="flex md:flex-col items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shrink-0">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[var(--text-muted)] tabular-nums block">18:30 • 20/10/2026</span>
              <h4 className="text-sm font-semibold text-[var(--text)]">Đã xác nhận thanh toán</h4>
              <p className="text-xs text-[var(--text-muted)]">Giao dịch SePay thành công</p>
            </div>
          </div>

          {/* Step 2: In-Progress */}
          <div className="flex md:flex-col items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--surface)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[var(--accent)] font-semibold block">
                Đang tiến hành
              </span>
              <h4 className="text-sm font-semibold text-[var(--text)]">Đóng gói & Kiểm định SiC</h4>
              <p className="text-xs text-[var(--text-muted)]">Lắp chip RFID & chứng nhận xuất xưởng</p>
            </div>
          </div>

          {/* Step 3: Pending */}
          <div className="flex md:flex-col items-start gap-3 opacity-65">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-subtle)] border border-[var(--line)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[var(--text-muted)] tabular-nums block">Dự kiến 21/10</span>
              <h4 className="text-sm font-semibold text-[var(--text)]">Bàn giao chuyển phát</h4>
              <p className="text-xs text-[var(--text-muted)]">Xe chuyên dụng hạ tầng điện</p>
            </div>
          </div>

          {/* Step 4: Pending */}
          <div className="flex md:flex-col items-start gap-3 opacity-65">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-subtle)] border border-[var(--line)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[var(--text-muted)] tabular-nums block">Dự kiến 23/10</span>
              <h4 className="text-sm font-semibold text-[var(--text)]">Giao hàng & Lắp đặt</h4>
              <p className="text-xs text-[var(--text-muted)]">Kỹ sư AutoHub bàn giao tại nhà</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Delivery Promise Bar */}
      <div className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] p-4 space-y-1">
        <div className="text-xs font-semibold text-[var(--accent)]">
          Cam kết dịch vụ AutoHub
        </div>
        <p className="text-xs text-[var(--text-2)] leading-relaxed">
          <strong className="text-[var(--text)]">Dự kiến giao hàng vào: Thứ Sáu, 23/10/2026.</strong> Chuyên viên kỹ thuật AutoHub sẽ liên hệ trước 60 phút để khảo sát đồng hồ điện và hỗ trợ gắn treo tường an toàn.
        </p>
      </div>
    </section>
  );
};
