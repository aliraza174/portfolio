"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import DeskScene from "./DeskScene";

const HeroScene = forwardRef(({ debug = false }, ref) => {
  const canvasContainerRef = useRef();
  const deskSceneRef = useRef();
  const cameraRef = useRef();

  // Expose camera and interior scene refs to parent (so GSAP can animate them)
  useImperativeHandle(ref, () => ({
    container: canvasContainerRef.current,
    camera: cameraRef.current,
    deskScene: deskSceneRef.current,
  }));

  return (
    <div
      ref={canvasContainerRef}
      className="relative w-full h-screen overflow-hidden bg-radial from-slate-950 to-black"
    >
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        className="w-full h-full"
      >
        {/* Cinematic camera positioning closer to the scene initially */}
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 1.6, 3.4]}
          fov={45}
          near={0.1}
          far={100}
        />

        {/* =================================================================
            CINEMATIC MOOD LIGHTING
           ================================================================= */}
        {/* Soft, dark ambient fill to prevent pitch blackness */}
        <ambientLight intensity={0.15} />

        {/* Soft overall purple room fill */}
        <color attach="background" args={["#030308"]} />
        <fog attach="fog" args={["#030308", 5, 12]} />

        {/* Strong soft blue spotlight above the desk setup projecting shadows */}
        <spotLight
          position={[0, 4.0, 0.8]}
          angle={Math.PI / 4}
          penumbra={0.8}
          intensity={8.0}
          color="#3b82f6" // Electric blue glow
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Moody purple rim/fill light from the side-rear */}
        <directionalLight
          position={[3.0, 2.0, -1.0]}
          intensity={3.0}
          color="#a855f7" // Purple accent
          castShadow={false}
        />

        {/* Cyan secondary fill light from the opposite front side */}
        <directionalLight
          position={[-3.0, 1.5, 2.0]}
          intensity={1.0}
          color="#06b6d4" // Cyan accent
          castShadow={false}
        />

        {/* =================================================================
            DESK, CHAIR & CHARACTER SCENE
           ================================================================= */}
        <DeskScene ref={deskSceneRef} position={[0, -0.4, 0]} />

        {/* Soft floor shadow overlay for realism */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
          <planeGeometry args={[15, 15]} />
          <shadowMaterial opacity={0.4} />
        </mesh>

        {/* Grid helper for deep cinematic cyberpunk style */}
        <gridHelper
          args={[20, 20, "#1e1b4b", "#090915"]}
          position={[0, -0.395, 0]}
        />

        {/* =================================================================
            DEBUG ORBIT CONTROLS (Toggled via prop)
           ================================================================= */}
        {debug && (
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
        )}
      </Canvas>

      {/* Subtle vignettes overlay for theatrical impact */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
});

HeroScene.displayName = "HeroScene";

export default HeroScene;
