"use client";

import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddressSearch } from "./AddressSearch";
import { RadiusSelector } from "./RadiusSelector";

interface SearchFormProps {
  compact?: boolean;
  address?: string | null;
  radius?: string | null;
}

export default function SearchForm({
  compact,
  address: initialAddress,
  radius: initialRadius,
}: SearchFormProps) {
  const [address, setAddress] = useState(initialAddress || "");
  const [radius, setRadius] = useState(
    initialRadius ? Number(initialRadius) : 1609
  ); // Default 1 mile
  const router = useRouter();

  const handleSearch = async () => {
    if (!address.trim()) return; // Early return if address is empty

    router.push(`/results?address=${address}&radius=${radius}`);
  };

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      <AddressSearch
        value={address}
        onChange={setAddress}
        onSearch={handleSearch}
        compact={compact}
      />
      <RadiusSelector value={radius} onChange={setRadius} compact={compact} />

      {!compact && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-10 h-10 text-primary/60" />
          </div>
          <h3 className="font-sans font-semibold text-xl text-foreground mb-2 text-balance text-center">
            Find restaurants near any location
          </h3>
          <p className="text-muted-foreground text-center leading-relaxed max-w-sm">
            Enter an address above to discover great places to eat and drink,
            even if you're not there yet.
          </p>
        </div>
      )}
    </div>
  );
}
