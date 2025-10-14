export function TokenRowSkeleton() {
  return (
    <div className="relative p-4 rounded-lg backdrop-blur-sm border border-white/[0.05]
      before:absolute before:inset-0 before:bg-background-800/30 before:-z-10">
      <div className="relative flex items-center gap-4">
        {/* Logo Skeleton */}
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/10 to-primary-500/10 animate-pulse-slow" />
          <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse backdrop-blur-sm" />
        </div>

        {/* Token Info Skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-5 w-24 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
        </div>

        {/* Chart Skeleton */}
        <div className="hidden sm:block">
          <div className="h-12 w-32 bg-white/5 rounded animate-pulse" />
        </div>

        {/* Liquidity Skeleton */}
        <div className="hidden lg:block space-y-2">
          <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
          <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      {/* Loading shimmer effect */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>
    </div>
  )
}
