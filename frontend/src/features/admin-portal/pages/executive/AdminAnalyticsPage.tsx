import React from 'react';
import { Download, Eye, RotateCw, Calculator, MessageSquare, TrendingUp } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export const AdminAnalyticsPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

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

        <button
          type="button"
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
          <div className={`text-2xl font-bold font-mono mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>168 giây</div>
          <div className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% thời gian xem chi tiết xe</span>
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
          <div className={`text-2xl font-bold font-mono mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>64.2%</div>
          <div className={`text-[11px] mt-1 font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>Khách xem nội & ngoại thất 3D</div>
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
          <div className={`text-2xl font-bold font-mono mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>82.5%</div>
          <div className={`text-[11px] mt-1 font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>Ưa chuộng gói vay 70-80% (5 năm)</div>
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
          <div className={`text-2xl font-bold font-mono mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>1.840 lượt</div>
          <div className="text-[11px] text-emerald-500 mt-1 font-mono">Độ trễ trung bình: 48ms</div>
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
            {[
              { car: 'VinFast VF9 Plus (6 Chỗ)', time: '210s', pct: '95%', color: '#0284C7', favColor: 'Trắng Ngọc Trai' },
              { car: 'VinFast VF8 Plus AWD', time: '185s', pct: '85%', color: '#0EA5E9', favColor: 'Xanh Deep Ocean' },
              { car: 'Hyundai SantaFe Calligraphy', time: '145s', pct: '65%', color: '#38BDF8', favColor: 'Đen Phantom' },
              { car: 'Honda CR-V e:HEV RS', time: '120s', pct: '50%', color: '#94A3B8', favColor: 'Đỏ Lịch Lãm' },
            ].map((item) => (
              <div key={item.car} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.car}</span>
                  <span className={`font-mono ${isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'}`}>{item.time} (Màu yêu thích: {item.favColor})</span>
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
            Chủ Đề Khách Hàng Hỏi Trợ Lý AI Gemini & Vector DB Nhiều Nhất
          </h2>
          <div className="space-y-2.5">
            {[
              { rank: '01', question: 'So sánh chi phí sạc pin xe điện vs tiền đổ xăng hàng tháng', count: '482 lượt hỏi' },
              { rank: '02', question: 'Thủ tục và tổng chi phí đăng ký lăn bánh tại Hà Nội & TP.HCM', count: '394 lượt hỏi' },
              { rank: '03', question: 'Những dòng xe nào đang có sẵn số khung VIN giao ngay trong tuần?', count: '312 lượt hỏi' },
              { rank: '04', question: 'Gói an toàn chủ động ADAS cấp 2 trên VF8 so với SantaFe', count: '286 lượt hỏi' },
              { rank: '05', question: 'Chính sách hoàn cọc giữ xe trong 72 giờ khi ngân hàng từ chối cho vay', count: '198 lượt hỏi' },
            ].map((q) => (
              <div
                key={q.rank}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/40'
                    : 'bg-slate-50 border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${
                    isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'
                  }`}>{q.rank}</span>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{q.question}</span>
                </div>
                <span className={`font-mono text-[11px] flex-shrink-0 ${
                  isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                }`}>{q.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
