'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore'

useGLTF.preload('/models/Y_Bot.glb')

export default function SuitModel() {
  const { scene } = useGLTF('/models/Y_Bot.glb')
  const groupRef        = useRef<THREE.Group>(null)
  const arcReactorRef   = useRef<THREE.Mesh>(null)
  const arcLightRef     = useRef<THREE.PointLight>(null)
  const eyeLeftRef      = useRef<THREE.Mesh>(null)
  const eyeRightRef     = useRef<THREE.Mesh>(null)
  const animatedBonesRef  = useRef<Record<string, THREE.Object3D>>({})
  const baseRotationsRef  = useRef<Record<string, THREE.Euler>>({})
  const phase = useAXIOMStore((state) => state.phase)

  useEffect(() => {
    if (!scene) return

    // ── MARK 42 MATERIALS ─────────────────────────────────────────────────
    const armourMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#8A0F14'),
      metalness: 0.84,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.05,
    })

    const jointsMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D4B15B'),
      metalness: 0.6,
      roughness: 0.28,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
      envMapIntensity: 0.3,
      emissive: new THREE.Color('#C9A84C'),
      emissiveIntensity: 0.0,
    })

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.name === 'Alpha_Joints') {
          child.material = jointsMaterial
        } else {
          // Every single other mesh gets armourMaterial — no exceptions
          child.material = armourMaterial
        }
      }
    })

    // ── BONE HELPER ───────────────────────────────────────────────────────
    const bn = (child: THREE.Object3D, shortName: string) =>
      child.name === `mixamorig:${shortName}` ||
      child.name === `mixamorig${shortName}`  ||
      child.name === shortName

    const captureBase = (key: string, bone: THREE.Object3D) => {
      animatedBonesRef.current[key] = bone
      baseRotationsRef.current[key] = bone.rotation.clone()
    }

    scene.traverse((child) => {
      if (bn(child, 'Spine'))         { child.rotation.x =  0.02 }
      if (bn(child, 'Spine1'))        { child.rotation.x =  0.03 }
      if (bn(child, 'Spine2'))        { child.rotation.x =  0.05 }
      if (bn(child, 'LeftShoulder'))  { child.rotation.z =  0.14; child.rotation.x = 0.04 }
      if (bn(child, 'RightShoulder')) { child.rotation.z = -0.14; child.rotation.x = 0.04 }
      if (bn(child, 'LeftArm'))       { child.rotation.z =  0;   child.rotation.x =  1.3 }
      if (bn(child, 'RightArm'))      { child.rotation.z =  0;   child.rotation.x =  1.3 }
      if (bn(child, 'LeftForeArm'))   { child.rotation.z =  0;   child.rotation.x =  0.1; child.rotation.y = 0 }
      if (bn(child, 'RightForeArm'))  { child.rotation.z =  0;   child.rotation.x = -0.1; child.rotation.y = 0 }
      if (bn(child, 'LeftHand'))      { child.rotation.x =  0 }
      if (bn(child, 'RightHand'))     { child.rotation.x =  0 }

      if (bn(child, 'Spine2'))        captureBase('spine2', child)
      if (bn(child, 'Head'))          captureBase('head', child)
      if (bn(child, 'LeftShoulder'))  captureBase('leftShoulder', child)
      if (bn(child, 'RightShoulder')) captureBase('rightShoulder', child)
      if (bn(child, 'LeftArm'))       captureBase('leftArm', child)
      if (bn(child, 'RightArm'))      captureBase('rightArm', child)
    })

    // ── DEV AUDIT ─────────────────────────────────────────────────────────
    if (process.env.NODE_ENV === 'development') {
      const meshNames: string[] = []
      const boneNames: string[] = []
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) meshNames.push(child.name)
        if (child instanceof THREE.Bone || child.type === 'Bone') boneNames.push(child.name)
      })
      console.group('[AXIOM] Model audit')
      console.log('Meshes:', meshNames)
      console.log('Bones: ', boneNames)
      console.groupEnd()
    }
  }, [scene])

  // ── IDLE SWAY + BONE TRACKING + GLOW PULSE ───────────────────────────
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      const cinematicPhase =
        phase === AnimationPhase.LOADING ||
        phase === AnimationPhase.HUD_INTRO ||
        phase === AnimationPhase.LANDING ||
        phase === AnimationPhase.RISING

      const targetY = cinematicPhase ? -1.08 : -0.9
      const bob =
        phase === AnimationPhase.INTERACTIVE || phase === AnimationPhase.PROJECT_VIEW
          ? Math.sin(t * 1.0) * 0.012
          : 0

      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY + bob,
        0.08
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.sin(t * 0.32) * 0.05,
        0.08
      )
    }

    // Breathing
    const breathingActive =
      phase === AnimationPhase.HUD_INTRO ||
      phase === AnimationPhase.INTERACTIVE ||
      phase === AnimationPhase.PROJECT_VIEW

    if (breathingActive) {
      const breath = Math.sin(t * 1.7) * 0.018

      const spine2 = animatedBonesRef.current.spine2
      const spine2Base = baseRotationsRef.current.spine2
      if (spine2 && spine2Base) spine2.rotation.x = spine2Base.x + breath

      const head = animatedBonesRef.current.head
      const headBase = baseRotationsRef.current.head
      if (head && headBase) head.rotation.x = headBase.x + breath * 0.35

      const leftShoulder = animatedBonesRef.current.leftShoulder
      const leftShoulderBase = baseRotationsRef.current.leftShoulder
      if (leftShoulder && leftShoulderBase) leftShoulder.rotation.x = leftShoulderBase.x + breath * 0.5

      const rightShoulder = animatedBonesRef.current.rightShoulder
      const rightShoulderBase = baseRotationsRef.current.rightShoulder
      if (rightShoulder && rightShoulderBase) rightShoulder.rotation.x = rightShoulderBase.x + breath * 0.5

      const leftArm = animatedBonesRef.current.leftArm
      const leftArmBase = baseRotationsRef.current.leftArm
      if (leftArm && leftArmBase) leftArm.rotation.x = leftArmBase.x + breath * 0.04

      const rightArm = animatedBonesRef.current.rightArm
      const rightArmBase = baseRotationsRef.current.rightArm
      if (rightArm && rightArmBase) rightArm.rotation.x = rightArmBase.x - breath * 0.04
    }

    // ── Attach arc reactor to Spine1 bone every frame ─────────────────
    if (arcReactorRef.current) {
      scene.traverse((child) => {
        if (
          child.name === 'mixamorig:Spine2' ||
          child.name === 'mixamorigSpine2' ||
          child.name === 'Spine2'
        ) {
          const worldPos = new THREE.Vector3()
          child.getWorldPosition(worldPos)
          arcReactorRef.current!.position.copy(worldPos)
          arcReactorRef.current!.position.z += 0.22
          arcReactorRef.current!.position.y += 0.08
        }
      })
      if (arcLightRef.current) {
        arcLightRef.current.position.copy(arcReactorRef.current.position)
      }
      // Pulse emissive
      const mat = arcReactorRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 7.5 + Math.sin(t * 2.0) * 0.8
    }

    // ── Attach eye slits to Head bone every frame ─────────────────────
    if (eyeLeftRef.current && eyeRightRef.current) {
      scene.traverse((child) => {
        if (
          child.name === 'mixamorig:Head' ||
          child.name === 'mixamorigHead' ||
          child.name === 'Head'
        ) {
          const worldPos = new THREE.Vector3()
          child.getWorldPosition(worldPos)

          eyeLeftRef.current!.position.set(
            worldPos.x - 0.038,
            worldPos.y + 0.07,
            worldPos.z + 0.14
          )
          eyeRightRef.current!.position.set(
            worldPos.x + 0.038,
            worldPos.y + 0.07,
            worldPos.z + 0.14
          )
        }
      })
      // Pulse eyes in sync
      const intensity = 11.0 + Math.sin(t * 2.2 + 0.3) * 1.0
      ;(eyeLeftRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity
      ;(eyeRightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity
    }

    void delta
  })

  return (
    <>
      {/* Suit model */}
      <group ref={groupRef} position={[0, -1.3, 0]} rotation={[0, 0.1, 0]} scale={[0.012, 0.012, 0.012]}>
        <primitive object={scene} />
      </group>

      {/* Arc Reactor — position updated every frame via ref */}
      <mesh ref={arcReactorRef}>
        <circleGeometry args={[0.04, 32]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#4FC3F7"
          emissiveIntensity={8.0}
          toneMapped={false}
        />
      </mesh>

      {/* Arc reactor point light — distance kept short to avoid blue-washing the neck */}
      <pointLight
        ref={arcLightRef}
        color="#4FC3F7"
        intensity={3.0}
        distance={0.4}
        decay={2}
      />

      {/* Left Eye */}
      <mesh ref={eyeLeftRef}>
        <boxGeometry args={[0.08, 0.022, 0.01]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#4FC3F7"
          emissiveIntensity={12.0}
          toneMapped={false}
        />
      </mesh>

      {/* Right Eye */}
      <mesh ref={eyeRightRef}>
        <boxGeometry args={[0.08, 0.022, 0.01]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#4FC3F7"
          emissiveIntensity={12.0}
          toneMapped={false}
        />
      </mesh>
    </>
  )
}
