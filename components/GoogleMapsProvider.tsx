"use client";
import { LoadScript, Libraries } from "@react-google-maps/api";
import { ReactNode } from "react";

interface GoogleMapsProviderProps {
  children: ReactNode;
}

const libraries: Libraries = ["places"];

export default function GoogleMapsProvider({
  children,
}: GoogleMapsProviderProps) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={libraries}
      loadingElement={<></>} 
    >
      {children}
    </LoadScript>
  );
}

