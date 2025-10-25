"use client";
import { ErrorMessage } from "@/components/ErrorMessage";
import { RestaurantList } from "@/components/RestaurantList";
import SearchForm from "@/components/SearchForm";
import type { Restaurant } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchRestaurants } from "@/lib/actions/places.action";
import { FilterBar, FilterOptions, SortOption } from "@/components/FilterBar";
import { filterRestaurants, sortRestaurants } from "@/lib/utils/filtering";
import MapView from "@/components/MapView";

export default function ResultsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [processedRestaurants, setProcessedRestaurants] = useState<
    Restaurant[]
  >([]);
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const [filters, setFilters] = useState<FilterOptions>({
    priceLevel: [],
    minRating: null,
    openNow: true,
    cuisineType: [],
  });

  // Setup useSearchParams from Next.js
  const searchParams = useSearchParams();

  // Extract values from URL (Add default values for numbers just incase its null)
  const originalAddress = searchParams.get("address");
  const address = originalAddress || "Current Location";
  const radius = Number(searchParams.get("radius")) || 1000;
  const lat = Number(searchParams.get("lat")) || 0;
  const lng = Number(searchParams.get("lng")) || 0;

  useEffect(() => {
    async function getRestaurants() {
      try {
        setIsLoading(true);
        setError(null);
        const results = await searchRestaurants({
          coordinates: {
            lat,
            lng,
          },
          radius,
        });
        if (!results) throw new Error("Unable to search restaurants");
        setRestaurants(results);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }
    getRestaurants();
  }, [lat, lng, radius]);

  useEffect(() => {
    if (!restaurants || restaurants.length === 0) return;

    // The order of operations actually matters here. It's important to filter first and THEN SORT. Why? Because 1. why sort something if youre just gonna end up filtering it out anyways. 2. Filtering first produces a smaller array and reduces the dataset so there's fewer things to sort = BETTER PERFORMANCE

    // Filter logic
    const filteredRestaurants = filterRestaurants(restaurants, filters);
    // Sorting logic

    const sortedRestaurants = sortRestaurants(filteredRestaurants, sortBy);

    // Set Processed data
    setProcessedRestaurants(sortedRestaurants);
  }, [restaurants, sortBy, filters]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 max-w-2xl">
          <SearchForm compact={true} address={address} radius={radius} />
        </div>

        {error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            <header className="mb-8 sm:mb-10 space-y-4">
              <div className="space-y-2">
                <h1 className="font-sans font-bold text-3xl sm:text-4xl text-foreground text-balance">
                  {originalAddress
                    ? `Restaurants near ${originalAddress}`
                    : "Restaurants Near You"}
                </h1>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  Discover delicious dining options in your area
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 ring-1 ring-primary/20">
                <span className="text-sm font-medium text-primary">
                  {`${processedRestaurants.length} ${
                    processedRestaurants.length === 1
                      ? "restaurant"
                      : "restaurants"
                  } found `}
                </span>
              </div>
            </header>
            <div className="mb-6">
              <FilterBar
                sortBy={sortBy}
                filters={filters}
                onSortChange={setSortBy}
                onFilterChange={setFilters}
              />
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
              <div className="w-full xl:w-1/2">
                <div className="xl:max-h-[calc(100vh-200px)] xl:overflow-y-auto xl:pr-2">
                  <RestaurantList
                    restaurants={processedRestaurants}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              <div className="w-full xl:w-1/2 xl:sticky xl:top-4 xl:self-start">
                <div className="h-[400px] xl:h-[calc(100vh-200px)] xl:min-h-[600px]">
                  <MapView
                    coordinates={{ lat, lng }}
                    processedRestaurants={processedRestaurants}
                    searchLocation={address}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
