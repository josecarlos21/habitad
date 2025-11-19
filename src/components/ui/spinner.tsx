
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icons } from '../icons';

const spinnerVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      default: 'h-4 w-4',
      sm: 'h-2 w-2',
      lg: 'h-8 w-8',
      icon: 'h-5 w-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function Spinner({ size, className }: SpinnerProps) {
  return (
    <div role="status">
      <Icons.spinner className={cn(spinnerVariants({ size }), className)} />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
