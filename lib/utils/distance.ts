// 1. Create function: calculateDistance(lat1, lon1, lat2, lon2) using Haversine formula
/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 - Latitude of point 1
 * @param lon1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lon2 - Longitude of point 2
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180; // Convert to radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// 2. Create function: formatDistance(meters) → "0.5 mi" or "500 m"
/**
 * Format distance in meters to human-readable string
 * @param meters - Distance in meters
 * @returns Formatted string like "0.5 mi" or "500 m"
 */
export function formatDistance(meters: number): string {
  const METERS_PER_MILE = 1609.34;

  // If distance is 1000 meters or more, show in miles
  if (meters >= 1000) {
    const miles = meters / METERS_PER_MILE;
    return `${miles.toFixed(1)} mi`;
  }

  // Otherwise show in meters
  return `${Math.round(meters)} m`;
}
