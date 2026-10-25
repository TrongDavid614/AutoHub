import React from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const CartSubHeaderBanner: React.FC = () => {
  return (
    <section className="relative w-full bg-[#060E20] pt-8 pb-6 px-4 md:px-8 overflow-hidden border-b border-[#2D3449]/70">
      {/* Ambient Blue Glow Accent */}
      <div className="pointer-events-none absolute left-1/3 -top-24 w-96 h-72 rounded-full bg-[#0EA5E9]/10 blur-[80px]" />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Page Heading & OEM Cert Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-[#DAE2FD] tracking-tight">
                Giỏ hàng & Thanh toán
              </h1>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#222A3D] border border-[#2D3449] text-[#89CEFF] font-mono text-[10px] font-bold tracking-[1.5px] uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-[#89CEFF]" />
                <span>100% OEM • TƯƠNG THÍCH CHUẨN GT-E</span>
              </div>
            </div>
            <p className="text-sm text-[#BEC8D2] max-w-2xl leading-relaxed">
              Kiểm tra danh mục cấu hình phụ kiện cao cấp và lựa chọn phương thức giao nhận kèm kỹ thuật viên chuẩn phi hành đoàn AutoHub.
            </p>
          </div>
        </div>

        {/* Installation Privilege Notification Strip */}
        <div className="rounded-[2px] bg-[#222A3D] border border-[#2D3449] p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[2px] bg-[#0EA5E9]/20 flex items-center justify-center flex-shrink-0 text-[#89CEFF]">
              <UserCheck className="w-4 h-4 text-[#89CEFF]" />
            </div>
            <div className="text-xs text-[#DAE2FD] leading-relaxed">
              <strong className="text-[#89CEFF] font-semibold">Đặc quyền Mobile Service: </strong>
              <span>
                Đơn hàng đủ điều kiện nhận dịch vụ kỹ thuật viên lắp đặt tận nhà miễn phí trong 24h đối với hệ thống trạm sạc cao cấp.
              </span>
            </div>
          </div>

          <span className="inline-flex items-center px-2.5 py-1 rounded-[2px] bg-[#060E20] border border-[#3E4850] text-[#89CEFF] font-mono text-[10px] font-bold tracking-wider uppercase shrink-0">
            TIÊU CHUẨN 24H
          </span>
        </div>
      </div>
    </section>
  );
};
