"use client";

import type React from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddressSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  compact?: boolean;
  isLoading?: boolean;
  error: string | null;
}

export function AddressSearch({
  value,
  onChange,
  onSearch,
  compact,
  isLoading,
  error,
}: AddressSearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="address-input"
        className={`block font-medium text-foreground ${
          compact ? "text-xs mb-1.5" : "text-sm mb-2"
        }`}
      >
        Search Location
      </label>
      <div className="flex items-center gap-2">
        <input
          id="address-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="123 Main St, Brooklyn, NY"
          className={`flex-1 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
            compact ? "h-9 px-3 py-1.5 text-xs" : "h-11 px-4 py-2 text-sm"
          }`}
        />
        <Button
          onClick={onSearch}
          disabled={isLoading}
          size="icon"
          className={`shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground ${
            compact ? "h-9 w-9" : "h-11 w-11"
          }`}
        >
          {isLoading ? (
            <Loader2
              className={`${compact ? "h-4 w-4" : "h-5 w-5"} animate-spin`}
            />
          ) : (
            <Search className={compact ? "h-4 w-4" : "h-5 w-5"} />
          )}
          <span className="sr-only">
            {isLoading ? "Searching..." : "Search"}
          </span>
        </Button>
      </div>
      {error && (
        <div
          className={`flex items-center gap-1.5 text-destructive ${
            compact ? "mt-1 text-xs" : "mt-1.5 text-sm"
          }`}
        >
          <AlertCircle className={compact ? "h-3 w-3" : "h-4 w-4"} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
