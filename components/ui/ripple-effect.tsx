'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from "@/lib/utils"

interface RippleEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number
  color?: string
}

export function RippleEffect({ 
  className,
  duration = 850,
  color = "rgba(255, 255, 255, 0.15)",
  ...props 
}: RippleEffectProps) {
  const rippleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rippleElement = rippleRef.current
    if (!rippleElement) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = rippleElement.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      rippleElement.style.setProperty('--x', `${x}px`)
      rippleElement.style.setProperty('--y', `${y}px`)
    }

    const parentElement = rippleElement.parentElement
    if (parentElement) {
      parentElement.addEventListener('mousemove', handleMouseMove)
      return () => parentElement.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={rippleRef}
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[inherit]",
        className
      )}
      {...props}
      style={{
        '--duration': `${duration}ms`,
        '--color': color,
      } as React.CSSProperties}
    >
      <div 
        className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), ${color}, transparent 40%)`
        }}
      />
    </div>
  )
}
