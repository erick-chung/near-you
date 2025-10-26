import type { Restaurant } from "@/lib/types";
import { formatDistance } from "@/lib/utils/distance";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";

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
    photoUrl, // Add this to your Restaurant type if it doesn't exist
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
        aria-hidden="true"
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
    <article
      className="bg-card rounded-xl shadow-md border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 overflow-hidden"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "backwards",
      }}
    >
      {/* Restaurant Photo */}
      {photoUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={photoUrl}
            alt={`Photo of ${name} restaurant interior and food`}
            width={400}
            height={192}
            className="w-full h-full object-cover"
            priority={index < 3}
          />
          {/* Status badge overlay on photo */}
          {isOpen !== undefined && (
            <div className="absolute top-3 right-3">
              <span
                className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm transition-all ${
                  isOpen
                    ? "bg-primary/90 text-primary-foreground ring-1 ring-primary/20"
                    : "bg-black/60 text-white ring-1 ring-white/20"
                }`}
                aria-label={`Restaurant is currently ${isOpen ? "open" : "closed"}`}
              >
                {isOpen ? "Open" : "Closed"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-4">
        {/* Header with name and status badge (only if no photo) */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-sans font-semibold text-lg text-card-foreground leading-tight text-balance">
            {name}
          </h3>
          {!photoUrl && isOpen !== undefined && (
            <span
              className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide shrink-0 transition-all ${
                isOpen
                  ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                  : "bg-muted/50 text-muted-foreground ring-1 ring-border"
              }`}
              aria-label={`Restaurant is currently ${isOpen ? "open" : "closed"}`}
            >
              {isOpen ? "Open" : "Closed"}
            </span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {address}
          </p>
        </div>

        {/* Rating and reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
            {renderStars()}
          </div>
          <span className="text-sm font-medium text-foreground">{rating}</span>
          <span className="text-sm text-muted-foreground">
            ({reviewCount} reviews)
          </span>
        </div>

        {/* Price level and cuisine types */}
        {(priceLevel || (cuisineType && cuisineType.length > 0)) && (
          <div className="flex items-center gap-3 mb-3">
            {priceLevel && (
              <div className="text-sm font-medium" aria-label={`Price level: ${priceLevel}`}>
                {renderPriceLevel()}
              </div>
            )}
            {priceLevel && cuisineType && cuisineType.length > 0 && (
              <div className="h-4 w-px bg-border" aria-hidden="true" />
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
    </article>
  );
}