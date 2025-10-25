"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Token } from "@/types/token";
import { Pool } from "@/types/pool";
import { BuyTrade, SellTrade } from "@/types/trades";
import { ContractClient } from "@/lib/contract-client";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { formatEther } from "viem";
import { RefreshCw, Clock, TrendingUp } from "lucide-react";

interface PriceChartsProps {
  token: Token;
  pool: Pool;
}

interface ChartDataPoint {
  time: string;
  buyPrice: number;
  sellPrice: number;
  formattedTime: string;
  timestamp: number;
}

const BLOCKS_PER_FETCH = 999; // Load 1000 blocks at a time

export function PriceCharts({ token, pool }: PriceChartsProps) {
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const [buyChartData, setBuyChartData] = useState<ChartDataPoint[]>([]);
  const [sellChartData, setSellChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextBlockToFetch, setNextBlockToFetch] = useState<number | null>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const { chainId, chain } = useAccount();
  const nativeCurrencySymbol = chain?.nativeCurrency?.symbol || "ETH";
  const contractClient = useMemo(
    () => new ContractClient(writeContractAsync, publicClient, chainId),
    [chainId]
  );

  const generateChartData = useCallback(
    (buyTrades: BuyTrade[], sellTrades: SellTrade[]): { buyData: ChartDataPoint[], sellData: ChartDataPoint[] } => {
      // Process buy trades separately - don't set sellPrice at all (undefined)
      const buyData = buyTrades.map((trade) => {
        const tradeDate = new Date(trade.timestamp);
        return {
          time: tradeDate.toISOString(),
          buyPrice: parseFloat(formatEther(BigInt(trade.buyPrice))),
          sellPrice: undefined as any, // undefined so it doesn't show on the chart
          formattedTime: tradeDate.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: trade.timestamp,
        };
      });

      // Process sell trades separately - don't set buyPrice at all (undefined)
      const sellData = sellTrades.map((trade) => {
        const tradeDate = new Date(trade.timestamp);
        return {
          time: tradeDate.toISOString(),
          buyPrice: undefined as any, // undefined so it doesn't show on the chart
          sellPrice: parseFloat(formatEther(BigInt(trade.sellPrice))),
          formattedTime: tradeDate.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: trade.timestamp,
        };
      });

      return { buyData, sellData };
    },
    []
  );

  const fetchNextBatch = useCallback(async () => {
    if (loading || !hasMoreData) return;

    setLoading(true);
    setError(null);

    try {
      // Get the current block if we don't have it yet
      let toBlock: number;
      if (nextBlockToFetch === null) {
        const latestBlock = await publicClient?.getBlockNumber();
        if (!latestBlock) {
          throw new Error("Unable to get current block number");
        }
        toBlock = Number(latestBlock);
      } else {
        toBlock = nextBlockToFetch;
      }

      const fromBlock = Math.max(0, toBlock - BLOCKS_PER_FETCH);

      // Fetch trades for this block range
      const [buyTrades, sellTrades] = await Promise.all([
        contractClient.getBuyTradeEventLogs(fromBlock, toBlock, token),
        contractClient.getSellTradeEventLogs(fromBlock, toBlock, token),
      ]);

      console.log("Fetched trades from blocks", fromBlock, "to", toBlock);

      // Generate chart data from trades
      const { buyData, sellData } = generateChartData(buyTrades, sellTrades);

      // Add new data to existing data
      setBuyChartData((prevData) => {
        const combined = [...prevData, ...buyData];
        // Sort by timestamp and remove duplicates
        const uniqueData = Array.from(
          new Map(combined.map((item) => [item.timestamp, item])).values()
        ).sort((a, b) => a.timestamp - b.timestamp);
        return uniqueData;
      });

      setSellChartData((prevData) => {
        const combined = [...prevData, ...sellData];
        // Sort by timestamp and remove duplicates
        const uniqueData = Array.from(
          new Map(combined.map((item) => [item.timestamp, item])).values()
        ).sort((a, b) => a.timestamp - b.timestamp);
        return uniqueData;
      });

      // Update next block to fetch
      if (fromBlock > 0) {
        setNextBlockToFetch(fromBlock - 1);
      } else {
        setHasMoreData(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch trade data";
      setError(errorMessage);
      console.error("Error fetching trade data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    publicClient,
    contractClient,
    token,
    generateChartData,
    nextBlockToFetch,
    hasMoreData,
    loading,
  ]);

  // Initial data fetch
  useEffect(() => {
    fetchNextBatch();
  }, []); // Only run on mount

  const currentBuyPrice = parseFloat(formatEther(BigInt(pool.buyPrice)));
  const currentSellPrice = parseFloat(formatEther(BigInt(pool.sellPrice)));

  // Combine buy and sell data for display, always including current prices as latest points
  const displayData = useMemo(() => {
    const now = new Date();
    const currentTimestamp = Date.now();
    
    // Create current price data points
    const currentBuyPoint: ChartDataPoint = {
      time: now.toISOString(),
      buyPrice: currentBuyPrice,
      sellPrice: undefined as any,
      formattedTime: now.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: currentTimestamp,
    };

    const currentSellPoint: ChartDataPoint = {
      time: now.toISOString(),
      buyPrice: undefined as any,
      sellPrice: currentSellPrice,
      formattedTime: now.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: currentTimestamp,
    };

    // Combine historical data with current prices
    const buyDataWithCurrent = [...buyChartData, currentBuyPoint];
    const sellDataWithCurrent = [...sellChartData, currentSellPoint];

    // Merge buy and sell data points by timestamp, keeping undefined for missing values
    const allDataPoints = new Map<number, ChartDataPoint>();

    buyDataWithCurrent.forEach(point => {
      const existing = allDataPoints.get(point.timestamp);
      if (existing) {
        existing.buyPrice = point.buyPrice;
      } else {
        allDataPoints.set(point.timestamp, {
          ...point,
        });
      }
    });

    sellDataWithCurrent.forEach(point => {
      const existing = allDataPoints.get(point.timestamp);
      if (existing) {
        existing.sellPrice = point.sellPrice;
      } else {
        allDataPoints.set(point.timestamp, {
          ...point,
        });
      }
    });

    // Convert to array and sort by timestamp
    const sortedData = Array.from(allDataPoints.values()).sort((a, b) => a.timestamp - b.timestamp);

    // If no data, show current prices as single point
    if (sortedData.length === 0) {
      return [{
        time: now.toISOString(),
        buyPrice: currentBuyPrice,
        sellPrice: currentSellPrice,
        formattedTime: now.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: currentTimestamp,
      }];
    }

    // Handle first data point: if only one type exists, use its price for both
    if (sortedData.length > 0) {
      const firstPoint = sortedData[0];
      if (firstPoint.buyPrice !== undefined && firstPoint.sellPrice === undefined) {
        // Only buy trade exists at first point, use buy price for sell
        firstPoint.sellPrice = firstPoint.buyPrice;
      } else if (firstPoint.sellPrice !== undefined && firstPoint.buyPrice === undefined) {
        // Only sell trade exists at first point, use sell price for buy
        firstPoint.buyPrice = firstPoint.sellPrice;
      }
    }

    return sortedData;
  }, [buyChartData, sellChartData, currentBuyPrice, currentSellPrice]);

  const totalDataPoints = buyChartData.length + sellChartData.length;

  return (
    <div className="space-y-6">
      {/* Header with Load More Button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Price Charts</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {totalDataPoints > 0
              ? `${totalDataPoints} data points loaded`
              : "No data yet"}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={fetchNextBatch}
            disabled={loading || !hasMoreData}
            className="relative overflow-hidden bg-gradient-to-r from-accent-blue/20 to-primary-500/20 hover:from-accent-blue/30 hover:to-primary-500/30 
              border border-accent-blue/20 hover:border-accent-blue/40 text-accent-blue hover:text-white
              backdrop-blur-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 to-primary-500/5" />
            <div className="relative flex items-center">
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-2" />
              )}
              {loading
                ? "Loading..."
                : hasMoreData
                ? "Load More Data"
                : "No More Data"}
            </div>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Combined Price Chart */}
      <Card className="relative overflow-hidden">
        {/* Glass morphism effects */}
        <div className="absolute inset-0 bg-background-800/40 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] to-primary-500/[0.05]" />
        <div className="absolute inset-0 border border-white/[0.05] rounded-lg" />

        <CardContent className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h4 className="text-sm text-muted-foreground font-medium mb-3">
                Price Chart
              </h4>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Buy Price</p>
                  <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
                    {currentBuyPrice} {nativeCurrencySymbol}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sell Price</p>
                  <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500">
                    {currentSellPrice} {nativeCurrencySymbol}
                  </p>
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                {totalDataPoints > 0
                  ? `${totalDataPoints} data points`
                  : "No data"}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Buy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs text-muted-foreground">Sell</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="h-[400px] w-full flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-accent-blue" />
                <p className="text-sm text-muted-foreground">
                  Loading price data...
                </p>
              </div>
            </div>
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData}>
                  <defs>
                    <linearGradient
                      id="buyGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="rgb(16, 185, 129)"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="99%"
                        stopColor="rgb(16, 185, 129)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="sellGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="rgb(239, 68, 68)"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="99%"
                        stopColor="rgb(239, 68, 68)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="formattedTime"
                    tick={{ fill: "rgb(148, 163, 184)", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgb(148, 163, 184)", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(17, 25, 40, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      backdropFilter: "blur(16px)",
                    }}
                    labelStyle={{ color: "rgb(148, 163, 184)" }}
                    labelFormatter={(label) => label}
                    formatter={(value: any, name: string) => {
                      if (value === undefined || value === null) return null;
                      return [
                        `${Number(value).toFixed(8)} ${nativeCurrencySymbol}`,
                        name === "buyPrice" ? "Buy Price" : "Sell Price",
                      ];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="buyPrice"
                    stroke="rgb(16, 185, 129)"
                    fill="url(#buyGradient)"
                    strokeWidth={2}
                    name="buyPrice"
                    connectNulls={true}
                  />
                  <Area
                    type="monotone"
                    dataKey="sellPrice"
                    stroke="rgb(239, 68, 68)"
                    fill="url(#sellGradient)"
                    strokeWidth={2}
                    name="sellPrice"
                    connectNulls={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Summary Stats */}
      {totalDataPoints > 0 && !loading && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-background-800/40 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] to-primary-500/[0.05]" />
          <div className="absolute inset-0 border border-white/[0.05] rounded-lg" />

          <CardContent className="relative p-6">
            <h4 className="text-lg font-semibold mb-4 text-white">
              Price Statistics
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <div className="text-xs text-muted-foreground mb-1">
                  Current Spread
                </div>
                <div className="text-sm font-medium text-white">
                  {(
                    ((currentBuyPrice - currentSellPrice) / ((currentSellPrice + currentBuyPrice)/2)) *
                    100
                  ).toFixed(2)}
                  %
                </div>
              </div>

              <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <div className="text-xs text-muted-foreground mb-1">
                  Avg Buy Price
                </div>
                <div className="text-sm font-medium text-emerald-400">
                  {buyChartData.length > 0 ? (
                    <>
                      {(
                        buyChartData.reduce((sum, point) => sum + point.buyPrice, 0) /
                        buyChartData.length
                      ).toFixed(8)}{" "}
                      {nativeCurrencySymbol}
                    </>
                  ) : (
                    `${currentBuyPrice.toFixed(8)} ${nativeCurrencySymbol}`
                  )}
                </div>
              </div>

              <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <div className="text-xs text-muted-foreground mb-1">
                  Avg Sell Price
                </div>
                <div className="text-sm font-medium text-red-400">
                  {sellChartData.length > 0 ? (
                    <>
                      {(
                        sellChartData.reduce((sum, point) => sum + point.sellPrice, 0) /
                        sellChartData.length
                      ).toFixed(8)}{" "}
                      {nativeCurrencySymbol}
                    </>
                  ) : (
                    `${currentSellPrice.toFixed(8)} ${nativeCurrencySymbol}`
                  )}
                </div>
              </div>

              <div className="text-center p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <div className="text-xs text-muted-foreground mb-1">
                  Data Points
                </div>
                <div className="text-sm font-medium text-accent-blue">
                  {totalDataPoints}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.05]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Data Points:</span>
                <span className="text-white">{totalDataPoints}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-white flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
