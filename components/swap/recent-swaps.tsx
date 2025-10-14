"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink, Clock } from "lucide-react"

interface RecentSwap {
  id: string
  tokenA: string
  tokenB: string
  amountA: string
  amountB: string
  timestamp: number
  txHash: string
}

const recentSwaps: RecentSwap[] = [
  {
    id: "1",
    tokenA: "ETH",
    tokenB: "DAI",
    amountA: "1.25",
    amountB: "4,000",
    timestamp: Date.now() - 120000, // 2 minutes ago
    txHash: "0x1234...5678",
  },
  {
    id: "2",
    tokenA: "USDC",
    tokenB: "WBTC",
    amountA: "50,000",
    amountB: "0.74",
    timestamp: Date.now() - 300000, // 5 minutes ago
    txHash: "0x2345...6789",
  },
  {
    id: "3",
    tokenA: "DAI",
    tokenB: "ETH",
    amountA: "8,000",
    amountB: "2.5",
    timestamp: Date.now() - 480000, // 8 minutes ago
    txHash: "0x3456...7890",
  },
]

export function RecentSwaps() {
  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    return `${minutes}m ago`
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-medium">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Recent Swaps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentSwaps.map((swap) => (
          <div key={swap.id} className="p-3 bg-muted/20 rounded-lg space-y-2">
            {/* Swap Details */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {swap.tokenA}
                </Badge>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <Badge variant="outline" className="text-xs">
                  {swap.tokenB}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{formatTimeAgo(swap.timestamp)}</span>
            </div>

            {/* Amounts */}
            <div className="flex items-center justify-between text-sm">
              <span>
                {swap.amountA} {swap.tokenA}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span>
                {swap.amountB} {swap.tokenB}
              </span>
            </div>

            {/* Transaction Hash */}
            <div className="flex items-center justify-between">
              <code className="text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded">{swap.txHash}</code>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-border/50">
          <Button variant="ghost" size="sm" className="w-full text-accent hover:text-accent-cyan-2">
            View All Swaps
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
