"use client"

import { useRef, useEffect } from "react"

interface AudioVisualizerProps {
  audioData: Float32Array | null
  isRecording: boolean
}

export function AudioVisualizer({ audioData, isRecording }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    if (!audioData || !isRecording) {
      // Draw a flat line when not recording
      ctx.beginPath()
      ctx.moveTo(0, rect.height / 2)
      ctx.lineTo(rect.width, rect.height / 2)
      ctx.strokeStyle = isRecording ? "#ef4444" : "#a1a1aa"
      ctx.lineWidth = 2
      ctx.stroke()
      return
    }

    // Draw waveform
    const sliceWidth = rect.width / audioData.length

    ctx.beginPath()
    ctx.moveTo(0, rect.height / 2)

    for (let i = 0; i < audioData.length; i++) {
      const value = audioData[i]
      const y = (value * rect.height) / 2 + rect.height / 2

      ctx.lineTo(i * sliceWidth, y)
    }

    ctx.lineTo(rect.width, rect.height / 2)
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 2
    ctx.stroke()
  }, [audioData, isRecording])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

