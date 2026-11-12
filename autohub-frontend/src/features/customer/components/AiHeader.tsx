import React, { useState, useRef, useEffect } from 'react';
import { Bot, Cpu, Zap, ShieldCheck, SlidersHorizontal, ChevronDown, Check, Sparkles } from 'lucide-react';
import type { AiModelOption } from '@/types/ai.types';

export interface AiHeaderProps {
  models?: AiModelOption[];
  selectedModel?: string;
  onSelectModel?: (modelId: string) => void;
}

export const AiHeader: React.FC<AiHeaderProps> = ({
  models = [],
  selectedModel = 'liquid/lfm-3-1.7b:free',
  onSelectModel,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeModelObj = models.find((m) => m.id === selectedModel);
  const currentModelName = activeModelObj ? activeModelObj.name : selectedModel;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                  AutoHub AI Consultant
                </span>

                {/* Model Selector Pill / Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-[#222A3D] hover:bg-[#2D3449] border border-[#3E4850] text-[#89CEFF] font-mono text-[11px] font-bold tracking-[0.5px] transition-colors cursor-pointer"
                    title="Bấm để chuyển đổi Model OpenRouter"
                  >
                    <Sparkles className="w-3 h-3 text-[#89CEFF]" />
                    <span className="max-w-[180px] truncate">{currentModelName}</span>
                    <ChevronDown className="w-3 h-3 text-[#89CEFF]/70" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-72 rounded-md bg-[#171F33] border border-[#3E4850] shadow-2xl py-2 z-50">
                      <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-[#88929B] font-semibold border-b border-[#3E4850]/40">
                        Chọn Model OpenRouter
                      </div>
                      <div className="max-h-60 overflow-y-auto py-1">
                        {models.map((m) => {
                          const isSelected = m.id === selectedModel;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                onSelectModel?.(m.id);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors hover:bg-[#222A3D] cursor-pointer ${
                                isSelected ? 'bg-[#222A3D] text-[#89CEFF] font-semibold' : 'text-[#BEC8D2]'
                              }`}
                            >
                              <div className="flex flex-col gap-0.5">
                                <span>{m.name}</span>
                                <div className="flex items-center gap-1.5 text-[10px] text-[#88929B]">
                                  <span>{m.provider}</span>
                                  {m.isFree && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px]">
                                      Miễn phí
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#89CEFF]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="font-mono text-[10px] font-bold text-[#88929B] tracking-[1.5px] uppercase mt-0.5">
                OPENROUTER PROXY & SHOWROOM RAG ENGINE
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
