import { mockApi } from "./mock-api"

export interface PriceUpdate {
  token: string
  price: string
  change24h: number
  volume24h: string
  timestamp: number
}

export interface LiquidityEvent {
  id: string
  type: "add" | "remove"
  token: string
  amount: string
  user: string
  timestamp: number
}

export interface TradeEvent {
  id: string
  type: "buy" | "sell" | "swap"
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
  user: string
  timestamp: number
  txHash: string
}

class EnhancedMockApi {
  private priceUpdateCallbacks: ((update: PriceUpdate) => void)[] = []
  private liquidityEventCallbacks: ((event: LiquidityEvent) => void)[] = []
  private tradeEventCallbacks: ((event: TradeEvent) => void)[] = []
  private priceUpdateInterval: NodeJS.Timeout | null = null

  constructor() {
    this.startPriceUpdates()
  }

  // Real-time price updates
  startPriceUpdates() {
    this.priceUpdateInterval = setInterval(() => {
      this.simulatePriceUpdate()
    }, 5000) // Update every 5 seconds
  }

  stopPriceUpdates() {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval)
      this.priceUpdateInterval = null
    }
  }

  private async simulatePriceUpdate() {
    const pools = await mockApi.getPools()
    const randomPool = pools[Math.floor(Math.random() * pools.length)]

    // Simulate price movement (-2% to +2%)
    const priceChange = (Math.random() - 0.5) * 0.04
    const newPrice = (Number.parseFloat(randomPool.sellPrice) * (1 + priceChange)).toString()

    const update: PriceUpdate = {
      token: randomPool.token.symbol,
      price: newPrice,
      change24h: priceChange * 100,
      volume24h: randomPool.volume24h,
      timestamp: Date.now(),
    }

    this.priceUpdateCallbacks.forEach((callback) => callback(update))
  }

  // Event subscriptions
  onPriceUpdate(callback: (update: PriceUpdate) => void) {
    this.priceUpdateCallbacks.push(callback)
    return () => {
      const index = this.priceUpdateCallbacks.indexOf(callback)
      if (index > -1) {
        this.priceUpdateCallbacks.splice(index, 1)
      }
    }
  }
}

export const enhancedMockApi = new EnhancedMockApi()
