'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore'

// Radial glow texture: bright arc-reactor blue core fading to transparent.
// Built lazily in the browser (safe — component is inside ssr:false Canvas).
function buildGlowTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width  = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const cx  = size / 2

  const grad = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx)
  // Arc-reactor blue → gold mid → transparent edge
  grad.addColorStop(0,    'rgba(80, 200, 255, 0.55)')
  grad.addColorStop(0.20, 'rgba(60, 160, 220, 0.40)')
  grad.addColorStop(0.45, 'rgba(201, 168, 76, 0.20)')
  grad.addColorStop(0.70, 'rgba(201, 168, 76, 0.06)')
  grad.addColorStop(1,    'rgba(0, 0, 0, 0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

export default function GroundShadow() {
  const phase   = useAXIOMStore((s) => s.phase)
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef  = useRef<THREE.MeshBasicMaterial>(null)
  const texRef  = useRef<THREE.CanvasTexture | null>(null)

  const active = phase !== AnimationPhase.LOADING && phase !== AnimationPhase.IDLE

  useFrame((state) => {
    // Build texture on first frame (guarantees document exists)
    if (!texRef.current && matRef.current) {
      texRef.current = buildGlowTexture()
      matRef.current.map = texRef.current
      matRef.current.needsUpdate = true
    }

    const t = state.clock.elapsedTime
    // Gentle pulse in sync with arc reactor
    const pulse = active ? 0.75 + Math.sin(t * 2.0) * 0.08 : 0

    const speed = 0.06
    if (matRef.current) {
      matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, pulse, speed)
    }
    if (meshRef.current) {
      // Ellipse: wider side-to-side, narrower front-to-back
      const tX = active ? 2.2 : 0.1
      const tZ = active ? 1.4 : 0.1
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, tX, speed)
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, tZ, speed)
    }
  })

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.28, 0]}
      scale={[0.1, 1, 0.1]}
    >
      <circleGeometry args={[1.0, 64]} />
      <meshBasicMaterial
        ref={matRef}
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
