import React from 'react';

export interface PasswordStrengthMeterProps {
  score: number; // 0 to 4
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ score }) => {
  const getStrengthInfo = (s: number) => {
    switch (s) {
      case 4:
        return { label: 'RẤT MẠNH (4/4)', color: 'text-[#34D399]', barColor: 'bg-[#34D399]' };
      case 3:
        return { label: 'KHÁ MẠNH (3/4)', color: 'text-[#89CEFF]', barColor: 'bg-[#89CEFF]' };
      case 2:
        return { label: 'TRUNG BÌNH (2/4)', color: 'text-amber-400', barColor: 'bg-amber-400' };
      case 1:
        return { label: 'YẾU (1/4)', color: 'text-rose-400', barColor: 'bg-rose-400' };
      default:
        return { label: 'CHƯA NHẬP (0/4)', color: 'text-[#88929B]', barColor: 'bg-[#222A3D]' };
    }
  };

  const { label, color, barColor } = getStrengthInfo(score);

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider uppercase">
        <span className="text-[#88929B]">ĐỘ BẢO MẬT:</span>
        <span className={color}>{label}</span>
      </div>

      {/* 4 Telemetry Bars */}
      <div className="grid grid-cols-4 gap-1.5 h-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= step ? barColor : 'bg-[#222A3D]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
