"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/actions/favorites.action";
import type { Favorite, Restaurant } from "@/lib/types";

export function useFavorites() {
  const { user, isLoaded } = useUser();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoize fetchFavorites to fix useEffect dependency
  const fetchFavorites = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await getFavorites();
      if (result.success && result.data) {
        setFavorites(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch favorites when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      fetchFavorites();
    } else if (isLoaded && !user) {
      setFavorites([]); // Clear favorites if user logs out
    }
  }, [isLoaded, user, fetchFavorites]);

  const addToFavorites = async (restaurant: Restaurant) => {
    if (!user) return false;

        const tempFavorite: Favorite = {
        id: `temp-${restaurant.id}`,
        userId: user.id,
        restaurantId: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        rating: restaurant.rating,
        priceLevel: restaurant.priceLevel ?? null,
        cuisineType: restaurant.cuisineType || [],
        photoUrl: restaurant.photoUrl ?? null,
        createdAt: new Date().toISOString(),
      };

    try {
      // Optimistic update - add immediately to UI
      setFavorites((prev) => [tempFavorite, ...prev]);

      // Call server action
      const result = await addFavorite({
        restaurantId: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        rating: restaurant.rating,
        priceLevel: restaurant.priceLevel,
        cuisineType: restaurant.cuisineType || [],
        photoUrl: restaurant.photoUrl,
      });

      if (result.success && result.data) {
        // Replace temp favorite with actual data from server
        setFavorites((prev) => prev.map((fav) => (fav.id === tempFavorite.id ? result.data : fav)));
        return true;
      } else {
        // Revert optimistic update if failure
        setFavorites((prev) => prev.filter((fav) => fav.id !== tempFavorite.id));
        return false;
      }
    } catch (err) {
      console.error("Failed to add favorite:", err);
      // Revert optimistic update if error
      setFavorites((prev) => prev.filter((fav) => fav.id !== tempFavorite.id));
      return false;
    }
  };

  const removeFromFavorites = async (restaurantId: string) => {
    if (!user) return false;

    // Store original favorites OUTSIDE the try block
    const originalFavorites = favorites;

    try {
      // Optimistic update - remove immediately from UI
      setFavorites((prev) => prev.filter((fav) => fav.restaurantId !== restaurantId));

      // Call server action
      const result = await removeFavorite(restaurantId);

      if (!result.success) {
        // Revert optimistic update if failure
        setFavorites(originalFavorites);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      // Revert optimistic update if error
      setFavorites(originalFavorites);
      return false;
    }
  };

  const isFavorite = (restaurantId: string) => {
    return favorites.some((fav) => fav.restaurantId === restaurantId);
  };

  const getFavoriteCount = () => {
    return favorites.length;
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteCount,
    fetchFavorites,
  };
}
