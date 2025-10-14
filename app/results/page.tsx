"use client";

import RestaurantList from "@/components/RestaurantList";
import SearchForm from "@/components/SearchForm";
import type { Restaurant } from "@/lib/types";
import { useSearchParams } from "next/navigation";

function ResultsPage() {
  // Setup useSearchParams from Next.js
  const searchParams = useSearchParams();

  // Extract values from URL
  const address = searchParams.get("address"); // brooklyn
  const radius = searchParams.get("radius"); // 5 (as a string)

  // Mock data
  const sampleRestaurants: Restaurant[] = [
    {
      id: "1",
      name: "The Golden Spoon",
      address: "123 Main Street, Downtown",
      coordinates: { lat: 40.7128, lng: -74.006 },
      rating: 4.5,
      reviewCount: 342,
      priceLevel: "$$",
      cuisineType: ["Italian", "Mediterranean"],
      distance: 0.3,
      isOpen: true,
    },
    {
      id: "2",
      name: "Sakura Sushi Bar",
      address: "456 Oak Avenue, Midtown",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      rating: 4.8,
      reviewCount: 521,
      priceLevel: "$$$",
      cuisineType: ["Japanese", "Sushi"],
      distance: 0.5,
      isOpen: true,
    },
    {
      id: "3",
      name: "Burger Haven",
      address: "789 Elm Street, West Side",
      coordinates: { lat: 40.7489, lng: -73.968 },
      rating: 4.2,
      reviewCount: 189,
      priceLevel: "$",
      cuisineType: ["American", "Burgers"],
      distance: 0.7,
      isOpen: false,
    },
    {
      id: "4",
      name: "Spice Route",
      address: "321 Pine Road, East District",
      coordinates: { lat: 40.7282, lng: -73.9942 },
      rating: 4.6,
      reviewCount: 267,
      priceLevel: "$$",
      cuisineType: ["Indian", "Curry"],
      distance: 1.2,
      isOpen: true,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-8 sm:mb-10">
          <SearchForm compact={true} address={address} radius={radius} />
        </div>

        {sampleRestaurants.length !== 0 && (
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
                  {`${sampleRestaurants.length} ${
                    sampleRestaurants.length === 1
                      ? "restaurant"
                      : "restaurants"
                  } found `}
                </span>
              </div>
            </header>

            <div className="flex flex-col gap-4 sm:gap-6">
              <RestaurantList restaurants={sampleRestaurants} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default ResultsPage;
