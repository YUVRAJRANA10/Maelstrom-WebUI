import { LiquidityPoolToken, Token } from "./token"
import { parseEther } from "viem"

export interface Pool {
  token: Token
  reserve: Reserve
  lpToken: LiquidityPoolToken
  buyPrice: string
  sellPrice: string
  avgPrice: string
  tokenRatio: string  
  volume24h: string
  totalLiquidty: string
  apr: number
  lastExchangeTs: number 
  lastUpdated: number
}

export interface RowPool{
  token: Token,
  buyPrice: string,
  sellPrice: string,
  totalLiquidity: string
  lpToken?: LiquidityPoolToken
}

const ETH: Token = {
  address: "0x0000000000000000000000000000000000000000",
  symbol: "ETH",
  name: "Ether",
  decimals: 18,
}

export const ETH_ROW_POOL: RowPool = {
  token: ETH,
  buyPrice: parseEther("1").toString(),
  sellPrice: parseEther("1").toString(),
  totalLiquidity: parseEther("0").toString(),
}

export interface InitPool{
  token: string
  ethAmount: string
  tokenAmount: string
  inititalBuyPrice: string
  initialSellPrice: string
}

export interface InitPoolResult{
  success: boolean
  txHash: string
  timestamp: number
  error?: string
}

export interface Reserve {
  tokenReserve: string,
  ethReserve: string
}


export interface PoolMock {
  slug: string;            
  symbol: string;         
  name: string;           
  logoUrl?: string;
  priceUSD: number;
  priceChange24hPct: number;
  liquidityUSD: number;
  lastExchangeTs: number;  // unix timestamp
  priceHistory24h: number[]; // small array for sparkline
}

// Function to format currency in compact notation
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2
  }).format(value);
}

// Function to format relative time
export function formatRelativeTime(timestamp: number): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diff = Math.floor((timestamp - Date.now()) / 1000);

  if (Math.abs(diff) < 60) return "just now";
  
  const minutes = Math.floor(diff / 60);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  
  const hours = Math.floor(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  
  const days = Math.floor(hours / 24);
  return rtf.format(days, "day");
}

// Function to format percentage with + sign for positive values
export function formatPercentage(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
