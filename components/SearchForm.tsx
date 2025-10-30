"use client";
import { useEffect, useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddressSearch } from "./AddressSearch";
import { RadiusSelector } from "./RadiusSelector";
import { geocodeAddress } from "@/lib/actions/geocoding.action";
import { Coordinates } from "@/lib/types";

interface SearchFormProps {
  compact?: boolean;
  externalAddress?: string;
  externalCoordinates?: Coordinates | null;
  address?: string | null;
  radius?: number | null;
}

export default function SearchForm({
  compact,
  externalAddress,
  externalCoordinates,
  address: initialAddress,
  radius: initialRadius,
}: SearchFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState(initialAddress || "");
  const [radius, setRadius] = useState(initialRadius || 805); // Default 0.5 mile
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [searches, setSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("searches");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const router = useRouter();

  const handleSearch = async (
    directCoordinates?: {
      lat: number;
      lng: number;
    },
    directAddress?: string
  ) => {
    try {
      setIsLoading(true);

      // Use directAddress if provided, otherwise use state
      const addressToUse = directAddress || address;
      // Use trimmedAddress instead of directaddress in the search
      const trimmedAddress = addressToUse.trim();

      if (!trimmedAddress) throw new Error("Please enter an address!");

      // Use coordinates from parameter first, then state, then geocode
      let result;
      if (directCoordinates) {
        // Use coordinates passed directly from autocomplete
        result = {
          formatted: trimmedAddress,
          coordinates: directCoordinates,
        };
      } else if (coordinates) {
        // Use coordinates from state
        result = {
          formatted: trimmedAddress,
          coordinates: coordinates,
        };
      } else {
        // Fall back to geocoding
        result = await geocodeAddress(trimmedAddress);
        if (!result) throw new Error("Could not fetch coordinates");
      }

      router.push(
        `/results?address=${result.formatted}&lat=${result.coordinates.lat}&lng=${result.coordinates.lng}&radius=${radius}`
      );
      const filteredSearches = searches
        .filter((search) => typeof search === "string")
        .filter((search) => search.toLowerCase() !== result.formatted.toLowerCase());
      const limit = 5;
      const limitedSearches = filteredSearches.slice(0, limit);
      setSearches([result.formatted, ...limitedSearches]);
    } catch (err) {
      console.error("Search form error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (newAddress: string, newCoordinates?: { lat: number; lng: number }) => {
    setAddress(newAddress);
    setCoordinates(newCoordinates || null);
    if (error) setError(null);
  };

  const handleAutocompleteSearch = (selectedAddress: string, selectedCoordinates: { lat: number; lng: number }) => {
    setAddress(selectedAddress);
    setCoordinates(selectedCoordinates);

    if (error) setError(null);

    handleSearch(selectedCoordinates, selectedAddress);
  };

  const handleRecentSearchClick = (search: string) => {
    setAddress(search);
    setCoordinates(null);
    setError(null);
    handleSearch(undefined, search);
  };

  const handleClearHistory = () => {
    setSearches([]);
  };

  useEffect(() => {
    if (compact && initialAddress) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("radius", radius.toString());
      // Update URL without navigation
      window.history.replaceState(null, "", `?${searchParams.toString()}`);
    }
  }, [radius, compact, initialAddress]);

  useEffect(() => {
    if (externalAddress && externalCoordinates) {
      router.push(
        `/results?address=${externalAddress}&lat=${externalCoordinates.lat}&lng=${externalCoordinates.lng}&radius=${radius}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalAddress, externalCoordinates]);

  useEffect(() => {
    localStorage.setItem("searches", JSON.stringify(searches));
  }, [searches]);

  useEffect(() => {
    if (externalAddress) setAddress(externalAddress);
  }, [externalAddress]);

  useEffect(() => {
    if (externalCoordinates) setCoordinates(externalCoordinates);
  }, [externalCoordinates]);
  return (
    <div className={compact ? "space-y-2" : "space-y-4"} role="search" aria-label="Restaurant search form">
      <AddressSearch
        value={address}
        onChange={handleAddressChange}
        onSearch={handleSearch}
        onAutocompleteSearch={handleAutocompleteSearch}
        compact={compact}
        isLoading={isLoading}
        error={error}
        searches={searches}
        onRecentSearchClick={handleRecentSearchClick}
        onClearHistory={handleClearHistory}
      />
      <RadiusSelector value={radius} onChange={setRadius} compact={compact} />
      {!compact && (
        <section className="flex flex-col items-center justify-center py-12 px-4" aria-label="Search introduction">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-10 h-10 text-primary/60" aria-hidden="true" />
          </div>
          <h3 className="font-sans font-semibold text-xl text-foreground mb-2 text-balance text-center">
            Find restaurants near any location
          </h3>
          <p className="text-muted-foreground text-center leading-relaxed max-w-sm">
            Enter an address above to discover great places to eat and drink, even if you are not there yet.
          </p>
        </section>
      )}
    </div>
  );
}
