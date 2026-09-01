'use client';

import { Star } from 'lucide-react';
import { cn } from '@/shared/lib/utils/tailwind-cn';
import { useState } from 'react';

interface StarRatingProps {
  value: number; // 0 to 5
  onChange?: (value: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StarRating({
  value,
  onChange,
  interactive = false,
  size = 'md',
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizes = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  };

  const currentDisplayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      onMouseLeave={() => interactive && setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = starIndex <= currentDisplayValue;
        return (
          <button
            key={starIndex}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starIndex)}
            onMouseEnter={() => interactive && setHoverValue(starIndex)}
            className={cn(
              'transition-colors focus:outline-none',
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizes[size],
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-slate-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
