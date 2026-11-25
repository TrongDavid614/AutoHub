import React from 'react';
import { ShieldCheck, Check, ArrowRight, Lock, Clock, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DepositPolicyCard: React.FC = () => {
  const navigate = useNavigate();

  const handleDeposit = () => {
    navigate('/customer/deposit-records');
  };

  return (
    <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)]">
              Chính sách đặt cọc giữ xe 72 giờ
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">Hoàn tiền 100% trong 72h nếu bạn thay đổi quyết định</p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Hoàn cọc 72h
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)]">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--accent)] text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>20 triệu giữ xe</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Giữ suất xe và số khung VIN trong 72 giờ với mức giá niêm yết.
          </p>
        </div>

        <div className="pt-3 sm:pt-0 sm:pl-4 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Hoàn tiền 100%</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Hủy cọc trong vòng 72h được hoàn trọn vẹn không mất phí.
          </p>
        </div>

        <div className="pt-3 sm:pt-0 sm:pl-4 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Xử lý 24 – 48h</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Chuyển khoản hoàn cọc nhanh về tài khoản của bạn.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--line)] flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hợp đồng điện tử rõ ràng</span>
        </div>

        <button
          type="button"
          onClick={handleDeposit}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <span>Đặt cọc giữ xe</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
