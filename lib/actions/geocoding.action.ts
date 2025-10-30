"use server";

import { API_ENDPOINTS, GEOCODING_API_BASE_URL } from "@/config/constants";
import { Address } from "@/lib/types/index";
import { retryWithBackoff } from "../utils/retry";
/**
 * Geocodes an address string into coordinates and formatted address
 * @param address - The address string to geocode
 * @returns Address with formatted string and coordinates
 * @throws Error if API key is missing, address not found, or API request fails
 */
export async function geocodeAddress(address: string): Promise<Address> {
 return await retryWithBackoff(async() => {
   try {
    // Step 1: Get API key and validate it exists
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Service temporarily unavailable. Please try again later"
      );
    }

    // Step 2: Build the API URL
    const baseURL = `${GEOCODING_API_BASE_URL}${API_ENDPOINTS.GEOCODE}`;
    const encodedAddress = encodeURIComponent(address);
    const url = `${baseURL}?address=${encodedAddress}&key=${apiKey}`;

    // Step 3: Make the fetch request to Google Geocoding API
    const response = await fetch(url);

    // Step 4: Check if the HTTP request was successful
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Too many requests. Please wait a moment.");
      } else {
        throw new Error("Connection issue. Please check your internet.");
      }
    }

    // Step 5: Parse the JSON response
    const data = await response.json();

    // Step 6: Validate the API response status
    if (data.status === "ZERO_RESULTS") {
      throw new Error("No results found for this address");
    } else if (data.status === "INVALID_REQUEST") {
      throw new Error("Invalid address format");
    } else if (
      data.status !== "OK" ||
      !data.results ||
      data.results.length === 0
    ) {
      throw new Error("Address not found");
    }

    // Step 7: Extract the first result from the response
    const result = data.results[0];

    // Step 8: Return formatted Address
    return {
      formatted: result.formatted_address,
      coordinates: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      },
    };
  } catch (err) {
    console.error("Geocoding failed:", err)
    // Handle network-level failures (Wifi off, DNS issues, etc)
    if (err instanceof TypeError && err.message.includes('fetch')) { 
      throw new Error("Connection issue. Please check your internet.")
    }
    // Re-throw other errors
    throw err; 
  }
 })
}

export async function reverseGeocodeCoordinates(lat: number, lng: number) {
  return await retryWithBackoff(async() => {
    try {
    // Step 1: Get API key and validate it exists
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Service temporarily unavailable. Please try again later"
      );
    }

    // Step 2: Build the API URL
    const baseURL = `${GEOCODING_API_BASE_URL}${API_ENDPOINTS.GEOCODE}`;
    const url = `${baseURL}?latlng=${lat},${lng}&key=${apiKey}`;

    // Step 3: Make the fetch request to Google Geocoding API
    const response = await fetch(url);

    // Step 4: Check if the HTTP request was successful
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Too many requests. Please wait a moment.");
      } else {
        throw new Error("Connection issue. Please check your internet.");
      }
    }

    // Step 5: Parse the JSON response
    const data = await response.json();

    // Step 6: Validate the API response status
    if (data.status === "ZERO_RESULTS") {
      throw new Error("No results found for this address");
    } else if (data.status === "INVALID_REQUEST") {
      throw new Error("Invalid address format");
    } else if (
      data.status !== "OK" ||
      !data.results ||
      data.results.length === 0
    ) {
      throw new Error("Address not found");
    }

    // Step 7: Extract the first result from the response
    const result = data.results[0].formatted_address;

    // Step 8: Return result
    return result;
  } catch (err) {
    console.error("Reverse geocoding failed:", err)
      if (err instanceof TypeError && err.message.includes('fetch')) { // Network failures create typeerrors (TypeError: fetch failed)
      throw new Error("Connection issue. Please check your internet.")
    }
    throw err;
  }
  })
}
