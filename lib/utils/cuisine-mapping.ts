export const CUISINE_TYPE_MAPPING: Record<string, string> = {
  // Asian
  'japanese_restaurant': 'Japanese',
  'chinese_restaurant': 'Chinese', 
  'korean_restaurant': 'Korean',
  'thai_restaurant': 'Thai',
  'vietnamese_restaurant': 'Vietnamese',
  'indian_restaurant': 'Indian',
  'asian_restaurant': 'Asian',
  
  // European
  'italian_restaurant': 'Italian',
  'french_restaurant': 'French',
  'spanish_restaurant': 'Spanish',
  'greek_restaurant': 'Greek',
  'mediterranean_restaurant': 'Mediterranean',
  
  // American
  'american_restaurant': 'American',
  'mexican_restaurant': 'Mexican',
  'brazilian_restaurant': 'Brazilian',
  
  // Middle Eastern
  'middle_eastern_restaurant': 'Middle Eastern',
  'turkish_restaurant': 'Turkish',
  
  // Other
  'seafood_restaurant': 'Seafood',
  'steakhouse': 'Steakhouse',
  'pizza_restaurant': 'Pizza',
  'bakery': 'Bakery',
  'cafe': 'Cafe',
  'fast_food_restaurant': 'Fast Food',
  'restaurant': 'Restaurant'
};

export function formatCuisineTypes(apiCuisineTypes: string[]): string[] {
  return apiCuisineTypes
    .map(type => CUISINE_TYPE_MAPPING[type] || formatFallbackCuisine(type))
    .filter((value, index, array) => array.indexOf(value) === index);
}

export function formatSingleCuisineType(apiCuisineType: string): string {
  return CUISINE_TYPE_MAPPING[apiCuisineType] || formatFallbackCuisine(apiCuisineType);
}

function formatFallbackCuisine(type: string): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
    .replace(/\s+Restaurant\s*$/i, '');
}

export function getFilterCuisineOptions() {
  return [
    { value: 'italian_restaurant', label: 'Italian' },
    { value: 'mexican_restaurant', label: 'Mexican' },
    { value: 'chinese_restaurant', label: 'Chinese' },
    { value: 'japanese_restaurant', label: 'Japanese' },
    { value: 'american_restaurant', label: 'American' },
    { value: 'indian_restaurant', label: 'Indian' },
    { value: 'thai_restaurant', label: 'Thai' },
    { value: 'mediterranean_restaurant', label: 'Mediterranean' },
    { value: 'korean_restaurant', label: 'Korean' },
    { value: 'french_restaurant', label: 'French' },
  ];
}

export function matchesCuisineFilter(restaurantCuisines: string[], selectedFilters: string[]): boolean {
  if (!selectedFilters.length) return true;
  if (!restaurantCuisines.length) return false;
  
  return restaurantCuisines.some(cuisine => selectedFilters.includes(cuisine));
}