import React from 'react';
import { Download, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SuccessActionMatrix: React.FC = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 pb-2">
      {/* Button 1: Download PDF */}
      <button
        type="button"
        onClick={handlePrint}
        className="h-12 px-5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)] text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <Download className="w-4 h-4 text-[var(--accent)]" />
        <span>Tải biên lai (PDF)</span>
      </button>

      {/* Button 2: Continue Shopping */}
      <button
        type="button"
        onClick={() => navigate('/accessories')}
        className="h-12 px-5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)] text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <ShoppingBag className="w-4 h-4 text-[var(--text-2)]" />
        <span>Tiếp tục mua phụ kiện</span>
      </button>

      {/* Button 3: Hub Tracking Primary CTA */}
      <button
        type="button"
        onClick={() => navigate('/customer/orders')}
        className="h-12 px-6 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <span>Theo dõi tại Hub khách hàng</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
