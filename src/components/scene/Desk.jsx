"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store/useStore";

const lines1 = [
  { w: 0.25, c: "#79c0ff", x: -0.05 },
  { w: 0.42, c: "#FF923E", x: -0.02 },
  { w: 0.32, c: "#FFC837", x: 0.01 },
  { w: 0.18, c: "#7ee787", x: -0.06 },
  { w: 0.38, c: "#79c0ff", x: -0.03 },
  { w: 0.28, c: "#d2a8ff", x: 0.02 },
  { w: 0.22, c: "#FF923E", x: -0.04 },
  { w: 0.35, c: "#FFC837", x: 0.0 },
  { w: 0.15, c: "#7ee787", x: -0.05 },
  { w: 0.30, c: "#79c0ff", x: -0.02 },
];

const lines2 = [
  { w: 0.35, c: "#FF923E", x: 0.03 },
  { w: 0.28, c: "#79c0ff", x: -0.01 },
  { w: 0.42, c: "#FFC837", x: 0.02 },
  { w: 0.20, c: "#7ee787", x: -0.04 },
  { w: 0.30, c: "#d2a8ff", x: 0.01 },
  { w: 0.38, c: "#79c0ff", x: -0.02 },
  { w: 0.18, c: "#FF923E", x: 0.03 },
  { w: 0.28, c: "#FFC837", x: -0.01 },
  { w: 0.32, c: "#7ee787", x: 0.0 },
  { w: 0.22, c: "#d2a8ff", x: -0.03 },
];

