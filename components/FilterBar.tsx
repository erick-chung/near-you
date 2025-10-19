"use client";

import { useState } from "react";
import {
  ChevronDown,
  DollarSign,
  SlidersHorizontal,
  UtensilsCrossed,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export type SortOption = "distance" | "rating" | "price" | "name";

export interface FilterOptions {
  priceLevel: string[];
  minRating: number | null;
  openNow: boolean;
  cuisineType: string[];
}

interface FilterBarProps {
  sortBy: SortOption;
  filters: FilterOptions;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filters: FilterOptions) => void;
}

const PRICE_LEVELS = [
  { value: "$", label: "$", description: "Inexpensive" },
  { value: "$$", label: "$$", description: "Moderate" },
  { value: "$$$", label: "$$$", description: "Expensive" },
  { value: "$$$$", label: "$$$$", description: "Very Expensive" },
];

const CUISINE_TYPES = [
  { value: "italian", label: "Italian" },
  { value: "mexican", label: "Mexican" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "american", label: "American" },
  { value: "indian", label: "Indian" },
  { value: "thai", label: "Thai" },
  { value: "mediterranean", label: "Mediterranean" },
];

const RATING_OPTIONS = [
  { label: "Any", value: null },
  { label: "3.0+", value: 3.0 },
  { label: "4.0+", value: 4.0 },
  { label: "4.5+", value: 4.5 },
];

export function FilterBar({
  sortBy,
  filters,
  onSortChange,
  onFilterChange,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount =
    filters.priceLevel.length + // How many priceLevels are selected
    filters.cuisineType.length + // How many cuisine types are selected
    (filters.minRating !== null ? 1 : 0) + // 1 if
    (filters.openNow ? 1 : 0);

  const handlePriceLevelToggle = (priceLevel: string) => {
    const newPriceLevels = filters.priceLevel.includes(priceLevel)
      ? filters.priceLevel.filter((p) => p !== priceLevel)
      : [...filters.priceLevel, priceLevel];

    onFilterChange({ ...filters, priceLevel: newPriceLevels });
  };

  const handleCuisineTypeToggle = (cuisineType: string) => {
    const newCuisineTypes = filters.cuisineType.includes(cuisineType)
      ? filters.cuisineType.filter((c) => c !== cuisineType)
      : [...filters.cuisineType, cuisineType];

    onFilterChange({ ...filters, cuisineType: newCuisineTypes });
  };

  const handleRatingChange = (rating: number | null) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const handleOpenNowToggle = (checked: boolean) => {
    onFilterChange({ ...filters, openNow: checked });
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                Filters & Sort
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeFilterCount > 0
                  ? `${activeFilterCount} active filter${
                      activeFilterCount > 1 ? "s" : ""
                    }`
                  : "Customize your search"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {activeFilterCount}
              </div>
            )}
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="w-full bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm space-y-5">
          {/* Sort Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Sort By
            </label>
            <Select
              value={sortBy}
              onValueChange={(value) => onSortChange(value as SortOption)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sort option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating (High to Low)</SelectItem>
                <SelectItem value="price">Price (Low to High)</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Level Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-primary" />
              Price Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRICE_LEVELS.map((price) => (
                <label
                  key={price.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.priceLevel.includes(price.value)}
                    onCheckedChange={() => handlePriceLevelToggle(price.value)}
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {price.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Cuisine Type Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <UtensilsCrossed className="h-4 w-4 text-primary" />
              Cuisine Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CUISINE_TYPES.map((cuisine) => (
                <label
                  key={cuisine.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.cuisineType.includes(cuisine.value)}
                    onCheckedChange={() =>
                      handleCuisineTypeToggle(cuisine.value)
                    }
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {cuisine.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Rating Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Minimum Rating
            </label>
            <div className="grid grid-cols-4 gap-2">
              {RATING_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleRatingChange(option.value)}
                  className={`rounded-lg h-9 text-sm font-semibold transition-all ${
                    filters.minRating === option.value
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/20 shadow-sm"
                      : "bg-muted text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Open Now Toggle */}
          <div className="flex items-center justify-between pt-1">
            <label
              htmlFor="open-now"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              Open Now
            </label>
            <Switch
              id="open-now"
              checked={filters.openNow}
              onCheckedChange={handleOpenNowToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
