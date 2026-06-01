"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store/useStore";
import * as THREE from "three";

/**
 * BackgroundScene — Phase-aware floating particles.
 *
 * home:    Warm pastel shapes (orange, yellow, blue, cream) match the room.
 * dark:    Subtle violet/indigo/cyan spheres matching #1a1a2e canvas.
 *
 * Color changes lerp smoothly so the switch feels atmospheric, not jarring.
 */
export default function BackgroundScene({ currentPhase }) {
  const groupRef = useRef();

  const isHome = currentPhase === "home";

  const homeColors  = ["#FF923E", "#FFC837", "#005CA8", "#F5EFEB"];
  const darkColors  = ["#818cf8", "#475569", "#22d3ee", "#1e1b4b", "#6366f1"];

  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < 22; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 6;
      data.push({
        basePos: [
          Math.cos(angle) * radius,
          1.0 + (Math.random() - 0.5) * 5,
          Math.sin(angle) * radius,
        ],
        scale:    0.04 + Math.random() * 0.12,
        speed:    0.12 + Math.random() * 0.22,
        rotSpeed: 0.08 + Math.random() * 0.35,
        offset:   Math.random() * Math.PI * 2,
        homeColor: homeColors[i % homeColors.length],
        darkColor: darkColors[i % darkColors.length],
        isSphere: Math.random() > 0.45,
      });
    }
    return data;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.006;
    }
  });

  // Hide floating spheres and cubes completely in Projects and Contact phases
  // Placed safely below all hook declarations (useRef, useMemo, useFrame) to satisfy the Rules of Hooks
  if (currentPhase === "projects" || currentPhase === "contact") {
    return null;
  }

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <FloatingParticle key={i} data={p} isHome={isHome} />
      ))}
    </group>
  );
}

function FloatingParticle({ data, isHome }) {
  const meshRef = useRef();

  const targetColor  = useMemo(() => new THREE.Color(isHome ? data.homeColor : data.darkColor), [isHome, data]);
  const currentColor = useRef(new THREE.Color(isHome ? data.homeColor : data.darkColor));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!meshRef.current) return;

    // Float
    meshRef.current.position.y =
      data.basePos[1] + Math.sin(t * data.speed + data.offset) * 0.3;
    meshRef.current.rotation.x = t * data.rotSpeed * 0.2;
    meshRef.current.rotation.z = t * data.rotSpeed * 0.12;

    // Lerp color
    currentColor.current.lerp(targetColor, 0.04);
    if (meshRef.current.material) {
      meshRef.current.material.color.copy(currentColor.current);

      // Fade particles out when in dark mode so they don't clutter
      const targetOpacity = isHome ? 1.0 : 0.45;
      meshRef.current.material.opacity = THREE.MathUtils.lerp(
        meshRef.current.material.opacity,
        targetOpacity,
        0.04,
      );
      meshRef.current.material.transparent = !isHome;
    }
  });

  return (
    <mesh ref={meshRef} position={data.basePos} scale={data.scale}>
      {data.isSphere ? (
        <sphereGeometry args={[1, 8, 8]} />
      ) : (
        <boxGeometry args={[1.2, 1.2, 1.2]} />
      )}
      <meshStandardMaterial
        color={isHome ? data.homeColor : data.darkColor}
        roughness={0.92}
        metalness={0.0}
        transparent={!isHome}
        opacity={isHome ? 1.0 : 0.45}
      />
    </mesh>
  );
}
