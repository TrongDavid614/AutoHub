import React from 'react';
import {
  getCellSubValue,
  getCellValue,
  getWinningTrimIdsForRow,
} from '@/features/customer/utils/comparisonScoring';
import type { SpecGroup, VehicleComparisonTrim } from '@/features/customer/types/comparison.types';

export interface ComparisonPrintTableProps {
  trims: VehicleComparisonTrim[];
  specGroups: SpecGroup[];
  onlyDifferences: boolean;
}

export const ComparisonPrintTable: React.FC<ComparisonPrintTableProps> = ({
  trims,
  specGroups,
  onlyDifferences,
}) => {
  return (
    <div className="hidden print:block w-full text-slate-900">
      <table className="w-full border-collapse border border-slate-300 text-xs">
        <thead>
          <tr className="bg-slate-50 align-top">
            <th className="w-[24%] border border-slate-300 p-2.5 text-left align-middle">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 block">
                THÔNG SỐ &amp; CẤU HÌNH
              </span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">
                {trims.length} Mẫu Xe Trực Diện
              </span>
            </th>

            {trims.map((trim) => {
              const isRecommended = trim.badgeVariant === 'accent' || trim.badge === 'KHUYÊN DÙNG';

              return (
                <th
                  key={trim.id}
                  className={`border border-slate-300 p-2.5 text-left font-normal align-top ${
                    isRecommended ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="space-y-1.5">
                    {trim.badge && (
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isRecommended
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {trim.badge}
                      </span>
                    )}
                    <div className="w-full h-24 rounded overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={trim.imageUrl}
                        alt={trim.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    {trim.brandName && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 block">
                        {trim.brandName}
                      </span>
                    )}
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      {trim.name}
                    </div>
                    <div className="text-sm font-bold font-mono text-slate-900">
                      {trim.priceFormatted}
                    </div>
                    {trim.depositFormatted && (
                      <div className="text-[10px] font-mono text-slate-600">
                        Cọc 72h: {trim.depositFormatted}
                      </div>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {specGroups.map((group) => {
            const visibleRows = onlyDifferences
              ? group.rows.filter((r) => Boolean(r.isDifferent ?? (r as { different?: boolean }).different))
              : group.rows;

            if (visibleRows.length === 0) return null;

            return (
              <React.Fragment key={group.id}>
                <tr className="bg-slate-100 break-inside-avoid">
                  <td
                    colSpan={trims.length + 1}
                    className="border border-slate-300 px-3 py-2 font-bold text-slate-900 uppercase tracking-wide text-[11px]"
                  >
                    {group.sectionNumber ? `${group.sectionNumber} — ${group.title}` : group.title}
                  </td>
                </tr>

                {visibleRows.map((row) => {
                  const isRowDifferent = Boolean(
                    row.isDifferent ?? (row as { different?: boolean }).different
                  );
                  const winningTrimIds = getWinningTrimIdsForRow(row, trims);

                  return (
                    <tr key={row.id} className="break-inside-avoid">
                      <td className="border border-slate-300 p-2.5 align-top bg-white">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-slate-900">{row.label}</span>
                          {isRowDifferent && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 border border-amber-200 text-amber-800">
                              Khác biệt
                            </span>
                          )}
                        </div>
                        {row.sublabel && (
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            {row.sublabel}
                          </div>
                        )}
                      </td>

                      {trims.map((trim, trimIndex) => {
                        const isWinner = winningTrimIds.has(String(trim.id));
                        const val = getCellValue(row, trim, trimIndex);
                        const sub = getCellSubValue(row, trim, trimIndex);

                        return (
                          <td
                            key={trim.id}
                            className={`border border-slate-300 p-2.5 align-top ${
                              isWinner ? 'bg-blue-50/70' : 'bg-white'
                            }`}
                          >
                            <div
                              className={`font-mono font-bold ${
                                isWinner ? 'text-blue-700' : 'text-slate-900'
                              }`}
                            >
                              {val}
                              {row.unit && val !== '—' ? ` ${row.unit}` : ''}
                            </div>
                            {sub && (
                              <div className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                                {sub}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
