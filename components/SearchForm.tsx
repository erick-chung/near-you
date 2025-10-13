"use client";

import { useState } from "react";

import { UtensilsCrossed } from "lucide-react";
import type { SearchParams } from "@/lib/types";
import { AddressSearch } from "./AddressSearch";
import { RadiusSelector } from "./RadiusSelector";

interface SearchFormProps {
  onSearch?: (params: Omit<SearchParams, "coordinates">) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState(1609); // Default 1 mile

  const handleSearch = () => {
    console.log(address, radius);
    if (address.trim() && onSearch) {
      onSearch({
        address,
        radius,
      });
    }
  };

  return (
    <div className="space-y-4">
      <AddressSearch
        value={address}
        onChange={setAddress}
        onSearch={handleSearch}
      />
      <RadiusSelector value={radius} onChange={setRadius} />

      {/* Empty state message */}
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <UtensilsCrossed className="w-10 h-10 text-primary/60" />
        </div>
        <h3 className="font-sans font-semibold text-xl text-foreground mb-2 text-balance text-center">
          Find restaurants near any location
        </h3>
        <p className="text-muted-foreground text-center leading-relaxed max-w-sm">
          Enter an address above to discover great places to eat and drink, even
          if you're not there yet.
        </p>
      </div>
    </div>
  );
}
