"use client"

import { useRealTimePrices } from "@/hooks/use-real-time-data"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function RealTimeTicker() {
  const priceUpdates = useRealTimePrices()

  if (priceUpdates.length === 0) return null

  return (
    <div className="bg-gray-900/50 border-y border-gray-700 py-2 overflow-hidden">
      <div className="flex animate-scroll-left space-x-8">
        {priceUpdates.slice(0, 10).map((update, index) => (
          <div
            key={`${update.token}-${update.timestamp}-${index}`}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <span className="font-medium text-sm uppercase">{update.token}</span>
            <span className="text-sm">${Number.parseFloat(update.price).toFixed(2)}</span>
            <div className={cn("flex items-center text-xs", update.change24h >= 0 ? "text-green-400" : "text-red-400")}>
              {update.change24h >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(update.change24h).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
