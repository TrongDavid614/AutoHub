import React from 'react';
import { Bot, Cpu, Zap, ShieldCheck, SlidersHorizontal } from 'lucide-react';

export const AiHeader: React.FC = () => {
  return (
    <div className="relative w-full rounded-lg bg-[#131B2E] border border-[#3E4850]/50 shadow-2xl p-6 lg:p-7 overflow-hidden">
      {/* Top ambient gradient glow bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#89CEFF] to-transparent opacity-80" />

      {/* Decorative radial blur lights */}
      <div className="absolute -top-20 left-1/4 w-80 h-40 bg-[#89CEFF]/10 rounded-full blur-[65px] pointer-events-none" />
      <div className="absolute top-1/2 -right-10 w-72 h-72 bg-[#00A6F0]/5 rounded-full blur-[75px] pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top meta row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[4px] bg-[#222A3D] border border-[#3E4850]/70 flex items-center justify-center text-[#89CEFF] shadow-[0_4px_6px_-1px_rgba(137,206,255,0.2)]">
              <Bot className="w-5 h-5 text-[#89CEFF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-[#DAE2FD] tracking-tight">
                  AutoHub Gemini AI
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#2D3449] text-[#89CEFF] font-mono text-[10px] font-bold tracking-[1.5px] uppercase">
                  GEMINI 1.5 PRO
                </span>
              </div>
              <p className="font-mono text-[10px] font-bold text-[#88929B] tracking-[1.5px] uppercase">
                GOOGLE GEMINI API & VECTOR DB RAG
              </p>
            </div>
          </div>

          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#222A3D] border border-[#3E4850]/60 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#89CEFF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#89CEFF]" />
            </span>
            <span className="font-mono text-[10px] font-bold text-[#89CEFF] tracking-[0.5px] uppercase">
              TRỰC TUYẾN 24/7
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5 pt-1">
          <h1 className="text-xl md:text-2xl font-bold text-[#DAE2FD] tracking-tight leading-tight">
            Trợ lý Tư vấn Xe điện Thông minh AutoHub
          </h1>
          <p className="text-sm text-[#BEC8D2] max-w-2xl leading-relaxed mt-0.5">
            Phân tích nhu cầu, ngân sách và gợi ý mẫu xe cùng hệ sinh thái phụ kiện tối ưu cho gia đình bạn với dữ liệu kỹ thuật thời gian thực.
          </p>
        </div>

        {/* 4 Capability Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-[#171F33] border border-[#3E4850]/50 text-[13px] text-[#BEC8D2]">
            <Cpu className="w-3.5 h-3.5 text-[#89CEFF]" />
            <span>Tra cứu thông số thời gian thực</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-[#171F33] border border-[#3E4850]/50 text-[13px] text-[#BEC8D2]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#89CEFF]" />
            <span>Định cấu hình xe bespoke</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-[#171F33] border border-[#3E4850]/50 text-[13px] text-[#BEC8D2]">
            <Zap className="w-3.5 h-3.5 text-[#89CEFF]" />
            <span>Gợi ý phụ kiện & hạ tầng sạc</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-[#171F33] border border-[#3E4850]/50 text-[13px] text-[#BEC8D2]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#89CEFF]" />
            <span>Chứng thực giá trị bảo hành 10 năm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
