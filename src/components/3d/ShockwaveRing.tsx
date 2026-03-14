'use client';

import { useSpring, animated } from '@react-spring/three';
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore';
import { useEffect, useState } from 'react';

export function ShockwaveRing() {
  const phase = useAXIOMStore((state) => state.phase);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (phase === AnimationPhase.LANDING) {
      // Trigger shockwave slightly after drop starts. Let's trigger it immediately for now, or delay it to match impact.
      // Impact happens at end of drop (2 seconds)
      const timeout = setTimeout(() => {
        setActive(true);
      }, 1900); // 1.9s to sync with impact at 2.0s
      return () => clearTimeout(timeout);
    } else if (phase === AnimationPhase.IDLE || phase === AnimationPhase.LOADING) {
      setActive(false);
    }
  }, [phase]);

  const { scale, opacity } = useSpring({
    scale: active ? [5, 5, 5] : [0.1, 0.1, 0.1],
    opacity: active ? 0 : 0.8,
    config: { duration: 800 }, // Expands and fades over 800ms
  });

  return (
    <animated.mesh 
      position={[0, 0, 0]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      scale={scale as any}
      visible={active || opacity.to(o => o > 0)}
    >
      <torusGeometry args={[1, 0.05, 16, 100]} />
      <animated.meshStandardMaterial 
        color="#C9A84C" 
        emissive="#C9A84C" 
        emissiveIntensity={2} 
        transparent 
        opacity={opacity} 
      />
    </animated.mesh>
  );
}
