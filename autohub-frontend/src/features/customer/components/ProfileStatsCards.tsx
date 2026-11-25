import React, { useState, useEffect } from 'react';
import { Package, CreditCard, Calendar } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { orderService } from '@/features/customer/services/order.service';
import { depositService } from '@/features/customer/services/deposit.service';
import { engagementService } from '@/features/customer/services/engagement.service';

export const ProfileStatsCards: React.FC = () => {
  const { user } = useAuthStore();
  const [orderCount, setOrderCount] = useState<number>(0);
  const [depositCount, setDepositCount] = useState<number>(0);
  const [testDriveCount, setTestDriveCount] = useState<number>(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const [orders, deposits, testDrives] = await Promise.all([
          orderService.getMyOrders(user?.id),
          depositService.getMyDeposits(user?.id),
          engagementService.getMyTestDrives(user?.id),
        ]);
        if (orders) setOrderCount(orders.length);
        if (deposits) setDepositCount(deposits.length);
        if (testDrives) setTestDriveCount(testDrives.length);
      } catch {
        // fallback to defaults
      }
    }
    loadStats();
  }, [user?.id]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--line)] flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-[var(--text-muted)]">Đơn phụ kiện</div>
          <div className="text-lg font-bold text-[var(--text)] tabular-nums">
            {orderCount.toString().padStart(2, '0')} đơn hàng
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--line)] flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-[var(--text-muted)]">Phiếu cọc xe 72h</div>
          <div className="text-lg font-bold text-[var(--accent)] tabular-nums">
            {depositCount.toString().padStart(2, '0')} phiếu cọc
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--line)] flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-[var(--text-muted)]">Lịch lái thử</div>
          <div className="text-lg font-bold text-emerald-700 tabular-nums">
            {testDriveCount.toString().padStart(2, '0')} lịch hẹn
          </div>
        </div>
      </div>
    </div>
  );
};

