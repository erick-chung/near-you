"use client";

import { FavoriteCard } from "@/components/FavoriteCard";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { UtensilsCrossed, Heart, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavoritesContext();

  const handleRemoveFavorite = async (restaurantId: string) => {
    await removeFromFavorites(restaurantId);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Back button */}
        <div className="mb-6 sm:mb-8">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="group hover:bg-primary/10 -ml-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
              Back to Search
            </Button>
          </Link>
        </div>

        <div className="mb-8 sm:mb-12 text-center relative">
          {/* Decorative food icons */}
          <div className="absolute -top-3 sm:-top-4 left-1/4 text-primary/20 animate-bounce hidden sm:block" style={{ animationDelay: "0s" }}>
            <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div className="absolute -top-2 right-1/4 text-primary/20 animate-bounce hidden sm:block" style={{ animationDelay: "0.5s" }}>
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 fill-primary text-primary animate-pulse" />
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Your Favorite Spots
            </h1>
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 fill-primary text-primary animate-pulse" />
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty px-4">
            Your personal collection of delicious discoveries
          </p>
        </div>

        {favorites.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr">
              {favorites.map((favorite, index) => (
                <FavoriteCard
                  key={favorite.id}
                  restaurant={{
                    id: favorite.restaurantId,
                    name: favorite.name,
                    address: favorite.address,
                    coordinates: { lat: 0, lng: 0 },
                    rating: favorite.rating || 0,
                    reviewCount: 0,
                    priceLevel: favorite.priceLevel || undefined,
                    cuisineType: favorite.cuisineType,
                    isOpen: undefined,
                    distance: 0,
                    photoUrl: favorite.photoUrl || undefined,
                  }}
                  onRemove={() => handleRemoveFavorite(favorite.restaurantId)}
                  index={index}
                  featured={index % 5 === 0}
                />
              ))}
            </div>

            {/* Stats footer */}
            <div className="mt-8 sm:mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full border border-primary/20">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {favorites.length} {favorites.length === 1 ? "favorite" : "favorites"} saved
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
            <div className="relative mb-6 sm:mb-8">
              {/* Decorative plate illustration */}
              <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30 animate-spin-slow" />
                <UtensilsCrossed className="h-16 w-16 sm:h-24 sm:w-24 text-primary/40" />
              </div>
              {/* Floating food icons */}
              <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 text-2xl sm:text-4xl animate-bounce" style={{ animationDelay: "0s" }}>
                🍕
              </div>
              <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 text-2xl sm:text-4xl animate-bounce" style={{ animationDelay: "0.3s" }}>
                🍜
              </div>
              <div className="absolute top-1/2 -right-4 sm:-right-8 text-xl sm:text-3xl animate-bounce" style={{ animationDelay: "0.6s" }}>
                🍔
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance text-center">
              Your plate is empty!
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-md text-center text-pretty">
              Start exploring and save your favorite restaurants to create your personal foodie collection
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              Discover Restaurants
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}