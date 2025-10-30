"use client"

import type { Restaurant } from "@/lib/types"
import { Star, Trash2 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { formatCuisineTypes } from "@/lib/utils/cuisine-mapping"
import { RestaurantModal } from "./RestaurantModal"

interface FavoriteCardProps {
  restaurant: Restaurant
  onRemove: (id: string) => void
  index: number
  featured?: boolean
}

export function FavoriteCard({ restaurant, onRemove, index, featured = false }: FavoriteCardProps) {
  const { id, name, address, rating, reviewCount, priceLevel, cuisineType, isOpen, photoUrl } = restaurant
  const [isRemoving, setIsRemoving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRemoving(true)
    setTimeout(() => {
      onRemove(id)
    }, 300)
  }

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsModalOpen(true)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`}
        aria-hidden="true"
      />
    ))
  }

  const renderPriceLevel = () => {
    const level = priceLevel?.length || 0
    return Array.from({ length: 4 }, (_, i) => (
      <span key={i} className={`text-sm ${i < level ? "text-foreground" : "text-muted-foreground/50"}`} aria-hidden="true">
        $
      </span>
    ))
  }

  const getPriceDescription = () => {
    const level = priceLevel?.length || 0;
    const descriptions = ["Budget-friendly", "Moderate", "Expensive", "Very expensive"];
    return descriptions[level - 1] || "Price not available";
  };

  const displayCuisineTypes = cuisineType && cuisineType.length > 0 
    ? formatCuisineTypes(cuisineType) 
    : [];

  const rotation = index % 3 === 0 ? "sm:rotate-1" : index % 3 === 1 ? "sm:-rotate-1" : "sm:rotate-0"

  return (
    <>
      <div
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${name} restaurant. ${rating} stars, ${getPriceDescription()}, ${displayCuisineTypes.slice(0, 2).join(", ")} cuisine. Click to open details modal.`}
        className={`group relative bg-card rounded-2xl shadow-lg border-4 border-card p-3 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:rotate-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${rotation} ${
          isRemoving ? "opacity-0 scale-75" : "opacity-100 scale-100"
        } ${featured ? "sm:col-span-2 lg:col-span-1" : ""} animate-in fade-in slide-in-from-bottom-4`}
        style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
      >
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label={`Remove ${name} from favorites`}
          type="button"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>

        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3">
          <Image
            src={photoUrl || "/placeholder.svg?height=400&width=400&query=restaurant food"}
            alt={`Interior and food at ${name} restaurant`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {isOpen !== undefined && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
              <span
                className={`inline-flex items-center justify-center rounded-full px-2 sm:px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
                  isOpen
                    ? "bg-primary/90 text-primary-foreground"
                    : "bg-muted/90 text-muted-foreground ring-1 ring-border"
                }`}
                aria-label={`Restaurant is currently ${isOpen ? "open" : "closed"}`}
                role="status"
              >
                {isOpen ? "Open Now" : "Closed"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base sm:text-lg text-card-foreground leading-tight line-clamp-2 text-balance group-hover:text-primary transition-colors">
            {name}
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars rating`}>
              {renderStars()}
            </div>
            <span className="text-sm font-medium text-foreground">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>

          {(priceLevel || displayCuisineTypes.length > 0) && (
            <div className="flex items-center gap-2 text-sm">
              {priceLevel && (
                <div className="font-medium" aria-label={`Price level: ${getPriceDescription()}`}>
                  {renderPriceLevel()}
                </div>
              )}
              {priceLevel && displayCuisineTypes.length > 0 && (
                <span className="text-muted-foreground">•</span>
              )}
              {displayCuisineTypes.length > 0 && (
                <div className="text-muted-foreground line-clamp-1 text-xs sm:text-sm">
                  {displayCuisineTypes.slice(0, 2).join(", ")}
                  {displayCuisineTypes.length > 2 && (
                    <span className="text-primary font-medium">
                      {" "}+{displayCuisineTypes.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <address className="text-xs text-muted-foreground line-clamp-2 leading-relaxed not-italic">
            {address}
          </address>
        </div>
      </div>

      <RestaurantModal
        restaurant={restaurant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}