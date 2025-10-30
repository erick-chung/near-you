"use server";

import { API_ENDPOINTS, PLACES_API_BASE_URL } from "@/config/constants";
import { GooglePlace, Restaurant, SearchParams } from "../types";
import { convertPriceLevel } from "../utils/formatting";
import { calculateDistance } from "../utils/distance";
import { retryWithBackoff } from "../utils/retry";

/**
 * Searches for nearby restaurants using Google Places API
 * @param params - Search parameters including location, radius, and filters
 * @returns Array of Restaurant objects
 * @throws Error if API key is missing or search fails
 */
export async function searchRestaurants(params: SearchParams): Promise<Restaurant[]> {
  return await retryWithBackoff(async () => {
    try {
      // Step 1: Get API key and validate it exists
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        throw new Error("Service temporarily unavailable. Please try again later");
      }

      // Step 2: Build the API URL
      const url = `${PLACES_API_BASE_URL}${API_ENDPOINTS.NEARBY_SEARCH}`;

      // Step 3: Make the POST request with body
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,

          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.types,places.nationalPhoneNumber,places.websiteUri,places.currentOpeningHours,places.photos",
        },
        body: JSON.stringify({
          includedTypes: ["restaurant"],
          maxResultCount: 20,
          locationRestriction: {
            circle: {
              center: {
                latitude: params.coordinates.lat,
                longitude: params.coordinates.lng,
              },
              radius: params.radius,
            },
          },
        }),
      });

      // Step 4: Check if HTTP request was successful
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Too many requests. Please wait a moment.");
        } else {
          throw new Error("Connection issue. Please check your internet.");
        }
      }

      // Step 5: Parse the JSON response
      const data = await response.json();

      // Step 6: Validate the API response
      if (!data.places || data.places.length === 0) throw new Error("No restaurants found in this area");

      // Step 7: Transform Google Places data to Restaurant type
      const restaurants: Restaurant[] = data.places.map((place: GooglePlace) => ({
        id: place.id || "",
        name: place.displayName?.text || "Unknown Restaurant",
        address: place.formattedAddress || "",
        coordinates: {
          lat: place.location?.latitude || 0,
          lng: place.location?.longitude || 0,
        },
        rating: place.rating || 0,
        reviewCount: place.userRatingCount || 0,
        priceLevel: convertPriceLevel(place.priceLevel),
        cuisineType:
          place.types?.filter(
            (type: string) => !["restaurant", "food", "point_of_interest", "establishment"].includes(type)
          ) || [],
        isOpen: place.currentOpeningHours?.openNow,
        phoneNumber: place.nationalPhoneNumber,
        website: place.websiteUri,
        photoUrl: place.photos?.[0]?.name
          ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`
          : undefined,
        distance: calculateDistance(
          params.coordinates.lat,
          params.coordinates.lng,
          place.location?.latitude || 0,
          place.location?.longitude || 0
        ),
      }));

      // Step 8: Sort restaurants by distance (closest first) and then return
      restaurants.sort((a, b) => a.distance - b.distance);
      return restaurants;
    } catch (err) {
      console.error("Restaurant search failed:", err);
      if (err instanceof TypeError && err.message.includes("fetch")) {
        // Network failures create typeerrors (TypeError: fetch failed)
        throw new Error("Connection issue. Please check your internet.");
      }
      throw err;
    }
  });
}
