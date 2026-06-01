"use client";

import React, { useRef } from "react";
import { useStore } from "@/store/useStore";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import Character from "./Character";
import DeskScene from "./DeskScene";
import CameraController from "./CameraController";
import LightingSetup from "./LightingSetup";
import BackgroundScene from "./BackgroundScene";
import AnimatedHoloPlatform from "./AnimatedHoloPlatform";
import ProjectBox from "./ProjectBox";

/**
 * DioramaWrapper — subtle mouse parallax on the whole diorama.
 * Lerps HARD toward zero when phase != 'home' so the character never
 * appears rotated when the user scrolls back up.
 */
function DioramaWrapper({ children }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const phase = useStore.getState().phase;

    if (phase !== "home") {
      // Fast lerp toward zero — no accumulated rotation when we return
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.18);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.18);
      return;
    }

    const scrollProgress = useStore.getState().scrollProgress;
    // Parallax only active when scrollProgress is low (very start of home)
    const parallaxAmt = Math.max(0, 1 - scrollProgress * 10);
    const targetY = state.pointer.x * 0.06 * parallaxAmt;
    const targetX = -state.pointer.y * 0.04 * parallaxAmt;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.06);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.06);
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * AboutOverlayTracker — R3F tracker that projects 3D joint locations into
 * 2D screen coordinates for the HTML overlay, clamping positions to prevent
 * overlapping with the top header Navbar and vertical card overlaps.
 */
function AboutOverlayTracker({ currentPhase }) {
  const { camera, size } = useThree();

  useFrame(() => {
    const headBox   = document.getElementById("about-head-box");
    const chestBox  = document.getElementById("about-chest-box");
    const hipsBox   = document.getElementById("about-hips-box");
    const headLine  = document.getElementById("about-head-line");
    const chestLine = document.getElementById("about-chest-line");
    const hipsLine  = document.getElementById("about-hips-line");

    const isMobile = size.width < 768;

    if (currentPhase !== "about") {
      if (headBox)   headBox.style.opacity   = 0;
      if (chestBox)  chestBox.style.opacity  = 0;
      if (hipsBox)   hipsBox.style.opacity   = 0;
      if (headLine)  headLine.style.opacity  = 0;
      if (chestLine) chestLine.style.opacity = 0;
      if (hipsLine)  hipsLine.style.opacity  = 0;
      return;
    } else {
      // Clear absolute opacity overrides so React's stagger reveal triggers work 100% from either scroll direction
      if (headBox && headBox.style.opacity === "0") headBox.style.opacity = "";
      if (chestBox && chestBox.style.opacity === "0") chestBox.style.opacity = "";
      if (hipsBox && hipsBox.style.opacity === "0") hipsBox.style.opacity = "";

      if (isMobile) {
        if (headLine)  headLine.style.opacity  = 0;
        if (chestLine) chestLine.style.opacity = 0;
        if (hipsLine)  hipsLine.style.opacity  = 0;

        if (headBox)  { headBox.style.left  = ""; headBox.style.top  = ""; }
        if (chestBox) { chestBox.style.left = ""; chestBox.style.top = ""; }
        if (hipsBox)  { hipsBox.style.left  = ""; hipsBox.style.top  = ""; }
        return;
      } else {
        if (headLine && headLine.style.opacity === "0") headLine.style.opacity = "";
        if (chestLine && chestLine.style.opacity === "0") chestLine.style.opacity = "";
        if (hipsLine && hipsLine.style.opacity === "0") hipsLine.style.opacity = "";
      }
    }

    // World coordinates of standing character (re-calculated for scale 1.22 & offset -0.92)
    const headWorld  = new THREE.Vector3(0,      0.48,  0);
    const chestWorld = new THREE.Vector3(-0.15,  0.04,  0.06);
    const hipsWorld  = new THREE.Vector3( 0.15, -0.34,  0.04);

    headWorld.project(camera);
    chestWorld.project(camera);
    hipsWorld.project(camera);

    const headX  = (headWorld.x  * 0.5 + 0.5) * size.width;
    const headY  = (-(headWorld.y  * 0.5) + 0.5) * size.height;
    const chestX = (chestWorld.x * 0.5 + 0.5) * size.width;
    const chestY = (-(chestWorld.y * 0.5) + 0.5) * size.height;
    const hipsX  = (hipsWorld.x  * 0.5 + 0.5) * size.width;
    const hipsY  = (-(hipsWorld.y  * 0.5) + 0.5) * size.height;

    const adjHeadY  = headY - 60;
    const adjChestY = chestY - 60;
    const adjHipsY  = hipsY - 60;

    // Minimum top margin of 100px so nothing touches the top edge
    const minTop = Math.max(100, size.height * 0.12);
    
    // Positioning and vertical distribution to completely prevent card overlap
    const headBoxTop  = Math.max(minTop, adjHeadY - 110);
    const chestBoxTop = Math.max(minTop + 140, adjChestY + 10);
    
    // Enforce a guaranteed vertical offset of 255px below the head card for the bottom card
    const hipsBoxTop  = Math.max(headBoxTop + 255, adjHipsY + 10);

    if (headBox)  { headBox.style.left  = `${headX  + 160}px`; headBox.style.top  = `${headBoxTop}px`; }
    if (chestBox) { chestBox.style.left = `${chestX - 460}px`; chestBox.style.top = `${chestBoxTop}px`; }
    if (hipsBox)  { hipsBox.style.left  = `${hipsX  + 160}px`; hipsBox.style.top  = `${hipsBoxTop}px`; }

    const headDot  = document.getElementById("about-head-dot");
    const headPing = document.getElementById("about-head-ping");
    if (headDot)  { headDot.setAttribute("cx",  headX);  headDot.setAttribute("cy",  adjHeadY); }
    if (headPing) { headPing.setAttribute("cx", headX);  headPing.setAttribute("cy", adjHeadY); }

    const chestDot  = document.getElementById("about-chest-dot");
    const chestPing = document.getElementById("about-chest-ping");
    if (chestDot)  { chestDot.setAttribute("cx",  chestX);  chestDot.setAttribute("cy",  adjChestY); }
    if (chestPing) { chestPing.setAttribute("cx", chestX);  chestPing.setAttribute("cy", adjChestY); }

    const hipsDot  = document.getElementById("about-hips-dot");
    const hipsPing = document.getElementById("about-hips-ping");
    if (hipsDot)  { hipsDot.setAttribute("cx",  hipsX);  hipsDot.setAttribute("cy",  adjHipsY); }
    if (hipsPing) { hipsPing.setAttribute("cx", hipsX);  hipsPing.setAttribute("cy", adjHipsY); }

    const headLinePath  = document.getElementById("about-head-line-path");
    const chestLinePath = document.getElementById("about-chest-line-path");
    const hipsLinePath  = document.getElementById("about-hips-line-path");
    
    // Connect perfectly to the middle of the vertically distributed cards
    if (headLinePath)  headLinePath.setAttribute("d",  `M ${headX} ${adjHeadY} L ${headX + 90} ${headBoxTop + 40} L ${headX + 160} ${headBoxTop + 40}`);
    if (chestLinePath) chestLinePath.setAttribute("d", `M ${chestX} ${adjChestY} L ${chestX - 90} ${chestBoxTop + 35} L ${chestX - 160} ${chestBoxTop + 35}`);
    if (hipsLinePath)  hipsLinePath.setAttribute("d",  `M ${hipsX} ${adjHipsY} L ${hipsX + 90} ${hipsBoxTop + 35} L ${hipsX + 160} ${hipsBoxTop + 35}`);
  });

  return null;
}

