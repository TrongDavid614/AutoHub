import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-[var(--radius)] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantClasses = {
    primary: 'bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)]',
    secondary: 'bg-[var(--surface-subtle)] text-[var(--text)] border border-[var(--line)] hover:bg-[var(--surface-muted)]',
    danger: 'bg-[var(--status-danger)] text-white hover:opacity-90',
    outline: 'border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-subtle)]',
    ghost: 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[13px] min-h-[36px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-6 py-2.5 text-base min-h-[44px]',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