function ScrollingTerminalLines({ lines, speed = 0.03 }) {
  const groupRef = useRef();
  const lineSpacing = 0.045;
  const blockHeight = lines.length * lineSpacing; // 0.45

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const phase = useStore.getState().phase;
    if (phase !== "home") return;

    // Continuous scroll upward
    const scrollOffset = (t * speed) % blockHeight;
    
    // Update individual child line positions and check bounds
    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const lineMesh = children[i];
      if (!lineMesh || !lineMesh.position) continue;
      
      const index = i % lines.length;
      const copyOffset = i >= lines.length ? -blockHeight : 0;
      
      const initialY = -0.20 + index * lineSpacing;
      let y = initialY + scrollOffset + copyOffset;
      
      lineMesh.position.y = y;
      lineMesh.visible = y >= -0.185 && y <= 0.185;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Copy 1 */}
      {lines.map((line, i) => (
        <mesh key={`c1-${i}`} position={[line.x, 0, 0.032]}>
          <planeGeometry args={[line.w, 0.022]} />
          <meshBasicMaterial color={line.c} />
        </mesh>
      ))}
      {/* Copy 2 */}
      {lines.map((line, i) => (
        <mesh key={`c2-${i}`} position={[line.x, 0, 0.032]}>
          <planeGeometry args={[line.w, 0.022]} />
          <meshBasicMaterial color={line.c} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Desk — Full diorama workspace with volumetric 3D toy-like assets.
 * Includes: L-desk, dual monitors with animated code-editor strips, keyboard,
 * pencil cup with pencils, penguin figurine, Rubik's cube, desk lamp,
 * large floor plant, 3D wall, shelf with books & succulent, corkboard with papers.
 */
export default function Desk(props) {
  const lampLightRef = useRef();
  const mouseRef = useRef();
  const speakerConeRef = useRef();
  const soundWavesRef = useRef();
  const penguinRef = useRef();
  const rubikRef = useRef();
  const lampRef = useRef();
  const plantRef = useRef();

  const scrollProgress = useStore((state) => state.scrollProgress);

  useFrame((state) => {
    const phase = useStore.getState().phase;
    if (phase !== "home") return;

    const t = state.clock.getElapsedTime();

    // Lamp warm flicker
    if (lampLightRef.current) {
      lampLightRef.current.intensity = 1.2 + Math.sin(t * 8) * 0.15;
    }

    // Mouse movement
    if (mouseRef.current) {
      mouseRef.current.position.x = -0.2 + Math.sin(t * 2) * 0.02;
      mouseRef.current.position.z = 0.70 + Math.cos(t * 3) * 0.015;
    }

    // Music/Speaker/Penguin animation
    const isMusicPlaying = useStore.getState().isMusicPlaying;
    if (isMusicPlaying) {
      if (speakerConeRef.current) {
        const pulse = 1.0 + Math.max(0, Math.sin(t * 12)) * 0.18;
        speakerConeRef.current.scale.set(pulse, 1.0, pulse);
      }
      if (soundWavesRef.current) {
        const waveChildren = soundWavesRef.current.children;
        for (let i = 0; i < waveChildren.length; i++) {
          const wave = waveChildren[i];
          const cycle = (t * 1.6 + i * 0.33) % 1.0;
          wave.position.y = 0.08 + cycle * 0.15;
          wave.position.x = Math.sin(t * 4.5 + i) * 0.02;
          wave.scale.setScalar(1.0 + cycle * 1.5);
          wave.visible = true;
          if (wave.material) {
            wave.material.opacity = (1.0 - cycle) * 0.85;
            wave.material.transparent = true;
          }
        }
      }
      if (penguinRef.current) {
        penguinRef.current.rotation.z = Math.sin(t * 2.8) * 0.09;
        penguinRef.current.position.y = 0.66 + Math.abs(Math.sin(t * 5.6)) * 0.012;
      }
    } else {
      if (speakerConeRef.current) speakerConeRef.current.scale.set(1.0, 1.0, 1.0);
      if (soundWavesRef.current) {
        soundWavesRef.current.children.forEach((w) => { w.visible = false; });
      }
      if (penguinRef.current) {
        penguinRef.current.rotation.z = 0;
        penguinRef.current.position.y = 0.66;
      }
    }

    // Cartoonish Room Ambient Animations
    if (plantRef.current) {
      plantRef.current.rotation.z = Math.sin(t * 1.0) * 0.025;
      plantRef.current.rotation.x = Math.cos(t * 0.8) * 0.015;
    }
    if (rubikRef.current) {
      rubikRef.current.position.y = 0.66 + Math.sin(t * 1.8) * 0.022; // smooth hovering
      rubikRef.current.rotation.y = t * 0.40; // slow rotation
      rubikRef.current.rotation.x = Math.sin(t * 0.6) * 0.12; // wobble
    }
    if (lampRef.current) {
      lampRef.current.rotation.z = Math.sin(t * 1.4) * 0.035; // breathing lamp neck sway
    }
  });

  return (
    <group {...props}>

      {/* ═══════════════════════════════════════════════
          3D WALL BACKDROP (Thick volumetric panel)
          ═══════════════════════════════════════════════ */}
      <mesh position={[0, 1.2, -1.3]} castShadow receiveShadow>
        <boxGeometry args={[4.0, 3.2, 0.15]} />
        <meshStandardMaterial color="#f0ebe4" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* ═══════════════════════════════════════════════
          L-SHAPED DESK (Thick solid 3D box tops)
          ═══════════════════════════════════════════════ */}
      {/* Main tabletop — thick slab */}
      <mesh position={[0, 0.60, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.12, 1.3]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} metalness={0.0} />
      </mesh>
      {/* Corner return tabletop — thick slab */}
      <mesh position={[0.8, 0.60, -0.55]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.12, 1.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* Cylindrical wooden support legs */}
      {[[-1.15, 0.6], [-1.15, -0.35], [1.15, 0.6], [1.15, -0.9], [0.4, -0.9]].map(
        ([x, z], i) => (
          <mesh key={`leg-${i}`} position={[x, 0.27, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.54, 16]} />
            <meshStandardMaterial color="#d4a373" roughness={0.85} metalness={0.0} />
          </mesh>
        )
      )}

      {/* ═══════════════════════════════════════════════
          DUAL MONITORS (Volumetric frames + active code screens)
          ═══════════════════════════════════════════════ */}
      {/* Primary center monitor */}
      <group position={[0, 0.66, 0.05]}>
        {/* Stand post */}
        <mesh position={[0, 0.14, -0.1]} castShadow>
          <cylinderGeometry args={[0.025, 0.035, 0.28, 12]} />
          <meshStandardMaterial color="#2e2e3a" roughness={0.85} metalness={0.0} />
        </mesh>
        {/* Stand base */}
        <mesh position={[0, 0.01, -0.1]} castShadow>
          <boxGeometry args={[0.22, 0.03, 0.16]} />
          <meshStandardMaterial color="#2e2e3a" roughness={0.85} metalness={0.0} />
        </mesh>
        {/* Monitor body — thick volumetric box */}
        <group position={[0, 0.32, -0.08]} rotation={[0, 0.08, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.44, 0.06]} />
            <meshStandardMaterial color="#1a1a24" roughness={0.85} metalness={0.0} />
          </mesh>
          {/* Screen background */}
          <mesh position={[0, 0, 0.031]}>
            <planeGeometry args={[0.6, 0.39]} />
            <meshStandardMaterial color="#0d1117" roughness={0.9} />
          </mesh>
          {/* Animated code-editor lines (wrapped for scroll animation) */}
          <ScrollingTerminalLines lines={lines1} speed={0.03} />

          {/* ── PREMIUM SCREEN GLOW LIGHTING ── */}
          {/* Projects a soft, cybernetic blue glow on the keyboard and character */}
          <pointLight
            position={[0, 0, 0.25]}
            color="#79c0ff"
            intensity={0.4}
            distance={1.6}
            decay={1.8}
          />
        </group>
      </group>

      {/* Secondary right monitor (angled inward) */}
      <group position={[0.64, 0.66, -0.08]}>
        <mesh position={[0, 0.14, -0.1]} castShadow>
          <cylinderGeometry args={[0.025, 0.035, 0.28, 12]} />
          <meshStandardMaterial color="#2e2e3a" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh position={[0, 0.01, -0.1]} castShadow>
          <boxGeometry args={[0.22, 0.03, 0.16]} />
          <meshStandardMaterial color="#2e2e3a" roughness={0.85} metalness={0.0} />
        </mesh>
        <group position={[0, 0.32, -0.08]} rotation={[0, -0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.44, 0.06]} />
            <meshStandardMaterial color="#1a1a24" roughness={0.85} metalness={0.0} />
          </mesh>
          <mesh position={[0, 0, 0.031]}>
            <planeGeometry args={[0.6, 0.39]} />
            <meshStandardMaterial color="#0d1117" roughness={0.9} />
          </mesh>
          {/* Animated code-editor lines */}
          <ScrollingTerminalLines lines={lines2} speed={0.045} />

          {/* Screen glow right */}
          <pointLight
            position={[0, 0, 0.25]}
            color="#FF923E"
            intensity={0.25}
            distance={1.2}
            decay={1.8}
          />
        </group>
      </group>

      {/* ═══════════════════════════════════════════════
          3D KEYBOARD (Directly under character's hands)
          ═══════════════════════════════════════════════ */}
      <group position={[0, 0.66, 0.53]} rotation={[0, 0, 0]} visible={true}>
        {/* Keyboard body */}
        <mesh castShadow visible={true}>
          <boxGeometry args={[0.55, 0.035, 0.22]} />
          <meshStandardMaterial color="#111115" roughness={0.90} metalness={0.1} />
        </mesh>
        {/* Key Caps */}
        {Array.from({ length: 4 }).map((_, r) => {
          const zPos = -0.07 + r * 0.046;
          const keysInRow = 10;
          return Array.from({ length: keysInRow }).map((_, c) => {
            const xPos = -0.216 + c * 0.048 + (r % 2 === 0 ? 0.008 : 0);
            const isWhite = (r + c) % 2 === 0;
            const keyColor = isWhite ? "#ffffff" : "#1a1a22";
            return (
              <mesh key={`key-${r}-${c}`} position={[xPos, 0.02, zPos]} castShadow>
                <boxGeometry args={[0.036, 0.016, 0.032]} />
                <meshStandardMaterial color={keyColor} roughness={0.6} metalness={0.1} />
              </mesh>
            );
          });
        })}
      </group>

      {/* ═══════════════════════════════════════════════
          PENCIL CUP HOLDER with multi-colored pencils
          ═══════════════════════════════════════════════ */}
      <group position={[0.3, 0.66, 0.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.12, 12]} />
          <meshStandardMaterial color="#FFC837" roughness={0.85} metalness={0.0} />
        </mesh>
        {[
          { x: -0.02, z: 0, c: "#e74c3c", angle: 0.08 },
          { x: 0.015, z: 0.01, c: "#3498db", angle: -0.1 },
          { x: 0, z: -0.015, c: "#2ecc71", angle: 0.05 },
        ].map(({ x, z, c, angle }, i) => (
          <mesh key={`pencil-${i}`} position={[x, 0.14, z]} rotation={[angle, 0, -angle]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
            <meshStandardMaterial color={c} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* ═══════════════════════════════════════════════
          LOW-POLY PENGUIN FIGURINE (left side)
          ═══════════════════════════════════════════════ */}
      <group ref={penguinRef} position={[-0.8, 0.66, -0.15]}>
        <mesh castShadow position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.055, 0.065, 0.18, 8]} />
          <meshStandardMaterial color="#111111" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh position={[0, 0.08, 0.045]}>
          <boxGeometry args={[0.065, 0.11, 0.025]} />
          <meshStandardMaterial color="#ffffff" roughness={0.85} />
        </mesh>
        <mesh castShadow position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#111111" roughness={0.85} />
        </mesh>
        <mesh position={[-0.025, 0.21, 0.05]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[0.025, 0.21, 0.05]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.19, 0.058]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.015, 0.04, 4]} />
          <meshStandardMaterial color="#FF923E" roughness={0.85} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════
          RUBIK'S CUBE (right side, volumetric)
          ═══════════════════════════════════════════════ */}
      <group ref={rubikRef} position={[0.7, 0.66, 0.35]} rotation={[0, 0.6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#222222" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh position={[0, 0, 0.051]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.051, 0]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshStandardMaterial color="#ffffff" roughness={0.85} />
        </mesh>
        <mesh position={[0.051, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshStandardMaterial color="#FF923E" roughness={0.85} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════
          SLEEK 3D DESKTOP SPEAKER (Pulsing sound waves)
          ═══════════════════════════════════════════════ */}
      <group position={[0.48, 0.66, 0.48]} rotation={[0, -0.45, 0]}>
        {/* Cabinet */}
        <mesh castShadow>
          <boxGeometry args={[0.09, 0.16, 0.09]} />
          <meshStandardMaterial color="#111115" roughness={0.8} />
        </mesh>
        {/* Subwoofer pulse cone */}
        <mesh ref={speakerConeRef} position={[0, -0.02, 0.046]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.005, 12]} />
          <meshStandardMaterial color="#22d3ee" roughness={0.4} emissive="#22d3ee" emissiveIntensity={0.25} />
        </mesh>
        {/* Tweeter */}
        <mesh position={[0, 0.04, 0.046]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.005, 12]} />
          <meshStandardMaterial color="#818cf8" roughness={0.4} emissive="#818cf8" emissiveIntensity={0.25} />
        </mesh>
        {/* Sound waves group */}
        <group ref={soundWavesRef}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0.1, 0.04]} rotation={[0.2, 0, 0]}>
              <torusGeometry args={[0.012 + i * 0.008, 0.002, 8, 16, Math.PI]} />
              <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ═══════════════════════════════════════════════
          DESK LAMP (Orange, volumetric)
          ═══════════════════════════════════════════════ */}
      <group ref={lampRef} position={[-1.0, 0.66, 0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.04, 16]} />
          <meshStandardMaterial color="#FF923E" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh position={[0, 0.24, 0]} rotation={[0, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
          <meshStandardMaterial color="#d4a373" roughness={0.85} />
        </mesh>
        <mesh position={[0.07, 0.45, 0]} rotation={[0, 0, 0.6]} castShadow>
          <coneGeometry args={[0.08, 0.14, 12]} />
          <meshStandardMaterial color="#FF923E" roughness={0.85} />
        </mesh>
        <spotLight
          ref={lampLightRef}
          position={[0.07, 0.4, 0]}
          color="#ffeedd"
          intensity={1.2}
          distance={1.2}
          angle={Math.PI / 4}
          penumbra={0.6}
        />
      </group>

      {/* ═══════════════════════════════════════════════
          LARGE FLOOR PLANT (Beside the desk, volumetric pot + leaves)
          ═══════════════════════════════════════════════ */}
      <group ref={plantRef} position={[-1.5, 0.0, 0.3]}>
        <mesh castShadow position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.18, 0.14, 0.32, 16]} />
          <meshStandardMaterial color="#fcfaf2" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.16, 16]} />
          <meshStandardMaterial color="#5c4033" roughness={0.95} />
        </mesh>
        {[
          { x: -0.06, z: 0, h: 0.55, lean: 0.12, c: "#1b4332" },
          { x: 0.05, z: 0.05, h: 0.65, lean: -0.1, c: "#2d6a4f" },
          { x: 0, z: -0.06, h: 0.72, lean: 0.05, c: "#40916c" },
          { x: 0.04, z: -0.03, h: 0.48, lean: -0.08, c: "#1b4332" },
        ].map(({ x, z, h, lean, c }, i) => (
          <mesh key={`leaf-${i}`} position={[x, 0.33 + h / 2, z]} rotation={[lean, 0, -lean * 0.8]} castShadow>
            <coneGeometry args={[0.035, h, 4]} />
            <meshStandardMaterial color={c} roughness={0.85} metalness={0.0} />
          </mesh>
        ))}
      </group>

      {/* ═══════════════════════════════════════════════
          WALL SHELF (Volumetric 3D board + book models + succulent)
          ═══════════════════════════════════════════════ */}
      <group position={[0, 1.55, -1.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.06, 0.35]} />
          <meshStandardMaterial color="#d4a373" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh position={[-0.55, -0.12, 0.1]} castShadow>
          <boxGeometry args={[0.04, 0.2, 0.04]} />
          <meshStandardMaterial color="#b8956a" roughness={0.85} />
        </mesh>
        <mesh position={[0.55, -0.12, 0.1]} castShadow>
          <boxGeometry args={[0.04, 0.2, 0.04]} />
          <meshStandardMaterial color="#b8956a" roughness={0.85} />
        </mesh>
        <mesh position={[-0.4, 0.17, 0.0]} rotation={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[0.1, 0.3, 0.22]} />
          <meshStandardMaterial color="#FF923E" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh position={[-0.28, 0.15, 0.02]} rotation={[0, -0.12, -0.08]} castShadow>
          <boxGeometry args={[0.08, 0.26, 0.22]} />
          <meshStandardMaterial color="#005CA8" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh position={[-0.12, 0.06, 0.0]} castShadow>
          <boxGeometry args={[0.22, 0.06, 0.16]} />
          <meshStandardMaterial color="#2ecc71" roughness={0.85} />
        </mesh>
        <group position={[0.4, 0.12, 0.0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.12, 12]} />
            <meshStandardMaterial color="#fcfaf2" roughness={0.85} metalness={0.0} />
          </mesh>
          <mesh position={[0, 0.1, 0]} castShadow>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#40916c" roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* ═══════════════════════════════════════════════
          CORKBOARD PANEL (Volumetric frame + pinned paper meshes)
          ═══════════════════════════════════════════════ */}
      <group position={[1.2, 1.85, -1.22]}>
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.7, 0.06]} />
          <meshStandardMaterial color="#d4a373" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh position={[0, 0, 0.031]}>
          <boxGeometry args={[0.77, 0.62, 0.01]} />
          <meshStandardMaterial color="#b58d63" roughness={0.95} metalness={0.0} />
        </mesh>
        <mesh position={[-0.15, 0.12, 0.042]} castShadow>
          <boxGeometry args={[0.2, 0.25, 0.005]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[-0.15, 0.26, 0.048]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.8} />
        </mesh>
        <mesh position={[0.18, 0.05, 0.042]} rotation={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[0.18, 0.22, 0.005]} />
          <meshStandardMaterial color="#fffde7" roughness={0.9} />
        </mesh>
        <mesh position={[0.18, 0.18, 0.048]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color="#005CA8" roughness={0.8} />
        </mesh>
        <mesh position={[-0.2, -0.15, 0.042]} rotation={[0, 0, -0.05]} castShadow>
          <boxGeometry args={[0.14, 0.12, 0.005]} />
          <meshStandardMaterial color="#FF923E" roughness={0.85} />
        </mesh>
        <mesh position={[-0.2, -0.07, 0.048]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color="#FFC837" roughness={0.8} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════
          RIGHT-SIDE WALL PANEL (Encloses the L-room corner)
          ═══════════════════════════════════════════════ */}
      <mesh position={[1.925, 1.2, 0.45]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 3.2, 0.15]} />
        <meshStandardMaterial color="#f0ebe4" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* ═══════════════════════════════════════════════
          FRAMED WALL ART (Hangs on the right wall)
          ═══════════════════════════════════════════════ */}
      <group position={[1.84, 1.8, 0.3]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Outer wood frame */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.6, 0.04]} />
          <meshStandardMaterial color="#d4a373" roughness={0.85} />
        </mesh>
        {/* Matte border */}
        <mesh position={[0, 0, 0.021]}>
          <boxGeometry args={[0.72, 0.52, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        {/* Minimalist landscape art illustration */}
        <group position={[0, 0, 0.027]}>
          {/* Sun */}
          <mesh position={[-0.15, 0.08, 0]}>
            <circleGeometry args={[0.08, 32]} />
            <meshBasicMaterial color="#FF923E" />
          </mesh>
          {/* Mountain 1 */}
          <mesh position={[-0.1, -0.08, 0.001]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.25, 0.25, 0.001]} />
            <meshBasicMaterial color="#2d6a4f" />
          </mesh>
          {/* Mountain 2 */}
          <mesh position={[0.12, -0.12, 0.002]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.3, 0.3, 0.001]} />
            <meshBasicMaterial color="#1b4332" />
          </mesh>
        </group>
      </group>

      {/* ═══════════════════════════════════════════════
          MINIMALIST CORNER FLOOR LAMP (Warm volumetric prop)
          ═══════════════════════════════════════════════ */}
      <group position={[-1.6, 0.0, -0.7]}>
        {/* Lamp Base */}
        <mesh castShadow position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.14, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#2e2e3a" roughness={0.8} />
        </mesh>
        {/* Lamp Pole */}
        <mesh castShadow position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.8, 8]} />
          <meshStandardMaterial color="#d4a373" roughness={0.8} />
        </mesh>
        {/* Curved neck / top support */}
        <mesh castShadow position={[0.1, 1.8, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
          <meshStandardMaterial color="#d4a373" roughness={0.8} />
        </mesh>
        {/* Lamp Shade (Cone) */}
        <mesh castShadow position={[0.2, 1.72, 0]} rotation={[0, 0, Math.PI / 12]}>
          <coneGeometry args={[0.12, 0.22, 16]} />
          <meshStandardMaterial color="#FF923E" roughness={0.8} />
        </mesh>
        {/* Warm light source */}
        <pointLight
          position={[0.2, 1.6, 0]}
          color="#ffeedd"
          intensity={0.8}
          distance={2.5}
          decay={2}
        />
      </group>
    </group>
  );
}
