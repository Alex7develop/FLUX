import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@flux/utils';

interface FluxButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
}

export function FluxButton({
  variant = 'primary',
  className,
  children,
  ...props
}: FluxButtonProps) {
  return (
    <button className={cn('flux-button', `flux-button--${variant}`, className)} {...props}>
      {children}
    </button>
  );
}
