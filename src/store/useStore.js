// src/store/useStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useStore = create(devtools((set) => ({
  scrollProgress: 0,
  phase: "home",
  headCoords: { x: 0, y: 0, visible: false },
  chestCoords: { x: 0, y: 0, visible: false },
  hipsCoords: { x: 0, y: 0, visible: false },
  isMusicPlaying: true, // defaults to active bouncing animations
  toggleMusic: () => set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),
  setScrollProgress: (progress) => {
    let phase = "home";
    if (progress >= 0.8333) {
      phase = "contact";
    } else if (progress >= 0.5000) {
      phase = "projects";
    } else if (progress >= 0.1667) {
      phase = "about";
    }
    set({ scrollProgress: progress, phase });
  },
  setHeadCoords: (coords) => set({ headCoords: coords }),
  setChestCoords: (coords) => set({ chestCoords: coords }),
  setHipsCoords: (coords) => set({ hipsCoords: coords }),
})));
