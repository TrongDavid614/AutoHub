import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'subtle';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-slate-900/90 border border-slate-800 text-slate-100 shadow-sm',
      elevated: 'bg-slate-900 border border-slate-700/80 text-slate-100 shadow-lg shadow-black/30',
      glass: 'bg-slate-900/60 backdrop-blur-md border border-slate-800/80 text-slate-100',
      subtle: 'bg-slate-950/60 border border-slate-800/60 text-slate-200',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl overflow-hidden transition-all duration-200',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between p-5 pb-3 border-b border-slate-800/60 gap-4', className)}
      {...props}
    >
      <div className="space-y-1">{children}</div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-base font-bold text-white tracking-tight flex items-center gap-2', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xs text-slate-400 font-normal', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between p-5 pt-3 border-t border-slate-800/60 text-xs text-slate-400', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
