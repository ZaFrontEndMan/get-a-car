import React, { memo } from "react";
import CarCard from "../CarCard";

interface OptimizedCarCardProps {
  car: {
    id: string;
    title: string;
    brand: string;
    image?: string;
    images?: string[];
    price?: number;
    daily_rate?: number;
    weeklyPrice?: number;
    weekly_rate?: number;
    monthlyPrice?: number;
    monthly_rate?: number;
    rating?: number;
    features?: string[];
    seats: number;
    fuel?: string;
    fuel_type?: string;
    transmission: string;
    vendor?: {
      id: string;
      name: string;
      logo_url?: string;
    };
    vendors?: {
      id: string;
      name: string;
      logo_url?: string;
    };
    isWishList?: boolean;
  };

  viewMode?: "grid" | "list";
  animationDelay?: number;
}

const OptimizedCarCard = memo<OptimizedCarCardProps>(
  ({ car, viewMode, animationDelay = 0 }) => {
    return (
      <div
        className="animate-fade-in"
        style={{
          animationDelay: `${Math.min(animationDelay, 0.5)}s`,
        }}
      >
        <CarCard car={car} viewMode={viewMode} />
      </div>
    );
  }
);

OptimizedCarCard.displayName = "OptimizedCarCard";

export default OptimizedCarCard;
