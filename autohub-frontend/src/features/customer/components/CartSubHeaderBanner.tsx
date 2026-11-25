import React from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const CartSubHeaderBanner: React.FC = () => {
  return (
    <section className="w-full bg-[var(--surface)] pt-6 pb-5 px-4 md:px-8 border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--text)] tracking-tight">
            Giỏ hàng &amp; thanh toán
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Kiểm tra sản phẩm đã chọn, địa chỉ giao nhận và phương thức thanh toán.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] shrink-0">
          <UserCheck className="w-4 h-4 text-[var(--accent)]" />
          <span>Hỗ trợ lắp đặt tận nơi trong 24h cho trạm sạc</span>
          <ShieldCheck className="w-4 h-4 text-emerald-600 ml-2" />
        </div>
      </div>
    </section>
  );
};
