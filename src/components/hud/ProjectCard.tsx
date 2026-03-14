'use client';

import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore';
import { Project } from '@/lib/data/projects';
import { Object3D } from 'three';
import { useEffect, useState } from 'react';

export function ProjectCard({ bone, project }: { bone: Object3D, project: Project }) {
  const isCardVisible = useAXIOMStore((state) => state.isCardVisible);
  const selectedProject = useAXIOMStore((state) => state.selectedProject);
  const closeProject = useAXIOMStore((state) => state.closeProject);
  const phase = useAXIOMStore((state) => state.phase);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const visible = mounted && phase === AnimationPhase.PROJECT_VIEW && isCardVisible && selectedProject === project.id;

  const statusColors = {
    LIVE: 'bg-[#22C55E]',
    DEMO: 'bg-[#3B82F6]',
    WIP: 'bg-[#F59E0B]'
  };

  return (
    <Html
      position={[0, 0, 0]}
      center
      wrapperClass="z-50"
      transform={false} // Use HTML 2D space floating on top of canvas overlaying 3D pos
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 120, opacity: 1 }} // Offset by 120px to the right as per PRD
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-[380px] bg-[rgba(0,20,30,0.92)] border border-[#C9A84C] relative p-6 pointer-events-auto"
            style={{ 
              boxShadow: '0 0 20px rgba(201,168,76,0.1)',
              background: 'linear-gradient(135deg, rgba(0,20,30,0.96) 0%, rgba(0,20,30,0.88) 100%)'
            }}
          >
            {/* Scanline texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-5 pointer-events-none" />

            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#C9A84C]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#C9A84C]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#C9A84C]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#C9A84C]" />

            <button 
              onClick={(e) => { e.stopPropagation(); closeProject(); }}
              className="absolute top-4 right-4 text-[#C9A84C] hover:text-[#FFFFFF] transition-colors"
            >
              ✕
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-orbitron text-[10px] tracking-widest text-[#C9A84C] uppercase">
                  SYSTEM OVERRIDE // {project.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>

              <h3 className="font-orbitron text-2xl font-bold text-white mb-1">
                {project.title}
              </h3>
              <p className="font-rajdhani text-[#4FC3F7] text-sm mb-4 tracking-wide font-semibold">
                {project.tagline}
              </p>

              <p className="font-rajdhani text-gray-300 text-sm leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.techStack.map(tech => (
                  <span 
                    key={tech} 
                    className="font-jetbrains text-xs bg-black/60 border border-[#C9A84C]/50 text-gray-300 px-2 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.demoUrl && (
                  <a 
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-[#C9A84C] text-[#080808] font-orbitron font-bold text-xs p-3 hover:bg-[#fff] transition-colors"
                  >
                    LIVE DEMO
                  </a>
                )}
                <a 
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center border border-[#C9A84C] text-[#C9A84C] font-orbitron font-bold text-xs p-3 hover:bg-[#C9A84C] hover:text-[#080808] transition-all"
                >
                  GITHUB
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  );
}
