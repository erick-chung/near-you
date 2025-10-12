// Search radius options in meters
export const RADIUS_OPTIONS = [500, 1000, 2000, 5000];

// Default search radius
export const DEFAULT_RADIUS = 1000;

// Price level options
export const PRICE_LEVELS = ["$", "$$", "$$$", "$$$$"];

// Google Places API endpoint
export const PLACES_API_BASE_URL = "https://places.googleapis.com/v1";

// API endpoints
export const API_ENDPOINTS = {
  NEARBY_SEARCH: "/places:searchNearby",
  PLACE_DETAILS: "/places",
  AUTOCOMPLETE: "/places:autocomplete",
  GEOCODE: "/geocode/json",
} as const;

// Map default settings
export const MAP_DEFAULTS = {
  CENTER: { lat: 40.7128, lng: -74.006 }, // NYC default
  ZOOM: 14,
} as const;

// Restaurant categories (optional for future filtering)
export const RESTAURANT_TYPES = [
  "restaurant",
  "cafe",
  "bar",
  "bakery",
  "meal_takeaway",
] as const;
