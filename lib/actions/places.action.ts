"use server";

import { API_ENDPOINTS, PLACES_API_BASE_URL } from "@/config/constants";
import { GooglePlace, Restaurant, SearchParams } from "../types";
import { convertPriceLevel } from "../utils/formatting";
import { calculateDistance } from "../utils/distance";

/**
 * Searches for nearby restaurants using Google Places API
 * @param params - Search parameters including location, radius, and filters
 * @returns Array of Restaurant objects
 * @throws Error if API key is missing or search fails
 */
export async function searchRestaurants(
  params: SearchParams
): Promise<Restaurant[]> {
  try {
    // Step 1: Get API key and validate it exists
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("Google Maps API key is not configured");
    }

    // Step 2: Build the API URL
    const url = `${PLACES_API_BASE_URL}${API_ENDPOINTS.NEARBY_SEARCH}`;

    // Step 3: Make the POST request with body
    const response = await fetch(url, {
      method: "POST", // Describes type of request (POST => We are sending google some info, and expecting results based on that info we gave)
      headers: {
        // Special instructions
        "Content-Type": "application/json", // Describes type of data we're sending
        "X-Goog-Api-Key": apiKey, // Here is my apiKey (verifies we can use this service)
        // Only send me these specific pieces of info
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.types,places.nationalPhoneNumber,places.websiteUri,places.currentOpeningHours,places.photos",
      },
      body: JSON.stringify({
        // Send search data (must stringify before sending cuz Google expects this format)
        includedTypes: ["restaurant"], // Only show me restaurants
        maxResultCount: 20, // Show up to 20 results
        locationRestriction: {
          // Search in a circular area
          circle: {
            center: {
              // Specifies center of circle using the coordinates we gave
              latitude: params.coordinates.lat,
              longitude: params.coordinates.lng,
            },
            radius: params.radius, // Radius of search circle
          },
        },
      }),
    });

    // Step 4: Check if HTTP request was successful
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

    // Step 5: Parse the JSON response
    const data = await response.json();

    // Step 6: Validate the API response
    if (!data.places || data.places.length === 0)
      throw new Error("No restaurants found in this area");

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
      priceLevel: convertPriceLevel(place.priceLevel), // Google gives "PRICE_LEVEL_MODERATE", which is why we created a utility function to convert it into $
      cuisineType:
        place.types?.filter(
          // Remove all the generic types that google gives you and only keep the specific ones
          (type: string) =>
            ![
              "restaurant",
              "food",
              "point_of_interest",
              "establishment",
            ].includes(type)
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
    console.error(err);
    throw err;
  }
}
