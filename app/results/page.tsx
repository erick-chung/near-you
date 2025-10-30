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
import { UtensilsCrossed, MapPin, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  const searchedAddress = searchParams.get('address') || '';

  useEffect(() => {
    async function getRestaurants() {
      // Safety check: Don't make API calls with invalid coordinates
      if (!lat || !lng || lat === 0 || lng === 0) {
        console.warn('Invalid coordinates, skipping restaurant search:', { lat, lng });
        return;
      }

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

  useEffect(() => {
  if (processedRestaurants.length > 0) {
    // Scroll to restaurant results section
    const restaurantList = document.querySelector('[aria-label="Restaurant list"]');
    if (restaurantList) {
      restaurantList.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }
}, [processedRestaurants]);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorative elements - desktop only */}
      <div className="absolute -top-4 left-8 text-primary/10 animate-bounce hidden lg:block" style={{ animationDelay: "1s" }}>
        <UtensilsCrossed className="h-12 w-12" />
      </div>
      <div className="absolute top-16 right-8 text-primary/10 animate-bounce hidden lg:block" style={{ animationDelay: "1.5s" }}>
        <Sparkles className="h-10 w-10" />
      </div>
      <div className="absolute top-32 left-4 text-3xl opacity-10 animate-bounce hidden lg:block" style={{ animationDelay: "2s" }}>
        🍽️
      </div>
      <div className="absolute top-48 right-12 text-2xl opacity-10 animate-bounce hidden lg:block" style={{ animationDelay: "0.5s" }}>
        🥘
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative">
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

        {/* Search form section */}
        <section className="mb-6 max-w-2xl relative" aria-label="Search form">
          {/* Decorative background for search */}
          <div className="absolute inset-0 -m-4 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent -z-10" />
          <SearchForm compact={true} address={address} radius={radius} />
        </section>

        {error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {/* Results header - FIXED ALIGNMENT */}
            <header className="mb-8 sm:mb-10 space-y-4 relative">
              {/* Floating food emojis - desktop only and positioned safely */}
              <div className="absolute -top-4 -left-8 text-2xl animate-bounce opacity-30 hidden lg:block" style={{ animationDelay: "0.3s" }}>
                🍕
              </div>
              <div className="absolute -top-4 -right-8 text-2xl animate-bounce opacity-30 hidden lg:block" style={{ animationDelay: "0.8s" }}>
                🍜
              </div>

              <div className="space-y-2">
                {/* FIXED: Proper alignment and icon sizing */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="h-7 w-7 sm:h-8 sm:w-8 text-primary animate-pulse flex-shrink-0" />
                  <h1 className="font-sans font-bold text-3xl sm:text-4xl text-foreground text-balance">
                    {originalAddress
                      ? `Restaurants near ${originalAddress}`
                      : "Restaurants Near You"}
                  </h1>
                  <UtensilsCrossed className="h-7 w-7 sm:h-8 sm:w-8 text-primary animate-pulse flex-shrink-0" />
                </div>
                {/* FIXED: Proper indentation to align with title */}
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg ml-9 sm:ml-11">
                  Discover delicious dining options in your area
                </p>
              </div>
              
              {/* Enhanced results counter */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 ring-1 ring-primary/20 shadow-sm hover:shadow-md transition-shadow" role="status" aria-live="polite">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  {`${processedRestaurants.length} ${
                    processedRestaurants.length === 1
                      ? "restaurant"
                      : "restaurants"
                  } found `}
                </span>
                <UtensilsCrossed className="h-4 w-4 text-primary" />
              </div>
            </header>

            {/* Filter section with decorative elements - desktop only */}
            <section className="mb-6 relative" aria-label="Filter and sort options">
              <div className="absolute -top-2 -left-2 text-primary/20 hidden lg:block">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="absolute -top-2 -right-2 text-primary/20 hidden lg:block">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <FilterBar
                sortBy={sortBy}
                filters={filters}
                onSortChange={setSortBy}
                onFilterChange={setFilters}
              />
            </section>

            {/* Main content area with decorative background */}
            <div className="flex flex-col lg:flex-row gap-6 relative">
              {/* Background decoration */}
              <div className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-br from-primary/3 via-transparent to-primary/5 -z-10" />
              
              <section className="w-full lg:w-1/2 relative" aria-label="Restaurant list">
                {/* Floating decorative elements - desktop only */}
                <div className="absolute -top-4 -left-4 text-lg opacity-20 animate-bounce hidden lg:block" style={{ animationDelay: "1.2s" }}>
                  🍔
                </div>
                <div className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto culg:pr-2">
                  <RestaurantList
                    restaurants={processedRestaurants}
                    isLoading={isLoading}
                    searchedAddress={searchedAddress}
                  />
                </div>
              </section>

              <section className="w-full lg:w-1/2 lg:sticky lg:top-4 lg:self-start relative" aria-label="Restaurant map">
                {/* Map decorative elements - desktop only */}
                <div className="absolute -top-4 -right-4 text-lg opacity-20 animate-bounce hidden lg:block" style={{ animationDelay: "1.7s" }}>
                  🗺️
                </div>
                <div className="h-[400px] lg:h-[calc(100vh-200px)] lg:min-h-[600px] rounded-xl overflow-hidden border border-border/50 shadow-lg">
                  <MapView
                    coordinates={{ lat, lng }}
                    processedRestaurants={processedRestaurants}
                    searchLocation={address}
                    isLoading={isLoading}
                  />
                </div>
              </section>
            </div>

            {/* Bottom decorative elements - desktop only */}
            <div className="mt-12 relative">
              <div className="absolute left-8 text-3xl opacity-15 animate-bounce hidden lg:block" style={{ animationDelay: "2.5s" }}>
                🥗
              </div>
              <div className="absolute right-8 text-3xl opacity-15 animate-bounce hidden lg:block" style={{ animationDelay: "3s" }}>
                🍰
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}