import React from 'react';

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
    <section className="text-center space-y-6 pt-4 pb-2">
      {/* 1. Pulse radar status icon (matching Figma Frame 20:13615) */}
      <div className="flex justify-center items-center">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/94337589215fbf9466ba30883bf50900034f2617?width=192"
          alt="Pulse radar status icon"
          className="w-24 h-24 object-contain animate-pulse"
        />
      </div>

      {/* 2. Badges & Status Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-[12px] bg-[#222A3D] text-[#89CEFF] font-mono text-[10px] font-bold uppercase tracking-[0.5px] shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#89CEFF] animate-ping" />
        <span>ĐÃ THANH TOÁN (PAID) • VNPAY SECURED</span>
      </div>

      {/* 3. Heading 1 */}
      <div className="space-y-3 max-w-[672px] mx-auto">
        <h1 className="text-[32px] sm:text-[40px] md:text-[44px] font-semibold text-[#DAE2FD] tracking-[-1.1px] leading-[1.2] font-sans">
          Đặt hàng & Thanh toán phụ kiện
          <br className="hidden sm:inline" /> thành công!
        </h1>

        <p className="text-[14px] sm:text-[15px] text-[#BEC8D2] max-w-[576px] mx-auto leading-6 font-sans">
          Mã đơn hàng:{' '}
          <strong className="font-mono text-[#89CEFF] font-bold">{orderCode}</strong>
          . Hệ thống AutoHub đã nhận ủy nhiệm thanh toán VNPay và tự động chuyển thông tin sang trung tâm kho vận linh kiện điện giải.
        </p>
      </div>

      {/* 4. Quick Telemetry Micro Strip */}
      <div className="max-w-[420px] mx-auto rounded-[2px] bg-[#171F33] border border-[#2D3449] p-3 grid grid-cols-3 divide-x divide-[#2D3449] text-center text-xs font-mono shadow-md">
        <div className="px-2">
          <div className="text-[10px] text-[#88929B] font-bold uppercase tracking-[1px]">THỜI GIAN</div>
          <div className="font-bold text-[#DAE2FD] mt-0.5">{transactionTime}</div>
        </div>
        <div className="px-2">
          <div className="text-[10px] text-[#88929B] font-bold uppercase tracking-[1px]">GIAO DỊCH</div>
          <div className="font-bold text-[#89CEFF] mt-0.5">{transactionId}</div>
        </div>
        <div className="px-2">
          <div className="text-[10px] text-[#88929B] font-bold uppercase tracking-[1px]">TRẠNG THÁI</div>
          <div className="font-bold text-[#34D399] mt-0.5">Đã duyệt</div>
        </div>
      </div>
    </section>
  );
};
