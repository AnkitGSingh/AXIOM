'use client';

import { useProgress } from '@react-three/drei';
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore';
import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const { progress } = useProgress();
  const phase = useAXIOMStore((state) => state.phase);
  const setPhase = useAXIOMStore((state) => state.setPhase);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (progress === 100 && phase === AnimationPhase.LOADING) {
      setTimeout(() => setPhase(AnimationPhase.HUD_INTRO), 500);
    }
  }, [progress, phase, setPhase]);

  // Fallback: if loading never reaches 100% (asset stall, missing file, etc.),
  // force-advance after 10 seconds so the experience is never permanently blocked.
  useEffect(() => {
    if (phase !== AnimationPhase.LOADING) return;
    const fallback = setTimeout(() => {
      setPhase(AnimationPhase.HUD_INTRO);
    }, 10000);
    return () => clearTimeout(fallback);
  }, [phase, setPhase]);

  useEffect(() => {
    if (phase !== AnimationPhase.LOADING) {
      setTimeout(() => setVisible(false), 500); // allow fade out
    }
  }, [phase]);

  if (!visible) return null;

  return (
    <div 
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] text-[#C9A84C] transition-opacity duration-500 font-orbitron select-none ${phase !== AnimationPhase.LOADING ? 'opacity-0' : 'opacity-100'}`}
    >
      <h1 className="text-4xl md:text-6xl tracking-[0.3em] font-bold mb-8">AXIOM</h1>
      <div className="text-2xl mb-4 font-rajdhani">{Math.round(progress)}%</div>
      <div className="w-64 h-1 bg-gray-900 rounded overflow-hidden">
        <div 
          className="h-full bg-[#C9A84C] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
