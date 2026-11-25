import React from 'react';
import { Bot } from 'lucide-react';

export const AiHeader: React.FC = () => {
  return (
    <div className="w-full rounded-lg bg-[var(--surface)] border border-[var(--line)] p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[var(--text)] tracking-tight">
              Trợ lý tư vấn chọn xe AutoHub
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Hỏi về dòng xe, giá lăn bánh, tồn kho showroom hoặc phụ kiện phù hợp.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          Sẵn sàng hỗ trợ
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[var(--text-secondary)]">
        <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subtle)] border border-[var(--line)]">
          Tra cứu thông số &amp; giá thực tế
        </span>
        <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subtle)] border border-[var(--line)]">
          Ước tính chi phí lăn bánh
        </span>
        <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subtle)] border border-[var(--line)]">
          Kiểm tra tồn kho showroom
        </span>
        <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subtle)] border border-[var(--line)]">
          Tư vấn đặt cọc giữ xe 72h
        </span>
      </div>
    </div>
  );
};
