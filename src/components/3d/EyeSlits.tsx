'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function EyeSlits() {
  const leftRef = useRef<THREE.Mesh>(null)
  const rightRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Eyes pulse in sync with arc reactor but slightly different phase
    const intensity = 4.0 + Math.sin(t * 2.5 + 0.3) * 1.5

    if (leftRef.current) {
      const mat = leftRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = intensity
    }
    if (rightRef.current) {
      const mat = rightRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = intensity
    }
  })

  const eyeMaterial = {
    color: '#000000',
    emissive: '#4FC3F7',
    emissiveIntensity: 4.0,
    toneMapped: false,
  } as const

  // Eye position: Y=1.00 = visor level on the helmet
  // The eyes on Mark 42 sit in the upper half of the face, wide-set and angled slightly inward
  return (
    <group position={[0, 0.955, 0.14]}>
      {/* Left eye slit — angled inward (rotateY slightly) */}
      <mesh ref={leftRef} position={[-0.041, 0.004, 0]} rotation={[0, 0.15, 0]}>
        <boxGeometry args={[0.05, 0.013, 0.008]} />
        <meshStandardMaterial {...eyeMaterial} />
      </mesh>

      {/* Right eye slit — angled inward (rotateY slightly negated) */}
      <mesh ref={rightRef} position={[0.041, 0.004, 0]} rotation={[0, -0.15, 0]}>
        <boxGeometry args={[0.05, 0.013, 0.008]} />
        <meshStandardMaterial {...eyeMaterial} />
      </mesh>

      {/* Subtle point light from eyes — illuminates visor area */}
      <pointLight
        color="#4FC3F7"
        intensity={0.8}
        distance={0.5}
        decay={2}
      />
    </group>
  )
}