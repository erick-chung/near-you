import type { Restaurant } from "@/lib/types";
import { formatDistance } from "@/lib/utils/distance";
import { Star, MapPin, Heart } from "lucide-react";
import Image from "next/image";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import { formatCuisineTypes } from "@/lib/utils/cuisine-mapping";
import { RestaurantModal } from "./RestaurantModal";

export function RestaurantCard({
  restaurant,
  index = 0,
  searchedAddress,
}: {
  restaurant: Restaurant;
  index?: number;
  searchedAddress?: string;
}) {
  const { user } = useUser();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    name,
    address,
    rating,
    reviewCount,
    priceLevel,
    cuisineType,
    distance,
    isOpen,
    photoUrl, 
  } = restaurant;

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!user) return; 
    
    setIsProcessing(true);
    try {
      if (isFavorite(restaurant.id)) {
        await removeFromFavorites(restaurant.id);
      } else {
        await addToFavorites(restaurant);
      }
    } finally {
      setIsProcessing(false);
    }
  };

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
        aria-hidden="true"
      >
        $
      </span>
    ));
  };

  const getPriceDescription = () => {
    const level = priceLevel?.length || 0;
    const descriptions = ["Budget-friendly", "Moderate", "Expensive", "Very expensive"];
    return descriptions[level - 1] || "Price not available";
  };

  const HeartButton = () => {
    const isFav = isFavorite(restaurant.id);
    
    return (
      <button
        onClick={handleHeartClick}
        disabled={isProcessing}
        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
          isFav 
            ? "bg-red-500/90 text-white shadow-lg" 
            : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
        }`}
        aria-label={`${isFav ? "Remove" : "Add"} ${name} ${isFav ? "from" : "to"} favorites`}
        type="button"
      >
        <Heart 
          className={`h-4 w-4 transition-all ${
            isFav ? "fill-current" : ""
          } ${isProcessing ? "animate-pulse" : ""}`} 
          aria-hidden="true"
        />
      </button>
    );
  };

  // Format cuisine types for display using the new utility
  const displayCuisineTypes = cuisineType && cuisineType.length > 0 
    ? formatCuisineTypes(cuisineType) 
    : [];

  return (
    <>
      <article
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${name} restaurant. ${rating} stars, ${getPriceDescription()}, ${displayCuisineTypes.slice(0, 2).join(", ")} cuisine. Click to open details modal.`}
        className="bg-card rounded-xl shadow-md border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 overflow-hidden relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        style={{
          animationDelay: `${index * 50}ms`,
          animationFillMode: "backwards",
        }}
      >
        {/* Heart Button */}
        <div className="absolute top-3 left-3 z-10">
          {user ? (
            <HeartButton />
          ) : (
            <SignInButton mode="modal">
              <button
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking sign in
                className="p-2 rounded-full bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label={`Sign in to add ${name} to favorites`}
                type="button"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
              </button>
            </SignInButton>
          )}
        </div>

        {/* Restaurant Photo */}
        {photoUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={photoUrl}
              alt={`Interior and food at ${name} restaurant`}
              width={400}
              height={192}
              className="w-full h-full object-cover"
              priority={index < 3}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  role="status"
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
          <header className="flex items-start justify-between gap-3 mb-3">
            <h2 className="font-sans font-semibold text-lg text-card-foreground leading-tight text-balance">
              {name}
            </h2>
            {!photoUrl && isOpen !== undefined && (
              <span
                className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide shrink-0 transition-all ${
                  isOpen
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                    : "bg-muted/50 text-muted-foreground ring-1 ring-border"
                }`}
                aria-label={`Restaurant is currently ${isOpen ? "open" : "closed"}`}
                role="status"
              >
                {isOpen ? "Open" : "Closed"}
              </span>
            )}
          </header>

          {/* Address */}
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
            <address className="text-sm text-muted-foreground leading-relaxed not-italic">
              {address}
            </address>
          </div>

          {/* Rating and reviews */}
          <div className="flex items-center gap-2 mb-3">
            <div 
              className="flex items-center gap-1" 
              role="img" 
              aria-label={`${rating} out of 5 stars rating`}
            >
              {renderStars()}
            </div>
            <span className="text-sm font-medium text-foreground">{rating}</span>
            <span className="text-sm text-muted-foreground">
              ({reviewCount.toLocaleString()} review{reviewCount !== 1 ? 's' : ''})
            </span>
          </div>

          {/* Price level and cuisine types */}
          {(priceLevel || displayCuisineTypes.length > 0) && (
            <div className="flex items-center gap-3 mb-3">
              {priceLevel && (
                <div className="text-sm font-medium" aria-label={`Price level: ${getPriceDescription()}`}>
                  {renderPriceLevel()}
                </div>
              )}
              {priceLevel && displayCuisineTypes.length > 0 && (
                <div className="h-4 w-px bg-border" aria-hidden="true" />
              )}
              {displayCuisineTypes.length > 0 && (
                <div className="text-sm text-muted-foreground" role="list" aria-label="Cuisine types">
                  {displayCuisineTypes.slice(0, 2).map((cuisine, index) => (
                    <span key={index} role="listitem" className="inline">
                      {cuisine}
                      {index < Math.min(displayCuisineTypes.length, 2) - 1 && " • "}
                    </span>
                  ))}
                  {displayCuisineTypes.length > 2 && (
                    <span className="text-primary font-medium">
                      {" "}+{displayCuisineTypes.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Distance */}
          <footer className="pt-3 border-t border-border">
            <p className="text-sm font-medium text-primary">
              {formatDistance(distance)} away
            </p>
          </footer>
        </div>
      </article>

      {/* Modal */}
      <RestaurantModal
        restaurant={restaurant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startingAddress={searchedAddress}
      />
    </>
  );
}