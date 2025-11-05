import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ 
  className, 
  size = 'md',
  ...props 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div 
      className={cn(
        sizeClasses[size],
        'border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin',
        className
      )}
      {...props}
    />
  );
}