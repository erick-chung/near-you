import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
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
                className="h-12 w-auto drop-shadow-sm"
              />
            </div>
          </Link>

          <p className="hidden sm:block text-sm text-muted-foreground font-medium">
            Discover places before you go
          </p>
        </div>
      </div>
    </header>
  );
}
