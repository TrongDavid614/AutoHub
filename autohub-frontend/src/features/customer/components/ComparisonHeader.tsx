import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';

export interface ComparisonHeaderProps {
  title?: string;
  subtitle?: string;
  categoryLabel?: string;
}

export const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({
  title = 'Bàn Cân So Sánh Đối Đầu AutoHub GT-e Series',
  subtitle = 'Phân tích chi tiết từng thông số hiệu năng 800V, kích thước khung gầm và hệ thống công nghệ an toàn LiDAR giữa các biến thể đỉnh cao của chuẩn mực di chuyển thông minh.',
  categoryLabel = 'DÒNG XE',
}) => {
  return (
    <div className="space-y-4 pb-2 border-b border-surface-highlight/40">
      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-text-muted">
        <Link
          to="/"
          className="text-text-secondary hover:text-accent-primary transition-colors font-medium uppercase tracking-wider"
        >
          TRANG CHỦ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />
        <Link
          to="/cars"
          className="text-text-secondary hover:text-accent-primary transition-colors font-medium uppercase tracking-wider"
        >
          {categoryLabel}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />
        <span className="text-accent-primary font-bold uppercase tracking-wider">
          BÀN CÂN SO SÁNH ĐỐI ĐẦU
        </span>
      </nav>

      {/* Main Header Block */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-[2px] bg-accent-action/20 border border-accent-primary/30 text-accent-primary font-mono text-[10px] font-bold tracking-wider uppercase">
            SHOWDOWN MATRIX • AUTOHUB ARCHITECTURE 800V
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[10px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bảo hành Pin 8 năm / Vô hạn km</span>
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight leading-tight">
          {title}
        </h1>

        <p className="text-sm text-text-secondary max-w-3xl leading-relaxed mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
