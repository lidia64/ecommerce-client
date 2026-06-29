// ── Product Card Skeleton ──────────────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="flex items-center justify-between pt-1">
          <div className="skeleton h-5 w-16" />
          <div className="skeleton h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// ── Product Grid Skeleton ──────────────────────────────────────────────────────
export function ProductGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ── Product Detail Skeleton ────────────────────────────────────────────────────
export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="skeleton rounded-2xl h-96 w-full" />
      <div className="space-y-4">
        <div className="skeleton h-8 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-7 w-24 mt-4" />
        <div className="skeleton h-11 w-40 rounded-lg mt-6" />
      </div>
    </div>
  )
}

// ── Generic Inline Skeleton ────────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}
