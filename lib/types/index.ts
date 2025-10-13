export interface Address {
  formatted: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  components?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  priceLevel?: string; // "$", "$$", "$$$", "$$$$"
  cuisineType?: string[];
  isOpen?: boolean;
  phoneNumber?: string;
  website?: string;
  photoUrl?: string;
  distance: number; // in miles or km
}

export interface SearchParams {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number; // in meters
  filters?: {
    priceLevel?: string[];
    cuisineType?: string[];
    minRating?: number;
  };
}

export interface SearchResult {
  restaurants: Restaurant[];
  searchLocation: Address;
  totalResults: number;
}

export interface GooglePlace {
  id: string;
  displayName?: {
    text: string;
  };
  formattedAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  types?: string[];
  nationalPhoneNumber?: string;
  websiteUri?: string;
  currentOpeningHours?: {
    openNow?: boolean;
  };
  photos?: Array<{
    name: string;
  }>;
}
