import { FilterOptions } from "@/components/FilterBar";
import { Restaurant } from "../types";
import { convertPriceForSort } from "./formatting";

// Helper Function for sorting restaurants by chosen category
export function sortRestaurants(restaurants: Restaurant[], sortBy: string) {
  switch (sortBy) {
    case "distance":
      restaurants.sort((a, b) => a.distance - b.distance); // Ascending order (closest first)
      break;

    case "rating":
      restaurants.sort((a, b) => b.rating - a.rating); // Descending order (highest rating first)
      break;

    case "price":
      restaurants.sort(
        (a, b) =>
          convertPriceForSort(a.priceLevel) - convertPriceForSort(b.priceLevel)
      ); // Ascending order (Cheapest prices first)
      break;

    case "name":
      restaurants.sort((a, b) => a.name.localeCompare(b.name)); // Ascending order (A-Z)
      break;
  }
  return restaurants; // return statement should be outside switch
}

// Helper Function for filtering restaurants based on selected filters (All selected filters must be satisfied to be included in the filtered options)
export function filterRestaurants(
  restaurants: Restaurant[],
  filters: FilterOptions
) {
  if (!filters) return restaurants; // Return original data if there's no filter

  const filteredRestaurants = restaurants.filter((restaurant) => {
    return (
      (!filters.minRating || restaurant.rating >= filters.minRating) &&
      restaurant.isOpen === filters.openNow &&
      (!filters.priceLevel.length ||
        (restaurant.priceLevel &&
          filters.priceLevel.includes(restaurant.priceLevel))) &&
      (!filters.cuisineType.length ||
        (restaurant.cuisineType &&
          restaurant.cuisineType.some((cuisine) =>
            filters.cuisineType.includes(cuisine)
          )))
    );
  });
  return filteredRestaurants;
}

