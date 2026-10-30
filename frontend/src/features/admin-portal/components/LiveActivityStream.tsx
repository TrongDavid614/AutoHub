import React, { useState } from 'react';
import { Activity, Radio, CreditCard, KeyRound, CalendarCheck, Package, Bot, CheckCircle } from 'lucide-react';
import { MOCK_SYSTEM_EVENTS, type SystemEvent } from '../mocks/dashboard.mock';

export interface LiveActivityStreamProps {
  events?: SystemEvent[];
}

export const LiveActivityStream: React.FC<LiveActivityStreamProps> = ({
  events = MOCK_SYSTEM_EVENTS,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredEvents = events.filter((e) => {
    if (filterType === 'ALL') return true;
    return e.type === filterType;
  });

  const getEventIcon = (type: SystemEvent['type']) => {
    switch (type) {
      case 'SEPAY_IPN':
        return <CreditCard className="w-4 h-4 text-[#10B981]" />;
      case 'VIN_ASSIGN':
        return <KeyRound className="w-4 h-4 text-[#89CEFF]" />;
      case 'TEST_DRIVE':
        return <CalendarCheck className="w-4 h-4 text-[#F59E0B]" />;
      case 'ACCESSORY_ORDER':
        return <Package className="w-4 h-4 text-[#0EA5E9]" />;
      case 'AI_RAG':
        return <Bot className="w-4 h-4 text-[#A855F7]" />;
      case 'REFUND_APPROVED':
        return <CheckCircle className="w-4 h-4 text-[#10B981]" />;
      default:
        return <Activity className="w-4 h-4 text-[#89CEFF]" />;
    }
  };

  return (
    <div className="rounded-xl bg-[#131B2E] border border-[#3E4850]/50 p-6 shadow-xl space-y-4">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3E4850]/40">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#10B981] animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Bàn Cờ Sự Kiện Trực Tiếp (Live Stream Feed)
            </h2>
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          </div>
          <p className="text-xs text-[#88929B] mt-0.5">
            Nhật ký giao dịch SePay, phân bổ số khung VIN, đăng ký lái thử và truy vấn AI theo thời gian thực
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#0B1326] border border-[#3E4850]/60 text-xs font-mono">
          {[
            { id: 'ALL', label: 'Tất Cả' },
            { id: 'SEPAY_IPN', label: 'Cọc SePay' },
            { id: 'VIN_ASSIGN', label: 'Gán VIN' },
            { id: 'AI_RAG', label: 'AI RAG' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1 rounded-[4px] text-[11px] font-semibold transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30 shadow-sm'
                  : 'text-[#88929B] hover:text-[#DAE2FD]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Timeline List */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="group relative p-3.5 rounded-lg bg-[#0B1326]/80 hover:bg-[#171F33]/70 border border-[#3E4850]/40 hover:border-[#89CEFF]/40 transition-all flex items-start gap-3.5"
          >
            {/* Type Icon */}
            <div className="p-2 rounded-lg bg-[#131B2E] border border-[#3E4850]/60 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
              {getEventIcon(evt.type)}
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-xs group-hover:text-[#89CEFF] transition-colors">
                    {evt.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#88929B]">
                    bởi <strong className="text-[#DAE2FD]">{evt.actor}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{
                      backgroundColor: `${evt.badgeColor}20`,
                      color: evt.badgeColor,
                      border: `1px solid ${evt.badgeColor}40`,
                    }}
                  >
                    {evt.statusBadge}
                  </span>
                  <span className="text-[#88929B]">{evt.timeAgo}</span>
                </div>
              </div>

              <p className="text-xs text-[#BEC8D2] leading-relaxed">
                {evt.description}
              </p>

              <div className="text-[10px] font-mono text-[#88929B] flex items-center gap-3 pt-0.5">
                <span>{evt.timestamp}</span>
                <span>•</span>
                <span>{evt.meta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
