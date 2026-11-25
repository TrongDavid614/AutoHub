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
  icon?: LucideIcon;
  variant?: 'red' | 'blue' | 'emerald' | 'amber' | 'purple' | 'slate';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--line)] p-5 transition-colors',
        onClick && 'cursor-pointer hover:border-[var(--line-strong)]',
        className
      )}
    >
      <div className="space-y-1.5">
        <p className="text-[13px] font-medium text-[var(--text-muted)]">{title}</p>
        <p className="text-2xl font-semibold text-[var(--text)] tracking-tight tabular-nums">{value}</p>
      </div>

      {(change || subtitle) && (
        <div className="mt-3 pt-3 border-t border-[var(--line)] flex items-center justify-between text-[13px]">
          {change ? (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center font-medium tabular-nums',
                  change.trend === 'up' && 'text-[var(--status-success)]',
                  change.trend === 'down' && 'text-[var(--status-danger)]',
                  change.trend === 'neutral' && 'text-[var(--text-muted)]'
                )}
              >
                {change.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
                {change.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {change.trend === 'neutral' && <Minus className="w-3.5 h-3.5 mr-0.5" />}
                {change.value}
              </span>
              {change.label && <span className="text-[var(--text-muted)]">{change.label}</span>}
            </div>
          ) : (
            <span />
          )}

          {subtitle && <span className="text-[13px] text-[var(--text-muted)]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
