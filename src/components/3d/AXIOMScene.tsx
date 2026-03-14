'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
// Bloom intentionally disabled for clean "eyes + reactor only" lighting.
import SuitModel from './SuitModel'

function Lights() {
  return (
    <>
      {/* Ambient lift so shadows are readable without flattening the model */}
      <ambientLight intensity={0.32} />

      {/* Gold key light */}
      <pointLight position={[3, 4, 2]} intensity={4} color="#FFD700" />

      {/* Front fill for torso readability — reduced to avoid chest wash */}
      <pointLight position={[0, 1.2, 4]} intensity={0.4} color="#FF4444" />

      {/* Warm red fill to keep chest deep crimson */}
      <pointLight position={[0, 1, 3]} intensity={1.5} color="#8B0000" />

      {/* Opposite fill to open left/right dark patches */}
      <pointLight position={[2.5, 1.5, -2]} intensity={0.55} color="#F2D8B8" />

      {/* Soft top light to reveal helmet/shoulder planes */}
      <pointLight position={[0, 5, 0]} intensity={0.55} color="#FFF2D8" />

      {/* Cool rim — depth */}
      <pointLight position={[-3, 2, -2]} intensity={0.6} color="#1A3A5C" />

      {/* Hemisphere fill to avoid crushed blacks in metallic surfaces */}
      <hemisphereLight args={['#2A1A14', '#2A1A14', 0.45]} />
    </>
  )
}

export default function AXIOMScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 5.0], fov: 38 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: '100%', height: '100%', display: 'block', background: '#080808' }}
      dpr={[1, 2]}
    >
      <Lights />

      <Suspense fallback={null}>
        <SuitModel />
        <Environment preset="studio" />
      </Suspense>

      {/* Post-processing disabled to prevent unintended body glow artifacts. */}

      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={8}
        target={[0, 0.6, 0]}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  )
}