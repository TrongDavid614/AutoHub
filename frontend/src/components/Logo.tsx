import React from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps {
  variant?: 'horizontal' | 'symbol' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className,
}) => {
  const sizeMap = {
    sm: { symbol: 'w-6 h-6', text: 'text-lg', gap: 'gap-2' },
    md: { symbol: 'w-8 h-8', text: 'text-xl', gap: 'gap-2.5' },
    lg: { symbol: 'w-10 h-10', text: 'text-2xl', gap: 'gap-3' },
  };

  const currentSize = sizeMap[size];

  // Official AutoHub Symbol Mark (Interlocking AH Monogram on 256x256 grid)
  const symbolElement = (
    <svg
      viewBox="0 0 256 256"
      className={cn(currentSize.symbol, 'flex-shrink-0')}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AutoHub Logo Mark"
    >
      <path
        fill="#89CEFF"
        fillRule="evenodd"
        d="M 40 216 L 108 40 L 148 40 L 216 216 L 178 216 L 160 168 L 96 168 L 78 216 Z M 128 84 L 108 136 L 148 136 Z M 192 40 L 216 40 L 216 148 L 192 148 Z"
      />
    </svg>
  );

  if (variant === 'symbol' || variant === 'icon-only') {
    return <div className={cn('inline-flex items-center justify-center', className)}>{symbolElement}</div>;
  }

  return (
    <div className={cn('inline-flex items-center tracking-tight font-extrabold', currentSize.gap, className)}>
      <div className="p-1 rounded bg-[#171F33] border border-[#3E4850]/60 shadow-[0_4px_6px_-1px_rgba(137,206,255,0.2)]">
        {symbolElement}
      </div>
      <div className={cn(currentSize.text, 'flex items-baseline')}>
        <span className="text-[#DAE2FD] font-bold">AUTO</span>
        <span className="text-[#89CEFF] font-black">HUB</span>
      </div>
    </div>
  );
};
