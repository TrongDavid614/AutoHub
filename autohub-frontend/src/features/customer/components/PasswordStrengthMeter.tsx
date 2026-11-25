import React from 'react';

export interface PasswordStrengthMeterProps {
  score: number; // 0 to 4
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ score }) => {
  const getStrengthInfo = (s: number) => {
    switch (s) {
      case 4:
        return {
          label: 'Rất mạnh (4/4)',
          color: 'text-emerald-700',
          barColor: 'bg-emerald-600',
        };
      case 3:
        return {
          label: 'Khá mạnh (3/4)',
          color: 'text-[var(--accent)]',
          barColor: 'bg-[var(--accent)]',
        };
      case 2:
        return {
          label: 'Trung bình (2/4)',
          color: 'text-amber-700',
          barColor: 'bg-amber-500',
        };
      case 1:
        return {
          label: 'Yếu (1/4)',
          color: 'text-red-600',
          barColor: 'bg-red-500',
        };
      default:
        return {
          label: 'Chưa nhập (0/4)',
          color: 'text-[var(--text-muted)]',
          barColor: 'bg-[var(--line)]',
        };
    }
  };

  const { label, color, barColor } = getStrengthInfo(score);

  return (
    <div className="pt-1.5 w-full space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-[var(--text-secondary)]">Độ mạnh mật khẩu:</span>
        <span className={`font-medium tabular-nums ${color}`}>{label}</span>
      </div>

      <div className="flex items-center gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex-1 h-full rounded-full transition-colors duration-200 ${
              score >= step ? barColor : 'bg-[var(--line)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
