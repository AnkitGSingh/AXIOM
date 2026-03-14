'use client';

import { useAXIOMStore } from '@/lib/store/useAXIOMStore';
import { motion, AnimatePresence } from 'framer-motion';

export function EasterEggOverlay() {
  const active = useAXIOMStore((state) => state.easterEggActive);

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Energy Burst Flash */}
          <div className="absolute inset-0 bg-[#4FC3F7] animate-pulse opacity-40 mix-blend-screen" />
          
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative text-white text-3xl md:text-5xl font-orbitron text-center p-12 bg-black/80 border-2 border-[#4FC3F7] shadow-[0_0_50px_rgba(79,195,247,0.8)] tracking-wider rounded-lg"
          >
            "Sometimes you gotta run before you can walk." <br />
            <span className="text-xl md:text-2xl mt-6 block text-[#C9A84C] font-rajdhani">— Ankit</span>
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
