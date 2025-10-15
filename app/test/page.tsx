"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Restaurant } from "@/lib/types";
import { useState } from "react";

function TestPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>("There is an error!");
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
  const showLoading = isLoading;
  const showError = !isLoading && error !== null;
  const showResults =
    !isLoading && error === null && sampleRestaurants.length > 0;
  return (
    <div>
      <ErrorMessage message={error} />
    </div>
  );
}

export default TestPage;
