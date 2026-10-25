import React from 'react';
import { Check, Truck, Wrench, Clock } from 'lucide-react';

export const DeliveryTimelineTracker: React.FC = () => {
  return (
    <section className="rounded-[8px] bg-[#171F33] border border-[#2D3449] p-6 sm:p-8 md:p-10 shadow-xl space-y-8">
      {/* 1. Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-[2px] bg-[#89CEFF]/10 flex items-center justify-center text-[#89CEFF] shrink-0">
          <Clock className="w-4 h-4 text-[#89CEFF]" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-lg sm:text-xl font-bold text-[#DAE2FD]">
            Tiến độ xử lý & Dự kiến giao hàng
          </h3>
          <p className="text-xs text-[#88929B]">
            Theo dõi thời gian thực theo mã định danh linh kiện VIN-ACC •{' '}
            <span className="font-mono text-[#89CEFF]">KHO VẬN: TRUNG TÂM PHỤ KIỆN TP. THỦ ĐỨC</span>
          </p>
        </div>
      </div>

      {/* 2. 4-Step Horizontal Timeline */}
      <div className="relative pt-4 pb-2">
        {/* Track Line for Desktop */}
        <div className="absolute top-8 left-6 right-6 h-0.5 bg-[#2D3449] -translate-y-1/2 z-0 hidden md:block">
          {/* Active completed segment (33% filled from Step 1 to Step 2) */}
          <div className="h-full bg-gradient-to-r from-[#89CEFF] to-[#0EA5E9] w-1/3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {/* Step 1: Completed */}
          <div className="flex md:flex-col items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#060E20] border-2 border-[#89CEFF] flex items-center justify-center text-[#89CEFF] shadow-[0_0_12px_rgba(137,206,255,0.4)] shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] text-[#88929B] block">18:30 • 20/10/2026</span>
              <h4 className="text-sm font-bold text-[#DAE2FD]">Đã xác nhận thanh toán</h4>
              <p className="text-xs text-[#88929B]">Giao dịch VNPay thành công</p>
            </div>
          </div>

          {/* Step 2: In-Progress */}
          <div className="flex md:flex-col items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#060E20] border-2 border-[#89CEFF] flex items-center justify-center text-[#89CEFF] shadow-[0_0_16px_rgba(14,165,233,0.5)] shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#89CEFF] animate-ping" />
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] text-[#89CEFF] font-bold uppercase block tracking-wider">
                ĐANG TIẾN HÀNH
              </span>
              <h4 className="text-sm font-bold text-[#DAE2FD]">Đóng gói & Kiểm định SiC</h4>
              <p className="text-xs text-[#88929B]">Lắp chip RFID & chứng nhận xuất xưởng</p>
            </div>
          </div>

          {/* Step 3: Pending */}
          <div className="flex md:flex-col items-start gap-3 opacity-60">
            <div className="w-8 h-8 rounded-full bg-[#060E20] border border-[#3E4850] flex items-center justify-center text-[#88929B] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] text-[#88929B] block">DỰ KIẾN 21/10</span>
              <h4 className="text-sm font-semibold text-[#DAE2FD]">Bàn giao chuyển phát VIP</h4>
              <p className="text-xs text-[#88929B]">Xe chuyên dụng hạ tầng điện</p>
            </div>
          </div>

          {/* Step 4: Pending */}
          <div className="flex md:flex-col items-start gap-3 opacity-60">
            <div className="w-8 h-8 rounded-full bg-[#060E20] border border-[#3E4850] flex items-center justify-center text-[#88929B] shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] text-[#88929B] block">DỰ KIẾN 23/10</span>
              <h4 className="text-sm font-semibold text-[#DAE2FD]">Giao hàng & Lắp đặt</h4>
              <p className="text-xs text-[#88929B]">Kỹ sư AutoHub bàn giao tại nhà</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Special Alert / Delivery Promise Bar */}
      <div className="rounded-[4px] bg-[#060E20] border border-[#2D3449] p-4 space-y-1.5">
        <div className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#89CEFF] uppercase">
          CAM KẾT DỊCH VỤ ĐỘC QUYỀN AUTOHUB
        </div>
        <p className="text-xs text-[#BEC8D2] leading-relaxed font-sans">
          📦 <strong className="text-[#DAE2FD]">Dự kiến giao hàng vào: Thứ Sáu, 23/10/2026.</strong> Chuyên viên kỹ thuật AutoHub sẽ liên hệ trước 60 phút để khảo sát đồng hồ điện và hỗ trợ gắn treo tường an toàn.
        </p>
      </div>
    </section>
  );
};
