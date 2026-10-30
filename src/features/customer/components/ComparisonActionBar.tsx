import React from 'react';
import { SlidersHorizontal, Download, Eye } from 'lucide-react';

interface ComparisonActionBarProps {
  onlyDifferences: boolean;
  onToggleDifferences: () => void;
  onExportPdf: () => void;
}

export const ComparisonActionBar: React.FC<ComparisonActionBarProps> = ({
  onlyDifferences,
  onToggleDifferences,
  onExportPdf,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-surface-container border border-surface-highlight shadow-sm">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
        <span className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">
          3/3 Phiên Bản Đang So Sánh Trực Diện
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onToggleDifferences}
          className={`py-2 px-3.5 rounded text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
            onlyDifferences
              ? 'bg-accent-action text-accent-contrast border-accent-primary shadow-[0_0_15px_rgba(14,165,233,0.3)]'
              : 'bg-surface-elevated text-text-secondary hover:text-text-primary border-surface-highlight hover:border-surface-interactive'
          }`}
        >
          {onlyDifferences ? (
            <Eye className="w-3.5 h-3.5 text-accent-contrast" />
          ) : (
            <SlidersHorizontal className="w-3.5 h-3.5 text-accent-primary" />
          )}
          <span>{onlyDifferences ? 'Hiển thị tất cả thông số' : 'Chỉ hiển thị điểm khác biệt'}</span>
        </button>

        <button
          type="button"
          onClick={onExportPdf}
          className="py-2 px-3.5 rounded bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight hover:border-accent-primary/40 text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-accent-primary" />
          <span>Xuất PDF</span>
        </button>
      </div>
    </div>
  );
};
