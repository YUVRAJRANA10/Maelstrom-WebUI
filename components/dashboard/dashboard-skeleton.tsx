export function DashboardSkeleton() {
  return (
    <div className="min-h-screen relative bg-gradient-pattern overflow-hidden">
      <main className="container relative mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header Skeleton */}
          <div className="relative rounded-xl p-8 overflow-hidden backdrop-blur-xl border border-white/[0.05]">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] to-primary-500/[0.05]" />
            <div className="absolute inset-0 border border-white/[0.05] rounded-xl" />
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-4 w-96 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Overview Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden border-0 rounded-lg"
              >
                <div className="absolute inset-0 bg-background-800/40 backdrop-blur-xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] to-primary-500/[0.05]" />
                <div className="absolute inset-0 border border-white/[0.05] rounded-lg" />
                <div className="relative z-10 p-6 space-y-4">
                  <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                </div>
                {/* Shimmer effect */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Pools Table Skeleton */}
            <div className="lg:col-span-2 space-y-8">
              <div className="relative rounded-xl overflow-hidden backdrop-blur-xl border border-white/[0.05]">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] to-primary-500/[0.05]" />
                <div className="absolute inset-0 border border-white/[0.05] rounded-xl" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-7 w-48 bg-white/5 rounded-lg animate-pulse" />
                    <div className="h-5 w-24 bg-white/5 rounded animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="relative p-4 rounded-lg backdrop-blur-sm border border-white/[0.05]
                          before:absolute before:inset-0 before:bg-background-800/30 before:-z-10"
                      >
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
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Activity Skeleton */}
            <div className="relative rounded-xl overflow-hidden backdrop-blur-xl border border-white/[0.05]">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] to-primary-500/[0.05]" />
              <div className="absolute inset-0 border border-white/[0.05] rounded-xl" />
              <div className="relative p-6">
                <div className="h-7 w-40 bg-white/5 rounded-lg animate-pulse mb-6" />
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="relative rounded-lg p-4 border border-white/[0.05]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                            <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                            <div className="h-4 w-40 bg-white/5 rounded animate-pulse" />
                          </div>
                        </div>
                      </div>
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dynamic glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--accent-cyan)/10%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--primary-500)/5%,transparent_50%)]" />
      </div>
    </div>
  );
}
