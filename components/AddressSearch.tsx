"use client";
import type React from "react";
import { Search, Loader2, AlertCircle, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Autocomplete } from "@react-google-maps/api";
import { useRef, useState } from "react";

interface AddressSearchProps {
  value: string;
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void;
  onSearch: () => void;
  onAutocompleteSearch?: (
    address: string,
    coordinates: { lat: number; lng: number }
  ) => void;
  onRecentSearchClick: (search: string) => void;
  onClearHistory?: () => void;
  compact?: boolean;
  isLoading?: boolean;
  error: string | null;
  searches: string[];
}

export function AddressSearch({
  value,
  onChange,
  onSearch,
  onAutocompleteSearch,
  onRecentSearchClick,
  onClearHistory,
  compact,
  isLoading,
  error,
  searches,
}: AddressSearchProps) {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const isValidInput = (input: string): boolean => {
    return input.trim().length >= 3;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (e.key === "Enter" && isValidInput(value)) {
      onSearch();
    }
  };

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  return (
    <div className="w-full relative">
      <label
        htmlFor="address-input"
        className={`block font-medium text-foreground ${
          compact ? "text-xs mb-1.5" : "text-sm mb-2"
        }`}
      >
        Search Location
      </label>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1">
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() => { // Callback back provided by Google Maps API specifically for the Autocomplete component. It's a function that Google's autocomplete system automatically calls when a user selects a place from the dropdown suggestions. => Why does it exist? Google needs a way to tell your code "Hey the user picked a place from my suggestions list. Here's the data for that place"...From this function you get accfess to getPlace(), which provides data such as the coordinates and formatted address
                if (autocompleteRef.current) {
                  const place = autocompleteRef.current.getPlace(); // .getPlace() is a Google method that says "give me the place the user selected". => place is an object with address, coordinates, etc

                  if (!place || !place.formatted_address) {
                    console.log("No valid place found from autocomplete")
                    return;
                  }
                  if (place.formatted_address) {
                    if (place.geometry?.location) {
                      const lat = place.geometry.location.lat();
                      const lng = place.geometry.location.lng();

                      // Use the new autocomplete search function if available
                      if (onAutocompleteSearch) {
                        onAutocompleteSearch(place.formatted_address, {
                          lat,
                          lng,
                        });
                      } else {
                        // Fallback to old method
                        onChange(place.formatted_address, { lat, lng });
                        onSearch();
                      }
                    } else {
                      // No coordinates available, just pass address
                      onChange(place.formatted_address);
                      onSearch();
                    }
                  }
                }
              }}
            >
              <input
                id="address-input"
                type="text"
                value={value}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="123 Main St, Brooklyn, NY"
                className={`w-full rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  compact ? "h-9 px-3 py-1.5 text-xs" : "h-11 px-4 py-2 text-sm"
                }`}
              />
            </Autocomplete>
          </div>
        </div>
        <Button
          onClick={() => {
            if (isValidInput(value)) onSearch()
          }}
          disabled={isLoading || !isValidInput(value)}
          size="icon"
          className={`shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground ${
            compact ? "h-9 w-9" : "h-11 w-11"
          }`}
        >
          {isLoading ? (
            <Loader2
              className={`${compact ? "h-4 w-4" : "h-5 w-5"} animate-spin`}
            />
          ) : (
            <Search className={compact ? "h-4 w-4" : "h-5 w-5"} />
          )}
          <span className="sr-only">
            {isLoading ? "Searching..." : "Search"}
          </span>
        </Button>
      </div>

      {isInputFocused && value === "" && searches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {searches.slice(0, 5).map((search, index) => (
            <button
              key={`${search}-${index}`}
              onMouseDown={() => onRecentSearchClick(search)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground hover:bg-primary/10 transition-colors cursor-pointer border-b border-border last:border-b-0"
            >
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 truncate">{search}</span>
            </button>
          ))}

          {searches.length > 0 && (
            <button
              onMouseDown={onClearHistory}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors cursor-pointer border-t border-border/50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="font-medium">Clear History</span>
            </button>
          )}
        </div>
      )}

      {error && (
        <div
          className={`flex items-center gap-1.5 text-destructive ${
            compact ? "mt-1 text-xs" : "mt-1.5 text-sm"
          }`}
        >
          <AlertCircle className={compact ? "h-3 w-3" : "h-4 w-4"} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
