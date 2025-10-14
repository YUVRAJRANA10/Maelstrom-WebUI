"use client"

import { useState, useEffect } from "react"
import { enhancedMockApi, type PriceUpdate } from "@/lib/enhanced-mock-api"

export function useRealTimePrices() {
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([])

  useEffect(() => {
    const unsubscribe = enhancedMockApi.onPriceUpdate((update) => {
      setPriceUpdates((prev) => [update, ...prev.slice(0, 49)]) // Keep last 50 updates
    })

    return unsubscribe
  }, [])

  return priceUpdates
}
