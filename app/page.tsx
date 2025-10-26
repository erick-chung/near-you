"use client";
import { GetLocationButton } from "@/components/GetLocationButton";
import SearchForm from "@/components/SearchForm";
import { Coordinates } from "@/lib/types";
import { useState } from "react";

export default function HomePage() {
  const [externalAddress, setExternalAddress] = useState("");
  const [externalCoordinates, setExternalCoordinates] =
    useState<Coordinates | null>(null);

  const handleSetAddress = (address: string, coordinates: Coordinates) => {
    setExternalAddress(address);
    if (coordinates) setExternalCoordinates(coordinates);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <section className="mb-8" aria-label="Find restaurants near any location">
          <SearchForm
            externalAddress={externalAddress}
            externalCoordinates={externalCoordinates}
          />
          <GetLocationButton onSetAddress={handleSetAddress} />
        </section>
      </div>
    </main>
  );
}