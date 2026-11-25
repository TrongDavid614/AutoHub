import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';

export interface AdminPaginationProps {
  currentPage: number; // 0-indexed (0 is page 1)
  pageSize: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  className?: string;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  pageSize,
  totalElements,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  isLoading = false,
  className,
}) => {
  const { isDarkMode } = useAdminTheme();

  if (totalElements <= 0 && totalPages <= 1) {
    return null;
  }

  const from = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const to = Math.min((currentPage + 1) * pageSize, totalElements);

  // Generate pagination items
  const getPageNumbers = (): (number | 'ellipsis-left' | 'ellipsis-right')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const pages: (number | 'ellipsis-left' | 'ellipsis-right')[] = [];
    pages.push(0); // First page

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);

    if (start > 1) {
      pages.push('ellipsis-left');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 2) {
      pages.push('ellipsis-right');
    }

    pages.push(totalPages - 1); // Last page
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const isFirst = currentPage <= 0;
  const isLast = currentPage >= totalPages - 1;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 rounded-xl border transition-colors',
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 text-[#DAE2FD]'
          : 'bg-white border-slate-200 text-slate-700 shadow-xs',
        className
      )}
    >
      {/* 1. Summary details */}
      <div className="flex items-center gap-3 text-xs">
        <span className={cn(isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
          Hiển thị{' '}
          <strong className={cn(isDarkMode ? 'text-white' : 'text-slate-800')}>
            {from} - {to}
          </strong>{' '}
          trên tổng số{' '}
          <strong className={cn(isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600')}>
            {totalElements}
          </strong>{' '}
          bản ghi
        </span>

        {/* Page size dropdown */}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l pl-3 border-slate-700/40">
            <label
              htmlFor="pageSizeSelect"
              className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}
            >
              Mỗi trang:
            </label>
            <select
              id="pageSizeSelect"
              value={pageSize}
              disabled={isLoading}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Số bản ghi mỗi trang"
              className={cn(
                'px-2 py-1 rounded-lg text-xs font-medium border transition-colors outline-hidden cursor-pointer',
                isDarkMode
                  ? 'bg-[#171F33] border-[#3E4850]/60 text-white focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-blue-500'
              )}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / trang
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 2. Navigation controls */}
      <div className="flex items-center gap-1">
        {/* First page button */}
        <button
          type="button"
          onClick={() => onPageChange(0)}
          disabled={isFirst || isLoading}
          title="Trang đầu"
          aria-label="Trang đầu"
          className={cn(
            'p-1.5 rounded-lg border text-xs transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed',
            isDarkMode
              ? 'bg-[#171F33] border-[#3E4850]/50 text-slate-300 hover:bg-[#1E293B] hover:text-white'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          )}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous page button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst || isLoading}
          title="Trang trước"
          aria-label="Trang trước"
          className={cn(
            'p-1.5 rounded-lg border text-xs transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed',
            isDarkMode
              ? 'bg-[#171F33] border-[#3E4850]/50 text-slate-300 hover:bg-[#1E293B] hover:text-white'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map((p, idx) => {
            if (p === 'ellipsis-left' || p === 'ellipsis-right') {
              return (
                <span
                  key={`${p}-${idx}`}
                  className={cn('px-2 py-1 text-xs select-none', isDarkMode ? 'text-slate-500' : 'text-slate-400')}
                >
                  •••
                </span>
              );
            }

            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                disabled={isLoading || isActive}
                aria-label={`Trang ${p + 1}`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer',
                  isActive
                    ? isDarkMode
                      ? 'bg-[#171F33] border-[#89CEFF] text-[#89CEFF]'
                      : 'bg-blue-50 border-blue-500 text-blue-600'
                    : isDarkMode
                      ? 'bg-transparent border-[#3E4850]/40 text-[#88929B] hover:bg-[#171F33] hover:text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                {p + 1}
              </button>
            );
          })}
        </div>

        {/* Next page button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast || isLoading}
          title="Trang tiếp theo"
          aria-label="Trang tiếp theo"
          className={cn(
            'p-1.5 rounded-lg border text-xs transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed',
            isDarkMode
              ? 'bg-[#171F33] border-[#3E4850]/50 text-slate-300 hover:bg-[#1E293B] hover:text-white'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page button */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={isLast || isLoading}
          title="Trang cuối"
          aria-label="Trang cuối"
          className={cn(
            'p-1.5 rounded-lg border text-xs transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed',
            isDarkMode
              ? 'bg-[#171F33] border-[#3E4850]/50 text-slate-300 hover:bg-[#1E293B] hover:text-white'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          )}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
