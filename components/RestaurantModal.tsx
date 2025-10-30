"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Navigation, Star, MapPin, X } from "lucide-react";
import { Restaurant } from "@/lib/types";
import { formatCuisineTypes } from "@/lib/utils/cuisine-mapping";
import { formatDistance } from "@/lib/utils/distance";
import Image from "next/image";

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  startingAddress?: string;
}

export function RestaurantModal({ restaurant, isOpen, onClose, startingAddress }: RestaurantModalProps) {
  if (!restaurant) return null;

  const {
    name,
    address,
    rating,
    reviewCount,
    priceLevel,
    cuisineType,
    distance,
    isOpen: restaurantIsOpen,
    photoUrl,
    website,
  } = restaurant;

  const displayCuisineTypes = cuisineType && cuisineType.length > 0 ? formatCuisineTypes(cuisineType) : [];

  const handleDirections = () => {
    const encodedDestination = encodeURIComponent(address);

    let mapsUrl;
    if (startingAddress) {
      // Use provided starting address
      const encodedStart = encodeURIComponent(startingAddress);
      mapsUrl = `https://www.google.com/maps/dir/${encodedStart}/${encodedDestination}`;
    } else {
      // Use current location (existing behavior)
      mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;
    }

    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  const handleWebsite = () => {
    if (website) {
      window.open(website, "_blank", "noopener,noreferrer");
    } else {
      // Fallback: Google search for restaurant
      const searchQuery = encodeURIComponent(`${name} ${address} menu`);
      window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank", "noopener,noreferrer");
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
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
        className={`text-lg font-bold ${index < level ? "text-green-600" : "text-gray-300"}`}
        aria-hidden="true"
      >
        $
      </span>
    ));
  };

  const priceDescription = () => {
    const level = priceLevel?.length || 0;
    const descriptions = ["Budget-friendly", "Moderate", "Expensive", "Very expensive"];
    return descriptions[level - 1] || "Price not available";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] max-w-lg mx-auto p-0 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-2xl sm:w-full max-h-[90vh] overflow-y-auto"
        aria-describedby="restaurant-details"
      >
        {/* Accessible title */}
        <DialogTitle className="sr-only">{name} Restaurant Details and Actions</DialogTitle>

        {/* Header with close button */}
        <header className="relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label={`Close ${name} restaurant details modal`}
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          {/* Restaurant Photo */}
          {photoUrl ? (
            <div className="relative h-40 sm:h-48 w-full">
              <Image
                src={photoUrl}
                alt={`Interior and food at ${name} restaurant`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 95vw, 512px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" aria-hidden="true" />
            </div>
          ) : (
            <div
              className="h-40 sm:h-48 w-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center"
              role="img"
              aria-label="Restaurant placeholder image"
            >
              <span className="text-4xl sm:text-6xl" role="img" aria-label="Restaurant icon">
                🍽️
              </span>
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="p-4 sm:p-6 space-y-3 sm:space-y-4" id="restaurant-details">
          {/* Restaurant name and status */}
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{name}</h1>
            {restaurantIsOpen !== undefined && (
              <span
                className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                  restaurantIsOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
                aria-label={`Restaurant is currently ${restaurantIsOpen ? "open" : "closed"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-1 sm:mr-2 ${restaurantIsOpen ? "bg-green-400" : "bg-red-400"}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">{restaurantIsOpen ? "Open Now" : "Closed"}</span>
                <span className="sm:hidden">{restaurantIsOpen ? "Open" : "Closed"}</span>
              </span>
            )}
          </div>

          {/* Rating section */}
          <section aria-labelledby="rating-heading">
            <h2 id="rating-heading" className="sr-only">
              Customer Rating
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of 5 stars rating`}>
                {renderStars()}
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">{rating}</span>
              <span className="text-xs sm:text-sm text-gray-600">
                ({reviewCount.toLocaleString()} review{reviewCount !== 1 ? "s" : ""})
              </span>
            </div>
          </section>

          {/* Price and cuisine section */}
          <section aria-labelledby="details-heading">
            <h2 id="details-heading" className="sr-only">
              Restaurant Details
            </h2>
            <div className="flex items-center gap-3 sm:gap-4">
              {priceLevel && (
                <div className="flex items-center gap-1">
                  <span className="sr-only">Price level: {priceDescription()}</span>
                  {renderPriceLevel()}
                </div>
              )}
              {displayCuisineTypes.length > 0 && (
                <div className="flex flex-wrap gap-1" role="list" aria-label="Cuisine types">
                  {displayCuisineTypes.slice(0, 3).map((cuisine, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
                      role="listitem"
                    >
                      {cuisine}
                    </span>
                  ))}
                  {displayCuisineTypes.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      +{displayCuisineTypes.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Location section */}
          <section aria-labelledby="location-heading">
            <h2 id="location-heading" className="sr-only">
              Location Information
            </h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <address className="text-xs sm:text-sm text-gray-600 leading-relaxed not-italic">{address}</address>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-blue-500" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-blue-600">{formatDistance(distance)} away</span>
              </div>
            </div>
          </section>

          {/* Action buttons section */}
          <section aria-labelledby="actions-heading">
            <h2 id="actions-heading" className="sr-only">
              Available Actions
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4" role="group" aria-label="Restaurant actions">
              <Button
                onClick={handleWebsite}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-sm"
                aria-label={website ? `Visit ${name} website and view menu` : `Search for ${name} menu online`}
                type="button"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" aria-hidden="true" />
                Website
              </Button>
              <Button
                onClick={handleDirections}
                variant="outline"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                aria-label={`Get directions to ${name} at ${address}`}
                type="button"
              >
                <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" aria-hidden="true" />
                Directions
              </Button>
            </div>
          </section>

          {/* Decorative element */}
          <div className="text-center pt-2" aria-hidden="true">
            <span className="text-xl sm:text-2xl">🍴 ✨ 🥘</span>
          </div>
        </main>
      </DialogContent>
    </Dialog>
  );
}
