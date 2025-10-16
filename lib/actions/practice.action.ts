"use server";
/* export async function fetchFromExternalAPI(params) {
1. Validate inputs & credentials
2. Build request (URL, headers, body)
3. Make HTTP request
4. Check HTTP response
5. Parse response
6. Validate API response
7. Extract needed data
8. Transform to your types
9. Return
 }
*/

import {
  API_ENDPOINTS,
  GEOCODING_API_BASE_URL,
  PLACES_API_BASE_URL,
} from "@/config/constants";
import { Address, GooglePlace, Restaurant } from "../types";
import { SearchParams } from "next/dist/server/request/search-params";
import { convertPriceLevel } from "../utils/formatting";

// 1. Create a server action that takes in an address as a string and returns an Address as a promise
export async function practiceGeocodeAddress(
  address: string
): Promise<Address> {
  // 2. Get the api key from your .env.local file, then verify that it exists. if it doesnt, throw an error
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) throw new Error("There is an error with API Key");

  // 3a. Build the api url using the constants you specified in the constants file
  const baseUrl = `${GEOCODING_API_BASE_URL}${API_ENDPOINTS.GEOCODE}`;

  // 3b. take the address you got as a parameter and encode the url
  const encodedAddress = encodeURIComponent(address);

  // 3c. then combine all those pieces to make the url
  const url = `${baseUrl}?address=${encodedAddress}&key=${apiKey}`;

  // 4. make the fetch request to google geocoding api (think. what is the default method for a fetch request and how does that affect what we write?)
  const response = await fetch(url);

  // 5. Check if the http request was successful (response.ok)
  if (!response.ok) throw new Error("HTTP Status Error!");

  // 6. Parse the json response
  const data = await response.json();

  // 7. Validate the API response status
  if (data.status === "ZERO_RESULTS") {
    throw new Error("Address does not exist!");
  } else if (data.status === "INVALID_REQUEST") {
    throw new Error("No address was provided");
  } else if (data.status === "REQUEST_DENIED") {
    throw new Error("Your API Key is invalid or doesn't have permission!");
  } else if (data.status !== "OK") {
    // You can't just do a regular else statement here because that will also include the status "OK", which is what you dont want. so, instead you have to just say if the status is not ok. cuz then that applies to all other status codes that arent ok or the ones that you specified above
    throw new Error("Failed to geocode address");
  }

  // 8. Extract the first result from the response
  const geoCode = data.results[0];

  // 9. Return formatted Address
  return {
    formatted: geoCode.formatted_address,
    coordinates: {
      lat: geoCode.geometry.location.lat,
      lng: geoCode.geometry.location.lng,
    },
  };
}

/*
Steps for creating a server action for Google Places API:



















*/

// 1. Create a server action called searchRestaurants that takes params as a parameter (type SearchParams) and returns an array of the type restaurant wrapped in a promise
export async function practiceSearchRestaurants(
  params: SearchParams
): Promise<Restaurant[]> {
  // 2. Get api key and validate it exists
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("API key not configured");

  // 3. Build the API URL
  const url = `${PLACES_API_BASE_URL}${API_ENDPOINTS.NEARBY_SEARCH}`;

  // 4. Make fetch request (Look up what kind of fetch request it is, and depending on that, what you add to your fetch request is different)
  const response = await fetch(url, {
    method: "POST",
    headers: {
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

  // 5. Check if HTTP request was successful
  if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

  // 6. Parse the JSON response
  const data = await response.json();

  // 7. Validate the API response (always use || for or)
  if (!data.places || data.places.length === 0)
    throw new Error("No restaurants found in this area");

  // 8. Transform Google Places data to Restaurant type
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
    distance: 0, // Will be calculated later when we know user's exact location
  }));

  // 9. Return the array of restaurants
  return restaurants;
}
