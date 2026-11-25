import React from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps {
  variant?: 'horizontal' | 'symbol' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'inverse';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  tone = 'default',
  className,
}) => {
  const sizeMap = {
    sm: { symbol: 'w-6 h-6', text: 'text-[17px]', gap: 'gap-2' },
    md: { symbol: 'w-7 h-7', text: 'text-xl', gap: 'gap-2.5' },
    lg: { symbol: 'w-9 h-9', text: 'text-2xl', gap: 'gap-3' },
  };

  const currentSize = sizeMap[size];

  const symbolElement = (
    <svg
      viewBox="0 0 256 256"
      className={cn(currentSize.symbol, 'flex-shrink-0')}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Biểu tượng AutoHub"
    >
      <path
        fill={tone === 'inverse' ? '#FFFFFF' : 'var(--accent)'}
        fillRule="evenodd"
        d="M 40 216 L 108 40 L 148 40 L 216 216 L 178 216 L 160 168 L 96 168 L 78 216 Z M 128 84 L 108 136 L 148 136 Z M 192 40 L 216 40 L 216 148 L 192 148 Z"
      />
    </svg>
  );

  if (variant === 'symbol' || variant === 'icon-only') {
    return <div className={cn('inline-flex items-center justify-center', className)}>{symbolElement}</div>;
  }

  return (
    <div className={cn('inline-flex items-center tracking-[-0.015em] font-semibold', currentSize.gap, className)}>
      {symbolElement}
      <div className={cn(currentSize.text, 'flex items-baseline leading-none')}>
        <span className={tone === 'inverse' ? 'text-white' : 'text-[var(--text)]'}>Auto</span>
        <span className={tone === 'inverse' ? 'text-white/85' : 'text-[var(--accent)]'}>Hub</span>
      </div>
    </div>
  );
};
