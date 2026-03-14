'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore'
import * as THREE from 'three'

const GROUND_Y = -1.06

// Each ring is described by its config and live progress (0 → 1)
interface RingConfig {
  delay: number      // ms before expansion starts
  maxScale: number
  durationMs: number
}

const RINGS: RingConfig[] = [
  { delay: 0,   maxScale: 10, durationMs: 700 },
  { delay: 220, maxScale: 6,  durationMs: 480 },
]

export default function ShockwaveRing() {
  const phase = useAXIOMStore((s) => s.phase)

  // meshRefs[i] holds the mesh for RINGS[i]
  const meshRefs = useRef<(THREE.Mesh | null)[]>([null, null])
  // startTime[i] = clock time (ms) when ring i should begin expanding; -1 = not yet triggered
  const startTimes = useRef<number[]>([-1, -1])
  const triggered  = useRef(false)

  useEffect(() => {
    if (phase === AnimationPhase.RISING && !triggered.current) {
      triggered.current = true
      // startTimes are set inside useFrame on first detection so we have the live clock
    } else if (phase === AnimationPhase.IDLE || phase === AnimationPhase.LOADING) {
      triggered.current = false
      startTimes.current = [-1, -1]
      // Reset all meshes to invisible
      meshRefs.current.forEach((m) => {
        if (!m) return
        m.scale.set(0.001, 0.001, 0.001)
        ;(m.material as THREE.MeshStandardMaterial).opacity = 0
      })
    }
  }, [phase])

  useFrame((state) => {
    if (!triggered.current) return

    const nowMs = state.clock.elapsedTime * 1000

    RINGS.forEach(({ delay, maxScale, durationMs }, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return

      const mat = mesh.material as THREE.MeshStandardMaterial

      // Stamp the start time on the first frame after trigger
      if (startTimes.current[i] === -1) {
        startTimes.current[i] = nowMs + delay
      }

      const elapsed = nowMs - startTimes.current[i]

      if (elapsed < 0) {
        // Waiting for delay — keep invisible
        mat.opacity = 0
        mesh.scale.set(0.001, 0.001, 0.001)
        return
      }

      const progress = Math.min(elapsed / durationMs, 1)

      const scale = 0.1 + progress * (maxScale - 0.1)
      mesh.scale.set(scale, scale, scale)
      mat.opacity = 0.9 * (1 - progress)  // linear fade out
    })
  })

  return (
    <group>
      {RINGS.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el }}
          position={[0, GROUND_Y, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[0.001, 0.001, 0.001]}
        >
          <torusGeometry args={[1, 0.035, 16, 100]} />
          <meshStandardMaterial
            color="#C9A84C"
            emissive="#C9A84C"
            emissiveIntensity={4}
            transparent
            opacity={0}
            toneMapped={false}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
