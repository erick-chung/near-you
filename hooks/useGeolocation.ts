"use client";
import { useState } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface HookReturn {
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
}

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Could not get current location");
      return;
    }
    setIsLoading(true);
    setError(null);

    function successCallback(position: GeolocationPosition) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setCoordinates({ lat, lng });
      setIsLoading(false);
    }

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
        case error.UNKNOWN_ERROR:
          setError("An unknown error occurred.");
          break;
      }
      setIsLoading(false);
    }
    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      options
    );
  }
  return { coordinates, isLoading, error, getCurrentLocation };
}
