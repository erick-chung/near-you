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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 2. Create function: formatDistance(meters)
/**
 * Format distance in meters to human-readable string
 * @param meters - Distance in meters
 * @returns Formatted string in feet or miles (e.g., "250 ft" or "0.5 mi")
 */
export function formatDistance(meters: number): string {
  const METERS_PER_MILE = 1609.34;
  const METERS_PER_FOOT = 0.3048;
  const miles = meters / METERS_PER_MILE;

  // If less than 0.1 miles, show in feet
  if (miles < 0.1) {
    const feet = meters / METERS_PER_FOOT;
    return `${Math.round(feet)} ft`;
  }

  // Otherwise show in miles
  return `${miles.toFixed(1)} mi`;
}
