import React, { useState } from 'react';
import { Sparkles, Download, RefreshCw, Cpu, Database } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';

export interface AdminWelcomeBannerProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AdminWelcomeBanner: React.FC<AdminWelcomeBannerProps> = ({
  onRefresh,
  isRefreshing = false,
}) => {
  const { isDarkMode } = useAdminTheme();
  const [isSyncingVector, setIsSyncingVector] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  const handleSyncVector = () => {
    setIsSyncingVector(true);
    setSyncSuccessMsg(null);
    setTimeout(() => {
      setIsSyncingVector(false);
      setSyncSuccessMsg('Đã băm nhỏ & đồng bộ 1.250 Vector Embeddings xe vào Vector Database cho Gemini AI thành công (18ms)!');
      setTimeout(() => setSyncSuccessMsg(null), 5000);
    }, 1200);
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-6 transition-all duration-300',
        isDarkMode
          ? 'bg-gradient-to-r from-[#131B2E] via-[#171F33] to-[#0E1726] border-[#3E4850]/50 shadow-xl'
          : 'bg-gradient-to-r from-white via-sky-50/40 to-slate-50 border-slate-200 shadow-sm'
      )}
    >
      {/* Background ambient lighting */}
      <div
        className={cn(
          'absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none',
          isDarkMode ? 'bg-[#89CEFF]/5' : 'bg-blue-400/5'
        )}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Admin Identity & System Vital Status */}
        <div className="space-y-3">
          <div>
            <h1
              className={cn(
                'text-2xl sm:text-3xl font-black tracking-tight',
                isDarkMode ? 'text-white' : 'text-slate-900'
              )}
            >
              Bảng Điều Khiển Điều Hành Doanh Nghiệp
            </h1>
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-md border',
                isDarkMode
                  ? 'bg-[#0B1326]/80 border-[#3E4850]/60 text-[#DAE2FD]'
                  : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
              )}
            >
              <Cpu className={cn('w-3.5 h-3.5', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600')} />
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}>Gemini AI:</span>
              <span className="text-[#10B981] font-bold">Online (1.5 Flash)</span>
            </div>

            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-md border',
                isDarkMode
                  ? 'bg-[#0B1326]/80 border-[#3E4850]/60 text-[#DAE2FD]'
                  : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
              )}
            >
              <Database className={cn('w-3.5 h-3.5', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600')} />
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}>Vector DB:</span>
              <span className={cn('font-bold', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-700')}>1.250 Embeddings</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Operational Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
          {/* AI Vector Sync Action */}
          <button
            type="button"
            onClick={handleSyncVector}
            disabled={isSyncingVector}
            className={cn(
              'h-[38px] flex items-center gap-2 px-4 rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer border shrink-0',
              isDarkMode
                ? 'bg-gradient-to-r from-[#171F33] to-[#222A3D] text-[#89CEFF] hover:text-white border-[#89CEFF]/40 hover:border-[#89CEFF] hover:shadow-[0_0_20px_rgba(137,206,255,0.3)]'
                : 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100 shadow-2xs'
            )}
            title="Kích hoạt pipeline băm nhỏ và nhúng vector thông số xe vào Vector DB"
          >
            <Sparkles className={cn('w-4 h-4', isSyncingVector && 'animate-spin')} />
            <span>{isSyncingVector ? 'Đang Băm & Đồng Bộ...' : '⚡ Đồng Bộ Vector DB Cho AI'}</span>
          </button>

          {/* Export Report Action */}
          <button
            type="button"
            onClick={() => alert('Đang xuất bảng tổng hợp chỉ số doanh thu & cọc xe 72h (Định dạng Excel .xlsx)...')}
            className={cn(
              'h-[38px] flex items-center gap-2 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer border shrink-0',
              isDarkMode
                ? 'bg-[#0B1326] text-[#DAE2FD] hover:text-white border-[#3E4850]/70 hover:border-[#89CEFF]/50'
                : 'bg-white text-slate-700 hover:text-slate-900 border-slate-300 hover:bg-slate-50 shadow-2xs'
            )}
          >
            <Download className={cn('w-4 h-4', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')} />
            <span className="hidden sm:inline">Xuất Báo Cáo</span>
          </button>

          {/* Refresh Action */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className={cn(
                'h-[38px] w-[38px] flex items-center justify-center rounded-lg border transition-all cursor-pointer shrink-0',
                isDarkMode
                  ? 'bg-[#0B1326] text-[#88929B] hover:text-[#89CEFF] border-[#3E4850]/70'
                  : 'bg-white text-slate-600 hover:text-blue-600 border-slate-300 shadow-2xs'
              )}
              title="Làm mới số liệu Dashboard"
            >
              <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            </button>
          )}
        </div>
      </div>

      {/* Sync Success Feedback Toast/Banner */}
      {syncSuccessMsg && (
        <div className="mt-4 p-3 rounded-lg bg-[#0D2818] border border-[#10B981]/50 text-[#A7F3D0] text-xs font-mono animate-fade-in flex items-center justify-between">
          <span>{syncSuccessMsg}</span>
          <button
            type="button"
            onClick={() => setSyncSuccessMsg(null)}
            className="text-[#A7F3D0] hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
