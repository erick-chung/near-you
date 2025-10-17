"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import RestaurantList from "@/components/RestaurantList";
import SearchForm from "@/components/SearchForm";
import type { Restaurant } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchRestaurants } from "@/lib/actions/places.action";

export default function ResultsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // Setup useSearchParams from Next.js
  const searchParams = useSearchParams();

  // Extract values from URL (Add default values for numbers just incase its null)
  const address = searchParams.get("address");
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

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 max-w-2xl">
          <SearchForm compact={true} address={address} radius={radius} />
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : restaurants.length > 0 ? (
          <>
            <header className="mb-8 sm:mb-10 space-y-4">
              <div className="space-y-2">
                <h1 className="font-sans font-bold text-3xl sm:text-4xl text-foreground text-balance">
                  {address
                    ? `Restaurants near ${address}`
                    : "Restaurants Near You"}
                </h1>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  Discover delicious dining options in your area
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 ring-1 ring-primary/20">
                <span className="text-sm font-medium text-primary">
                  {`${restaurants.length} ${
                    restaurants.length === 1 ? "restaurant" : "restaurants"
                  } found `}
                </span>
              </div>
            </header>
            <div className="flex flex-col gap-4 sm:gap-6">
              <RestaurantList restaurants={restaurants} />
            </div>
          </>
        ) : (
          <div>No restaurants found</div>
        )}
      </div>
    </main>
  );
}
