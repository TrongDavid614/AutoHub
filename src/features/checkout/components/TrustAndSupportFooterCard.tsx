import React from 'react';
import { Phone, Zap, ShieldCheck } from 'lucide-react';

export const TrustAndSupportFooterCard: React.FC = () => {
  return (
    <div className="rounded-[4px] bg-[#131B2E] border border-[#2D3449] p-6 shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2D3449] gap-4 md:gap-0">
      {/* Block 1 */}
      <div className="flex items-center gap-3.5 md:px-4 first:pl-0">
        <div className="w-10 h-10 rounded-[2px] bg-[#222A3D] border border-[#2D3449] flex items-center justify-center text-[#89CEFF] shrink-0">
          <Phone className="w-5 h-5 text-[#89CEFF]" />
        </div>
        <div>
          <div className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
            VIP CONCIERGE HOTLINE
          </div>
          <a
            href="tel:19008888"
            className="font-mono text-sm font-bold text-[#DAE2FD] hover:text-[#89CEFF] transition-colors"
          >
            1900 8888 (24/7)
          </a>
        </div>
      </div>

      {/* Block 2 */}
      <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:px-6">
        <div className="w-10 h-10 rounded-[2px] bg-[#222A3D] border border-[#2D3449] flex items-center justify-center text-[#89CEFF] shrink-0">
          <Zap className="w-5 h-5 text-[#89CEFF]" />
        </div>
        <div>
          <div className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
            CỨU HỘ & KỸ THUẬT LƯU ĐỘNG
          </div>
          <p className="text-xs font-semibold text-[#DAE2FD]">
            Hỗ trợ đo kiểm & sạc lưu động 24h
          </p>
        </div>
      </div>

      {/* Block 3 */}
      <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:px-6 last:pr-0">
        <div className="w-10 h-10 rounded-[2px] bg-[#222A3D] border border-[#2D3449] flex items-center justify-center text-[#89CEFF] shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#89CEFF]" />
        </div>
        <div>
          <div className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
            BẢO CHỨNG OEM 100%
          </div>
          <p className="text-xs font-semibold text-[#DAE2FD]">
            Bảo hành điện tử 3 năm 1 đổi 1
          </p>
        </div>
      </div>
    </div>
  );
};
