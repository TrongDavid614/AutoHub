import React from 'react';
import { Headphones, RefreshCw, Award } from 'lucide-react';

export const TrustAndSupportFooterCard: React.FC = () => {
  return (
    <div className="rounded-[8px] bg-[#060E20]/80 border border-[#2D3449] p-6 shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#222A3D] gap-6 md:gap-0">
      {/* Block 1: VIP Concierge 24/7 */}
      <div className="flex items-center gap-4 md:px-4 first:pl-0">
        <div className="w-10 h-10 rounded-[12px] bg-[#171F33] flex items-center justify-center text-[#89CEFF] shrink-0">
          <Headphones className="w-[18px] h-[18px] text-[#89CEFF]" />
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#BEC8D2] uppercase">
            VIP CONCIERGE 24/7
          </div>
          <a
            href="tel:19008888"
            className="font-mono text-[18px] font-bold text-[#DAE2FD] hover:text-[#89CEFF] transition-colors block leading-tight"
          >
            1900 8888
          </a>
          <p className="text-[13px] text-[#BEC8D2] leading-tight">
            Hỗ trợ ưu tiên phụ kiện điện hóa
          </p>
        </div>
      </div>

      {/* Block 2: Chính sách linh hoạt */}
      <div className="flex items-center gap-4 pt-6 md:pt-0 md:px-6">
        <div className="w-10 h-10 rounded-[12px] bg-[#171F33] flex items-center justify-center text-[#89CEFF] shrink-0">
          <RefreshCw className="w-[18px] h-[18px] text-[#89CEFF]" />
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#BEC8D2] uppercase">
            CHÍNH SÁCH LINH HOẠT
          </div>
          <h4 className="text-[15px] font-semibold text-[#DAE2FD] leading-tight">
            1 Đổi 1 Trong 30 Ngày
          </h4>
          <p className="text-[13px] text-[#BEC8D2] leading-tight">
            Lỗi phần cứng hoặc không tương thích xe
          </p>
        </div>
      </div>

      {/* Block 3: Bảo hành chính hãng */}
      <div className="flex items-center gap-4 pt-6 md:pt-0 md:px-6 last:pr-0">
        <div className="w-10 h-10 rounded-[12px] bg-[#171F33] flex items-center justify-center text-[#89CEFF] shrink-0">
          <Award className="w-[18px] h-[18px] text-[#89CEFF]" />
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#BEC8D2] uppercase">
            BẢO HÀNH CHÍNH HÃNG
          </div>
          <h4 className="text-[15px] font-semibold text-[#DAE2FD] leading-tight">
            03 Năm Tiêu Chuẩn Toàn Cầu
          </h4>
          <p className="text-[13px] text-[#BEC8D2] leading-tight">
            Đồng bộ tự động cùng hồ sơ xe điện AutoHub
          </p>
        </div>
      </div>
    </div>
  );
};
