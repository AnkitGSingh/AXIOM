'use client';

import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useEffect, useState, Component, ReactNode } from 'react';

// Isolates EffectComposer crash so it never brings down the whole Canvas
class PostFX_ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function BloomEffect() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={1.5}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export function PostProcessing() {
  return (
    <PostFX_ErrorBoundary>
      <BloomEffect />
    </PostFX_ErrorBoundary>
  );
}
