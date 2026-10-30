import React from 'react';
import { Cpu, Database, CreditCard, Clock, Activity } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export const SystemMonitorPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  const auditLogs = [
    {
      time: '2026-10-29 14:48:12',
      module: 'AI_RAG',
      operator: 'Khách vãng lai (118.69.12.44)',
      action: 'Truy vấn ngữ nghĩa Gemini API & Vector DB',
      result: 'Similarity: 0.91 (22ms)',
      status: 'success',
    },
    {
      time: '2026-10-29 14:45:00',
      module: 'SEPAY_WEBHOOK',
      operator: 'SePay Webhook (my.sepay.vn)',
      action: 'Giao dịch cọc xe #DEP-8841 (20.000.000 ₫)',
      result: 'RspCode: 00 (Thành công)',
      status: 'success',
    },
    {
      time: '2026-10-29 14:32:18',
      module: 'STAFF_ACTION',
      operator: 'STF-004 (Nguyễn Văn Tuấn)',
      action: 'Gán số khung VIN: VF8-VIN-2026-9921 cho phiếu #DEP-8835',
      result: '200 OK (Đã khóa xe)',
      status: 'success',
    },
    {
      time: '2026-10-29 14:30:00',
      module: 'CRON_JOB',
      operator: 'System Daemon Scheduler',
      action: 'Quét tự động phiếu cọc 72h (Đã cảnh báo 4 phiếu)',
      result: '0 Lỗi (Tác vụ hoàn tất)',
      status: 'success',
    },
  ];

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
            Giám Sát Vận Hành, Nhật Ký Kiểm Toán & Cụm Trí Tuệ Nhân Tạo
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Theo dõi tình trạng kết nối Google Gemini API Cloud, Vector Database RAG, tiến trình lập lịch Cron Job và nhật ký giao dịch SePay Webhook.
          </p>
        </div>
      </div>

      {/* 4 Health Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gemini API Health */}
        <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Gemini AI API</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF]'
                : 'bg-sky-50 text-blue-600 border border-sky-100'
            }`}>
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Gemini 1.5 Pro (Active)</div>
              <div className={`text-[11px] font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Endpoint: generativelanguage.googleapis.com</div>
            </div>
          </div>
          <div className="pt-1 text-[11px] text-emerald-500 font-mono">
            Độ trễ: 380ms (Cloud API Latency)
          </div>
        </div>

        {/* Vector DB */}
        <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Vector Database</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF]'
                : 'bg-purple-50 text-purple-600 border border-purple-100'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Vector DB Store</div>
              <div className={`text-[11px] font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>1.250 Embeddings</div>
            </div>
          </div>
          <div className="pt-1 text-[11px] text-emerald-500 font-mono">
            Độ trễ Cosine: 18ms (&lt; 50ms)
          </div>
        </div>

        {/* SePay Webhook */}
        <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Cổng Thanh Toán</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF]'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>SePay Webhook Live</div>
              <div className={`text-[11px] font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>HMAC-SHA512 Verified</div>
            </div>
          </div>
          <div className="pt-1 text-[11px] text-emerald-500 font-mono">
            Tỷ lệ thành công: 99.8%
          </div>
        </div>

        {/* Cron Jobs */}
        <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Bộ Lập Lịch Cron Job</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF]'
                : 'bg-amber-50 text-amber-600 border border-amber-100'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>3 Tác Vụ Ngầm</div>
              <div className={`text-[11px] font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Quét cọc 72h: 60s/lần</div>
            </div>
          </div>
          <div className="pt-1 text-[11px] text-blue-500 font-mono">
            Lần quét kế: Còn 24 giây
          </div>
        </div>
      </div>

      {/* Real-time Audit Trail Table */}
      <div className={`rounded-xl border overflow-hidden space-y-3 p-5 transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <Activity className="w-4 h-4 text-blue-500" />
            <span>Nhật Ký Kiểm Toán Thời Gian Thực (Audit Trail Log)</span>
          </h2>
          <span className="text-xs font-mono text-emerald-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Tự động làm mới mỗi 10 giây
          </span>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className={`font-mono uppercase text-[11px] border-b ${
              isDarkMode
                ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                : 'bg-slate-50/80 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="py-2.5 px-3">Thời Gian</th>
                <th className="py-2.5 px-3">Phân Hệ</th>
                <th className="py-2.5 px-3">Người / Tác Nhân</th>
                <th className="py-2.5 px-3">Nội Dung Thao Tác</th>
                <th className="py-2.5 px-3">Kết Quả Phản Hồi</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-sans ${
              isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
            }`}>
              {auditLogs.map((log, idx) => (
                <tr key={idx} className={`transition-colors ${
                  isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                }`}>
                  <td className={`py-2.5 px-3 font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{log.time}</td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isDarkMode
                        ? 'bg-[#171F33] text-[#89CEFF] border-[#3E4850]/50'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {log.module}
                    </span>
                  </td>
                  <td className={`py-2.5 px-3 font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{log.operator}</td>
                  <td className={`py-2.5 px-3 ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700'}`}>{log.action}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-500 font-semibold">{log.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
