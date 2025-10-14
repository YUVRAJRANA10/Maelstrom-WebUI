"use client"

import { useState, useEffect, useMemo } from "react"
import { mockApi } from "@/lib/mock-api"
import type { PoolMock } from "@/types/pool"

type SortField = "liquidity" | "priceChange" | "lastExchange";
type SortDirection = "asc" | "desc";
type FilterType = "all" | "active" | "new";

export function usePools() {
  const [pools, setPools] = useState<PoolMock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<{ field: SortField; direction: SortDirection }>({
    field: "liquidity",
    direction: "desc"
  })
  const [filter, setFilter] = useState<FilterType>("all")
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Fetch pools data
  const fetchPools = async () => {
    try {
      setLoading(true)
      const rawPools = await mockApi.getPools()
      
      // Transform the data to match PoolMock interface
      const transformedPools: PoolMock[] = rawPools.map(pool => ({
        slug: pool.token.symbol,
        symbol: pool.token.symbol,
        name: pool.token.name,
        priceUSD: Number.parseFloat(pool.avgPrice) / 1e18,
        priceChange24hPct: (Math.random() - 0.5) * 20, // Mock 24h change
        liquidityUSD: Number.parseFloat(pool.totalLiquidty),
        lastExchangeTs: pool.lastUpdated,
        priceHistory24h: Array.from({ length: 24 }, () => 
          Number.parseFloat(pool.avgPrice) / 1e18 * (1 + (Math.random() - 0.5) * 0.1)
        )
      }))
      
      setPools(transformedPools)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pools")
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh effect
  useEffect(() => {
    fetchPools()
    
    if (autoRefresh) {
      const interval = setInterval(fetchPools, 10000) // Refresh every 10s
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  // Sort and filter pools
  const filteredPools = useMemo(() => {
    let result = [...pools]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(pool => 
        pool.name.toLowerCase().includes(searchLower) ||
        pool.symbol.toLowerCase().includes(searchLower)
      )
    }

    // Apply type filter
    switch (filter) {
      case "active":
        result = result.filter(pool => pool.lastExchangeTs > Date.now() - 24 * 60 * 60 * 1000)
        break
      case "new":
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        result = result.filter(pool => pool.lastExchangeTs > oneWeekAgo)
        break
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sort.field) {
        case "liquidity":
          comparison = a.liquidityUSD - b.liquidityUSD
          break
        case "priceChange":
          comparison = a.priceChange24hPct - b.priceChange24hPct
          break
        case "lastExchange":
          comparison = a.lastExchangeTs - b.lastExchangeTs
          break
      }
      return sort.direction === "desc" ? -comparison : comparison
    })

    return result
  }, [pools, search, sort, filter])

  return {
    pools: filteredPools,
    loading,
    error,
    search,
    setSearch,
    sort,
    setSort,
    filter,
    setFilter,
    autoRefresh,
    setAutoRefresh,
    refetch: fetchPools
  }
}
