import React from 'react';
import { StarIcon, StarHalfIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showScore = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  const starSize = sizeClasses[size];
  
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} className={cn(starSize, "text-yellow-400 fill-yellow-400")} />
        ))}
        
        {hasHalfStar && (
          <StarHalfIcon className={cn(starSize, "text-yellow-400 fill-yellow-400")} />
        )}
        
        {[...Array(maxRating - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <StarIcon key={`empty-${i}`} className={cn(starSize, "text-yellow-400")} />
        ))}
      </div>
      
      {showScore && (
        <span className="text-sm text-gray-500 ml-2">
          {rating.toFixed(1)}
          {reviewCount !== undefined && ` (${reviewCount})`}
        </span>
      )}
    </div>
  );
}
