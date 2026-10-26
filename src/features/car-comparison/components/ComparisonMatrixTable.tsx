import React from 'react';
import { Zap, Activity } from 'lucide-react';
import type { SpecGroup } from '../types/comparison.types';

interface ComparisonMatrixTableProps {
  specGroups: SpecGroup[];
  onlyDifferences: boolean;
}

export const ComparisonMatrixTable: React.FC<ComparisonMatrixTableProps> = ({
  specGroups,
  onlyDifferences,
}) => {
  return (
    <div className="space-y-8">
      {specGroups.map((group) => {
        const visibleRows = onlyDifferences
          ? group.rows.filter((r) => r.isDifferent)
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
              {visibleRows.map((row) => (
                <div
                  key={row.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 rounded-lg border transition-colors ${
                    row.isTelemetryHighlight
                      ? 'bg-surface-elevated/90 border-accent-primary/40 shadow-sm'
                      : 'bg-surface-container/60 border-surface-highlight/70 hover:bg-surface-container'
                  }`}
                >
                  {/* Col 1-3: Label Column */}
                  <div className="md:col-span-3 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      {row.isTelemetryHighlight && (
                        <Activity className="w-3.5 h-3.5 text-accent-primary shrink-0" />
                      )}
                      <span className="text-sm sm:text-base font-semibold text-text-primary">
                        {row.label}
                      </span>
                    </div>
                    {row.sublabel && (
                      <p className="text-xs text-text-muted leading-relaxed">
                        {row.sublabel}
                      </p>
                    )}
                  </div>

                  {/* Col 4-6: Standard Spec */}
                  <div className="md:col-span-3 p-3 rounded bg-surface-elevated/50 md:bg-transparent space-y-1">
                    <span className="md:hidden text-[10px] font-mono text-text-muted uppercase block">
                      AutoHub GT-e Luxury:
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`font-mono font-bold text-text-primary ${
                          row.isTelemetryHighlight ? 'text-2xl text-accent-primary' : 'text-sm sm:text-base'
                        }`}
                      >
                        {row.standardVal}
                      </span>
                      {row.unit && (
                        <span className="text-xs font-mono font-bold text-text-muted">
                          {row.unit}
                        </span>
                      )}
                    </div>
                    {row.standardSub && (
                      <p className="text-xs text-text-muted">
                        {row.standardSub}
                      </p>
                    )}
                  </div>

                  {/* Col 7-9: Grand Touring Spec (Active/Recommended) */}
                  <div className="md:col-span-3 p-3 rounded bg-accent-primary/5 md:bg-accent-primary/5 border border-accent-primary/20 space-y-1">
                    <span className="md:hidden text-[10px] font-mono text-accent-primary uppercase font-bold block">
                      GT-e Grand Touring (Khuyên dùng):
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`font-mono font-bold text-accent-primary ${
                          row.isTelemetryHighlight ? 'text-2xl font-black' : 'text-sm sm:text-base'
                        }`}
                      >
                        {row.performanceVal}
                      </span>
                      {row.unit && (
                        <span className="text-xs font-mono font-bold text-accent-primary">
                          {row.unit}
                        </span>
                      )}
                    </div>
                    {row.performanceSub && (
                      <p className="text-xs text-text-secondary font-medium">
                        {row.performanceSub}
                      </p>
                    )}
                  </div>

                  {/* Col 10-12: Track Edition Spec */}
                  <div className="md:col-span-3 p-3 rounded bg-surface-elevated/50 md:bg-transparent space-y-1">
                    <span className="md:hidden text-[10px] font-mono text-text-muted uppercase block">
                      GT-e Track Edition:
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`font-mono font-bold text-text-primary ${
                          row.isTelemetryHighlight ? 'text-2xl text-accent-primary' : 'text-sm sm:text-base'
                        }`}
                      >
                        {row.trackVal}
                      </span>
                      {row.unit && (
                        <span className="text-xs font-mono font-bold text-text-muted">
                          {row.unit}
                        </span>
                      )}
                    </div>
                    {row.trackSub && (
                      <p className="text-xs text-text-muted">
                        {row.trackSub}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