/**
 * SceneContent — everything inside the Canvas.
 */
function SceneContent({ currentPhase }) {
  const isHome = currentPhase === "home";

  return (
    <>
      <CameraController />
      <LightingSetup currentPhase={currentPhase} />
      <BackgroundScene currentPhase={currentPhase} />
      <AboutOverlayTracker currentPhase={currentPhase} />

      {/* ── HOME: DeskScene kept pre-loaded in memory to prevent GPU shader compilation lag spikes during scrolling ── */}
      <group visible={currentPhase === "home"}>
        <DioramaWrapper>
          <DeskScene />
          <Character position={[0, -0.22, 1.42]} rotation={[0, Math.PI, 0]} isStanding={false} />
        </DioramaWrapper>
      </group>

      {/* ── ABOUT: Character slightly downscaled and positioned down to perfectly clear the top of the viewport ── */}
      <group visible={currentPhase === "about"} position={[0, -0.92, 0]} scale={[1.22, 1.22, 1.22]}>
        <AnimatedHoloPlatform characterBaseY={0} />
        <Character position={[0, 0, 0]} rotation={[0, 0, 0]} isStanding={true} />
      </group>

      {/* ── PROJECTS: ProjectBox with slithering cube lines ── */}
      <group visible={currentPhase === "projects"} position={[1.95, -0.05, 0]} scale={[1.05, 1.05, 1.05]}>
        <ProjectBox />
      </group>
    </>
  );
}

/**
 * HeroScene — main export.
 */
function HeroScene({ debug = false }) {
  const phase = useStore((state) => state.phase);
  const [canvasOpacity, setCanvasOpacity] = React.useState(1);
  const [currentPhase, setCurrentPhase] = React.useState(phase);

  React.useEffect(() => {
    let active = true;
    if (phase !== currentPhase) {
      setCanvasOpacity(0);
      const timer = setTimeout(() => {
        if (active) {
          setCurrentPhase(phase);
          setCanvasOpacity(1);
        }
      }, 280);
      return () => { active = false; clearTimeout(timer); };
    } else {
      setCanvasOpacity(1);
    }
  }, [phase, currentPhase]);

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas — fades on phase cut */}
      <div
        style={{
          width: "100%", height: "100%",
          opacity: 1.0,
          transition: "opacity 0.28s ease-in-out",
          willChange: "opacity",
        }}
      >
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
          className="w-full h-full"
        >
          <PerspectiveCamera makeDefault position={[0, 1.8, 4.0]} fov={38} near={0.1} far={100} />
          <SceneContent currentPhase={currentPhase} />
          {debug && <OrbitControls enableZoom enablePan maxPolarAngle={Math.PI / 2 + 0.1} />}
        </Canvas>
      </div>

      {/* Cinematic vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(15,12,25,0.55) 100%)" }}
      />

    </div>
  );
}

HeroScene.displayName = "HeroScene";
export default HeroScene;
