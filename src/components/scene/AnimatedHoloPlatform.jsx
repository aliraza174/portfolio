"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { useFrame } from "@react-three/fiber";

function AnimatedHoloPlatform({ characterBaseY = -0.15 }) {
  const ref = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const fillRef = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const phase = useStore.getState().phase;

    if (phase !== "about") {
      ref.current.scale.setScalar(0);
      return;
    }

    const t = state.clock.getElapsedTime();
    // Smoothly scale up to 1 when phase is about
    const current = ref.current.scale.x;
    const next = THREE.MathUtils.lerp(current, 1.0, 0.08);
    ref.current.scale.setScalar(next);

    if (next > 0.05) {
      const pulse  = 0.85 + Math.sin(t * 2.5) * 0.15;
      const pulse2 = 0.85 + Math.sin(t * 2.5 + Math.PI) * 0.12;
      if (ring1Ref.current) ring1Ref.current.material.opacity = 0.7 * next * pulse;
      if (ring2Ref.current) ring2Ref.current.material.opacity = 0.5 * next * pulse2;
      if (ring3Ref.current) {
        ring3Ref.current.rotation.z += 0.01;
        ring3Ref.current.material.opacity = 0.3 * next;
      }
      if (fillRef.current) fillRef.current.material.opacity = 0.12 * next;
    }
  });

  // Standing character feet ≈ y(root) - 0.08; put rings just below
  const footY = characterBaseY - 0.08;

  return (
    <group ref={ref} position={[0, footY, 0]} scale={[0, 0, 0]}>
      <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.33, 64]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[0.38, 0.41, 64]} />
        <meshBasicMaterial color="#00c4ff" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[0.20, 0.215, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh ref={fillRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.003, 0]}>
        <circleGeometry args={[0.27, 64]} />
        <meshStandardMaterial color="#00f3ff" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default AnimatedHoloPlatform;
