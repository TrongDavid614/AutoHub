import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DepositCountdownBadgeProps {
  initialSeconds: number;
  status: string;
  className?: string;
}

export const DepositCountdownBadge: React.FC<DepositCountdownBadgeProps> = ({
  initialSeconds,
  status,
  className,
}) => {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    if (status === 'COMPLETED' || initialSeconds <= 0) return;

    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status, initialSeconds]);

  const remainingSeconds = Math.max(0, initialSeconds - elapsed);

  if (status === 'COMPLETED') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40',
          className
        )}
      >
        <span>✓ Đã ký HĐMB</span>
      </span>
    );
  }

  if (remainingSeconds <= 0) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40',
          className
        )}
      >
        <Clock className="w-3 h-3" />
        <span>Hết hạn 72h</span>
      </span>
    );
  }

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const isUrgent = remainingSeconds < 3600 * 12; // dưới 12 tiếng

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border transition-colors',
        isUrgent
          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40 animate-pulse'
          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
        className
      )}
    >
      <Clock className="w-3 h-3" />
      <span>
        Còn {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </span>
  );
};
