"use client";

import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddressSearch } from "./AddressSearch";
import { RadiusSelector } from "./RadiusSelector";
import { geocodeAddress } from "@/lib/actions/geocoding.action";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState(initialAddress || "");
  const [radius, setRadius] = useState(
    initialRadius ? Number(initialRadius) : 1609
  ); // Default 1 mile
  const router = useRouter();

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      if (!address.trim()) throw new Error("Please enter an address!");

      const result = await geocodeAddress(address);

      if (!result) throw new Error("Could not fetch coordinates");

      console.log(result);

      router.push(
        `/results?address=${result.formatted}&lat=${result.coordinates.lat}&lng=${result.coordinates.lng}&radius=${radius}`
      );
    } catch (err) {
      // By default, err is type unknown. So, you have to set Error to something that's definitely a string such as a custom message or the message from the Error object
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    if (error) setError(null);
  };

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      <AddressSearch
        value={address}
        onChange={handleAddressChange}
        onSearch={handleSearch}
        compact={compact}
        isLoading={isLoading}
        error={error}
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
