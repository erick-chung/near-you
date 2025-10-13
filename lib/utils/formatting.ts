/**
 * Format address components into a readable string
 * @param components - Address components from Google Places API
 * @returns Formatted address string
 */
export function formatAddress(components: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): string {
  const parts = [];

  if (components.street) parts.push(components.street);
  if (components.city) parts.push(components.city);
  if (components.state) parts.push(components.state);
  if (components.zip) parts.push(components.zip);

  return parts.join(", ");
}

/**
 * Format phone number to (XXX) XXX-XXXX format
 * @param phone - Raw phone number string
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Handle different lengths
  if (cleaned.length === 10) {
    // Format: (123) 456-7890
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }

  if (cleaned.length === 11 && cleaned[0] === "1") {
    // Format: +1 (123) 456-7890
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7
    )}`;
  }

  // If not standard format, return original
  return phone;
}

/**
 * Helper function to convert Google's price level to our format
 */
export function convertPriceLevel(priceLevel?: string): string | undefined {
  if (!priceLevel) return undefined;

  const priceLevelMap: { [key: string]: string } = {
    PRICE_LEVEL_FREE: "$",
    PRICE_LEVEL_INEXPENSIVE: "$",
    PRICE_LEVEL_MODERATE: "$$",
    PRICE_LEVEL_EXPENSIVE: "$$$",
    PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
  };

  return priceLevelMap[priceLevel];
}
