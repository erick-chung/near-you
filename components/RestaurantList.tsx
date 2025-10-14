import { Restaurant } from "@/lib/types";
import { UtensilsCrossed } from "lucide-react";
import RestaurantCard from "./RestaurantCard";

export default function RestaurantList({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  return (
    <>
      {restaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-10 h-10 text-primary/60" />
          </div>
          <h3 className="font-sans font-semibold text-xl text-foreground mb-2 text-balance text-center">
            No restaurants found
          </h3>
          <p className="text-muted-foreground text-center leading-relaxed max-w-sm">
            Sorry, we couldn't find any restaurants in your area. Try adjusting
            your location or search criteria.
          </p>
        </div>
      ) : (
        restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))
      )}
    </>
  );
}

// When doing conditional rendering in the future, follow this format (WRAP EACH PART IN PARENTHESES):
// {condition ? (
//   <JSX />
// ) : (
//   <OtherJSX />
// )}
