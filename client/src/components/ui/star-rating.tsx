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
  rating = 0,
  maxRating = 5,
  size = 'md',
  showScore = false,
  reviewCount,
  className,
}: StarRatingProps) {
  // Ensure rating is a valid number and within bounds
  const validRating = isNaN(rating) ? 0 : Math.max(0, Math.min(rating, maxRating));
  
  // Calculate star counts
  const fullStars = Math.floor(validRating);
  const hasHalfStar = validRating % 1 >= 0.5;
  const emptyStars = Math.max(0, maxRating - fullStars - (hasHalfStar ? 1 : 0));
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  const starSize = sizeClasses[size];
  
  // Create arrays of correct length for rendering
  const fullStarsArray = Array(fullStars).fill(null);
  const emptyStarsArray = Array(emptyStars).fill(null);
  
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex">
        {fullStarsArray.map((_, i) => (
          <StarIcon key={`full-${i}`} className={cn(starSize, "text-yellow-400 fill-yellow-400")} />
        ))}
        
        {hasHalfStar && (
          <StarHalfIcon className={cn(starSize, "text-yellow-400 fill-yellow-400")} />
        )}
        
        {emptyStarsArray.map((_, i) => (
          <StarIcon key={`empty-${i}`} className={cn(starSize, "text-yellow-400")} />
        ))}
      </div>
      
      {showScore && (
        <span className="text-sm text-gray-500 ml-2">
          {validRating.toFixed(1)}
          {reviewCount !== undefined && ` (${reviewCount})`}
        </span>
      )}
    </div>
  );
}
