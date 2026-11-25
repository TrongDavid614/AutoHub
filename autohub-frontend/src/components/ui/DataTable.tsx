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
      {enableSelection && selectedKeys.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--accent-soft)] border border-[var(--accent)]/30 rounded-lg text-xs">
          <div className="flex items-center gap-2 text-[var(--text)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span>
              Đã chọn <strong className="font-semibold tabular-nums">{selectedKeys.length}</strong> hàng
            </span>
            <button
              type="button"
              onClick={() => onSelectionChange?.([])}
              className="ml-2 text-[var(--text-secondary)] hover:text-[var(--text)] underline cursor-pointer text-[11px]"
            >
              Bỏ chọn tất cả
            </button>
          </div>
          {bulkActions && <div className="flex items-center gap-2">{bulkActions(selectedKeys)}</div>}
        </div>
      )}

      {/* TABLE CONTAINER */}
      <div className="w-full overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-[var(--text)]">
            {/* TABLE HEADER */}
            <thead className="bg-[var(--surface-subtle)] border-b border-[var(--line)] text-xs font-semibold text-[var(--text-secondary)]">
              <tr>
                {enableSelection && (
                  <th className="w-10 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isAllCurrentPageSelected}
                      onChange={handleSelectAll}
                      className="rounded border-[var(--line-strong)] bg-[var(--surface)] text-[var(--accent)] focus:ring-[var(--accent)] w-3.5 h-3.5 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={cn('px-4 py-3 select-none', col.className)}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors cursor-pointer group"
                      >
                        <span>{col.title}</span>
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-[var(--accent)]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-[var(--accent)]" />
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
            <tbody className="divide-y divide-[var(--line)] bg-[var(--surface)]">
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    {enableSelection && (
                      <td className="px-4 py-4 text-center">
                        <div className="w-3.5 h-3.5 bg-[var(--surface-subtle)] rounded mx-auto" />
                      </td>
                    )}
                    {columns.map((_, cIdx) => (
                      <td key={cIdx} className="px-4 py-4">
                        <div
                          className="h-3.5 bg-[var(--surface-subtle)] rounded"
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
                    className="px-4 py-14 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-3 bg-[var(--surface-subtle)] rounded-full border border-[var(--line)] text-[var(--text-muted)]">
                        <Inbox className="w-7 h-7" />
                      </div>
                      <p className="text-sm font-semibold text-[var(--text)]">{emptyText}</p>
                      <p className="text-xs text-[var(--text-muted)]">{emptySubtext}</p>
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
                        isSelected
                          ? 'bg-[var(--accent-soft)]'
                          : 'hover:bg-[var(--surface-subtle)]',
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
                            className="rounded border-[var(--line-strong)] bg-[var(--surface)] text-[var(--accent)] focus:ring-[var(--accent)] w-3.5 h-3.5 cursor-pointer"
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
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-[var(--line)] bg-[var(--surface-subtle)] gap-3 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-3">
              <span className="tabular-nums">
                Hiển thị{' '}
                <strong className="text-[var(--text)]">
                  {Math.min((safeCurrentPage - 1) * pageSize + 1, totalItems)} -{' '}
                  {Math.min(safeCurrentPage * pageSize, totalItems)}
                </strong>{' '}
                trên <strong className="text-[var(--text)]">{totalItems}</strong> bản ghi
              </span>

              <div className="flex items-center gap-1.5 pl-3 border-l border-[var(--line)]">
                <span>Số hàng:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-[var(--surface)] border border-[var(--line-strong)] rounded px-2 py-1 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
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
              <span className="text-[var(--text-secondary)] mr-2 tabular-nums">
                Trang <strong className="text-[var(--text)]">{safeCurrentPage}</strong> / {totalPages}
              </span>

              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-1.5 rounded border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-secondary)] transition-colors"
                  title="Trang đầu"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-secondary)] transition-colors"
                  title="Trang trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-secondary)] transition-colors"
                  title="Trang sau"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-1.5 rounded border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-secondary)] transition-colors"
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
