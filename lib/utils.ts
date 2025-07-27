import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)
  const formattedMinutes = String(minutes).padStart(2, "0")
  const formattedSeconds = String(seconds).padStart(2, "0")

  return `${formattedMinutes}:${formattedSeconds}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

