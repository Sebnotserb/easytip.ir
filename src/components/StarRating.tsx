"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Interactive star rating component (1–5).
 * Supports read-only mode for displaying ratings.
 */
export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "lg",
}: StarRatingProps) {
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    sm: "text-lg gap-0.5",
    md: "text-2xl gap-1",
    lg: "text-4xl gap-1",
  };

  return (
    <div className={`flex justify-center ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`star-hover transition-colors ${
            readonly ? "cursor-default" : "cursor-pointer"
          }`}
          disabled={readonly}
          aria-label={`${star} ستاره`}
        >
          <span
            className={
              star <= (hover || value) ? "text-yellow-400" : "text-gray-300"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
