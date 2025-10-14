"use client";

import { Search } from "lucide-react";
import { Button } from "./ui/button";

interface AddressSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export default function AddressSearch({
  value,
  onChange,
  onSearch,
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
        className="block text-sm font-medium text-foreground mb-2"
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
          className="flex-1 h-11 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        <Button
          onClick={onSearch}
          size="icon"
          className="h-11 w-11 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </div>
  );
}
