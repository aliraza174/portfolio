"use client";

import React, { useRef } from "react";
import HeroScene from "@/components/scene/HeroScene";
import useScrollAnimation from "@/hooks/useScrollAnimation";

export default function Home() {
  const heroSceneRef = useRef();
  const scrollContainerRef = useRef();

  // Bind the high-performance GSAP ScrollTrigger timeline to the 3D scene elements
  useScrollAnimation(heroSceneRef, scrollContainerRef);

  return (
    <main className="relative min-h-screen bg-[#030308] text-white overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* 1. FIXED BACKGROUND CANVAS FOR THE 3D HERO SCENE */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-auto">
        <HeroScene ref={heroSceneRef} debug={false} />
      </div>

      {/* 2. SCROLL DEPTH CONTAINER (Scrubbing track for GSAP)
          Pointer events are set to none to allow clicking through to 3D orbit controls later if desired,
          while standard children elements will override with pointer-events-auto. */}
      <div 
        ref={scrollContainerRef} 
        className="relative w-full h-[300vh] pointer-events-none"
      >
        {/* VIEWPORT PANEL 1: Seated Intro Scene (0% to 33% scroll) */}
        <section className="h-screen w-full relative flex items-center justify-center">
          {/* Visual anchor for the initial section */}
        </section>

        {/* VIEWPORT PANEL 2: swivelling chair & starting to stand (33% to 66% scroll) */}
        <section className="h-screen w-full relative flex items-center justify-center">
          {/* Visual anchor for intermediate scroll state */}
        </section>

        {/* VIEWPORT PANEL 3: fully standing and shifted layout (66% to 100% scroll) */}
        <section className="h-screen w-full relative flex items-center justify-center">
          {/* Visual anchor for layout shifting completion */}
        </section>
      </div>
    </main>
  );
}
