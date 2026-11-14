import React, { useState, useEffect, useCallback } from 'react';
import {
  Download,
  Eye,
  RotateCw,
  Calculator,
  MessageSquare,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Inbox,
  BarChart3,
  Bot,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import { adminAnalyticsService } from '../../services/admin-analytics.service';
import type { AnalyticsOverviewData } from '@/types/admin-analytics.types';

export const AdminAnalyticsPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [data, setData] = useState<AnalyticsOverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAnalyticsService.getOverview();
      setData(res);
    } catch (err) {
      console.error('[AdminAnalytics] Lỗi tải dữ liệu telemetry:', err);
      setError('Không thể kết nối đến máy chủ để tải dữ liệu phân tích hành vi người dùng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportCsv = () => {
    if (!data) return;
    const rows = [
      ['Chỉ Số Phân Tích', 'Giá Trị'],
      ['Dwell Time Trung Bình (giây)', String(data.avgDwellTimeSeconds)],
      ['Tỷ lệ Tương tác Xoay 360°', data.interact360Percentage],
      ['Tỷ lệ Dùng Dự toán Lăn bánh', data.calculatorLoanPercentage],
      ['Số lượt Hỏi đáp Trợ lý AI', String(data.aiConsultantQueries)],
      ['Độ trễ AI Trung bình (ms)', String(data.aiAverageLatencyMs)],
      [],
      ['Mẫu Xe', 'Thời Gian Dwell', 'Tỷ Lệ %', 'Màu Sắc Quan Tâm Nhất'],
      ...(data.dwellByCar ?? []).map((c) => [c.car, c.time, c.pct, c.favColor]),
      [],
      ['Chủ Đề AI RAG Phổ Biến', 'Số Lượt Hỏi', 'Tỷ Lệ %'],
      ...(data.aiTrends ?? []).map((t) => [t.topic, String(t.queries), t.pct]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      rows.map((row) => row.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `autohub_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isEmpty = !loading && !error && (!data || ((data.dwellByCar ?? []).length === 0 && (data.aiTrends ?? []).length === 0));

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300 pb-12',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* 1. Header & Controls */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Báo Cáo Phân Tích Hành Vi & Telemetry Người Dùng
          </h1>
          <p className={cn('text-xs mt-1', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Tổng hợp dữ liệu thực tế từ CSDL AutoHubDB: thời gian ngắm xe (Dwell Time), tần suất xoay 360°, tính năng dự toán lăn bánh và xu hướng câu hỏi AI RAG.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={loading}
            title="Làm mới dữ liệu"
            className={cn(
              'p-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/40 text-[#88929B] hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            )}
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={loading || !data}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-sm',
              isDarkMode
                ? 'bg-[#171F33] hover:bg-[#1E293B] text-white border-[#3E4850]/50'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300',
              (loading || !data) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>Xuất Báo Cáo CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'p-4 rounded-xl border animate-pulse space-y-3',
                  isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
                )}
              >
                <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-8 w-20 bg-slate-300 dark:bg-slate-700 rounded" />
                <div className="h-2 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'p-6 rounded-xl border animate-pulse space-y-4',
                  isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
                )}
              >
                <div className="h-4 w-48 bg-slate-300 dark:bg-slate-700 rounded" />
                <div className="space-y-3 pt-2">
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Error Alert State */}
      {!loading && error && (
        <div
          className={cn(
            'p-8 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-colors',
            isDarkMode
              ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          )}
        >
          <AlertTriangle className="w-8 h-8 text-rose-500" />
          <div className="text-sm font-semibold">{error}</div>
          <p className="text-xs opacity-80">Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau giây lát.</p>
          <button
            type="button"
            onClick={fetchAnalytics}
            className="flex items-center gap-1.5 px-4 py-2 mt-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại (Retry)</span>
          </button>
        </div>
      )}

      {/* 4. Empty State */}
      {isEmpty && (
        <div
          className={cn(
            'p-16 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-colors',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <div className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Chưa có dữ liệu hành vi người dùng
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Chưa ghi nhận đủ nhật ký telemetry để phân tích. Dữ liệu sẽ tự động xuất hiện khi khách truy cập vào sàn và tương tác với xe.
          </p>
          <button
            type="button"
            onClick={fetchAnalytics}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 mt-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer',
              isDarkMode
                ? 'border-[#3E4850]/50 hover:bg-[#1E293B] text-slate-300'
                : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            )}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>
        </div>
      )}

      {/* 5. Real Data View */}
      {!loading && !error && data && !isEmpty && (
        <>
          {/* 4 Overview Indicator Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={cn(
                'p-4 rounded-xl border transition-colors',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
              )}
            >
              <div className={cn('flex items-center justify-between text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                <span>Dwell Time Trung Bình</span>
                <Eye className="w-4 h-4 text-blue-500" />
              </div>
              <div className={cn('text-2xl font-bold font-mono mt-2', isDarkMode ? 'text-white' : 'text-slate-900')}>
                {data.avgDwellTimeSeconds ?? 0} giây
              </div>
              <div className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Thời gian xem chi tiết sản phẩm</span>
              </div>
            </div>

            <div
              className={cn(
                'p-4 rounded-xl border transition-colors',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
              )}
            >
              <div className={cn('flex items-center justify-between text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                <span>Tương Tác Xoay 360°</span>
                <RotateCw className="w-4 h-4 text-blue-500" />
              </div>
              <div className={cn('text-2xl font-bold font-mono mt-2', isDarkMode ? 'text-white' : 'text-slate-900')}>
                {data.interact360Percentage || '0.0%'}
              </div>
              <div className={cn('text-[11px] mt-1 font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                Khách xem nội & ngoại thất 3D
              </div>
            </div>

            <div
              className={cn(
                'p-4 rounded-xl border transition-colors',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
              )}
            >
              <div className={cn('flex items-center justify-between text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                <span>Dùng Dự Toán Lăn Bánh</span>
                <Calculator className="w-4 h-4 text-blue-500" />
              </div>
              <div className={cn('text-2xl font-bold font-mono mt-2', isDarkMode ? 'text-white' : 'text-slate-900')}>
                {data.calculatorLoanPercentage || '0.0%'}
              </div>
              <div className={cn('text-[11px] mt-1 font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                Ưa chuộng gói vay 70-80% (5 năm)
              </div>
            </div>

            <div
              className={cn(
                'p-4 rounded-xl border transition-colors',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
              )}
            >
              <div className={cn('flex items-center justify-between text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                <span>Tư Vấn Qua AI RAG</span>
                <MessageSquare className="w-4 h-4 text-blue-500" />
              </div>
              <div className={cn('text-2xl font-bold font-mono mt-2', isDarkMode ? 'text-white' : 'text-slate-900')}>
                {data.aiConsultantQueries ?? 0} lượt
              </div>
              <div className="text-[11px] text-emerald-500 mt-1 font-mono">
                Độ trễ trung bình: {data.aiAverageLatencyMs ?? 0}ms
              </div>
            </div>
          </div>

          {/* Main Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dwell Time Analysis */}
            <div
              className={cn(
                'p-5 rounded-xl border space-y-4 transition-colors',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <h3 className={cn('text-sm font-bold uppercase font-mono tracking-wider', isDarkMode ? 'text-white' : 'text-slate-900')}>
                    Xếp Hạng Thời Gian Dừng Xem (Dwell Time)
                  </h3>
                </div>
                <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>Theo Mẫu Xe</span>
              </div>

              <div className="space-y-3">
                {(data.dwellByCar ?? []).map((item) => (
                  <div key={item.car} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={cn('font-medium', isDarkMode ? 'text-white' : 'text-slate-800')}>{item.car}</span>
                      <span className={cn('font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        {item.time} ({item.pct})
                      </span>
                    </div>
                    <div className={cn('h-2 rounded-full overflow-hidden', isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-100')}>
                      <div className={cn('h-full rounded-full', item.color)} style={{ width: item.pct }} />
                    </div>
                    <div className={cn('text-[10px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                      Màu được ngắm lâu nhất:{' '}
                      <strong className={isDarkMode ? 'text-white' : 'text-slate-700'}>{item.favColor}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant Topics Analysis */}
            <div
              className={cn(
                'p-5 rounded-xl border space-y-4 transition-colors',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-500" />
                  <h3 className={cn('text-sm font-bold uppercase font-mono tracking-wider', isDarkMode ? 'text-white' : 'text-slate-900')}>
                    Xu Hướng Chủ Đề Khách Hỏi Trợ Lý AI RAG
                  </h3>
                </div>
                <span className="text-xs text-purple-500 font-mono font-bold">Top Chủ Đề</span>
              </div>

              <div className="space-y-3">
                {(data.aiTrends ?? []).map((trend) => (
                  <div
                    key={trend.topic}
                    className={cn(
                      'p-3 rounded-lg border transition-colors',
                      isDarkMode
                        ? 'bg-[#131B2E]/50 border-[#3E4850]/30 hover:bg-[#131B2E]'
                        : 'bg-slate-50/80 border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={cn('font-medium', isDarkMode ? 'text-white' : 'text-slate-900')}>{trend.topic}</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-[#89CEFF]">{trend.pct}</span>
                    </div>
                    <div className={cn('text-[10px] mt-1 font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                      {trend.queries} lượt đặt câu hỏi ngữ nghĩa
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
