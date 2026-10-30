import React from 'react';

export interface PasswordStrengthMeterProps {
  score: number; // 0 to 4
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ score }) => {
  const getStrengthInfo = (s: number) => {
    switch (s) {
      case 4:
        return {
          label: 'RẤT MẠNH (4/4)',
          color: 'text-[#34D399]',
          barColor: 'bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.5)]',
        };
      case 3:
        return {
          label: 'KHÁ MẠNH (3/4)',
          color: 'text-[#89CEFF]',
          barColor: 'bg-[#89CEFF] shadow-[0_0_8px_rgba(137,206,255,0.5)]',
        };
      case 2:
        return {
          label: 'TRUNG BÌNH (2/4)',
          color: 'text-amber-400',
          barColor: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]',
        };
      case 1:
        return {
          label: 'YẾU (1/4)',
          color: 'text-rose-400',
          barColor: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.4)]',
        };
      default:
        return {
          label: 'CHƯA NHẬP (0/4)',
          color: 'text-[#88929B]',
          barColor: 'bg-[#2D3449]',
        };
    }
  };

  const { label, color, barColor } = getStrengthInfo(score);

  return (
    <div className="pt-1 w-full">
      {/* Telemetry Password Strength Display Card matching Figma 20:14537 */}
      <div className="p-2 rounded-[4px] bg-[#171F33]/60 border border-[#2D3449]/50 space-y-1.5 shadow-sm">
        {/* Metric Header Row */}
        <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-[1.5px] uppercase">
          <span className="text-[#BEC8D2]">ĐỘ BẢO MẬT:</span>
          <span className={color}>{label}</span>
        </div>

        {/* 4-Segment Precision Telemetry Bar (Height 6px, Gap 6px) */}
        <div className="flex items-center gap-1.5 h-1.5 w-full">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex-1 h-full rounded-full transition-all duration-300 ${
                score >= step ? barColor : 'bg-[#2D3449]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
