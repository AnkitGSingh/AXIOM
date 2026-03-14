'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ArcReactor() {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  // Pulse the arc reactor intensity
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      // Gentle pulse between intensity 3 and 5
      mat.emissiveIntensity = 3.5 + Math.sin(t * 2.5) * 1.0
    }
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshStandardMaterial
      // Ring pulses slightly out of phase
      mat.emissiveIntensity = 1.5 + Math.sin(t * 2.5 + 0.8) * 0.5
      // Slow rotation of the ring
      ringRef.current.rotation.z = t * 0.5
    }
  })

  // Arc Reactor: mid-chest. Suit at Y=-1.0, scaled 0.012.
  // Chest sits ~Y=0.58 world units. Push Z forward so it faces viewer.
  return (
    <group position={[0, 0.66, 0.16]}>
      {/* Core glow — bright centre */}
      <mesh ref={meshRef}>
        <circleGeometry args={[0.055, 32]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#4FC3F7"
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </mesh>

      {/* Outer ring — slightly larger, dimmer */}
      <mesh ref={ringRef} position={[0, 0, -0.002]}>
        <ringGeometry args={[0.055, 0.08, 32]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#4FC3F7"
          emissiveIntensity={1.5}
          toneMapped={false}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Point light emanating from reactor — illuminates suit chest */}
      <pointLight
        color="#4FC3F7"
        intensity={1.5}
        distance={1.2}
        decay={2}
      />
    </group>
  )
}