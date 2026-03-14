'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore'
import { useAudio } from '@/lib/audio/useAudio'

// Fires on LANDING → RISING transition (exact impact moment):
//   1. Plays landing impact audio
//   2. Shakes camera for 300ms with decreasing intensity
export default function ImpactEffects() {
  const phase = useAXIOMStore((s) => s.phase)
  const { playLandingSound } = useAudio()
  const { camera } = useThree()

  const shaking      = useRef(false)
  const shakeElapsed = useRef(0)
  const baseX        = useRef(camera.position.x)
  const baseY        = useRef(camera.position.y)
  // Prevents double-fire when React re-renders during RISING phase
  const firedRef     = useRef(false)

  useEffect(() => {
    if (phase !== AnimationPhase.RISING) {
      firedRef.current = false  // reset so next landing can fire again
      return
    }
    if (firedRef.current) return  // already fired this cycle — don't repeat
    firedRef.current     = true
    baseX.current        = camera.position.x
    baseY.current        = camera.position.y
    shakeElapsed.current = 0
    shaking.current      = true
    playLandingSound()
  }, [phase, camera, playLandingSound])

  useFrame((_, delta) => {
    if (!shaking.current) return

    shakeElapsed.current += delta

    if (shakeElapsed.current >= 0.3) {
      // Restore exact baseline and stop
      camera.position.x = baseX.current
      camera.position.y = baseY.current
      shaking.current   = false
      return
    }

    // Intensity tapers from 0.1 → 0 over 300ms — violent at impact, gone cleanly
    const intensity = 0.1 * (1 - shakeElapsed.current / 0.3)
    camera.position.x = baseX.current + (Math.random() - 0.5) * intensity
    camera.position.y = baseY.current + (Math.random() - 0.5) * intensity
  })

  return null
}
