import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

export const ModelRibbon: React.FC = () => {
  return (
    <div className="p-5 sm:p-6 rounded-lg bg-surface-container border border-surface-highlight shadow-lg space-y-4">
      {/* Ribbon Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-primary">
          DÒNG XE ĐƯỢC CHỌN
        </span>
        <div className="px-2.5 py-0.5 rounded-[2px] bg-accent-action/20 border border-accent-primary/30 text-accent-primary font-mono text-[10px] font-bold tracking-wider">
          SEDAN THỂ THAO THUẦN ĐIỆN 800V
        </div>
      </div>

      {/* Ribbon Card */}
      <div className="flex items-center gap-4 p-4 rounded bg-surface-elevated border border-surface-highlight/70">
        <div className="w-12 h-12 rounded-lg bg-accent-action/20 border border-accent-primary/40 flex items-center justify-center text-accent-primary font-mono font-black text-lg tracking-wider shrink-0 shadow-[0_0_15px_rgba(14,165,233,0.25)]">
          GT
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              AutoHub GT-e
            </h2>
            <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>PIN SIÊU DẪN</span>
            </div>
          </div>
          <p className="text-xs text-text-muted flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-accent-primary" />
            <span>Kiến trúc điện áp cao 800V SiC • Sạc 10-80% trong 15 phút</span>
          </p>
        </div>
      </div>
    </div>
  );
};
