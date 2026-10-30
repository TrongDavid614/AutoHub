import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DataColumn<T> {
  key: string;
  title: string;
  render?: (record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string;
}

export interface DataTableProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  rowKey: (item: T) => string | number;
  isLoading?: boolean;
  emptyText?: string;
  emptySubtext?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  enableSelection?: boolean;
  selectedKeys?: (string | number)[];
  onSelectionChange?: (selectedKeys: (string | number)[]) => void;
  bulkActions?: (selectedKeys: (string | number)[]) => React.ReactNode;
  className?: string;
  onRowClick?: (record: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyText = 'Không tìm thấy dữ liệu phù hợp',
  emptySubtext = 'Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm',
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  enableSelection = false,
  selectedKeys = [],
  onSelectionChange,
  bulkActions,
  className,
  onRowClick,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sorting logic
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDirection === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [data, sortKey, sortDirection]);

  // Pagination logic
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, safeCurrentPage, pageSize]);

  // Selection logic
  const isAllCurrentPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedKeys.includes(rowKey(item)));

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (isAllCurrentPageSelected) {
      const pageKeys = paginatedData.map((item) => rowKey(item));
      onSelectionChange(selectedKeys.filter((k) => !pageKeys.includes(k)));
    } else {
      const pageKeys = paginatedData.map((item) => rowKey(item));
      const newSelected = Array.from(new Set([...selectedKeys, ...pageKeys]));
      onSelectionChange(newSelected);
    }
  };

  const handleSelectRow = (key: string | number) => {
    if (!onSelectionChange) return;
    if (selectedKeys.includes(key)) {
      onSelectionChange(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedKeys, key]);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* BULK ACTIONS TOOLBAR (inspired by shadcn-admin-kit) */}
      {enableSelection && selectedKeys.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border border-red-500/30 rounded-xl text-xs shadow-md">
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>
              Đã chọn <strong className="text-white font-bold">{selectedKeys.length}</strong> hàng
            </span>
            <button
              type="button"
              onClick={() => onSelectionChange?.([])}
              className="ml-2 text-slate-400 hover:text-white underline cursor-pointer text-[11px]"
            >
              Bỏ chọn tất cả
            </button>
          </div>
          {bulkActions && <div className="flex items-center gap-2">{bulkActions(selectedKeys)}</div>}
        </div>
      )}

      {/* TABLE CONTAINER */}
      <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            {/* TABLE HEADER */}
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                {enableSelection && (
                  <th className="w-10 px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={isAllCurrentPageSelected}
                      onChange={handleSelectAll}
                      className="rounded border-slate-700 bg-slate-900 text-red-600 focus:ring-red-500 w-3.5 h-3.5 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={cn('px-4 py-3.5 select-none', col.className)}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
                      >
                        <span>{col.title}</span>
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-red-500" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-red-500" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    ) : (
                      <span>{col.title}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-slate-800/60 bg-slate-900">
              {isLoading ? (
                // SKELETON LOADING
                Array.from({ length: pageSize }).map((_, rIdx) => (
                  <tr key={rIdx} className="animate-pulse">
                    {enableSelection && (
                      <td className="px-4 py-4 text-center">
                        <div className="w-3.5 h-3.5 bg-slate-800 rounded mx-auto" />
                      </td>
                    )}
                    {columns.map((_, cIdx) => (
                      <td key={cIdx} className="px-4 py-4">
                        <div
                          className="h-3.5 bg-slate-800 rounded"
                          style={{ width: `${60 + ((rIdx + cIdx) % 4) * 10}%` }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                // EMPTY STATE
                <tr>
                  <td
                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                    className="px-4 py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-3 bg-slate-800/80 rounded-full border border-slate-700/60 text-slate-400">
                        <Inbox className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-semibold text-slate-300">{emptyText}</p>
                      <p className="text-xs text-slate-500">{emptySubtext}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // DATA ROWS
                paginatedData.map((record, index) => {
                  const key = rowKey(record);
                  const isSelected = selectedKeys.includes(key);

                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick?.(record)}
                      className={cn(
                        'transition-colors duration-150',
                        isSelected ? 'bg-red-950/20 hover:bg-red-950/30' : 'hover:bg-slate-800/50',
                        onRowClick && 'cursor-pointer'
                      )}
                    >
                      {enableSelection && (
                        <td
                          className="px-4 py-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(key)}
                            className="rounded border-slate-700 bg-slate-900 text-red-600 focus:ring-red-500 w-3.5 h-3.5 cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className={cn('px-4 py-3 align-middle', col.className)}>
                          {col.render
                            ? col.render(record, index)
                            : (record[col.key] as React.ReactNode)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {!isLoading && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-800/80 bg-slate-950/40 gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span>
                Hiển thị{' '}
                <strong className="text-slate-200">
                  {Math.min((safeCurrentPage - 1) * pageSize + 1, totalItems)} -{' '}
                  {Math.min(safeCurrentPage * pageSize, totalItems)}
                </strong>{' '}
                trên <strong className="text-slate-200">{totalItems}</strong> bản ghi
              </span>

              <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
                <span>Số hàng:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 mr-2">
                Trang <strong className="text-white">{safeCurrentPage}</strong> / {totalPages}
              </span>

              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-1.5 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                  title="Trang đầu"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                  title="Trang trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                  title="Trang sau"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-1.5 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                  title="Trang cuối"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
