"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function useScrollAnimation(heroSceneRef, scrollContainerRef) {
  useEffect(() => {
    // Safety checks for SSR and direct rendering refs
    if (!heroSceneRef.current || !scrollContainerRef.current) return;

    const scene = heroSceneRef.current;
    const camera = scene.camera;
    const deskScene = scene.deskScene;

    if (!camera || !deskScene) return;

    // Define initial resets to prevent GSAP flash on load
    gsap.set(camera.position, { x: 0, y: 1.6, z: 3.4 });
    gsap.set(camera.rotation, { x: 0, y: 0, z: 0 });
    if (deskScene.chairSwivel) gsap.set(deskScene.chairSwivel.rotation, { y: 0 });
    if (deskScene.animProgress) gsap.set(deskScene.animProgress, { standProgress: 0 });
    if (deskScene.desk) gsap.set(deskScene.desk.position, { x: 0, y: 0, z: 0.5 });
    if (deskScene.character) gsap.set(deskScene.character.position, { x: 0, y: 0, z: 1.4 });
    if (deskScene.chair) gsap.set(deskScene.chair.position, { x: 0, y: 0, z: 1.4 });

    // Create the master scroll-driven timeline
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Smooth scrubbing lag to feel silky
        invalidateOnRefresh: true,
      },
    });

    // Orchestrate animations in one master timeline:
    // Timestamp 0 to 3s (Timeline virtual units)
    
    // 1. Camera moves back, rises, and tilts down slightly
    masterTimeline.to(camera.position, {
      y: 2.1,
      z: 5.8,
      duration: 3,
      ease: "power1.inOut"
    }, 0);

    masterTimeline.to(camera.rotation, {
      x: -Math.PI / 18,
      duration: 3,
      ease: "power1.inOut"
    }, 0);

    // 2. Chair swivels outwards as character prepares to stand
    if (deskScene.chairSwivel) {
      masterTimeline.to(deskScene.chairSwivel.rotation, {
        y: -Math.PI / 3.5, // Swivel chair 50 degrees left
        duration: 2.5,
        ease: "power1.inOut"
      }, 0.2);
    }

    // 3. Human standProgress blends from 0 to 1 (triggers body stand rig in DeskScene useFrame)
    if (deskScene.animProgress) {
      masterTimeline.to(deskScene.animProgress, {
        standProgress: 1.0,
        duration: 2.2,
        ease: "power2.inOut"
      }, 0.4);
    }

    // 4. Desk and chair shift smoothly to the left of the screen (shifts into UI layout mode)
    if (deskScene.desk && deskScene.character && deskScene.chair) {
      masterTimeline.to(deskScene.desk.position, {
        x: -1.0,
        z: -0.6,
        duration: 3,
        ease: "power1.inOut"
      }, 0.5);

      // Character steps slightly left and forward to clear the chair
      masterTimeline.to(deskScene.character.position, {
        x: -0.85,
        z: 0.8,
        duration: 3,
        ease: "power1.inOut"
      }, 0.5);

      // Swivel chair rolls back and out of the way
      masterTimeline.to(deskScene.chair.position, {
        x: -0.7,
        z: 1.7,
        duration: 3,
        ease: "power1.inOut"
      }, 0.5);
    }

    // Cleanup: Kill ScrollTrigger instance on component unmount
    return () => {
      masterTimeline.kill();
      ScrollTrigger.getAll().forEach((instance) => {
        instance.kill();
      });
    };
  }, [heroSceneRef, scrollContainerRef]);
}
