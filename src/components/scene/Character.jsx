"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store/useStore";

/**
 * Character — Premium claymorphic vinyl-toy figure.
 *
 * Hierarchy (all animation via useFrame, zero forwardRef/useImperativeHandle):
 *
 *   rootRef           ← rises on stand-up, rotates to face camera
 *   └─ torsoRef       ← breathes, leans forward when seated
 *       ├─ Torso mesh
 *       ├─ Hip bridge
 *       ├─ Neck
 *       ├─ headRef    ← nods, scans
 *       ├─ leftUpperArmRef  → leftForearmRef → leftHandRef
 *       └─ rightUpperArmRef → rightForearmRef → rightHandRef
 *   ├─ leftThighRef  → leftShinRef
 *   └─ rightThighRef → rightShinRef
 *
 * All Y-axis translation is handled ONLY by rootRef to prevent jitter.
 */

const Character = ({
  position = [0, -0.05, 1.42],
  rotation = [0, Math.PI, 0],
  isStanding = false,
}) => {
  const rootRef        = useRef();
  const torsoRef       = useRef();
  const headRef        = useRef();
  const leftUpperArmRef  = useRef();
  const rightUpperArmRef = useRef();
  const leftForearmRef   = useRef();
  const rightForearmRef  = useRef();
  const leftHandRef      = useRef();
  const rightHandRef     = useRef();
  const leftThighRef     = useRef();
  const rightThighRef    = useRef();
  const leftShinRef      = useRef();
  const rightShinRef     = useRef();

  // Set initial position and rotation immediately on mount to prevent any spin-in or jump glitches
  React.useLayoutEffect(() => {
    if (rootRef.current) {
      rootRef.current.position.y = position[1];
      rootRef.current.rotation.y = isStanding ? 0 : rotation[1];
      rootRef.current.position.x = position[0];
      rootRef.current.position.z = position[2];
    }
  }, [position, rotation, isStanding]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // ── TARGET CALCULATION ─────────────────────────────────────────────────
    const targetY    = position[1];
    const targetRotY = isStanding ? 0 : rotation[1];

    // ── ROOT LERP (0.12 friction = snappy but smooth) ──────────────────────
    if (rootRef.current) {
      rootRef.current.position.y   = THREE.MathUtils.lerp(rootRef.current.position.y,   targetY,    0.12);
      rootRef.current.rotation.y   = THREE.MathUtils.lerp(rootRef.current.rotation.y,   targetRotY, 0.12);
      rootRef.current.position.x   = position[0];
      rootRef.current.position.z   = position[2];
    }

    // Normalised stand progress derived strictly from isStanding state
    const standP = isStanding ? 1.0 : 0.0;
    const lean = 1 - standP; // 1.0 = seated forward lean, 0.0 = upright

    // ── TORSO ──────────────────────────────────────────────────────────────
    if (torsoRef.current) {
      const breathe = Math.sin(t * 1.8) * 0.005;
      torsoRef.current.position.y  = 0.77 + breathe;
      torsoRef.current.position.z  = -standP * 0.07;
      torsoRef.current.rotation.x  = lean * 0.18;
    }

    // ── HEAD ───────────────────────────────────────────────────────────────
    if (headRef.current) {
      const nod  = Math.cos(t * 0.65) * 0.02;
      const scan = Math.sin(t * 0.8)  * 0.18;
      headRef.current.rotation.x = nod  + THREE.MathUtils.lerp(-lean * 0.09, 0.06, standP);
      headRef.current.rotation.y =        THREE.MathUtils.lerp(scan, 0, standP);
    }

    // Arm splay snap
    const armP = Math.pow(standP, 4);

    // ── UPPER ARMS: Rest seated hands directly on top of the keyboard ──
    if (leftUpperArmRef.current && rightUpperArmRef.current) {
      const txRot = -0.65; // Upper shoulder rotated forward to reach keyboard (was -0.58)
      const tzRot = 0.15;  // Elbow splayed inward toward keyboard keys
      leftUpperArmRef.current.rotation.x  = THREE.MathUtils.lerp(txRot, 0.06, armP);
      leftUpperArmRef.current.rotation.z  = THREE.MathUtils.lerp(tzRot, 0.02, armP);
      rightUpperArmRef.current.rotation.x = THREE.MathUtils.lerp(txRot, 0.06, armP);
      rightUpperArmRef.current.rotation.z = THREE.MathUtils.lerp(-tzRot, -0.02, armP);
    }

    // ── FOREARMS: Bent forward perfectly to tap the keys ──
    if (leftForearmRef.current && rightForearmRef.current) {
      leftForearmRef.current.rotation.x  = THREE.MathUtils.lerp(-0.92, -Math.PI / 18, armP); // Forearm angle (was -0.85)
      leftForearmRef.current.rotation.y  = THREE.MathUtils.lerp(0.10, 0, armP);
      rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(-0.92, -Math.PI / 18, armP); // Forearm angle (was -0.85)
      rightForearmRef.current.rotation.y = THREE.MathUtils.lerp(-0.10, 0, armP);
    }

    // ── HANDS ──────────────────────────────────────────────────────────────
    const jitter = 1 - armP;
    if (leftHandRef.current && rightHandRef.current) {
      leftHandRef.current.position.y  = -0.21 + Math.sin(t * 16) * 0.005 * jitter; // Securely attached to forearm joints
      rightHandRef.current.position.y = -0.21 + Math.cos(t * 20) * 0.005 * jitter; // Securely attached to forearm joints
    }

    // ── THIGHS ────────────────────────────────────────────────────────────
    if (leftThighRef.current && rightThighRef.current) {
      const hipY = 0.42 + standP * 0.08;
      leftThighRef.current.position.y   = hipY;
      rightThighRef.current.position.y  = hipY;
      
      leftThighRef.current.rotation.x   = THREE.MathUtils.lerp(-Math.PI / 2, 0, standP);
      rightThighRef.current.rotation.x  = THREE.MathUtils.lerp(-Math.PI / 2, 0, standP);
      
      leftThighRef.current.rotation.z   = THREE.MathUtils.lerp(0, -0.05, standP);
      rightThighRef.current.rotation.z  = THREE.MathUtils.lerp(0, 0.05, standP);
    }

    // ── SHINS ──────────────────────────────────────────────────────────────
    if (leftShinRef.current && rightShinRef.current) {
      leftShinRef.current.rotation.x  = THREE.MathUtils.lerp(Math.PI / 2, 0, standP);
      rightShinRef.current.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, 0, standP);
    }
  });

  // Shared clay material factory - completely solid, opaque, and premium
  const clay = (color, isClothing = false) => {
    const phase = useStore.getState().phase;
    const isDark = phase !== "home";
    
    let finalColor = color;
    
    if (isDark && isClothing) {
      if (color === "#3a3a3a") {
        finalColor = "#5c548a"; // Lavender-slate shirt
      } else if (color === "#1c1c1c") {
        finalColor = "#3c385c"; // Space-indigo pants
      } else if (color === "#111111") {
        finalColor = "#26223b"; // Purple ankle bands
      } else if (color === "#2a2a2a") {
        finalColor = "#4b466e"; // Purple-gray shoe caps
      }
    }
    
    return (
      <meshStandardMaterial 
        color={finalColor} 
        roughness={0.85} 
        metalness={0.0}
        transparent={false}
        opacity={1.0}
      />
    );
  };

  return (
    /* rootRef — the top-level transform that rises during stand-up */
    <group ref={rootRef} position={position} rotation={rotation}>

      {/* ── BODY CORE ─────────────────────────────────────────────── */}
      <group ref={torsoRef} position={[0, 0.72, 0]}>

        {/* Torso capsule (dark shirt) */}
        <mesh position={[0, -0.04, -0.02]} rotation={[0.15, 0, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.155, 0.15, 16, 32]} />
          {clay("#3a3a3a", true)}
        </mesh>

        {/* Hip bridge (trouser waistband) */}
        <mesh position={[0, -0.22, 0.04]} castShadow>
          <sphereGeometry args={[0.168, 32, 32]} />
          {clay("#1c1c1c", true)}
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.175, 0]} castShadow>
          <cylinderGeometry args={[0.042, 0.05, 0.072, 16]} />
          {clay("#f5c5a3")}
        </mesh>

        {/* ── HEAD ─────────────────────────────────────────────────── */}
        <group ref={headRef} position={[0, 0.41, 0.01]}>

          {/* Skull */}
          <mesh castShadow>
            <sphereGeometry args={[0.21, 32, 32]} />
            {clay("#f5c5a3")}
          </mesh>

          {/* Hair — back dome */}
          <mesh position={[0, 0.06, -0.07]} castShadow>
            <sphereGeometry args={[0.225, 24, 24]} />
            {clay("#4e2b0f")}
          </mesh>
          {/* Hair — front tuft */}
          <mesh position={[0.04, 0.15, 0.09]} castShadow>
            <sphereGeometry args={[0.10, 16, 16]} />
            {clay("#4e2b0f")}
          </mesh>
          <mesh position={[-0.10, 0.11, 0.02]} castShadow>
            <sphereGeometry args={[0.076, 12, 12]} />
            {clay("#4e2b0f")}
          </mesh>

          {/* Left eye */}
          <group position={[-0.08, -0.012, 0.165]}>
            <mesh><sphereGeometry args={[0.05, 16, 16]} />{clay("#ffffff")}</mesh>
            <mesh position={[0.005, -0.006, 0.034]}>
              <sphereGeometry args={[0.033, 16, 16]} />{clay("#1e0e00")}
            </mesh>
            <mesh position={[0.015, 0.012, 0.047]}>
              <sphereGeometry args={[0.01, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Right eye */}
          <group position={[0.08, -0.012, 0.165]}>
            <mesh><sphereGeometry args={[0.05, 16, 16]} />{clay("#ffffff")}</mesh>
            <mesh position={[-0.005, -0.006, 0.034]}>
              <sphereGeometry args={[0.033, 16, 16]} />{clay("#1e0e00")}
            </mesh>
            <mesh position={[-0.015, 0.012, 0.047]}>
              <sphereGeometry args={[0.01, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Eyebrows */}
          <mesh position={[-0.08, 0.046, 0.19]} rotation={[0, 0, 0.07]}>
            <boxGeometry args={[0.056, 0.014, 0.01]} />{clay("#4e2b0f")}
          </mesh>
          <mesh position={[0.08, 0.046, 0.19]} rotation={[0, 0, -0.07]}>
            <boxGeometry args={[0.056, 0.014, 0.01]} />{clay("#4e2b0f")}
          </mesh>

          {/* Nose */}
          <mesh position={[0, -0.052, 0.2]}>
            <sphereGeometry args={[0.016, 12, 12]} />{clay("#e6b090")}
          </mesh>

          {/* Mouth */}
          <mesh position={[0, -0.092, 0.19]}>
            <boxGeometry args={[0.042, 0.006, 0.005]} />{clay("#c8886a")}
          </mesh>

          {/* Ears */}
          <mesh position={[-0.205, -0.02, 0.01]} castShadow>
            <sphereGeometry args={[0.036, 10, 10]} />{clay("#f5c5a3")}
          </mesh>
          <mesh position={[0.205, -0.02, 0.01]} castShadow>
            <sphereGeometry args={[0.036, 10, 10]} />{clay("#f5c5a3")}
          </mesh>
        </group>

        {/* ── LEFT ARM ─────────────────────────────────────────────── */}
        <group ref={leftUpperArmRef} position={[-0.205, 0.025, 0]}>
          {/* Shoulder sphere */}
          <mesh castShadow>
            <sphereGeometry args={[0.075, 16, 16]} />
            {clay("#3a3a3a", true)}
          </mesh>
          {/* Upper arm segment */}
          <mesh position={[0, -0.12, 0]} castShadow>
            <capsuleGeometry args={[0.057, 0.13, 10, 16]} />
            {clay("#3a3a3a", true)}
          </mesh>

          {/* Forearm pivot at elbow */}
          <group ref={leftForearmRef} position={[0, -0.24, 0]}>
            <mesh position={[0, -0.115, 0]} castShadow>
              <capsuleGeometry args={[0.050, 0.13, 10, 16]} />
              {clay("#f5c5a3")}
            </mesh>

            {/* Hand */}
            <group ref={leftHandRef} position={[0, -0.21, 0]}>
              {/* Palm */}
              <mesh position={[0, -0.025, 0.01]} castShadow>
                <sphereGeometry args={[0.053, 16, 16]} />
                {clay("#f5c5a3")}
              </mesh>
              {/* Thumb */}
              <mesh position={[-0.045, -0.01, 0.025]} rotation={[0, 0, -0.7]} castShadow>
                <capsuleGeometry args={[0.016, 0.028, 6, 8]} />
                {clay("#f5c5a3")}
              </mesh>
              {/* Index finger */}
              <mesh position={[-0.02, -0.065, 0.02]} castShadow>
                <capsuleGeometry args={[0.012, 0.025, 6, 8]} />
                {clay("#f5c5a3")}
              </mesh>
              {/* Middle finger */}
              <mesh position={[0, -0.070, 0.02]} castShadow>
                <capsuleGeometry args={[0.013, 0.028, 6, 8]} />
                {clay("#f5c5a3")}
              </mesh>
              {/* Ring finger */}
              <mesh position={[0.02, -0.065, 0.02]} castShadow>
                <capsuleGeometry args={[0.012, 0.024, 6, 8]} />
                {clay("#f5c5a3")}
              </mesh>
              {/* Pinky */}
              <mesh position={[0.035, -0.055, 0.02]} castShadow>
                <capsuleGeometry args={[0.010, 0.018, 6, 8]} />
                {clay("#f5c5a3")}
              </mesh>
            </group>
          </group>
        </group>

        {/* ── RIGHT ARM ────────────────────────────────────────────── */}
        <group ref={rightUpperArmRef} position={[0.205, 0.025, 0]}>
          {/* Shoulder sphere */}
          <mesh castShadow>
            <sphereGeometry args={[0.075, 16, 16]} />
            {clay("#3a3a3a", true)}
          </mesh>
          {/* Upper arm segment */}
          <mesh position={[0, -0.12, 0]} castShadow>
            <capsuleGeometry args={[0.057, 0.13, 10, 16]} />
            {clay("#3a3a3a", true)}
          </mesh>

          {/* Forearm pivot at elbow */}
          <group ref={rightForearmRef} position={[0, -0.24, 0]}>
            <mesh position={[0, -0.115, 0]} castShadow>
              <capsuleGeometry args={[0.050, 0.13, 10, 16]} />
              {clay("#f5c5a3")}
            </mesh>

            {/* Hand */}
            <group ref={rightHandRef} position={[0, -0.21, 0]}>
              {/* Palm */}
              <mesh position={[0, -0.025, 0.01]} castShadow>
                <sphereGeometry args={[0.053, 16, 16]} />
                {clay("#f5c5a3")}
              </mesh>
              {/* Thumb */}
              <mesh position={[0.045, -0.01, 0.025]} rotation={[0, 0, 0.7]} castShadow>
                <capsuleGeometry args={[0.016, 0.028, 6, 8]} />
                {clay("#f5c5a3")}
              </mesh>
              {/* Index finger */}
              <mesh position={[0.02, -0.065, 0.02]} castShadow>
                <capsuleGeometry args={[0.012, 0.025, 6, 8]} />
                {clay("#f5c5a3")}
              </mesh>
              {/* Middle finger */}
              <mesh position={[0, -0.070, 0.02]} castShadow>
                <capsuleGeometry args={[0.013, 0.028, 6, 8]} />
                {clay("#f5c5a3")}
              </mesh>
              {/* Ring finger */}
              <mesh position={[-0.02, -0.065, 0.02]} castShadow>
                <capsuleGeometry args={[0.012, 0.024, 6, 8]} />
                {clay("#f5c5a3")}
              </mesh>
              {/* Pinky */}
              <mesh position={[-0.035, -0.055, 0.02]} castShadow>
                <capsuleGeometry args={[0.010, 0.018, 6, 8]} />
                {clay("#f5c5a3")}
              </mesh>
            </group>
          </group>
        </group>

      </group>{/* end torsoRef */}

      {/* ── LEFT LEG ─────────────────────────────────────────────────── */}
      <group ref={leftThighRef} position={[-0.1, 0.46, 0.05]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.13, 8, 16]} />
          {clay("#1c1c1c", true)}
        </mesh>
        {/* Shin pivot at knee */}
        <group ref={leftShinRef} position={[0, -0.26, 0]}>
          <mesh position={[0, -0.10, 0]} castShadow>
            <capsuleGeometry args={[0.058, 0.11, 8, 16]} />
            {clay("#1c1c1c", true)}
          </mesh>
          {/* Ankle band */}
          <mesh position={[0, -0.20, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.058, 0.014, 8, 16]} />
            {clay("#111111", true)}
          </mesh>
          {/* Sock cuff */}
          <mesh position={[0, -0.23, 0]} castShadow>
            <cylinderGeometry args={[0.044, 0.044, 0.05, 16]} />
            {clay("#ffffff")}
          </mesh>
          {/* Shoe group */}
          <group position={[0, -0.28, 0.045]}>
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.058, 0.085, 16, 16]} />
              {clay("#2a2a2a", true)}
            </mesh>
            {/* Toe cap */}
            <mesh position={[0, 0, 0.095]} castShadow>
              <sphereGeometry args={[0.058, 16, 16]} />{clay("#f5f5f5")}
            </mesh>
            {/* Sole */}
            <mesh position={[0, -0.052, 0.022]}>
              <boxGeometry args={[0.13, 0.03, 0.21]} />{clay("#f5f5f5")}
            </mesh>
            {/* Tongue */}
            <mesh position={[0, 0.048, 0.018]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.04, 0.02, 0.06]} />{clay("#f5f5f5")}
            </mesh>
          </group>
        </group>
      </group>

      {/* ── RIGHT LEG ────────────────────────────────────────────────── */}
      <group ref={rightThighRef} position={[0.1, 0.46, 0.05]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.13, 8, 16]} />
          {clay("#1c1c1c", true)}
        </mesh>
        {/* Shin pivot at knee */}
        <group ref={rightShinRef} position={[0, -0.26, 0]}>
          <mesh position={[0, -0.10, 0]} castShadow>
            <capsuleGeometry args={[0.058, 0.11, 8, 16]} />
            {clay("#1c1c1c", true)}
          </mesh>
          {/* Ankle band */}
          <mesh position={[0, -0.20, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.058, 0.014, 8, 16]} />
            {clay("#111111", true)}
          </mesh>
          {/* Sock cuff */}
          <mesh position={[0, -0.23, 0]} castShadow>
            <cylinderGeometry args={[0.044, 0.044, 0.05, 16]} />
            {clay("#ffffff")}
          </mesh>
          {/* Shoe group */}
          <group position={[0, -0.28, 0.045]}>
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.058, 0.085, 16, 16]} />
              {clay("#2a2a2a", true)}
            </mesh>
            {/* Toe cap */}
            <mesh position={[0, 0, 0.095]} castShadow>
              <sphereGeometry args={[0.058, 16, 16]} />{clay("#f5f5f5")}
            </mesh>
            {/* Sole */}
            <mesh position={[0, -0.052, 0.022]}>
              <boxGeometry args={[0.13, 0.03, 0.21]} />{clay("#f5f5f5")}
            </mesh>
            {/* Tongue */}
            <mesh position={[0, 0.048, 0.018]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.04, 0.02, 0.06]} />{clay("#f5f5f5")}
            </mesh>
          </group>
        </group>
      </group>

    </group> /* end rootRef */
  );
};

Character.displayName = "Character";
export default Character;
