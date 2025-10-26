"use client";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { reverseGeocodeCoordinates } from "@/lib/actions/geocoding.action";
import { Coordinates } from "@/lib/types";
import { Loader2, Navigation } from "lucide-react";
import { useEffect } from "react";

interface GetLocationProps {
  onSetAddress: (address: string, coordinates: Coordinates) => void;
}

export function GetLocationButton({ onSetAddress }: GetLocationProps) {
  const { coordinates, isLoading, error, getCurrentLocation } =
    useGeolocation();

  useEffect(() => {
    async function getAddress() {
      if (coordinates) {
        try {
          const address = await reverseGeocodeCoordinates(
            coordinates.lat,
            coordinates.lng
          );
          onSetAddress(address, coordinates);
        } catch (err) {
          console.error(err);
        }
      }
    }
    getAddress();
  }, [coordinates, onSetAddress]);

  return (
    <div className="flex justify-center mt-4">
      <Button
        variant="outline"
        size="lg"
        className="group relative overflow-hidden border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 bg-transparent"
        onClick={getCurrentLocation}
        disabled={isLoading}
        aria-label="Use my current location to find nearby restaurants"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
            <span className="font-medium">Getting Location...</span>
          </>
        ) : (
          <>
            <Navigation className="h-4 w-4 mr-2 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span className="font-medium">Get My Location</span>
          </>
        )}
      </Button>
      {error && (
        <div className="text-red-500 text-sm mt-2 text-center" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}