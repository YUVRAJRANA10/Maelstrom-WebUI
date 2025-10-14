export interface Token{
  address: string
  symbol: string
  name: string
  icon: string
  decimals: number
}

export interface LiquidityPoolToken extends Token{
  totalSupply: string
  balance: string
}

export interface ETH{
  priceUSD: string
  lastUpdated: number
  symbol: string
}

export interface Pool {
  token: Token
  ethReserve: string
  lpToken: LiquidityPoolToken
  tokenReserve: string
  buyPrice: string
  sellPrice: string
  avgPrice: string
  tokenRatio: string  
  volume24h: string
  totalLiquidty: string
  apr: number
  lastUpdated: number
}

export interface BuyTrade{
  token: Token
  buyPrice: string
  imapct: string  //10% for say
}

export interface SellTrade{
  token: Token
  sellPrice: string
  impact: string
}

export interface SwapRequest{
  tokenIn: Token,
  tokenOut: Token,
  amountIn: string,
}

export interface SellRequest{
  token: Token,
  amountIn: string,
}

export interface BuyRequest{
  token: Token,
  amountIn: string
}

export interface DepositRequest{
  token: Token,
  ethAmount: string
  tokenAmount: string
}

export interface WithdrawRequest{
  token: Token,
  lpTokenAmount: string
}

export interface SwapResult{
  success: boolean
  txHash: string
  swapRequest: SwapRequest
  amountOut: string
  timestamp: number
  fee: string
  error?: string
}

export interface SellResult{
  success: boolean
  txHash: string
  sellRequest: SellRequest
  amountOut: string
  timestamp: number
  fee: string
  error?: string
}

export interface BuyResult{
  success: boolean
  txHash: string
  buyRequest: BuyRequest
  amountOut: string
  timestamp: number
  fee: string
  error?: string
}

export interface DepositResult{
  success: boolean
  txHash: string
  depositRequest: DepositRequest
  lpTokensMinted: string
  timestamp: number
  error?: string
}

export interface WithdrawResult{
  success: boolean
  txHash: string
  withdrawRequest: WithdrawRequest
  tokenAmount: string
  ethAmount: string
  timestamp: number
  error?: string
}

export interface PoolData {
  token: string
  symbol: string
  totalLiquidity: string
  liquidityChange24h: number
  poolRatio: string
  tradingFee: string
  estimatedAPR: string
  tokenReserves: {
    token: {
      amount: string
      value: string
      percentage: number
    }
    eth: {
      amount: string
      value: string
      percentage: number
    }
  }
  totalValue: string
  availableChains: string[]
  poolStatistics: {
    totalFeesCollected: {
      token: string
      eth: string
    }
    volume24h: string
    volume7d: string
    poolAge: string
  }
  priceData: {
    current: number
    change24h: number
    ethPrice: number
    history: Array<{
      timestamp: number
      price: number
    }>
  }
}

export const ETH_MOCK: ETH ={
  priceUSD: "2070.96",
  lastUpdated: Date.now(),
  symbol: "ETH"
}

export const DAI_MOCK: Token ={
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  symbol: "DAI",
  name: "Dai Stablecoin",
  icon: "https://placehold.co/64x64?text=DAI",
  decimals: 18
}

export const WBTC_MOCK: Token ={
  address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  symbol: "WBTC",
  name: "Wrapped Bitcoin",
  icon: "https://placehold.co/64x64?text=WBTC",
  decimals: 8
}

const USDC_MOCK: Token ={
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  symbol: "USDC",
  name: "USD Coin",
  icon: "https://placehold.co/64x64?text=USDC",
  decimals: 6
}

export const Tokens: Token[] = [DAI_MOCK, USDC_MOCK, WBTC_MOCK]
export const TOKEN_MAP = new Map<string,Token>();
TOKEN_MAP.set("DAI", DAI_MOCK);
TOKEN_MAP.set("USDC", USDC_MOCK);
TOKEN_MAP.set("WBTC", WBTC_MOCK);

export const LP_MOCK: LiquidityPoolToken ={
  address: "0xMockLPTokenAddress0000000000000000000000",
  symbol: "MOCK-LP",
  name: "Mock Liquidity Pool Token",
  icon: "https://placehold.co/64x64?text=LP",
  decimals: 18,
  totalSupply: "10000000000000000000000", // 10,000 MOCK-LP
  balance: "5000000000000000000000" // 5,000 MOCK-LP
}

// Mock pool data
const mockPools: Pool[] = [
  { 
    token: DAI_MOCK,
    ethReserve: "1000000000000000000000",
    lpToken: LP_MOCK,
    tokenReserve: "3200000000000000000000000", // 3.2M DAI
    buyPrice: "3250000000000000000000", // 3250 DAI per ETH (buy)
    sellPrice: "3150000000000000000000", // 3150 DAI per ETH (sell)
    avgPrice: "3200000000000000000000", // 3200 DAI per ETH (spot)
    tokenRatio: "3.2",  // 3.2 DAI per 1 ETH
    volume24h: "2500000", // $2.5M 24h volume
    totalLiquidty: "10200000", // $10.2M total liquidity
    apr: 12.5, // 12.5% APR
    lastUpdated: Date.now(), // 1 minute ago
  },
  {
    token: USDC_MOCK,
    ethReserve: "750000000000000000000", // 750 ETH
    lpToken: LP_MOCK,
    tokenReserve: "2250000000", // 2.25M USDC (6 decimals)
    buyPrice: "3050000000000000000000", // 3050 USDC per ETH
    sellPrice: "2950000000000000000000", // 2950 USDC per ETH
    avgPrice: "3000000000000000000000", // 3000 USDC per ETH
    tokenRatio: "3.0",  // 3.0 USDC per 1 ETH
    volume24h: "1500000", // $1.5M 24h volume
    totalLiquidty: "6750000", // $6.75M total liquidity
    apr: 10.2, // 10.2% APR
    lastUpdated: Date.now() - 60000, // 1 minute ago
  },
  {
    token: WBTC_MOCK,
    ethReserve: "500000000000000000000", // 500 ETH
    lpToken: LP_MOCK,
    tokenReserve: "15", // 15 WBTC (8 decimals)
    buyPrice: "41000000000000000000000", // 41,000 USDC per ETH
    sellPrice: "39000000000000000000000", // 39,000 USDC per ETH
    avgPrice: "40000000000000000000000", // 40,000 USDC per ETH
    tokenRatio: "40.0",  // 40 WBTC per 1 ETH
    volume24h: "3000000", // $3M 24h volume
    totalLiquidty: "20000000", // $20M total liquidity
    apr: 15.8, // 15.8% APR
    lastUpdated: Date.now() - 120000, // 2 minutes ago
  },
]

// Simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class MockApi {
  private pools: Pool[] = [...mockPools]

  async getPools(): Promise<Pool[]> {
    await delay(Math.random() * 500 + 200) // 200-700ms delay
    return [...this.pools]
  }

  async getPool(token: string): Promise<Pool | null> {
    await delay(Math.random() * 300 + 100) // 100-400ms delay
    return this.pools.find((p) => p.token.name === token) || null
  }

  async buy(buyRequest: BuyRequest): Promise<BuyResult> {
    await delay(Math.random() * 1000 + 500)
    const token=buyRequest.token
    const ethAmount = buyRequest.amountIn

    const pool = this.pools.find((p) => p.token === token)
    if (!pool) throw new Error("Pool not found")

    const ethAmountNum = Number.parseFloat(ethAmount)

    const newBuyPrice = (Number.parseFloat(pool.buyPrice) * (1.1)).toString()
    const newSellPrice = (Number.parseFloat(pool.sellPrice) * (0.99)).toString()

    pool.buyPrice = newBuyPrice
    pool.sellPrice = newSellPrice
    pool.lastUpdated = Date.now()

    const amountOut = (ethAmountNum * Number.parseFloat(pool.buyPrice)).toString()

    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      buyRequest: buyRequest,
      amountOut,
      fee: (Number.parseFloat(amountOut) * 0.005).toString(), // 0.5% fee
      timestamp: Date.now(),
    }
  }

  async sell(sellRequest: SellRequest): Promise<SellResult> {
    await delay(Math.random() * 1000 + 500)
    const token = sellRequest.token
    const tokenAmount = sellRequest.amountIn

    const pool = this.pools.find((p) => p.token === token)
    if (!pool) throw new Error("Pool not found")

    const tokenAmountNum = Number.parseFloat(tokenAmount)

    const newBuyPrice = (Number.parseFloat(pool.buyPrice) * (1.01)).toString()
    const newSellPrice = (Number.parseFloat(pool.sellPrice) * (0.99)).toString()

    pool.buyPrice = newBuyPrice
    pool.sellPrice = newSellPrice
    pool.lastUpdated = Date.now()

    const amountOut = ((tokenAmountNum / Number.parseFloat(pool.sellPrice))).toString()

    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      sellRequest: sellRequest,
      amountOut,
      fee: (Number.parseFloat(amountOut) * 0.005).toString(), // 0.5% fee
      timestamp: Date.now(),
    }
  }

  async swap(swapRequest: SwapRequest): Promise<SwapResult> {
    await delay(Math.random() * 1200 + 600)

    const tokenIn = swapRequest.tokenIn 
    const tokenOut = swapRequest.tokenOut
    const amountIn = swapRequest.amountIn

    // Simplified swap logic - in reality this would be more complex
    const poolA = this.pools.find((p) => p.token === tokenIn)
    const poolB = this.pools.find((p) => p.token === tokenOut)

    if (!poolA || !poolB) throw new Error("Pool not found")

    const amountInNum = Number.parseFloat(amountIn)

    // Estimate output (simplified)
    const ethValue = amountInNum * Number.parseFloat(poolA.sellPrice)
    const amountOut = ethValue / Number.parseFloat(poolB.buyPrice)

    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      swapRequest: swapRequest,
      amountOut: amountOut.toString(),
      fee: (amountOut * 0.005).toString(), // 0.5% fee
      timestamp: Date.now(),
    }
  }
}

export function getPoolData(tokenSymbol: string): PoolData {
  return {
    token: tokenSymbol,
    symbol: tokenSymbol.toUpperCase(),
    totalLiquidity: "$148.37B",
    liquidityChange24h: 2.31,
    poolRatio: "0.0565",
    tradingFee: "5.00%",
    estimatedAPR: "597.40%",
    tokenReserves: {
      token: {
        amount: "633.56K",
        value: "$74.07B",
        percentage: 49.9
      },
      eth: {
        amount: "35.77K",
        value: "$74.30B",
        percentage: 50.1
      }
    },
    totalValue: "$148.37B",
    availableChains: ["base"],
    poolStatistics: {
      totalFeesCollected: {
        token: "30.37K",
        eth: "2.06M"
      },
      volume24h: "$12.45B",
      volume7d: "N/A",
      poolAge: "84 days"
    },
    priceData: {
      current: 116907.79,
      change24h: 174.46,
      ethPrice: 2077096.13,
      history: Array.from({ length: 100 }, (_, i) => ({
        timestamp: Date.now() - (100 - i) * 600000,
        price: 116000 + Math.sin(i * 0.1) * 1000 + Math.random() * 500
      }))
    }
  }
}

// Singleton instance
export const mockApi = new MockApi()
