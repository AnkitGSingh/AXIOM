import { Howl, Howler } from 'howler';
import { useAXIOMStore } from '@/lib/store/useAXIOMStore';
import { useEffect, useRef } from 'react';

export function useAudio() {
  const isMuted = useAXIOMStore((state) => state.isMuted);
  const landingSoundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize Howler instance for landing sound.
    // onloaderror prevents a missing/broken audio file from throwing
    // an unhandled exception that could disrupt the 3D experience.
    landingSoundRef.current = new Howl({
      src: ['/audio/landing-impact.mp3'],
      volume: 0.8,
      preload: true,
      onloaderror: () => {
        // Audio file not found or failed to load — fail silently.
        landingSoundRef.current = null;
      },
    });
  }, []);

  useEffect(() => {
    // Update global mute state for Howler
    Howler.mute(isMuted);
  }, [isMuted]);

  const playLandingImpact = () => {
    if (landingSoundRef.current && !isMuted) {
      landingSoundRef.current.play();
    }
  };

  return { playLandingImpact };
}
