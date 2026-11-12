import React, { useState, useEffect } from 'react';
import { Package, CreditCard, Calendar } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { orderService } from '@/features/customer/services/order.service';
import { depositService } from '@/features/customer/services/deposit.service';
import { engagementService } from '@/features/customer/services/engagement.service';

export const ProfileStatsCards: React.FC = () => {
  const { user } = useAuthStore();
  const [orderCount, setOrderCount] = useState<number>(2);
  const [depositCount, setDepositCount] = useState<number>(1);
  const [testDriveCount, setTestDriveCount] = useState<number>(2);

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
      <div className="p-4 rounded-[4px] bg-surface-elevated/60 border border-surface-highlight flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-[2px] bg-accent-action/15 flex items-center justify-center text-accent-primary shrink-0">
          <Package className="w-5 h-5 text-accent-primary" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-text-muted uppercase">ĐƠN PHỤ KIỆN</div>
          <div className="text-lg font-bold text-text-primary font-mono">{orderCount.toString().padStart(2, '0')} Đơn hàng</div>
        </div>
      </div>

      <div className="p-4 rounded-[4px] bg-surface-elevated/60 border border-surface-highlight flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-[2px] bg-accent-action/15 flex items-center justify-center text-accent-primary shrink-0">
          <CreditCard className="w-5 h-5 text-accent-primary" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-text-muted uppercase">PHIẾU CỌC XE 72H</div>
          <div className="text-lg font-bold text-accent-primary font-mono">{depositCount.toString().padStart(2, '0')} Đang giữ chỗ</div>
        </div>
      </div>

      <div className="p-4 rounded-[4px] bg-surface-elevated/60 border border-surface-highlight flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-[2px] bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
          <Calendar className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-text-muted uppercase">LỊCH LÁI THỬ DEMO</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">{testDriveCount.toString().padStart(2, '0')} Lịch hẹn</div>
        </div>
      </div>
    </div>
  );
};

