import React from 'react';
import { Activity } from 'lucide-react';

export const ChargingTelemetryWidget: React.FC = () => {
  return (
    <div className="rounded-[2px] bg-[#060E20] border border-[#2D3449] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
      {/* Left Telemetry Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#89CEFF]" />
          <span className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#89CEFF] uppercase">
            HIỆU NĂNG SẠC TƯƠNG THÍCH
          </span>
        </div>
        <div className="text-sm font-bold text-[#DAE2FD]">
          120 km tầm vận hành / 60 phút sạc
        </div>
        <p className="text-[11px] text-[#88929B]">
          Kiểm soát dòng điện thông minh, chống quá nhiệt thông qua ứng dụng AutoHub Mobile.
        </p>
      </div>

      {/* Right Sparkline & Metric */}
      <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
        {/* SVG Sparkline */}
        <div className="w-24 h-8">
          <svg width="96" height="32" viewBox="0 0 96 32" fill="none" className="overflow-visible">
            <path
              d="M0 25.5999L19.2 20.7999L38.4 22.7199L57.6 11.1999L76.8 15.0399L96 5.43994"
              stroke="#89CEFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="96" cy="5.44" r="3.5" fill="#89CEFF" className="animate-pulse" />
          </svg>
        </div>

        {/* Numeric Telemetry */}
        <div className="text-right">
          <div className="font-mono text-base font-bold text-[#89CEFF]">99.4%</div>
          <div className="font-mono text-[9px] text-[#88929B] tracking-wider uppercase">
            HIỆU SUẤT TRUYỀN DẪN
          </div>
        </div>
      </div>
    </div>
  );
};
