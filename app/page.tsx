"use client";
import { GetLocationButton } from "@/components/GetLocationButton";
import SearchForm from "@/components/SearchForm";
import { Coordinates } from "@/lib/types";
import { useState } from "react";
import { UtensilsCrossed, MapPin, Sparkles, Search } from "lucide-react";

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
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 relative">
          {/* Safe decorative food icons - positioned well away from text */}
          <div className="absolute -top-8 left-8 text-primary/20 animate-bounce hidden lg:block" style={{ animationDelay: "0s" }}>
            <UtensilsCrossed className="h-10 w-10" />
          </div>
          <div className="absolute -top-6 right-8 text-primary/20 animate-bounce hidden lg:block" style={{ animationDelay: "0.5s" }}>
            <Sparkles className="h-8 w-8" />
          </div>

          {/* Main heading */}
          <div className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Search className="h-8 w-8 sm:h-12 sm:w-12 fill-primary text-primary animate-pulse" />
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              Discover Amazing Restaurants
            </h1>
            <MapPin className="h-8 w-8 sm:h-12 sm:w-12 fill-primary text-primary animate-pulse" />
          </div>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty mb-8 sm:mb-12">
            Find the perfect dining spot near any location and save your favorites for later
          </p>

          {/* Safe floating food emojis - positioned away from text content */}
          <div className="absolute -left-8 top-40 text-2xl animate-bounce hidden xl:block" style={{ animationDelay: "0.3s" }}>
            🍔
          </div>
          <div className="absolute -right-8 top-40 text-2xl animate-bounce hidden xl:block" style={{ animationDelay: "0.8s" }}>
            🍣
          </div>
        </div>

        {/* Search Section */}
        <section 
          className="relative" 
          aria-label="Find restaurants near any location"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 -m-8 sm:-m-12 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-primary/10 -z-10" />
          <div className="absolute -top-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 blur-xl -z-10" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-primary/5 blur-xl -z-10" />
          
          {/* Search form container */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative">
            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 text-primary/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="absolute -top-2 -right-2 text-primary/30">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Where would you like to eat?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Search by address or use your current location
                </p>
              </div>

              <SearchForm
                externalAddress={externalAddress}
                externalCoordinates={externalCoordinates}
              />
              
              <div className="flex justify-center">
                <GetLocationButton onSetAddress={handleSetAddress} />
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="mt-16 sm:mt-24 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-card/50 rounded-xl p-6 border border-border/50 hover:bg-card/70 transition-colors">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Smart Search</h3>
              <p className="text-sm text-muted-foreground">Find restaurants by location, cuisine, price, and rating</p>
            </div>
            
            <div className="bg-card/50 rounded-xl p-6 border border-border/50 hover:bg-card/70 transition-colors">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Live Directions</h3>
              <p className="text-sm text-muted-foreground">Get directions from your search location to any restaurant</p>
            </div>
            
            <div className="bg-card/50 rounded-xl p-6 border border-border/50 hover:bg-card/70 transition-colors">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Save Favorites</h3>
              <p className="text-sm text-muted-foreground">Build your personal collection of amazing dining spots</p>
            </div>
          </div>
        </section>

        {/* Bottom decorative elements - safe positioning */}
        <div className="mt-16 sm:mt-24 relative">
          <div className="absolute left-4 bottom-0 text-3xl opacity-20 animate-bounce hidden lg:block" style={{ animationDelay: "2s" }}>
            🥘
          </div>
          <div className="absolute right-4 bottom-0 text-3xl opacity-20 animate-bounce hidden lg:block" style={{ animationDelay: "2.5s" }}>
            🍷
          </div>
        </div>
      </div>
    </main>
  );
}