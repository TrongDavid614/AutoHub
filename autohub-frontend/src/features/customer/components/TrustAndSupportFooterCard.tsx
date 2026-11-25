import React from 'react';
import { Headphones, RefreshCw, Award } from 'lucide-react';

export const TrustAndSupportFooterCard: React.FC = () => {
  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--line)] gap-6 md:gap-0">
      {/* Block 1: Concierge 24/7 */}
      <div className="flex items-center gap-4 md:px-4 first:pl-0">
        <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
          <Headphones className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="text-xs font-medium text-[var(--text-muted)]">
            Hỗ trợ khách hàng 24/7
          </div>
          <a
            href="tel:19008888"
            className="text-lg font-bold tabular-nums text-[var(--text)] hover:text-[var(--accent)] transition-colors block leading-tight"
          >
            1900 8888
          </a>
          <p className="text-xs text-[var(--text-2)] leading-tight">
            Tư vấn ưu tiên phụ kiện điện hóa
          </p>
        </div>
      </div>

      {/* Block 2: Chính sách linh hoạt */}
      <div className="flex items-center gap-4 pt-6 md:pt-0 md:px-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="text-xs font-medium text-[var(--text-muted)]">
            Chính sách linh hoạt
          </div>
          <h4 className="text-sm font-semibold text-[var(--text)] leading-tight">
            1 Đổi 1 Trong 30 Ngày
          </h4>
          <p className="text-xs text-[var(--text-2)] leading-tight">
            Lỗi phần cứng hoặc không tương thích xe
          </p>
        </div>
      </div>

      {/* Block 3: Bảo hành chính hãng */}
      <div className="flex items-center gap-4 pt-6 md:pt-0 md:px-6 last:pr-0">
        <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="text-xs font-medium text-[var(--text-muted)]">
            Bảo hành chính hãng
          </div>
          <h4 className="text-sm font-semibold text-[var(--text)] leading-tight">
            3 Năm Tiêu Chuẩn Toàn Cầu
          </h4>
          <p className="text-xs text-[var(--text-2)] leading-tight">
            Đồng bộ tự động cùng hồ sơ xe điện AutoHub
          </p>
        </div>
      </div>
    </div>
  );
};
