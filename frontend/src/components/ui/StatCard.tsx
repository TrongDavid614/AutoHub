import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon: LucideIcon;
  variant?: 'red' | 'blue' | 'emerald' | 'amber' | 'purple' | 'slate';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  variant = 'slate',
  className,
  onClick,
}) => {
  const iconVariants = {
    red: 'bg-red-500/10 text-red-400 border-red-500/20 group-hover:bg-red-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:bg-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:bg-purple-500/20',
    slate: 'bg-slate-800 text-slate-300 border-slate-700 group-hover:bg-slate-700',
  };

  const glowVariants = {
    red: 'hover:border-red-500/40 hover:shadow-red-950/20',
    blue: 'hover:border-blue-500/40 hover:shadow-blue-950/20',
    emerald: 'hover:border-emerald-500/40 hover:shadow-emerald-950/20',
    amber: 'hover:border-amber-500/40 hover:shadow-amber-950/20',
    purple: 'hover:border-purple-500/40 hover:shadow-purple-950/20',
    slate: 'hover:border-slate-700 hover:shadow-slate-950/20',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm transition-all duration-200 hover:shadow-lg',
        glowVariants[variant],
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 tracking-wide">{title}</p>
          <p className="text-2xl font-black text-white tracking-tight">{value}</p>
        </div>
        <div
          className={cn(
            'p-3 rounded-lg border transition-colors',
            iconVariants[variant]
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          {change ? (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[11px]',
                  change.trend === 'up' && 'text-emerald-400 bg-emerald-500/10',
                  change.trend === 'down' && 'text-rose-400 bg-rose-500/10',
                  change.trend === 'neutral' && 'text-slate-400 bg-slate-800'
                )}
              >
                {change.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
                {change.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {change.trend === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
                {change.value}
              </span>
              {change.label && <span className="text-slate-400">{change.label}</span>}
            </div>
          ) : <span />}

          {subtitle && <span className="text-[11px] text-slate-400 font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
