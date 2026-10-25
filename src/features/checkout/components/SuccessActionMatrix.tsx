import React from 'react';
import { Download, ShoppingBag, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SuccessActionMatrix: React.FC = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Button 1: Download PDF */}
      <button
        type="button"
        onClick={handlePrint}
        className="py-3.5 px-4 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] hover:border-[#89CEFF] text-[#DAE2FD] text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
      >
        <Download className="w-4 h-4 text-[#89CEFF]" />
        <span>TẢI BIÊN LAI (PDF)</span>
      </button>

      {/* Button 2: Continue Shopping */}
      <button
        type="button"
        onClick={() => navigate('/accessories')}
        className="py-3.5 px-4 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] hover:border-[#89CEFF] text-[#DAE2FD] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
      >
        <ShoppingBag className="w-4 h-4 text-[#89CEFF]" />
        <span>KHÁM PHÁ SHOWROOM</span>
      </button>

      {/* Button 3: Hub Tracking CTA (Primary Glow) */}
      <button
        type="button"
        onClick={() => navigate('/customer/orders')}
        className="py-3.5 px-4 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(137,206,255,0.5)] active:scale-[0.98]"
      >
        <span>THEO DÕI ĐƠN HÀNG</span>
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
};
