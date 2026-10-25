import React from 'react';
import { Download, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SuccessActionMatrix: React.FC = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 pb-2">
      {/* Button 1: Download PDF */}
      <button
        type="button"
        onClick={handlePrint}
        className="h-[52px] px-6 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3850] text-[#DAE2FD] text-[13px] font-semibold tracking-[0.65px] uppercase flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] active:scale-[0.99]"
      >
        <Download className="w-4 h-4 text-[#89CEFF]" />
        <span>TẢI HÓA BIÊN LAI (PDF)</span>
      </button>

      {/* Button 2: Continue Shopping */}
      <button
        type="button"
        onClick={() => navigate('/accessories')}
        className="h-[52px] px-6 rounded-[2px] bg-[#131B2E] hover:bg-[#1A253D] border border-[#2D3449]/80 text-[#DAE2FD] text-[13px] font-semibold tracking-[0.65px] uppercase flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
      >
        <ShoppingBag className="w-4 h-4 text-[#7BD0FF]" />
        <span>TIẾP TỤC MUA PHỤ KIỆN</span>
      </button>

      {/* Button 3: Hub Tracking CTA (Primary Glow) */}
      <button
        type="button"
        onClick={() => navigate('/customer/orders')}
        className="h-[52px] px-8 rounded-[2px] bg-[#0EA5E9] hover:bg-[#38BDF8] text-[#00344D] text-[13px] font-bold tracking-[0.65px] uppercase flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-[0_10px_15px_-3px_rgba(137,206,255,0.30),0_4px_6px_-4px_rgba(137,206,255,0.30)] active:scale-[0.99]"
      >
        <span>THEO DÕI TẠI HUB KHÁCH HÀNG</span>
        <ArrowRight className="w-4 h-4 text-[#00344D]" />
      </button>
    </div>
  );
};
