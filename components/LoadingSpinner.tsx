import { MapPin } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6" role="status" aria-live="polite" aria-label="Loading restaurants">
      {/* Spinner Container */}
      <div className="relative w-24 h-24" aria-hidden="true">
        {/* Outer rotating ring with gradient */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-primary via-primary/60 to-transparent bg-clip-border animate-spin [animation-duration:2s]" />
        {/* Middle pulsing ring */}
        <div className="absolute inset-2 rounded-full border-4 border-primary/30 animate-pulse [animation-duration:1.5s]" />
        {/* Inner rotating ring (opposite direction) */}
        <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-primary animate-spin [animation-duration:1s] [animation-direction:reverse]" />
        {/* Center icon with pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Pulsing background glow */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse [animation-duration:2s]" />
            {/* Location pin icon */}
            <MapPin className="w-8 h-8 text-primary relative z-10 animate-bounce [animation-duration:1.5s]" aria-hidden="true" />
          </div>
        </div>
      </div>
      {/* Loading text with animated dots */}
      <div className="flex items-center gap-1">
        <p className="text-lg font-medium text-foreground">
          Searching for restaurants
        </p>
        <div className="flex gap-1" aria-hidden="true">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
      {/* Subtle hint text */}
      <p className="text-sm text-muted-foreground animate-pulse [animation-duration:3s]">
        Finding the best spots near you
      </p>
    </div>
  );
}