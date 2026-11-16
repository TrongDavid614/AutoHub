import React from 'react';
import { ShieldCheck, Check, ArrowRight, Lock, Clock, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DepositPolicyCard: React.FC = () => {
  const navigate = useNavigate();

  const handleDeposit = () => {
    navigate('/customer/deposit-records');
  };

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-[#131B2E] to-[#0E1626] border border-cyan-500/40 shadow-xl text-[#DAE2FD] space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-[#3E4850]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              Chính sách bảo chứng cọc 72 giờ
            </h4>
            <p className="text-xs text-[#88929B]">100% Hoàn tiền không rủi ro cho khách hàng</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          AN TÂM TUYỆT ĐỐI
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-[#0B1326] border border-[#3E4850]/40 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>20 Triệu giữ xe</span>
          </div>
          <p className="text-[11px] text-[#88929B] leading-relaxed">
            Khóa số khung VIN và mức giá niêm yết độc quyền trong 72 giờ.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#0B1326] border border-[#3E4850]/40 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Hoàn tiền 100%</span>
          </div>
          <p className="text-[11px] text-[#88929B] leading-relaxed">
            Hủy cọc bất kỳ lúc nào trong 72h, hoàn trọn vẹn không phí phạt.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#0B1326] border border-[#3E4850]/40 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Xử lý 24 - 48h</span>
          </div>
          <p className="text-[11px] text-[#88929B] leading-relaxed">
            Tự động chuyển khoản ngân hàng nhanh chóng và minh bạch.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-xs text-[#88929B]">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hợp đồng điện tử minh bạch có giá trị pháp lý</span>
        </div>

        <button
          type="button"
          onClick={handleDeposit}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <span>Đặt cọc giữ xe ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
