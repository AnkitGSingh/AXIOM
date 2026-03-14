'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D, Vector3, Group } from 'three';
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore';
import { Project } from '@/lib/data/projects';
import { ProjectCard } from '../hud/ProjectCard';

export function InteractiveZone({ bone, project }: { bone?: Object3D, project: Project }) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  
  const phase = useAXIOMStore((state) => state.phase);
  const setHoveredPart = useAXIOMStore((state) => state.setHoveredPart);
  const selectProject = useAXIOMStore((state) => state.selectProject);
  const selectedProject = useAXIOMStore((state) => state.selectedProject);

  const _position = new Vector3();
  
  useFrame(() => {
    if (groupRef.current && bone) {
      bone.getWorldPosition(_position);
      groupRef.current.position.copy(_position);
    }
  });

  if (!bone) return null;

  const isInteractive = phase === AnimationPhase.INTERACTIVE || phase === AnimationPhase.PROJECT_VIEW;
  const isSelected = selectedProject === project.id;

  const handlePointerOver = (e: any) => {
    if (!isInteractive) return;
    e.stopPropagation();
    setHovered(true);
    setHoveredPart(project.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    if (!isInteractive) return;
    setHovered(false);
    setHoveredPart(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    if (!isInteractive) return;
    e.stopPropagation();
    
    // Get world position of the bone to target the camera
    const worldPos = new Vector3();
    bone.getWorldPosition(worldPos);
    
    selectProject(project.id, worldPos);
  };

  return (
    <group ref={groupRef}>
      <mesh 
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        visible={hovered || isSelected}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#C9A84C" 
          emissive="#C9A84C" 
          emissiveIntensity={hovered ? 2 : 1}
          transparent
          opacity={hovered ? 0.6 : 0.8}
          wireframe={true}
        />
      </mesh>
      
      {/* 2D Floating card, tracks group world position natively */}
      <ProjectCard bone={bone} project={project} />
    </group>
  );
}
