import type { Restaurant } from "@/lib/types";
import { RestaurantCard } from "./RestaurantCard";
import RestaurantCardSkeleton from "./RestaurantCardSkeleton";
import { UtensilsCrossed } from "lucide-react";

export function RestaurantList({
  restaurants,
  isLoading,
}: {
  restaurants: Restaurant[];
  isLoading: boolean;
}) {
  return (
    <>
      {isLoading ? (
        <div aria-live="polite" aria-label="Loading restaurants">
          {Array.from({ length: 6 }).map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <section className="flex flex-col items-center justify-center py-16 px-4" aria-label="No restaurants found">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-10 h-10 text-primary/60" aria-hidden="true" />
          </div>
          <h3 className="font-sans font-semibold text-xl text-foreground mb-2 text-balance text-center">
            No restaurants found
          </h3>
          <p className="text-muted-foreground text-center leading-relaxed max-w-sm">
            Sorry, we could not find any restaurants in your area. Try adjusting
            your location or search criteria.
          </p>
        </section>
      ) : (
        <div role="feed" aria-label="Restaurant results">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              index={index}
            />
          ))}
        </div>
      )}
    </>
  );
}