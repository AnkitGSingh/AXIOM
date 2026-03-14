'use client';

import { useProgress } from '@react-three/drei';
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore';
import { Howler } from 'howler';

export function LoadingScreen() {
  const { progress } = useProgress();
  const phase    = useAXIOMStore((state) => state.phase);
  const setPhase = useAXIOMStore((state) => state.setPhase);

  if (phase !== AnimationPhase.LOADING) return null;

  const handleInitialize = () => {
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }
    setPhase(AnimationPhase.IDLE);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] w-full h-full"
    >
      {progress < 100 ? (
        <div className="flex flex-col items-center gap-4">
          <h1
            style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#C9A84C', letterSpacing: '0.3em' }}
            className="text-4xl md:text-6xl font-bold"
          >
            AXIOM
          </h1>
          <div className="w-64 h-1 bg-gray-900 rounded overflow-hidden">
            <div
              className="h-full bg-[#C9A84C] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p style={{ fontFamily: 'var(--font-rajdhani), sans-serif', color: '#C9A84C' }}>
            {Math.round(progress)}%
          </p>
        </div>
      ) : (
        <button
          onClick={handleInitialize}
          style={{
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontSize: '2rem',
            padding: '1.5rem 4rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            border: '2px solid #C9A84C',
            color: '#C9A84C',
            background: 'transparent',
            boxShadow: '0 0 20px rgba(201,168,76,0.5)',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#C9A84C';
            (e.currentTarget as HTMLButtonElement).style.color = '#080808';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(201,168,76,0.9)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = '#C9A84C';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(201,168,76,0.5)';
          }}
        >
          INITIALIZE SYSTEM
        </button>
      )}
    </div>
  );
}
