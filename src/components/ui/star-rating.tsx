"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // The current rating value
  maxRating?: number; // Maximum rating (usually 5)
  onRatingChange?: (rating: number) => void; // Callback when rating changes (if interactive)
  readOnly?: boolean; // If true, rating cannot be changed
  size?: number; // Size of the stars in pixels
  className?: string; // Additional CSS classes
  iconClassName?: string; // Class for individual star icons
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onRatingChange,
  readOnly = false,
  size = 24,
  className,
  iconClassName,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    if (!readOnly && onRatingChange) {
      setHoverRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly && onRatingChange) {
      setHoverRating(null);
    }
  };

  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const displayRating = hoverRating ?? rating;

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;
        // Handle half stars (optional, more complex)
        // const isHalf = !isFilled && starValue - 0.5 <= displayRating;

        return (
          <Star
            key={index}
            size={size}
            className={cn(
              "transition-colors duration-150 ease-in-out",
              isFilled
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground/50",
              !readOnly && onRatingChange
                ? "cursor-pointer hover:scale-110"
                : "",
              iconClassName
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleClick(index)}
            aria-hidden="true" // Hide decorative stars from screen readers
          />
        );
      })}
      {/* Add hidden input for forms or screen reader text */}
      <span className="sr-only">
        {rating} out of {maxRating} stars
      </span>
    </div>
  );
};

export default StarRating;
