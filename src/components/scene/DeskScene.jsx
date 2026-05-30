"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";

const DeskScene = forwardRef((props, ref) => {
  // Main groups
  const containerRef = useRef();
  const deskRef = useRef();
  const chairRef = useRef();
  const characterRef = useRef();

  // Character body parts
  const torsoRef = useRef();
  const headRef = useRef();
  const leftUpperArmRef = useRef();
  const rightUpperArmRef = useRef();
  const leftForearmRef = useRef();
  const rightForearmRef = useRef();
  const leftThighRef = useRef();
  const rightThighRef = useRef();
  const leftShinRef = useRef();
  const rightShinRef = useRef();

  // Swivel base of the chair
  const chairSwivelRef = useRef();

  // Custom animation values for GSAP targeting (avoid React state re-renders for max performance)
  const animProgress = useRef({
    standProgress: 0, // 0 = Sitting, 1 = Standing
  });

  // Expose refs and custom progress object for GSAP ScrollTrigger control
  useImperativeHandle(ref, () => ({
    container: containerRef.current,
    desk: deskRef.current,
    chair: chairRef.current,
    character: characterRef.current,
    torso: torsoRef.current,
    head: headRef.current,
    leftUpperArm: leftUpperArmRef.current,
    rightUpperArm: rightUpperArmRef.current,
    leftForearm: leftForearmRef.current,
    rightForearm: rightForearmRef.current,
    leftThigh: leftThighRef.current,
    rightThigh: rightThighRef.current,
    leftShin: leftShinRef.current,
    rightShin: rightShinRef.current,
    chairSwivel: chairSwivelRef.current,
    animProgress: animProgress.current, // Expose standProgress for GSAP timeline
  }));

  // Subtle real-time idle floating and typing animations blended with standing logic
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const stand = animProgress.current.standProgress; // Interpolation factor (0 to 1)

    // 1. Torso standing movement + breathing idle bobbing
    if (torsoRef.current) {
      // Sitting torso y is ~0.95, standing torso y is ~1.55.
      // Torso z shifts back slightly while standing (from -0.05 to -0.22)
      const baseY = 0.95 + stand * 0.6;
      const baseZ = -0.05 - stand * 0.17;
      torsoRef.current.position.y = Math.sin(time * 1.5) * 0.02 + baseY;
      torsoRef.current.position.z = baseZ;
      // Subtle lean while standing
      torsoRef.current.rotation.x = stand * 0.04;
    }

    // 2. Slight idle head tilt/bobbing
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 1.0) * 0.05;
      headRef.current.rotation.x = Math.cos(time * 1.2) * 0.03 + stand * 0.02;
    }

    // 3. Arms typing vs relaxed standing posture
    if (leftUpperArmRef.current && rightUpperArmRef.current) {
      // Sitting shoulder angle: tilted forward. Standing shoulder angle: relaxed at side.
      const leftShoulderX = (-Math.PI / 4) * (1 - stand) + (0.05) * stand;
      const rightShoulderX = (-Math.PI / 4) * (1 - stand) + (0.05) * stand;
      
      leftUpperArmRef.current.rotation.x = leftShoulderX + Math.sin(time * 15) * 0.015 * (1 - stand);
      leftUpperArmRef.current.rotation.z = Math.sin(time * 8) * 0.01 * (1 - stand);
      
      rightUpperArmRef.current.rotation.x = rightShoulderX + Math.cos(time * 15) * 0.015 * (1 - stand);
      rightUpperArmRef.current.rotation.z = -Math.cos(time * 8) * 0.01 * (1 - stand);
    }

    if (leftForearmRef.current && rightForearmRef.current) {
      // Sitting elbow: bent -Math.PI / 3. Standing elbow: straight/relaxed -Math.PI / 16.
      const leftElbowX = (-Math.PI / 3) * (1 - stand) + (-Math.PI / 16) * stand;
      const rightElbowX = (-Math.PI / 3) * (1 - stand) + (-Math.PI / 16) * stand;
      leftForearmRef.current.rotation.x = leftElbowX;
      rightForearmRef.current.rotation.x = rightElbowX;
    }

    // 4. Legs rotation (Hip & Knee joints)
    // Seated thigh: -Math.PI/2. Standing thigh: 0.
    if (leftThighRef.current && rightThighRef.current) {
      const thighX = (-Math.PI / 2) * (1 - stand);
      leftThighRef.current.rotation.x = thighX;
      rightThighRef.current.rotation.x = thighX;
    }
    // Seated shin: Math.PI/2. Standing shin: 0.
    if (leftShinRef.current && rightShinRef.current) {
      const shinX = (Math.PI / 2) * (1 - stand);
      leftShinRef.current.rotation.x = shinX;
      rightShinRef.current.rotation.x = shinX;
    }
  });

  return (
    <group ref={containerRef} {...props}>
      {/* =================================================================
          1. FUTURISTIC DESK SETUP
         ================================================================= */}
      <group ref={deskRef} position={[0, 0, 0.5]}>
        {/* Sleek desk top */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.06, 1.2]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Desk Frame/Legs (Futuristic metallic frames) */}
        <mesh position={[-1.1, 0.375, 0]} castShadow>
          <boxGeometry args={[0.06, 0.75, 1.0]} />
          <meshStandardMaterial color="#0c0c14" roughness={0.4} metalness={0.9} />
        </mesh>
        <mesh position={[1.1, 0.375, 0]} castShadow>
          <boxGeometry args={[0.06, 0.75, 1.0]} />
          <meshStandardMaterial color="#0c0c14" roughness={0.4} metalness={0.9} />
        </mesh>

        {/* Glowing futuristic cyber-accent strip */}
        <mesh position={[0, 0.72, -0.58]}>
          <boxGeometry args={[2.2, 0.02, 0.02]} />
          <meshStandardMaterial
            emissive="#3b82f6"
            emissiveIntensity={4.0}
            color="#3b82f6"
          />
        </mesh>

        {/* =================================================================
            LAPTOP & MONITOR SCREEN GLOW
           ================================================================= */}
        <group position={[0, 0.78, -0.2]}>
          {/* Laptop Base */}
          <mesh position={[0, 0.005, 0.1]} castShadow>
            <boxGeometry args={[0.35, 0.01, 0.25]} />
            <meshStandardMaterial color="#2e2e3a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Laptop Screen (Angled back) */}
          <group position={[0, 0.01, -0.025]} rotation={[-Math.PI / 6, 0, 0]}>
            <mesh position={[0, 0.11, 0]} castShadow>
              <boxGeometry args={[0.35, 0.22, 0.01]} />
              <meshStandardMaterial color="#1e1e28" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Emissive screen display projecting light */}
            <mesh position={[0, 0.11, 0.006]}>
              <planeGeometry args={[0.33, 0.2]} />
              <meshBasicMaterial color="#00f3ff" />
            </mesh>
            {/* Screen directional light projection */}
            <spotLight
              position={[0, 0.11, 0.05]}
              target-position={[0, 0.2, 0.5]}
              color="#00f3ff"
              intensity={2.5}
              distance={1.5}
              angle={Math.PI / 3}
              penumbra={0.5}
              castShadow={false}
            />
          </group>
        </group>
      </group>

      {/* =================================================================
          2. MINIMALISTIC SWIVEL CHAIR
         ================================================================= */}
      <group ref={chairRef} position={[0, 0, 1.4]}>
        {/* Swivel base column */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4]} />
          <meshStandardMaterial color="#0f0f15" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Swivel star feet */}
        <mesh position={[0, 0.02, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.03, 0.05]} />
          <meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.5, 0.03, 0.05]} />
          <meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Chair Seat & Backrest (This swivel-group rotates during scroll) */}
        <group ref={chairSwivelRef} position={[0, 0.4, 0]}>
          {/* Seat Cushion */}
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.08, 0.5]} />
            <meshStandardMaterial color="#1a1a24" roughness={0.6} />
          </mesh>
          {/* Metallic seat connector */}
          <mesh position={[0, 0.2, -0.22]} castShadow>
            <boxGeometry args={[0.08, 0.35, 0.04]} />
            <meshStandardMaterial color="#2e2e3a" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.45, -0.24]} rotation={[-Math.PI / 24, 0, 0]} castShadow>
            <boxGeometry args={[0.5, 0.55, 0.06]} />
            <meshStandardMaterial color="#1a1a24" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* =================================================================
          3. ARTICULATED HUMAN CHARACTER (PLACEHOLDER GEOMETRY)
         ================================================================= */}
      <group ref={characterRef} position={[0, 0, 1.4]}>
        {/* Torso (Anchor of the body, parent of limbs) */}
        <group ref={torsoRef} position={[0, 0.95, -0.05]}>
          {/* Torso Mesh */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.55, 0.24]} />
            <meshStandardMaterial color="#2a3b5c" roughness={0.7} />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 0.1]} />
            <meshStandardMaterial color="#d4a373" roughness={0.5} />
          </mesh>

          {/* Head (Child of Torso, bobbing applied in useFrame) */}
          <group ref={headRef} position={[0, 0.52, 0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.18, 32, 32]} />
              <meshStandardMaterial color="#d4a373" roughness={0.5} />
            </mesh>
            {/* Futuristic glowing visor/goggles */}
            <mesh position={[0, 0.04, 0.12]}>
              <boxGeometry args={[0.24, 0.05, 0.08]} />
              <meshStandardMaterial emissive="#8b5cf6" emissiveIntensity={3} color="#8b5cf6" />
            </mesh>
          </group>

          {/* ==============================================
              LIMBS: LEFT ARM (Pivot at Shoulder)
             ============================================== */}
          <group ref={leftUpperArmRef} position={[-0.26, 0.22, 0]}>
            {/* Left Upper Arm Mesh */}
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.035, 0.35]} />
              <meshStandardMaterial color="#2a3b5c" roughness={0.6} />
            </mesh>

            {/* Left Forearm (Pivot at Elbow) */}
            <group ref={leftForearmRef} position={[0, -0.3, 0]} rotation={[-Math.PI / 3, 0, 0]}>
              <mesh position={[0, -0.15, 0]} castShadow>
                <cylinderGeometry args={[0.035, 0.03, 0.32]} />
                <meshStandardMaterial color="#d4a373" roughness={0.5} />
              </mesh>
              {/* Left Hand placeholder */}
              <mesh position={[0, -0.32, 0]} castShadow>
                <sphereGeometry args={[0.04]} />
                <meshStandardMaterial color="#d4a373" roughness={0.5} />
              </mesh>
            </group>
          </group>

          {/* ==============================================
              LIMBS: RIGHT ARM (Pivot at Shoulder)
             ============================================== */}
          <group ref={rightUpperArmRef} position={[0.26, 0.22, 0]}>
            {/* Right Upper Arm Mesh */}
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.035, 0.35]} />
              <meshStandardMaterial color="#2a3b5c" roughness={0.6} />
            </mesh>

            {/* Right Forearm (Pivot at Elbow) */}
            <group ref={rightForearmRef} position={[0, -0.3, 0]} rotation={[-Math.PI / 3, 0, 0]}>
              <mesh position={[0, -0.15, 0]} castShadow>
                <cylinderGeometry args={[0.035, 0.03, 0.32]} />
                <meshStandardMaterial color="#d4a373" roughness={0.5} />
              </mesh>
              {/* Right Hand placeholder */}
              <mesh position={[0, -0.32, 0]} castShadow>
                <sphereGeometry args={[0.04]} />
                <meshStandardMaterial color="#d4a373" roughness={0.5} />
              </mesh>
            </group>
          </group>

          {/* ==============================================
              LIMBS: LEFT LEG (Pivot at Hip)
             ============================================== */}
          <group ref={leftThighRef} position={[-0.14, -0.28, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Left Thigh Mesh */}
            <mesh position={[0, -0.2, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.4]} />
              <meshStandardMaterial color="#1f2937" roughness={0.6} />
            </mesh>

            {/* Left Shin (Pivot at Knee) */}
            <group ref={leftShinRef} position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh position={[0, -0.2, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.04, 0.4]} />
                <meshStandardMaterial color="#1f2937" roughness={0.6} />
              </mesh>
              {/* Left Shoe */}
              <mesh position={[0, -0.42, 0.04]} castShadow>
                <boxGeometry args={[0.09, 0.06, 0.18]} />
                <meshStandardMaterial color="#111115" roughness={0.8} />
              </mesh>
            </group>
          </group>

          {/* ==============================================
              LIMBS: RIGHT LEG (Pivot at Hip)
             ============================================== */}
          <group ref={rightThighRef} position={[0.14, -0.28, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Right Thigh Mesh */}
            <mesh position={[0, -0.2, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.4]} />
              <meshStandardMaterial color="#1f2937" roughness={0.6} />
            </mesh>

            {/* Right Shin (Pivot at Knee) */}
            <group ref={rightShinRef} position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh position={[0, -0.2, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.04, 0.4]} />
                <meshStandardMaterial color="#1f2937" roughness={0.6} />
              </mesh>
              {/* Right Shoe */}
              <mesh position={[0, -0.42, 0.04]} castShadow>
                <boxGeometry args={[0.09, 0.06, 0.18]} />
                <meshStandardMaterial color="#111115" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
});

DeskScene.displayName = "DeskScene";

export default DeskScene;
