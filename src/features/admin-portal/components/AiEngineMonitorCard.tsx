import React from 'react';
import { Cpu, Database, ShieldCheck, Timer, CheckCircle2, Zap } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { MOCK_AI_ENGINE_STATUS, type AiEngineStatus } from '../mocks/dashboard.mock';

export interface AiEngineMonitorCardProps {
  status?: AiEngineStatus;
}

export const AiEngineMonitorCard: React.FC<AiEngineMonitorCardProps> = ({
  status = MOCK_AI_ENGINE_STATUS,
}) => {
  const { isDarkMode } = useAdminTheme();

  return (
    <div className={`rounded-xl border p-6 transition-colors ${
      isDarkMode
        ? 'bg-[#131B2E] border-[#3E4850]/50 shadow-xl'
        : 'bg-white border-slate-200 shadow-sm'
    } space-y-5`}>
      {/* Header */}
      <div className={`flex items-center justify-between pb-3 border-b ${
        isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-100'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            <h2 className={`text-base font-bold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Giám Sát Cụm AI & Hạ Tầng Tự Động Hóa
            </h2>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          HỆ THỐNG ỔN ĐỊNH
        </span>
      </div>

      {/* 3 Core Infrastructure Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Block 1: AI Gemini Cloud Engine */}
        <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              Gemini AI API
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
              CLOUD API
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className={`text-[11px] font-mono truncate font-semibold ${
              isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'
            }`}>
              {status.gemini.model}
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono pt-1">
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Hạn mức Quota API:</span>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {status.gemini.quotaUsedPercent}% / 100%
              </span>
            </div>
            {/* Quota Progress */}
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${
              isDarkMode ? 'bg-[#171F33]' : 'bg-slate-200'
            }`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400"
                style={{ width: `${status.gemini.quotaUsedPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono pt-1">
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Thời gian phản hồi:</span>
              <span className={`font-bold ${isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'}`}>
                {status.gemini.responseTimeMs} ms (Cửa sổ: {status.gemini.contextWindow})
              </span>
            </div>
          </div>
        </div>

        {/* Block 2: Vector Database (RAG Semantic Store) */}
        <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <Database className="w-3.5 h-3.5 text-purple-500" />
              Vector Database
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 text-[10px] font-mono font-bold">
              RAG STORE
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Trạng thái:</span>
              <span className="text-emerald-500 font-bold">KẾT NỐI TỐT</span>
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Số lượng Embeddings:</span>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {status.vectorDb.indexedEmbeddingsCount.toLocaleString()} Vectors
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Độ trễ Cosine RAG:</span>
              <span className="text-emerald-500 font-bold">{status.vectorDb.queryLatencyMs} ms</span>
            </div>

            <div className={`text-[10px] pt-1 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
              Sẵn sàng phục vụ tra cứu thông số kỹ thuật xe đối kháng kết hợp Gemini
            </div>
          </div>
        </div>

        {/* Block 3: Cổng thanh toán & Webhook */}
        <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Cổng Thanh Toán
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
              HMAC-SHA512
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className={`text-[11px] font-mono truncate ${
              isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-600'
            }`}>
              {status.paymentGateway.name}
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono pt-1">
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Tỷ lệ Uptime:</span>
              <span className="text-emerald-500 font-bold">{status.paymentGateway.uptimePercent}%</span>
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Xác thực IPN:</span>
              <span className={`font-bold ${isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'}`}>
                Chữ ký tự động
              </span>
            </div>

            <div className={`text-[10px] pt-1 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
              Đối soát biên lai tức thì và kích hoạt đồng hồ cọc 72h
            </div>
          </div>
        </div>
      </div>

      {/* Cron Jobs Bottom Status Row */}
      <div className={`p-3.5 rounded-xl border space-y-2 transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40'
          : 'bg-slate-50/80 border-slate-200'
      }`}>
        <div className={`flex items-center justify-between text-xs font-mono font-bold uppercase ${
          isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
        }`}>
          <span className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-blue-500" />
            Bộ Lập Lịch Tác Vụ Ngầm (Automated Cron Jobs)
          </span>
          <span className="text-emerald-500">3 Tác Vụ Đang Chạy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {status.cronJobs.map((job) => (
            <div
              key={job.name}
              className={`p-2.5 rounded-lg border text-xs space-y-1 transition-colors ${
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/50'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-[11px] line-clamp-1 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {job.name}
                </span>
                <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              </div>
              <div className={`text-[10px] font-mono ${
                isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600 font-medium'
              }`}>
                {job.schedule}
              </div>
              <div className={`text-[10px] font-mono ${
                isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
              }`}>
                {job.lastRun}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
