"use client";
import { Button } from "@/components/ui/button";
import { reverseGeocodeCoordinates } from "@/lib/actions/geocoding.action";
import { Coordinates } from "@/lib/types";
import { Loader2, Navigation } from "lucide-react";
import { useEffect, useState } from "react";

interface GetLocationProps {
  onSetAddress: (address: string, coordinates: Coordinates) => void;
}

export function GetLocationButton({ onSetAddress }: GetLocationProps) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  async function getCurrentLocation() {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      setError("Could not get current location");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Success: got coordinates
    function successCallback(position: GeolocationPosition) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setCoordinates({ lat, lng });
      setIsLoading(false);
    }

    // Error: permission denied, timeout, etc
    function errorCallback(error: GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          setError("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          setError("The request to get user location timed out.");
          break;
        default:
          setError("An unknown error occurred.");
          break;
      }
      setIsLoading(false);
    }

    // Request location
    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      options
    );
  }

  // Sends both address and coordinates back to parent - Only runs when we have coordinates from successCallback
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