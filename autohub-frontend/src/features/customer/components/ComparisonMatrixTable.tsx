import React from 'react';
import { Zap, Activity } from 'lucide-react';
import type { SpecGroup, VehicleComparisonTrim } from '@/features/customer/types/comparison.types';

export interface ComparisonMatrixTableProps {
  trims: VehicleComparisonTrim[];
  specGroups: SpecGroup[];
  onlyDifferences: boolean;
}

export const ComparisonMatrixTable: React.FC<ComparisonMatrixTableProps> = ({
  trims,
  specGroups,
  onlyDifferences,
}) => {
  const maxCars = 3;
  const emptySlotsCount = Math.max(0, maxCars - trims.length);

  return (
    <div className="space-y-8 print:space-y-6">
      {specGroups.map((group) => {
        const visibleRows = onlyDifferences
          ? group.rows.filter((r) => Boolean(r.isDifferent ?? (r as { different?: boolean }).different))
          : group.rows;

        if (visibleRows.length === 0) return null;

        return (
          <div key={group.id} className="space-y-3">
            {/* Group Header */}
            <div className="flex items-center gap-3 pb-2 border-b border-surface-highlight">
              <div className="w-8 h-8 rounded bg-accent-action/20 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-primary block">
                  {group.sectionNumber}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                  {group.title}
                </h3>
              </div>
            </div>

            {/* Spec Rows */}
            <div className="space-y-2.5">
              {visibleRows.map((row) => {
                const isRowDifferent = Boolean(row.isDifferent ?? (row as { different?: boolean }).different);
                const isRowHighlight = Boolean(row.isTelemetryHighlight ?? (row as { telemetryHighlight?: boolean }).telemetryHighlight);

                return (
                  <div
                    key={row.id}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 rounded-lg border transition-colors ${
                      isRowHighlight
                        ? 'bg-surface-elevated/90 border-accent-primary/40 shadow-sm'
                        : isRowDifferent
                          ? 'bg-surface-container/80 border-surface-highlight hover:border-accent-primary/30'
                          : 'bg-surface-container/50 border-surface-highlight/60 hover:bg-surface-container'
                    }`}
                  >
                    {/* Col 1-3: Label Column */}
                    <div className="md:col-span-3 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isRowHighlight && (
                          <Activity className="w-3.5 h-3.5 text-accent-primary shrink-0" />
                        )}
                        <span className="text-sm sm:text-base font-semibold text-text-primary">
                          {row.label}
                        </span>
                        {isRowDifferent && (
                          <span className="no-print px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            Khác biệt
                          </span>
                        )}
                      </div>
                      {row.sublabel && (
                        <p className="text-xs text-text-muted leading-relaxed">
                          {row.sublabel}
                        </p>
                      )}
                    </div>

                    {/* Col 4-12: The Columns for each car */}
                    {trims.map((trim, trimIndex) => {
                      const isRecommended = trim.badgeVariant === 'accent' || trim.badge === 'KHUYÊN DÙNG';
                      const trimKey = String(trim.id);
                      const val =
                        row.values?.[trimKey] ??
                        (trimIndex === 0
                          ? row.standardVal
                          : trimIndex === 1
                            ? row.performanceVal
                            : row.trackVal) ??
                        '—';

                      const sub =
                        row.subValues?.[trimKey] ??
                        (trimIndex === 0
                          ? row.standardSub
                          : trimIndex === 1
                            ? row.performanceSub
                            : row.trackSub) ??
                        '';

                      return (
                        <div
                          key={trim.id}
                          className={`md:col-span-3 p-3 rounded space-y-1 ${
                            isRecommended
                              ? 'bg-accent-primary/5 border border-accent-primary/20'
                              : 'bg-surface-elevated/50 md:bg-transparent'
                          }`}
                        >
                          {/* Mobile Trim Header */}
                          <span className="md:hidden text-[10px] font-mono text-text-muted uppercase block font-semibold">
                            {trim.name}:
                          </span>

                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span
                              className={`font-mono font-bold ${
                                isRecommended
                                  ? 'text-accent-primary'
                                  : 'text-text-primary'
                              } ${
                                isRowHighlight
                                  ? 'text-xl sm:text-2xl font-black'
                                  : 'text-sm sm:text-base'
                              }`}
                            >
                              {val}
                            </span>
                            {row.unit && val !== '—' && (
                              <span
                                className={`text-xs font-mono font-bold ${
                                  isRecommended ? 'text-accent-primary' : 'text-text-muted'
                                }`}
                              >
                                {row.unit}
                              </span>
                            )}
                          </div>

                          {sub && (
                            <p
                              className={`text-xs ${
                                isRecommended
                                  ? 'text-text-secondary font-medium'
                                  : 'text-text-muted'
                              }`}
                            >
                              {sub}
                            </p>
                          )}
                        </div>
                      );
                    })}

                    {/* Empty slots placeholders */}
                    {Array.from({ length: emptySlotsCount }).map((_, slotIdx) => (
                      <div
                        key={`empty-col-${slotIdx}`}
                        className="no-print hidden md:block md:col-span-3 p-3 text-center border-l border-surface-highlight/30 text-text-muted/40 font-mono text-xs"
                      >
                        —
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
