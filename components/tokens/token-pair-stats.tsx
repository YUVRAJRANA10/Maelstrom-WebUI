"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Pool } from "@/types/pool";
import { formatEther } from "viem";

interface TokenPairStatsProps {
  poolData: Pool;
}

export function TokenPairStats({ poolData }: TokenPairStatsProps) {
  const stats = [
    {
      label: "24h Volume",
      value: `${Number(formatEther(BigInt(poolData.volume24h))).toFixed(8)} ETH`,
    },
    {
      label: "Total Liquidity",
      value: `${Number(formatEther(BigInt(poolData.totalLiquidty))).toFixed(8)} ETH`,
    },
    {
      label: "Buy Price",
      value: `${Number(formatEther(BigInt(poolData.buyPrice))).toFixed(8)} ETH`,
    },
    {
      label: "Sell Price",
      value: `${Number(formatEther(BigInt(poolData.sellPrice))).toFixed(8)} ETH`,
      change: "Current",
      positive: true,
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="relative overflow-hidden border-0 group"
        >
          {/* Glass background with gradient */}
          <div className="absolute inset-0 bg-background-800/40 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] to-primary-500/[0.05]" />
          <div className="absolute inset-0 border border-white/[0.05] rounded-lg" />

          <CardContent className="relative p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground/80 font-medium">
                {stat.label}
              </p>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
