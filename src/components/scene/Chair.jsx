"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store/useStore";

/**
 * Chair — Volumetric 3D office swivel chair with thick toy-like proportions.
 * Faces toward the desk when mounted with rotation={[0, Math.PI, 0]}.
 */
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

// Easing function for a vinyl-toy style smooth, bouncy overshoot
const easeOutBack = (x) => {
  const c1 = 0.3; // subtle bounce overshoot
  const c2 = c1 + 1;
  return 1 + c2 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export default function Chair({
  position = [0, -0.10, 1.48],
  ...props
}) {
  const metal = <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.6} />;
  const whitePlastic = <meshStandardMaterial color="#f0f0f0" roughness={0.7} metalness={0.1} />;

  return (
    <group position={position} {...props}>
      {/* SEAT (White molded plastic L-shape) */}
      <group position={[0, 0.42, 0]}>
        {/* Seat base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.08, 0.46]} />
          {whitePlastic}
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.25, -0.19]} castShadow>
          <boxGeometry args={[0.46, 0.48, 0.07]} />
          {whitePlastic}
        </mesh>
        {/* Curved join between seat and back */}
        <mesh position={[0, 0.04, -0.19]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.46, 16]} rotation={[0, 0, Math.PI / 2]} />
          {whitePlastic}
        </mesh>
      </group>

      {/* CANTILEVER METAL FRAME */}
      {/* Floor Left/Right bars */}
      <mesh position={[-0.22, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.03, 0.4, 8, 16]} />
        {metal}
      </mesh>
      <mesh position={[0.22, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.03, 0.4, 8, 16]} />
        {metal}
      </mesh>
      {/* Floor Front crossbar */}
      <mesh position={[0, 0.03, 0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.03, 0.44, 8, 16]} />
        {metal}
      </mesh>

      {/* Diagonal supports (from front-floor up to back-seat) */}
      <mesh position={[-0.22, 0.225, 0.02]} rotation={[-0.74, 0, 0]} castShadow>
        <capsuleGeometry args={[0.03, 0.47, 8, 16]} />
        {metal}
      </mesh>
      <mesh position={[0.22, 0.225, 0.02]} rotation={[-0.74, 0, 0]} castShadow>
        <capsuleGeometry args={[0.03, 0.47, 8, 16]} />
        {metal}
      </mesh>

      {/* Seat Bottom Supports (under the seat) */}
      <mesh position={[-0.22, 0.38, -0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.03, 0.16, 8, 16]} />
        {metal}
      </mesh>
      <mesh position={[0.22, 0.38, -0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.03, 0.16, 8, 16]} />
        {metal}
      </mesh>
    </group>
  );
}
