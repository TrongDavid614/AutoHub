import React from 'react';
import { cn } from '../lib/utils';

export interface Column<T> {
  key: string;
  title: string;
  render?: (record: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  dataSource: T[];
  rowKey: (item: T) => string | number;
  className?: string;
  emptyText?: string;
}

export function Table<T>({
  columns,
  dataSource,
  rowKey,
  className,
  emptyText = 'Không có dữ liệu hiển thị',
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto border border-slate-200 rounded-lg', className)}>
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={cn('px-4 py-3', col.className)}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {dataSource.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            dataSource.map((record) => (
              <tr key={rowKey(record)} className="hover:bg-slate-50/80 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3', col.className)}>
                    {col.render ? col.render(record) : (record as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
