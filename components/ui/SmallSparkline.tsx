"use client"

import { useMemo } from "react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface SmallSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  positive?: boolean;
}

export function SmallSparkline({ 
  data, 
  width = 120, 
  height = 40, 
  className = "",
  positive = true
}: SmallSparklineProps) {
  // Transform data into the format recharts expects
  const chartData = useMemo(() => 
    data.map((value, index) => ({ value, index })),
    [data]
  )

  const color = positive ? "#2bd3ff" : "#ff6b6b"
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`h-[${height}px] w-[${width}px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
