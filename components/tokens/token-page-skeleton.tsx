"use client"

export function TokenPageSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Token Header Skeleton */}
      <div className="p-6 rounded-xl backdrop-blur-sm border border-white/[0.05]
        relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-background/50 before:via-background/70 before:to-background/80 before:opacity-90">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/10 to-primary-500/10 animate-pulse-slow" />
            <div className="absolute inset-0 rounded-full bg-blue-950/50 animate-pulse backdrop-blur-sm" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-accent/10 rounded animate-pulse" />
            <div className="h-3 w-16 bg-primary-500/10 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Token Pair Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl backdrop-blur-sm border border-white/[0.05]
            relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-background/50 before:via-background/70 before:to-background/80 before:opacity-90">
            <div className="space-y-2">
              <div className="h-3 w-20 bg-accent/10 rounded animate-pulse" />
              <div className="h-5 w-24 bg-primary-500/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Liquidity Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liquidity Breakdown */}
        <div className="p-6 rounded-xl backdrop-blur-sm border border-white/[0.05]
          relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-background/50 before:via-background/70 before:to-background/80 before:opacity-90">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-accent/10 rounded animate-pulse" />
            <div className="h-[200px] bg-primary-500/10 rounded-lg animate-pulse" />
          </div>
        </div>
        
        {/* Liquidity Actions */}
        <div className="p-6 rounded-xl backdrop-blur-sm border border-white/[0.05]
          relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-background/50 before:via-background/70 before:to-background/80 before:opacity-90">
          <div className="space-y-4">
            <div className="h-8 bg-accent/10 rounded animate-pulse" />
            <div className="h-[160px] bg-primary-500/10 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Price Charts Skeleton */}
      <div className="p-6 rounded-xl backdrop-blur-sm border border-white/[0.05]
        relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-background/50 before:via-background/70 before:to-background/80 before:opacity-90">
        <div className="space-y-4">
          <div className="h-4 w-40 bg-accent/10 rounded animate-pulse" />
          <div className="h-[300px] bg-primary-500/10 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}
