import React, { useState, useEffect } from 'react';
import { Download, Eye, RotateCw, Calculator, MessageSquare, TrendingUp, RefreshCw } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { adminService, type AnalyticsOverviewResponse } from '@/features/admin-portal/services/admin.service';

export const AdminAnalyticsPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [analytics, setAnalytics] = useState<AnalyticsOverviewResponse>({
    avgDwellTimeSeconds: 168,
    interact360Percentage: '64.2%',
    calculatorLoanPercentage: '82.5%',
    aiConsultantQueries: 1840,
    aiAverageLatencyMs: 48,
    dwellByCar: [
      { car: 'VinFast VF9 Plus (6 Chỗ)', time: '210s', pct: '95%', color: '#0284C7', favColor: 'Trắng Ngọc Trai' },
      { car: 'VinFast VF8 Plus AWD', time: '185s', pct: '85%', color: '#0EA5E9', favColor: 'Xanh Deep Ocean' },
      { car: 'Hyundai SantaFe Calligraphy', time: '145s', pct: '65%', color: '#38BDF8', favColor: 'Đen Phantom' },
      { car: 'Honda CR-V e:HEV RS', time: '120s', pct: '50%', color: '#94A3B8', favColor: 'Đỏ Lịch Lãm' },
    ],
    aiTrends: [
      { topic: 'Chính sách pin & trạm sạc xe điện', queries: 612, pct: '78%' },
      { topic: 'Dự toán lăn bánh & lãi suất trả góp 5 năm', queries: 489, pct: '62%' },
      { topic: 'Thời hạn bảo hành phụ tùng chính hãng', queries: 324, pct: '41%' },
      { topic: 'Quy trình hoàn hủy cọc giữ xe 72 giờ', queries: 215, pct: '27%' },
    ],
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAnalyticsOverview();
      if (data) {
        setAnalytics(data);
      }
    } catch {
      // Keeps current state gracefully
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

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
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-sm ${
              isDarkMode
                ? 'bg-[#171F33] hover:bg-[#1E293B] text-white border-[#3E4850]/50'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Đồng bộ CSDL</span>
          </button>

          <button
            type="button"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-sm ${
              isDarkMode
                ? 'bg-[#171F33] hover:bg-[#1E293B] text-white border-[#3E4850]/50'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>Xuất Báo Cáo Excel</span>
          </button>
        </div>
      </div>

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
            {analytics.avgDwellTimeSeconds} giây
          </div>
          <div className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Thời gian xem chi tiết xe</span>
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
            {analytics.interact360Percentage}
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
            {analytics.calculatorLoanPercentage}
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
            {analytics.aiConsultantQueries.toLocaleString()} lượt
          </div>
          <div className="text-[11px] text-emerald-500 mt-1 font-mono">
            Độ trễ trung bình: {analytics.aiAverageLatencyMs}ms
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
          <h2 className={`text-sm font-bold uppercase tracking-wider font-mono ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Thời Gian Dừng Xem Trung Bình Theo Mẫu Xe (Dwell Time)
          </h2>
          <div className="space-y-3 pt-2">
            {analytics.dwellByCar.map((item) => (
              <div key={item.car} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.car}</span>
                  <span className={`font-mono ${isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'}`}>
                    {item.time} (Màu ưa chuộng: {item.favColor})
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-100'
                }`}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: item.pct, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Inquiry Trends */}
        <div className={`p-5 rounded-xl border space-y-4 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h2 className={`text-sm font-bold uppercase tracking-wider font-mono ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Chủ Đề Khách Hỏi Trợ Lý Ảo AI Nhiều Nhất (RAG Topics)
          </h2>
          <div className="space-y-3 pt-2">
            {analytics.aiTrends.map((trend) => (
              <div key={trend.topic} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{trend.topic}</span>
                  <span className={`font-mono text-emerald-500`}>{trend.queries} câu hỏi ({trend.pct})</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-100'
                }`}>
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: trend.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
