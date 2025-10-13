import { RestaurantCard } from "@/components/RestaurantCard";
import { Restaurant } from "@/lib/types";

export default function Home() {
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-sans font-bold text-3xl text-foreground mb-2 text-balance">
            Restaurants Near You
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Discover delicious dining options in your area
          </p>
        </div>

        {/* Restaurant cards */}
        <div className="flex flex-col gap-4">
          {sampleRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </main>
  );
}
