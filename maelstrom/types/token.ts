import { Address } from "viem"

export interface Token{
  address: Address
  symbol: string
  name: string
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