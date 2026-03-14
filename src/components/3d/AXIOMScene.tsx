'use client'

import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
// Bloom intentionally disabled for clean "eyes + reactor only" lighting.
import SuitModel from './SuitModel'
import ParticleGrid from './ParticleGrid'
import ShockwaveRing from './ShockwaveRing'
import ImpactEffects from './ImpactEffects'
import GroundShadow from './GroundShadow'
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore'
import { LoadingScreen } from '@/components/hud/LoadingScreen'

// Drives the phase machine: IDLE → LANDING → HUD_INTRO
// Lives inside Canvas so it has access to the R3F context if needed.
function LandingTrigger() {
  const phase    = useAXIOMStore((s) => s.phase)
  const setPhase = useAXIOMStore((s) => s.setPhase)

  // Fire LANDING 800ms after mount (gives scene time to settle)
  useEffect(() => {
    if (phase !== AnimationPhase.IDLE) return
    const t = setTimeout(() => setPhase(AnimationPhase.LANDING), 800)
    return () => clearTimeout(t)
  }, [phase, setPhase])

  // Spring onRest in SuitModel fires RISING when the drop finishes.
  // Advance to HUD_INTRO 600ms after that so the landing pose is briefly held.
  useEffect(() => {
    if (phase !== AnimationPhase.RISING) return
    const t = setTimeout(() => setPhase(AnimationPhase.HUD_INTRO), 600)
    return () => clearTimeout(t)
  }, [phase, setPhase])

  return null
}

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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
    <LoadingScreen />
    <Canvas
      camera={{ position: [0, 0.8, 7.0], fov: 44 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: '100%', height: '100%', display: 'block', background: '#080808' }}
      dpr={[1, 2]}
    >
      <Lights />

      <LandingTrigger />
      <ImpactEffects />

      <Suspense fallback={null}>
        <SuitModel />
        <GroundShadow />
        <ParticleGrid />
        <ShockwaveRing />
        <Environment preset="studio" />
      </Suspense>

      {/* Post-processing disabled to prevent unintended body glow artifacts. */}

      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={10}
        target={[0, 0.4, 0]}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
    </div>
  )
}