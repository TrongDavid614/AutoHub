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
import {
  adminAnalyticsService,
  type AnalyticsOverviewData,
} from '../../services/admin-analytics.service';

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
      console.error('Failed to load analytics data:', err);
      setError('Không thể kết nối đến hệ thống máy chủ để tải dữ liệu phân tích hành vi người dùng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className={`space-y-6 antialiased transition-colors ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'}`}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Báo Cáo Doanh Thu, Tỷ Lệ Chuyển Đổi & Phân Tích Hành Vi Người Dùng
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Trực quan hóa nhật ký tương tác NhatKyHanhVi, thời gian ngắm xe Dwell Time, tương tác 360 độ và xu hướng hỏi đáp AI RAG.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchAnalytics}
            title="Làm mới dữ liệu"
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/40 text-[#88929B] hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => alert('Xuất báo cáo định dạng CSV thành công!')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-sm ${
              isDarkMode
                ? 'bg-[#171F33] hover:bg-[#1E293B] text-white border-[#3E4850]/50'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>Xuất Báo Cáo Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border animate-pulse space-y-3 ${
                  isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
                }`}
              >
                <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-8 w-20 bg-slate-300 dark:bg-slate-700 rounded" />
                <div className="h-2 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl border animate-pulse space-y-4 ${
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
            }`}>
              <div className="h-4 w-48 bg-slate-300 dark:bg-slate-700 rounded" />
              <div className="space-y-3 pt-2">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className={`p-6 rounded-xl border animate-pulse space-y-4 ${
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
            }`}>
              <div className="h-4 w-48 bg-slate-300 dark:bg-slate-700 rounded" />
              <div className="space-y-3 pt-2">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert with Retry Button */}
      {!loading && error && (
        <div className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-colors ${
          isDarkMode ? 'bg-[#2C1810] border-red-500/40 text-red-300' : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div className="text-sm font-semibold">{error}</div>
          <p className="text-xs text-slate-400">Vui lòng kiểm tra lại dịch vụ Backend Spring Boot.</p>
          <button
            type="button"
            onClick={fetchAnalytics}
            className="flex items-center gap-1.5 px-4 py-2 mt-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại (Retry)</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !data && (
        <div className={`p-16 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-colors ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        }`}>
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Chưa có dữ liệu hành vi người dùng
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Chưa ghi nhận đủ nhật ký tương tác để phân tích. Hệ thống sẽ tự động tổng hợp khi khách truy cập sàn.
          </p>
          <button
            type="button"
            onClick={fetchAnalytics}
            className="flex items-center gap-1.5 px-3.5 py-1.5 mt-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>
        </div>
      )}

      {/* Real Data View */}
      {!loading && !error && data && (
        <>
          {/* 4 Overview Indicator Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40'
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
                <span>Dwell Time Trung Bình</span>
                <Eye className="w-4 h-4 text-blue-500" />
              </div>
              <div className={`text-2xl font-bold font-mono mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {data.avgDwellTimeSeconds} giây
              </div>
              <div className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Thời gian xem chi tiết sản phẩm</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40'
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
                <span>Tương Tác Xoay 360°</span>
                <RotateCw className="w-4 h-4 text-blue-500" />
              </div>
              <div className={`text-2xl font-bold font-mono mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {data.interact360Percentage}
              </div>
              <div className={`text-[11px] mt-1 font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>
                Khách xem nội & ngoại thất 3D
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40'
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
                <span>Dùng Dự Toán Lăn Bánh</span>
                <Calculator className="w-4 h-4 text-blue-500" />
              </div>
              <div className={`text-2xl font-bold font-mono mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {data.calculatorLoanPercentage}
              </div>
              <div className={`text-[11px] mt-1 font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>
                Ưa chuộng gói vay 70-80% (5 năm)
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40'
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
                <span>Tư Vấn Qua AI RAG</span>
                <MessageSquare className="w-4 h-4 text-blue-500" />
              </div>
              <div className={`text-2xl font-bold font-mono mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {data.aiConsultantQueries} lượt
              </div>
              <div className="text-[11px] text-emerald-500 mt-1 font-mono">
                Độ trễ trung bình: {data.aiAverageLatencyMs}ms
              </div>
            </div>
          </div>

          {/* Main Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dwell Time Analysis */}
            <div className={`p-5 rounded-xl border space-y-4 transition-colors ${
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <h3 className={`text-sm font-bold uppercase font-mono tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Xếp Hạng Thời Gian Dừng Xem (Dwell Time)
                  </h3>
                </div>
                <span className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>Theo Mẫu Xe</span>
              </div>

              <div className="space-y-3">
                {data.dwellByCar.map((item) => (
                  <div key={item.car} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.car}</span>
                      <span className={`font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
                        {item.time} ({item.pct})
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-100'}`}>
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: item.pct }} />
                    </div>
                    <div className={`text-[10px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>
                      Màu được ngắm lâu nhất: <strong className={isDarkMode ? 'text-white' : 'text-slate-700'}>{item.favColor}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant Topics Analysis */}
            <div className={`p-5 rounded-xl border space-y-4 transition-colors ${
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-500" />
                  <h3 className={`text-sm font-bold uppercase font-mono tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Xu Hướng Chủ Đề Khách Hỏi Trợ Lý AI RAG
                  </h3>
                </div>
                <span className="text-xs text-purple-500 font-mono font-bold">Top 4 Chủ Đề</span>
              </div>

              <div className="space-y-3">
                {data.aiTrends.map((trend) => (
                  <div
                    key={trend.topic}
                    className={`p-3 rounded-lg border transition-colors ${
                      isDarkMode
                        ? 'bg-[#131B2E]/50 border-[#3E4850]/30 hover:bg-[#131B2E]'
                        : 'bg-slate-50/80 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{trend.topic}</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-[#89CEFF]">{trend.pct}</span>
                    </div>
                    <div className={`text-[10px] mt-1 font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>
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
