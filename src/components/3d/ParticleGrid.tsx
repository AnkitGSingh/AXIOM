'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const GOLD_COUNT = 240
const BLUE_COUNT  =  60

export default function ParticleGrid() {
  const goldRef = useRef<THREE.Points>(null)
  const blueRef = useRef<THREE.Points>(null)

  const scene = useMemo(() => {
    // Soft circular sprite — eliminates the square-particle look
    const makeSprite = (r: number, g: number, b: number): THREE.CanvasTexture => {
      const sz  = 64
      const cvs = document.createElement('canvas')
      cvs.width = sz; cvs.height = sz
      const ctx  = cvs.getContext('2d')!
      const half = sz / 2
      const grad = ctx.createRadialGradient(half, half, 0, half, half, half)
      grad.addColorStop(0,   `rgba(${r},${g},${b},1)`)
      grad.addColorStop(0.4, `rgba(${r},${g},${b},0.6)`)
      grad.addColorStop(1,   `rgba(0,0,0,0)`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, sz, sz)
      return new THREE.CanvasTexture(cvs)
    }

    const buildCloud = (count: number) => {
      const pos    = new Float32Array(count * 3)
      const col    = new Float32Array(count * 3)  // RGB per particle — driven every frame
      const phases = new Float32Array(count)       // unique sin phase per particle
      const speeds = new Float32Array(count)       // unique drift speed — creates parallax
      for (let i = 0; i < count; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 22  // X: ±11
        pos[i * 3 + 1] = (Math.random() - 0.5) * 22  // Y: ±11
        pos[i * 3 + 2] = (Math.random() - 0.5) * 18  // Z: ±9 — fully surrounds model
        phases[i] = Math.random() * Math.PI * 2
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
      return { geo, pos, col, phases, speeds }
    }

    const gold = buildCloud(GOLD_COUNT)
    const blue = buildCloud(BLUE_COUNT)

    // Stagger speeds — faster = feels closer (parallax depth cue)
    for (let i = 0; i < GOLD_COUNT; i++) gold.speeds[i] = 0.0010 + Math.random() * 0.0015
    for (let i = 0; i < BLUE_COUNT;  i++) blue.speeds[i] = 0.0005 + Math.random() * 0.0008

    const makeMat = (r: number, g: number, b: number, size: number) =>
      new THREE.PointsMaterial({
        size,
        map:          makeSprite(r, g, b),
        vertexColors: true,   // per-particle brightness via color buffer
        transparent:  true,
        opacity:      1,
        depthWrite:   false,
        blending:     THREE.AdditiveBlending,
        sizeAttenuation: true,
        alphaTest:    0.005,  // discard the transparent sprite border
      })

    return {
      goldGeo: gold.geo, goldPos: gold.pos, goldCol: gold.col,
      goldPhases: gold.phases, goldSpeeds: gold.speeds,
      blueGeo:  blue.geo, bluePos:  blue.pos, blueCol:  blue.col,
      bluePhases: blue.phases, blueSpeeds: blue.speeds,
      goldMat: makeMat(201, 168,  76, 0.18),  // #C9A84C — larger foreground gold
      blueMat: makeMat( 79, 195, 247, 0.10),  // #4FC3F7 — smaller accent blue
    }
  }, [])

  // Pre-compute base colours once
  const GOLD = useMemo(() => new THREE.Color('#C9A84C'), [])
  const BLUE = useMemo(() => new THREE.Color('#4FC3F7'), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // ── Gold cloud ────────────────────────────────────────────────────────
    if (goldRef.current) {
      const { goldPos, goldCol, goldPhases, goldSpeeds } = scene
      for (let i = 0; i < GOLD_COUNT; i++) {
        // Brightness pulse — floor 0.15 keeps particles always faintly visible
        const p = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(t * 0.7 + goldPhases[i]))
        goldCol[i * 3]     = GOLD.r * p
        goldCol[i * 3 + 1] = GOLD.g * p
        goldCol[i * 3 + 2] = GOLD.b * p
        // Upward Y drift with wrap
        goldPos[i * 3 + 1] += goldSpeeds[i]
        if (goldPos[i * 3 + 1] > 11) goldPos[i * 3 + 1] = -11
      }
      ;(goldRef.current.geometry.getAttribute('color')    as THREE.BufferAttribute).needsUpdate = true
      ;(goldRef.current.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    }

    // ── Blue cloud — slower drift = parallax depth ────────────────────────
    if (blueRef.current) {
      const { bluePos, blueCol, bluePhases, blueSpeeds } = scene
      for (let i = 0; i < BLUE_COUNT; i++) {
        const p = 0.1 + 0.9 * (0.5 + 0.5 * Math.sin(t * 1.2 + bluePhases[i] + 1.5))
        blueCol[i * 3]     = BLUE.r * p
        blueCol[i * 3 + 1] = BLUE.g * p
        blueCol[i * 3 + 2] = BLUE.b * p
        bluePos[i * 3 + 1] += blueSpeeds[i]
        if (bluePos[i * 3 + 1] > 11) bluePos[i * 3 + 1] = -11
      }
      ;(blueRef.current.geometry.getAttribute('color')    as THREE.BufferAttribute).needsUpdate = true
      ;(blueRef.current.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    }
  })

  return (
    <group>
      <points ref={goldRef} geometry={scene.goldGeo} material={scene.goldMat} />
      <points ref={blueRef} geometry={scene.blueGeo} material={scene.blueMat} />
    </group>
  )
}
