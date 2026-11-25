import React from 'react';
import type { KpiMetric } from '@/types/admin-dashboard.types';
import { MOCK_DASHBOARD_KPIS } from '../mocks/dashboard.mock';
import { cn } from '@/lib/utils';

export interface AdminStatCardsProps {
  kpis?: KpiMetric[];
}

export const AdminStatCards: React.FC<AdminStatCardsProps> = ({
  kpis = MOCK_DASHBOARD_KPIS,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const isWarning = kpi.badgeType === 'warning';
        const isSuccess = kpi.badgeType === 'success';

        return (
          <div
            key={kpi.id}
            className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-5 flex flex-col justify-between gap-3 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                {kpi.title}
              </h3>

              {kpi.badgeText && (
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0',
                    isWarning
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : isSuccess
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border-[var(--line)]'
                  )}
                >
                  {kpi.badgeText}
                </span>
              )}
            </div>

            <div>
              <div className="text-2xl font-bold text-[var(--text)] tabular-nums tracking-tight">
                {kpi.value}
              </div>
              {kpi.subtitle && (
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">
                  {kpi.subtitle}
                </p>
              )}
            </div>

            {kpi.targetLabel && (
              <div className="pt-3 border-t border-[var(--line)] text-xs text-[var(--text-muted)] tabular-nums">
                {kpi.targetLabel}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
