import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-[13px] font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--line-strong)] rounded-[var(--radius)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25 focus:border-[var(--accent)] transition-colors',
            error && 'border-[var(--status-danger)] focus:ring-[var(--status-danger)]/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-[13px] text-[var(--status-danger)] font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
