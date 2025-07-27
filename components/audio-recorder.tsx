"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mic, Square, Play, Pause, Save, Loader2, RefreshCw } from "lucide-react"
import { formatTime } from "@/lib/utils"

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingName, setRecordingName] = useState("")
  const [processing, setProcessing] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Set up audio context for visualization
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 256

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Handle recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [isRecording, isPaused])

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Set up audio visualization
      if (audioContextRef.current && analyserRef.current) {
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream)
        sourceRef.current.connect(analyserRef.current)
        visualize()
      }

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setAudioBlob(audioBlob)

        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)

        if (audioRef.current) {
          audioRef.current.src = url
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())

        // Stop visualization
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      setAudioBlob(null)
      setAudioUrl(null)
      setFeedback(null)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const visualize = () => {
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext("2d")
    if (!canvasCtx) return

    const width = canvas.width
    const height = canvas.height
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    canvasCtx.clearRect(0, 0, width, height)

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)

      analyserRef.current!.getByteFrequencyData(dataArray)

      canvasCtx.fillStyle = "rgb(20, 20, 20)"
      canvasCtx.fillRect(0, 0, width, height)

      const barWidth = (width / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2

        canvasCtx.fillStyle = `rgb(${barHeight + 100}, 100, 200)`
        canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    draw()
  }

  const handleSubmit = async () => {
    if (!audioBlob) return

    setProcessing(true)

    try {
      // Simulate sending to backend for processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate feedback from AI
      setFeedback(`
        Your pronunciation is good overall. Here are some suggestions:
        
        1. Pay attention to the "th" sound in "the" and "this"
        2. Try to emphasize the stressed syllables more
        3. Your intonation is natural, keep it up!
        
        Overall score: 85/100
      `)
    } catch (error) {
      console.error("Error processing audio:", error)
    } finally {
      setProcessing(false)
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setIsPlaying(false)
    setRecordingName("")
    setFeedback(null)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  // Handle audio ended event
  useEffect(() => {
    const handleAudioEnded = () => {
      setIsPlaying(false)
    }

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnded)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnded)
      }
    }
  }, [audioRef.current])

  return (
    <div className="space-y-4">
      <div className="relative h-24 bg-muted rounded-md overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" width={300} height={100} />

        {!isRecording && !audioBlob && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Click record to start speaking</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {isRecording ? (
            <span className="flex items-center">
              {isPaused ? "Paused" : "Recording"}
              {!isPaused && <span className="ml-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
            </span>
          ) : audioBlob ? (
            "Recording complete"
          ) : (
            "Not recording"
          )}
        </div>
        <div className="text-sm font-mono">{formatTime(recordingTime)}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {!isRecording && !audioBlob ? (
          <Button onClick={startRecording} className="flex-1" variant="default">
            <Mic className="mr-2 h-4 w-4" />
            Record
          </Button>
        ) : isRecording ? (
          <>
            <Button onClick={stopRecording} variant="destructive" className="flex-1">
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>

            {isPaused ? (
              <Button onClick={resumeRecording} variant="outline" className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
            ) : (
              <Button onClick={pauseRecording} variant="outline" className="flex-1">
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            )}
          </>
        ) : (
          <>
            <Button onClick={playAudio} variant="outline" className="flex-1">
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </>
              )}
            </Button>

            <Button onClick={resetRecording} variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              New
            </Button>

            <Button onClick={handleSubmit} variant="default" className="flex-1" disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </>
        )}
      </div>

      {audioBlob && !processing && !feedback && (
        <div className="pt-2">
          <Label htmlFor="recording-name" className="text-sm">
            Recording Name
          </Label>
          <Input
            id="recording-name"
            value={recordingName}
            onChange={(e) => setRecordingName(e.target.value)}
            placeholder="Enter a name for your recording"
            className="mt-1"
          />
        </div>
      )}

      {feedback && (
        <Card className="p-3 mt-2 text-sm whitespace-pre-line">
          <div className="font-medium mb-1">AI Feedback:</div>
          {feedback}
        </Card>
      )}

      <audio ref={audioRef} className="hidden" />
    </div>
  )
}

