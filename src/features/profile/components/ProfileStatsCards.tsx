import React from 'react';
import { Package, CreditCard, Calendar } from 'lucide-react';

export const ProfileStatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-[4px] bg-surface-elevated/60 border border-surface-highlight flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-[2px] bg-accent-action/15 flex items-center justify-center text-accent-primary shrink-0">
          <Package className="w-5 h-5 text-accent-primary" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-text-muted uppercase">ĐƠN PHỤ KIỆN</div>
          <div className="text-lg font-bold text-text-primary font-mono">08 Đơn hàng</div>
        </div>
      </div>

      <div className="p-4 rounded-[4px] bg-surface-elevated/60 border border-surface-highlight flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-[2px] bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
          <CreditCard className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-text-muted uppercase">PHIẾU CỌC XE 72H</div>
          <div className="text-lg font-bold text-amber-400 font-mono">01 Đang giữ chỗ</div>
        </div>
      </div>

      <div className="p-4 rounded-[4px] bg-surface-elevated/60 border border-surface-highlight flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-[2px] bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
          <Calendar className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-text-muted uppercase">LỊCH LÁI THỬ DEMO</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">02 Đã hoàn tất</div>
        </div>
      </div>
    </div>
  );
};
