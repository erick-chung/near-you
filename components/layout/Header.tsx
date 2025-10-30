"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useFavoritesContext } from "@/contexts/FavoritesContext";

export default function Header() {
  const { user, isLoaded } = useUser();
  const { getFavoriteCount } = useFavoritesContext();
  const favoriteCount = getFavoriteCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Left */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-all hover:opacity-80 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative">
              <Image
                src="/near-you-logo.png"
                alt="NearYou"
                width={140}
                height={48}
                priority
                className="h-10 w-auto drop-shadow-sm sm:h-12"
              />
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Favorites Link - Prominent with Count Badge */}
            <Link
              href="/favorites"
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favorites</span>

              {/* Cute Count Bubble */}
              {user && favoriteCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {favoriteCount > 99 ? "99+" : favoriteCount}
                </div>
              )}
            </Link>

            {/* Auth Section - Right */}
            <div className="flex items-center gap-2">
              {!isLoaded ? (
                <Skeleton className="h-9 w-20 rounded-md" />
              ) : user ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
              ) : (
                <SignInButton mode="modal">
                  <Button size="sm" className="h-9 text-sm font-medium">
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
