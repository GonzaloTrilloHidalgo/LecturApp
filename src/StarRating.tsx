import React from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  const MAX_STARS = 5;

  return (
    <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
      {[...Array(MAX_STARS)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={index}
            onClick={() => onChange(ratingValue)}
            style={{
              cursor: "pointer",
              color: ratingValue <= value ? "#facc15" : "#e5e7eb",
              fontSize: "1.5rem",
            }}
            role="button"
            aria-label={`${ratingValue} estrellas`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
