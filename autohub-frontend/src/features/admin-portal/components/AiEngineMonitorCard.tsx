import React from 'react';
import { Cpu, Database, ShieldCheck, Timer, CheckCircle2 } from 'lucide-react';
import type { AiEngineStatus } from '@/types/admin-dashboard.types';
import { MOCK_AI_ENGINE_STATUS } from '../mocks/dashboard.mock';

export interface AiEngineMonitorCardProps {
  status?: AiEngineStatus;
}

export const AiEngineMonitorCard: React.FC<AiEngineMonitorCardProps> = ({
  status = MOCK_AI_ENGINE_STATUS,
}) => {
  const ai = status.openrouter || status.gemini || MOCK_AI_ENGINE_STATUS.openrouter!;

  return (
    <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-base font-semibold text-[var(--text)]">
            Trạng thái hệ thống & tác vụ nền
          </h2>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          Ổn định
        </span>
      </div>

      {/* 3 Service Sections separated by clean dividers (no nested cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[var(--line)]">
        {/* AI Model */}
        <div className="space-y-3 md:pr-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text)]">Trợ lý tư vấn AI</span>
            <span className="text-[11px] font-medium text-[var(--text-secondary)]">Hoạt động</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-[var(--accent)] font-medium truncate">{ai.model}</div>

            <div className="flex justify-between items-center text-[var(--text-secondary)]">
              <span>Hạn mức API đã dùng</span>
              <span className="font-semibold text-[var(--text)] tabular-nums">
                {ai.quotaUsedPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${ai.quotaUsedPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[var(--text-secondary)] pt-0.5">
              <span>Độ trễ phản hồi</span>
              <span className="font-semibold text-[var(--text)] tabular-nums">
                {ai.responseTimeMs} ms ({ai.contextWindow})
              </span>
            </div>
          </div>
        </div>

        {/* SQL Data Query Tool */}
        <div className="space-y-2.5 pt-4 md:pt-0 md:px-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
            <Database className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Dữ liệu truy vấn thời gian thực</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[var(--text-secondary)]">
              <span>Trạng thái CSDL</span>
              <span className="text-emerald-700 font-medium">Đã kết nối</span>
            </div>
            <div className="flex justify-between items-center text-[var(--text-secondary)]">
              <span>Lượt tư vấn hôm nay</span>
              <span className="font-semibold text-[var(--text)] tabular-nums">
                {status.vectorDb.indexedEmbeddingsCount.toLocaleString('vi-VN')} lượt
              </span>
            </div>
            <div className="flex justify-between items-center text-[var(--text-secondary)]">
              <span>Thời gian truy vấn</span>
              <span className="font-semibold text-[var(--text)] tabular-nums">
                {status.vectorDb.queryLatencyMs} ms
              </span>
            </div>
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="space-y-2.5 pt-4 md:pt-0 md:pl-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cổng thanh toán</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="text-[var(--text)] font-medium truncate">{status.paymentGateway.name}</div>
            <div className="flex justify-between items-center text-[var(--text-secondary)]">
              <span>Tỷ lệ uptime</span>
              <span className="text-emerald-700 font-semibold tabular-nums">
                {status.paymentGateway.uptimePercent}%
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Đối soát biên lai tự động và kích hoạt giữ xe 72 giờ.
            </p>
          </div>
        </div>
      </div>

      {/* Cron Jobs Row (plain table/row style, no nested cards) */}
      <div className="pt-4 border-t border-[var(--line)] space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            Lịch chạy tác vụ nền ({status.cronJobs.length})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 divide-y md:divide-y-0 md:divide-x divide-[var(--line)]">
          {status.cronJobs.map((job) => (
            <div key={job.name} className="pt-2 md:pt-0 md:px-3 first:md:pl-0 text-xs space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-[var(--text)] line-clamp-1">{job.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              </div>
              <div className="text-[11px] text-[var(--accent)] tabular-nums">{job.schedule}</div>
              <div className="text-[11px] text-[var(--text-muted)] tabular-nums">{job.lastRun}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
