import React from 'react';
import { Clock, ShieldCheck } from 'lucide-react';

interface DepositSummaryCardProps {
  carVariant: string;
  exteriorColor: string;
  formattedTime: string;
}

export const DepositSummaryCard: React.FC<DepositSummaryCardProps> = ({
  carVariant,
  exteriorColor,
  formattedTime,
}) => {
  return (
    <div className="p-4 rounded-lg bg-[#17223D] border border-[#06B6D4]/20 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2D3449]/60">
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono text-[#88929B] uppercase">PHIÊN BẢN XE</div>
          <div className="font-semibold text-sm text-white">{carVariant}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono text-[#88929B] uppercase">MÀU SẮC NGOẠI THẤT</div>
          <div className="font-semibold text-sm text-[#7BD0FF]">{exteriorColor}</div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00A6E0]/20 border border-[#00A6E0]/40 text-[#7BD0FF] font-mono text-xs font-bold">
          <Clock className="w-3.5 h-3.5 text-[#00A6E0]" />
          <span>Tạm giữ suất: {formattedTime}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="text-[10px] font-mono font-bold text-[#88929B] uppercase">MỨC TIỀN CỌC CỐ ĐỊNH</div>
          <div className="text-xs text-[#89CEFF] font-medium flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cam kết hoàn cọc 100% trong vòng 72h</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-extrabold text-[#89CEFF]">
            20.000.000 <span className="text-xs text-[#DAE2FD] font-normal">VNĐ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
