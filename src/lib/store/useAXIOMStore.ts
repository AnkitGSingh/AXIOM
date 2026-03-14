import { create } from 'zustand';
import { Vector3 } from 'three';

export enum AnimationPhase {
  LOADING = 'LOADING',
  IDLE = 'IDLE',
  LANDING = 'LANDING',
  RISING = 'RISING',
  HUD_INTRO = 'HUD_INTRO',
  INTERACTIVE = 'INTERACTIVE',
  PROJECT_VIEW = 'PROJECT_VIEW'
}

interface AXIOMState {
  phase: AnimationPhase;
  selectedProject: string | null;
  isMuted: boolean;
  hoveredPart: string | null;
  cameraTarget: Vector3 | null;
  isCardVisible: boolean;
  easterEggActive: boolean;

  setPhase: (phase: AnimationPhase) => void;
  selectProject: (id: string, target?: Vector3) => void;
  closeProject: () => void;
  toggleMute: () => void;
  setHoveredPart: (part: string | null) => void;
  setCameraTarget: (pos: Vector3 | null) => void;
  triggerEasterEgg: () => void;
}

export const useAXIOMStore = create<AXIOMState>((set) => ({
  phase: AnimationPhase.HUD_INTRO,
  selectedProject: null,
  isMuted: false,
  hoveredPart: null,
  cameraTarget: null,
  isCardVisible: false,
  easterEggActive: false,

  setPhase: (phase) => set({ phase }),
  
  selectProject: (id, target) => set({ 
    selectedProject: id, 
    isCardVisible: true, 
    phase: AnimationPhase.PROJECT_VIEW,
    ...(target ? { cameraTarget: target } : {})
  }),
  
  closeProject: () => set({ 
    selectedProject: null, 
    isCardVisible: false, 
    cameraTarget: null, 
    phase: AnimationPhase.INTERACTIVE 
  }),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  
  setHoveredPart: (part) => set({ hoveredPart: part }),
  
  setCameraTarget: (pos) => set({ cameraTarget: pos }),

  triggerEasterEgg: () => {
    set({ easterEggActive: true });
    // Auto turn off after 4 seconds
    setTimeout(() => {
      set({ easterEggActive: false });
    }, 4000);
  }
}));
