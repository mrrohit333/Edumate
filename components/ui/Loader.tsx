"use client"

import React from 'react'
import { cn } from '@/lib/utils'

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The variant of the loader
   * @default "circle"
   */
  variant?: 'circle' | 'triangle' | 'rectangle'
  
  /**
   * The size of the loader
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg'
  
  /**
   * The path color of the loader
   * @default "currentColor"
   */
  pathColor?: string
  
  /**
   * The dot color of the loader
   * @default "red"
   */
  dotColor?: string
  
  /**
   * The duration of the animation in seconds
   * @default 3
   */
  duration?: number
}

/**
 * A component that displays an animated loading indicator
 */
export function Loader({
  variant = 'circle',
  size = 'default',
  pathColor = 'currentColor',
  dotColor = 'red',
  duration = 3,
  className,
  ...props
}: LoaderProps) {
  // Determine size in pixels
  const sizeMap = {
    sm: 32,
    default: 44,
    lg: 64
  }
  
  const pixelSize = sizeMap[size]
  
  const sizeStyles = {
    width: `${pixelSize}px`,
    height: variant === 'triangle' ? `${pixelSize * 0.93}px` : `${pixelSize}px`,
  }
  
  const customVars = {
    '--path': pathColor,
    '--dot': dotColor,
    '--duration': `${duration}s`,
  } as React.CSSProperties
  
  return (
    <div 
      className={cn('loader', variant === 'triangle' && 'triangle', className)}
      style={{ ...sizeStyles, ...customVars }}
      {...props}
    >
      {variant === 'circle' && (
        <svg viewBox="0 0 80 80">
          <circle r="32" cy="40" cx="40" />
        </svg>
      )}
      
      {variant === 'triangle' && (
        <svg viewBox="0 0 86 80">
          <polygon points="43 8 79 72 7 72" />
        </svg>
      )}
      
      {variant === 'rectangle' && (
        <svg viewBox="0 0 80 80">
          <rect height="64" width="64" y="8" x="8" />
        </svg>
      )}
    </div>
  )
}

// Export a loader wrapper component that includes all three loader types
export function LoaderGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)} {...props}>
      <Loader variant="circle" />
      <Loader variant="triangle" />
      <Loader variant="rectangle" />
    </div>
  )
} 