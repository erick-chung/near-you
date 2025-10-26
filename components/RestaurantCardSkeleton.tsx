export default function RestaurantCardSkeleton() {
  return (
    <article
      className="bg-card rounded-xl shadow-md p-4 border border-border animate-pulse"
      aria-label="Loading restaurant information"
      role="status"
    >
      {/* Header with name and badge skeleton */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="h-6 bg-muted rounded-md w-3/4" aria-hidden="true" />
        <div className="h-6 w-16 bg-muted rounded-full shrink-0" aria-hidden="true" />
      </div>
      {/* Address skeleton */}
      <div className="flex items-start gap-2 mb-3">
        <div className="h-4 w-4 bg-muted rounded shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-full" aria-hidden="true" />
          <div className="h-4 bg-muted rounded w-2/3" aria-hidden="true" />
        </div>
      </div>
      {/* Rating skeleton */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-4 bg-muted rounded" aria-hidden="true" />
          ))}
        </div>
        <div className="h-4 w-8 bg-muted rounded" aria-hidden="true" />
        <div className="h-4 w-24 bg-muted rounded" aria-hidden="true" />
      </div>
      {/* Price and cuisine skeleton */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-4 w-12 bg-muted rounded" aria-hidden="true" />
        <div className="h-4 w-px bg-border" aria-hidden="true" />
        <div className="h-4 w-32 bg-muted rounded" aria-hidden="true" />
      </div>
      {/* Distance skeleton */}
      <div className="pt-3 border-t border-border">
        <div className="h-4 w-20 bg-muted rounded" aria-hidden="true" />
      </div>
    </article>
  );
}