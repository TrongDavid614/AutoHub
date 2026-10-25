import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface SuccessHeroBannerProps {
  orderCode: string;
  transactionTime: string;
  transactionId: string;
}

export const SuccessHeroBanner: React.FC<SuccessHeroBannerProps> = ({
  orderCode,
  transactionTime,
  transactionId,
}) => {
  return (
    <section className="text-center space-y-6 pt-6">
      {/* Badges & Status Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] font-mono text-xs font-bold uppercase tracking-wider shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
        <span>ĐÃ THANH TOÁN (PAID) • VNPAY SECURED</span>
      </div>

      {/* Heading 1 & Pulse Icon */}
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#0EA5E9]/20 border border-[#89CEFF] flex items-center justify-center mx-auto text-[#89CEFF] shadow-[0_0_30px_rgba(14,165,233,0.3)]">
          <CheckCircle2 className="w-8 h-8 text-[#89CEFF]" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#DAE2FD] tracking-tight leading-tight">
          Đặt hàng & Thanh toán phụ kiện
          <br className="hidden sm:inline" /> thành công!
        </h1>

        <p className="text-sm text-[#BEC8D2] max-w-xl mx-auto leading-relaxed">
          Mã đơn hàng: <strong className="font-mono text-[#89CEFF]">{orderCode}</strong>. Hệ thống AutoHub đã nhận ủy nhiệm thanh toán VNPay và tự động chuyển thông tin sang trung tâm kho vận linh kiện điện giải.
        </p>
      </div>

      {/* Quick Telemetry Micro Strip */}
      <div className="max-w-md mx-auto rounded-[2px] bg-[#171F33] border border-[#2D3449] p-3 grid grid-cols-3 divide-x divide-[#2D3449] text-center text-xs font-mono">
        <div>
          <div className="text-[10px] text-[#88929B] uppercase">THỜI GIAN</div>
          <div className="font-bold text-[#DAE2FD] mt-0.5">{transactionTime}</div>
        </div>
        <div>
          <div className="text-[10px] text-[#88929B] uppercase">GIAO DỊCH</div>
          <div className="font-bold text-[#89CEFF] mt-0.5">{transactionId}</div>
        </div>
        <div>
          <div className="text-[10px] text-[#88929B] uppercase">TRẠNG THÁI</div>
          <div className="font-bold text-[#34D399] mt-0.5">Đã duyệt</div>
        </div>
      </div>
    </section>
  );
};
