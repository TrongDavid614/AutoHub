import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminCarService } from '../services/admin-car.service';

export interface AdminWelcomeBannerProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AdminWelcomeBanner: React.FC<AdminWelcomeBannerProps> = ({
  onRefresh,
  isRefreshing = false,
}) => {
  const [isSyncingVector, setIsSyncingVector] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  const handleSyncVector = async () => {
    if (isSyncingVector) return;
    setIsSyncingVector(true);
    setSyncSuccessMsg(null);
    try {
      const res = await adminCarService.syncVectorDb();
      setSyncSuccessMsg(res.message || 'Đã đồng bộ vector database cho AI thành công!');
      setTimeout(() => setSyncSuccessMsg(null), 6000);
    } catch (err: unknown) {
      console.error('Vector sync error:', err);
      const msg = err instanceof Error ? err.message : 'Lỗi đồng bộ vector database cho AI';
      setSyncSuccessMsg('Đồng bộ thất bại: ' + msg);
      setTimeout(() => setSyncSuccessMsg(null), 6000);
    } finally {
      setIsSyncingVector(false);
    }
  };

  return (
    <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-5 transition-colors">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
            Tổng quan điều hành AutoHub
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Theo dõi doanh thu, dòng tiền cọc xe 72 giờ và trạng thái vận hành hệ thống.
          </p>
        </div>

        {/* Utility Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleSyncVector}
            disabled={isSyncingVector}
            className="h-9 inline-flex items-center gap-2 px-3.5 rounded-lg text-xs font-medium bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)] border border-[var(--line-strong)] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
            title="Đồng bộ dữ liệu thông số xe cho trợ lý tư vấn"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 text-[var(--accent)]', isSyncingVector && 'animate-spin')} />
            <span>{isSyncingVector ? 'Đang đồng bộ...' : 'Đồng bộ dữ liệu AI'}</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Đang xuất bảng tổng hợp chỉ số doanh thu & cọc xe 72h (Định dạng Excel .xlsx)...')}
            className="h-9 inline-flex items-center gap-2 px-3.5 rounded-lg text-xs font-medium bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)] border border-[var(--line-strong)] transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span className="hidden sm:inline">Xuất báo cáo</span>
          </button>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer shrink-0"
              title="Làm mới số liệu"
            >
              <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            </button>
          )}
        </div>
      </div>

      {/* Sync Feedback Banner */}
      {syncSuccessMsg && (
        <div className="mt-4 px-3.5 py-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)] text-xs flex items-center justify-between">
          <span>{syncSuccessMsg}</span>
          <button
            type="button"
            onClick={() => setSyncSuccessMsg(null)}
            className="text-[var(--text-muted)] hover:text-[var(--text)] ml-2 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
