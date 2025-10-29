"use client";
import { Restaurant } from "@/lib/types";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { formatDistance } from "@/lib/utils/distance";

interface MapViewProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  processedRestaurants: Restaurant[];
  searchLocation: string;
  isLoading: boolean;
}

export default function MapView({
  coordinates,
  processedRestaurants,
  searchLocation,
  isLoading,
}: MapViewProps) {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const center = coordinates;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-3.5 w-3.5 ${
          index < Math.floor(rating)
            ? "fill-[oklch(0.65_0.19_35)] text-[oklch(0.65_0.19_35)]"
            : "fill-gray-300 text-gray-300"
        }`}
        aria-hidden="true"
      />
    ));
  };

 
  useEffect(() => {
     const fitMapBounds = () => {
    if (!map || processedRestaurants.length === 0) return;
    // Create an invisible rectangle
    const bounds = new google.maps.LatLngBounds();
    // Now expand the rectangle to include each location
    // Add search location
    bounds.extend(coordinates);
    // Add all restaurant locations (EXPAND THE COORDINATES FOR EACH RESTAURANT)
    processedRestaurants.forEach((restaurant) => {
      bounds.extend(restaurant.coordinates);
    });
    // So each extend call makes the invisible rectangle bigger if needed to include that point
    map.fitBounds(bounds, 50);
    // Optional: prevent excessive zoom out
    const currentZoom = map.getZoom();
    if (currentZoom && currentZoom > 16) {
      map.setZoom(16);
    }
  };

    fitMapBounds();
  }, [map, processedRestaurants, coordinates]);

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <GoogleMap
      center={center}
      zoom={14}
      mapContainerClassName="h-[400px] lg:h-[500px]"
      onClick={() => setSelectedRestaurant(null)}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      <Marker
        position={coordinates}
        icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        title={`Search location: ${searchLocation}`}
      />
      {processedRestaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={restaurant.coordinates}
          icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          title={`${restaurant.name} - Click for details`}
          onClick={() => {
            setSelectedRestaurant(restaurant);
          }}
        />
      ))}
      {selectedRestaurant && (
        <InfoWindow
          position={selectedRestaurant.coordinates}
          onCloseClick={() => setSelectedRestaurant(null)}
        >
          <div className="p-2 min-w-[240px] max-w-[280px]">
            {/* Restaurant name */}
            <h4 className="font-semibold text-base text-gray-900 mb-2 leading-tight">
              {selectedRestaurant.name}
            </h4>
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5" role="img" aria-label={`${selectedRestaurant.rating} out of 5 stars`}>
                {renderStars(selectedRestaurant.rating)}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {selectedRestaurant.rating}
              </span>
              <span className="text-xs text-gray-500">
                ({selectedRestaurant.reviewCount} reviews)
              </span>
            </div>
            {/* Distance */}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-[oklch(0.65_0.19_35)]">
                {formatDistance(selectedRestaurant.distance)} away
              </p>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}