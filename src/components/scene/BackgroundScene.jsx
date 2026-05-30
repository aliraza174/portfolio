"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function BackgroundScene() {
  const pointsRef = useRef();

  // Subtle rotation to make the floating particles feel alive
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.04;
      pointsRef.current.rotation.x = time * 0.02;
    }
  });

  // Generate random floating particles positions
  const count = 100;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 12; // X
    positions[i + 1] = (Math.random() - 0.5) * 12; // Y
    positions[i + 2] = (Math.random() - 0.5) * 12; // Z
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a855f7"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}
