"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"
import * as THREE from "three"

// Load the 3D model
export function Instructor3D({
  isPlaying = false,
  isMuted = false,
  currentSpeech = ""
}: {
  isPlaying?: boolean
  isMuted?: boolean
  currentSpeech?: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Simple animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2
    }
  })

  return (
    <Box
      ref={meshRef}
      args={[1, 1, 1]} // width, height, depth
      position={[0, 0, 0]}
    >
      <meshStandardMaterial color={isPlaying ? "#4CAF50" : "#2196F3"} />
    </Box>
  )
}

// No preloading needed for basic geometry

