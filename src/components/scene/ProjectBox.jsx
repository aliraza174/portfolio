// d:/portfolio/src/components/scene/ProjectBox.jsx
"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

export default function ProjectBox() {
  const groupRef = useRef();

  // INTERACTIVE SWIPE STATE REFS
  const isDragging = useRef(false);
  const previousX = useRef(0);
  const rotationVelocity = useRef(0);
  const rotationY = useRef(0);
  const idleSpinSpeed = useRef(0.006); // Default slow idle spin

  // persistent coordinates and variables for twinkling particles
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.4 + Math.random() * 1.1;
      list.push({
        x: Math.cos(angle) * radius,
        y: -0.6 + Math.random() * 1.5,
        z: (Math.random() - 0.5) * 1.2,
        speed: 0.3 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
        scale: 0.014 + Math.random() * 0.014,
      });
    }
    return list;
  }, []);

  // Global mouse & touch swipe event listeners
  useEffect(() => {
    const handleDown = (e) => {
      isDragging.current = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      previousX.current = clientX;
    };

    const handleMove = (e) => {
      if (!isDragging.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - previousX.current;
      
      // Swipe impulse: positive deltaX means mouse moving right = rotate right
      rotationVelocity.current += deltaX * 0.0007;
      previousX.current = clientX;
    };

    const handleUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousedown", handleDown, { passive: true });
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseup", handleUp, { passive: true });
    
    window.addEventListener("touchstart", handleDown, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend", handleUp, { passive: true });

    return () => {
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      
      window.removeEventListener("touchstart", handleDown);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, []);

  useFrame((state) => {
    const phase = useStore.getState().phase;
    if (phase !== "projects") return;
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // Subtle sinusoidal vertical floating drift
    const driftY = Math.sin(t * 1.0) * 0.06;
    groupRef.current.position.y = -0.05 + driftY;

    // Apply the rotation velocity from swipe momentum
    rotationY.current += rotationVelocity.current;
    
    // Apply friction/damping to momentum
    rotationVelocity.current *= 0.94;

    // Keep auto-rotation going in whatever direction we swipe
    if (Math.abs(rotationVelocity.current) > 0.0005) {
      const sig = Math.sign(rotationVelocity.current);
      if (sig !== 0 && !isNaN(sig)) {
        idleSpinSpeed.current = sig * 0.006;
      }
    }

    // Apply auto-rotation when swipe momentum slows down
    if (!isDragging.current) {
      if (Math.abs(rotationVelocity.current) < 0.001) {
        rotationY.current += idleSpinSpeed.current;
      }
    }

    // Apply rotations
    groupRef.current.rotation.y = rotationY.current;
    
    // Gentle mouse vertical pitch tilt
    const targetRotX = -state.pointer.y * 0.12;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
  });

  // 12 small cubes arranged in a highly detailed isometric Capital "A"
  const cubes = [
    { pos: [0, 0.78, 0], s: 0.25 },        // Apex (Row 4)
    { pos: [-0.22, 0.44, 0], s: 0.25 },    // Upper Left Leg (Row 3)
    { pos: [0.22, 0.44, 0], s: 0.25 },     // Upper Right Leg (Row 3)
    { pos: [-0.44, 0.10, 0], s: 0.25 },    // Mid Left Leg (Row 2)
    { pos: [-0.22, 0.10, 0], s: 0.25 },    // Crossbar Left (Row 2)
    { pos: [0, 0.10, 0], s: 0.25 },        // Crossbar Center (Row 2)
    { pos: [0.22, 0.10, 0], s: 0.25 },     // Crossbar Right (Row 2)
    { pos: [0.44, 0.10, 0], s: 0.25 },     // Mid Right Leg (Row 2)
    { pos: [-0.66, -0.24, 0], s: 0.25 },   // Lower Left Leg (Row 1)
    { pos: [0.66, -0.24, 0], s: 0.25 },    // Lower Right Leg (Row 1)
    { pos: [-0.88, -0.58, 0], s: 0.25 },   // Foot Left (Row 0)
    { pos: [0.88, -0.58, 0], s: 0.25 },    // Foot Right (Row 0)
  ];

  return (
    <group position={[0, -0.05, 0]}>
      {/* ── STATIONARY GLOWING HOLOGRAPHIC BASE PLATFORM ── */}
      <HolographicProjectPlatform />

      {/* ── FLOATING 3D LETTER A ── */}
      <group ref={groupRef} position={[0, 0, 0]}>
        {cubes.map((c, i) => (
          <WireframeCube key={i} position={c.pos} scale={c.s} index={i} />
        ))}

        {/* ── TWINKLING HOLOGRAPHIC CYAN PARTICLES ── */}
        {particles.map((p, i) => (
          <TwinklingParticle key={`p-${i}`} data={p} />
        ))}
      </group>
    </group>
  );
}

/** Stationary glowing holographic base platform placed underneath the letter "A" */
function HolographicProjectPlatform() {
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  const hexRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef1.current) {
      ringRef1.current.material.opacity = 0.45 + Math.sin(t * 2.0) * 0.15;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -t * 0.05;
      ringRef2.current.material.opacity = 0.25 + Math.cos(t * 1.5) * 0.08;
    }
    if (hexRef.current) {
      hexRef.current.rotation.z = t * 0.1;
      hexRef.current.material.opacity = 0.35 + Math.sin(t * 2.0) * 0.1;
    }
  });

  return (
    <group position={[0, -0.85, 0]}>
      {/* Central semi-transparent base cylinder/disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.02, 32]} />
        <meshStandardMaterial
          color="#1e1b4b"
          transparent
          opacity={0.35}
          roughness={0.5}
          metalness={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Main outer glowing ring (Cyan #22d3ee) */}
      <mesh ref={ringRef1} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.85, 0.9, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} depthWrite={false} />
      </mesh>

      {/* Inner thin dashed/hexagonal ring (Glowing Indigo #818cf8) */}
      <mesh ref={hexRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[0.68, 0.72, 6]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      {/* Outer rotating decorative ring (Cyan #22d3ee) */}
      <mesh ref={ringRef2} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[0.98, 1.01, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} depthWrite={false} />
      </mesh>

      {/* Neon glowing cyan upward projection light beam */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.65, 0.85, 0.8, 32, 1, true]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** A single cube with slithering dashed edges + corner vertex dots */
function WireframeCube({ position, scale, index }) {
  const lineRef = useRef();

  // 8 corners of a unit cube
  const verts = [
    [-0.5, -0.5, -0.5], // 0
    [ 0.5, -0.5, -0.5], // 1
    [ 0.5,  0.5, -0.5], // 2
    [-0.5,  0.5, -0.5], // 3
    [-0.5, -0.5,  0.5], // 4
    [ 0.5, -0.5,  0.5], // 5
    [ 0.5,  0.5,  0.5], // 6
    [-0.5,  0.5,  0.5], // 7
  ];

  // Hamiltonian edge-covering path traversal
  const path = [0, 1, 2, 3, 0, 4, 5, 1, 2, 6, 5, 4, 7, 3, 7, 6];
  const points = path.map(i => verts[i]);

  const phaseShift = index * 0.35;

  useFrame((state) => {
    const phase = useStore.getState().phase;
    if (phase !== "projects") return;
    const t = state.clock.getElapsedTime();
    if (lineRef.current?.material) {
      // Slither dash offsets along the wireframe edges (moving snake lines)
      lineRef.current.material.dashOffset = -(t * 0.36 + phaseShift);
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Very subtle transparent backing fill for premium 3D dark space look */}
      <mesh>
        <boxGeometry args={[0.98, 0.98, 0.98]} />
        <meshStandardMaterial
          color="#1e293b" // slate dark blue
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={0.20}
          depthWrite={false}
        />
      </mesh>

      {/* Slithering dashed edge path — premium glowing purple-blue snake lines (#818cf8) */}
      <Line
        ref={lineRef}
        points={points}
        color="#818cf8"
        lineWidth={1.5}
        dashed
        dashScale={1.0}
        dashSize={0.45}   // exactly half of local cube side (1.0)
        dashGap={0.35}
      />

      {/* Radiant cyan corner vertex dots (#22d3ee) */}
      {verts.map((v, i) => (
        <mesh key={i} position={v}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      ))}
    </group>
  );
}

/** Twinkling particle component that floats slowly upward and twinkles */
function TwinklingParticle({ data }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Slow vertical drift
    let y = data.y + t * data.speed * 0.15;
    const range = 1.8;
    y = ((y + 0.9) % range) - 0.9;
    meshRef.current.position.y = y;

    // Twist rotation
    meshRef.current.rotation.x = t * data.speed * 0.3;
    meshRef.current.rotation.y = t * data.speed * 0.5;

    // Twinkling opacity
    if (meshRef.current.material) {
      meshRef.current.material.opacity = 0.2 + Math.sin(t * 3.5 + data.offset) * 0.55;
    }
  });

  return (
    <mesh ref={meshRef} position={[data.x, data.y, data.z]} scale={data.scale}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
    </mesh>
  );
}
