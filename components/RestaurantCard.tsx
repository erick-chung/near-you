import type { Restaurant } from "@/lib/types";
import { formatDistance } from "@/lib/utils/distance";
import { Star, MapPin } from "lucide-react";

export function RestaurantCard({
  restaurant,
  index = 0,
}: {
  restaurant: Restaurant;
  index?: number;
}) {
  const {
    name,
    address,
    rating,
    reviewCount,
    priceLevel,
    cuisineType,
    distance,
    isOpen,
  } = restaurant;

  // Generate star rating display
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? "fill-primary text-primary"
            : "fill-muted text-muted"
        }`}
      />
    ));
  };

  const renderPriceLevel = () => {
    const level = priceLevel?.length || 0;
    return Array.from({ length: 4 }, (_, index) => (
      <span
        key={index}
        className={`${
          index < level ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        $
      </span>
    ));
  };

  return (
    <div
      className="bg-card rounded-xl shadow-md p-4 border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "backwards",
      }}
    >
      {/* Header with name and open/closed badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-sans font-semibold text-lg text-card-foreground leading-tight text-balance">
          {name}
        </h3>
        {isOpen !== undefined && (
          <span
            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide shrink-0 transition-all ${
              isOpen
                ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                : "bg-muted/50 text-muted-foreground ring-1 ring-border"
            }`}
          >
            {isOpen ? "Open" : "Closed"}
          </span>
        )}
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {address}
        </p>
      </div>

      {/* Rating and reviews */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">{renderStars()}</div>
        <span className="text-sm font-medium text-foreground">{rating}</span>
        <span className="text-sm text-muted-foreground">
          ({reviewCount} reviews)
        </span>
      </div>

      {/* Price level and cuisine types */}
      {(priceLevel || (cuisineType && cuisineType.length > 0)) && (
        <div className="flex items-center gap-3 mb-3">
          {priceLevel && (
            <div className="text-sm font-medium">{renderPriceLevel()}</div>
          )}
          {priceLevel && cuisineType && cuisineType.length > 0 && (
            <div className="h-4 w-px bg-border" />
          )}
          {cuisineType && cuisineType.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {cuisineType.join(" • ")}
            </p>
          )}
        </div>
      )}

      {/* Distance */}
      <div className="pt-3 border-t border-border">
        <p className="text-sm font-medium text-primary">
          {formatDistance(distance)} away
        </p>
      </div>
    </div>
  );
}
