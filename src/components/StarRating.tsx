//@ts-nocheck
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  totalReviews,
  size = "md",
}: StarRatingProps) {
  const sizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const iconSize = sizes[size];

  return (
    <div className="flex items-center">
      <div className="flex text-primary">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <Star className={`${iconSize} fill-current`} />
            ) : star - 0.5 <= rating ? (
              <StarHalf className={`${iconSize} fill-current`} />
            ) : (
              <Star className={iconSize} />
            )}
          </span>
        ))}
      </div>
      {totalReviews !== undefined && (
        <span className="ml-2 text-sm text-muted-foreground">
          ({totalReviews})
        </span>
      )}
    </div>
  );
}
