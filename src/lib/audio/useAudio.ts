import { Howl, Howler } from 'howler';
import { useAXIOMStore } from '@/lib/store/useAXIOMStore';
import { useCallback, useEffect } from 'react';

// Module-level singleton — loads immediately on first import, not on component mount.
// This guarantees the audio is decoded and ready well before the 2.8s landing impact.
const landingSound = new Howl({
  src: ['/audio/landing-impact.mp3'],
  volume: 0.8,
  preload: true,
  onloaderror: () => { /* fail silently — 3D experience is unaffected */ },
});

export function useAudio() {
  const isMuted = useAXIOMStore((state) => state.isMuted);

  // Unlock WebAudio context on first user interaction so the browser
  // doesn't block playback on subsequent automated triggers.
  useEffect(() => {
    const unlock = () => {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
      }
      document.removeEventListener('click',      unlock);
      document.removeEventListener('keydown',    unlock);
      document.removeEventListener('touchstart', unlock);
    };
    document.addEventListener('click',      unlock);
    document.addEventListener('keydown',    unlock);
    document.addEventListener('touchstart', unlock);
    return () => {
      document.removeEventListener('click',      unlock);
      document.removeEventListener('keydown',    unlock);
      document.removeEventListener('touchstart', unlock);
    };
  }, []);

  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);

  // Stable reference — only changes when mute state changes
  const playLandingSound = useCallback(() => {
    if (isMuted) return;
    // Call play() directly — Howler handles AudioContext state internally.
    // No async .then() means zero extra delay between call and playback.
    landingSound.play();
  }, [isMuted]);

  return { playLandingSound };
}
