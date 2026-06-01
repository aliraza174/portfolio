"use client";

import React from "react";
import { useStore } from "@/store/useStore";

/**
 * UserOverlay – displays UI feedback based on the current animation phase.
 * It reads the `phase` state from the Zustand store.
 * When the character is in the 'standing' phase, the overlay is hidden.
 * Otherwise, a subtle translucent message appears.
 */
export default function UserOverlay() {
  const phase = useStore((state) => state.phase);

  // Hide overlay when fully standing
  if (phase === "standing") return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-lg font-medium">
        {phase === "seated" && "Preparing…"}
        {phase === "transitioning" && "Taking a stand…"}
      </div>
    </div>
  );
}
