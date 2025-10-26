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

/*
The @react-google-maps/api library has a built-in default loading state that shows "Loading..." text while the Google Maps JavaScript API downloads and initializes

Component LifeCycle:
Page loads → GoogleMapsProvider mounts → LoadScript starts fetching Google API → Shows "Loading..." → API ready → "Loading..." disappears → Your components can use Google Maps

How We Fixed It:
We overrode the library's default behavior using the loadingElement prop

What It Does:
Instead of showing the library's default "Loading..." text, we tell it to render nothing (empty fragment) during the loading period
*/