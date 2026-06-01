"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * LightingSetup — Phase-aware lighting.
 *
 * home:             Warm white studio lights matching the cream #F5EFEB room.
 * about/projects/contact: Deep purple-blue ambiance matching #1a1a2e canvas background,
 *                         with a clean neutral-white key light to keep the character's
 *                         skin tones completely solid, and an intense cyan rim light to
 *                         match the neon holographic platform.
 */
export default function LightingSetup({ currentPhase }) {
  const hemRef  = useRef();
  const keyRef  = useRef();
  const fillRef = useRef();
  const rimRef  = useRef();

  const isHome = currentPhase === "home";
  const isAbout = currentPhase === "about";
  const isPinkTheme = currentPhase === "projects" || currentPhase === "contact";

  // Targets per phase (Home / About / Projects & Contact pink studio)
  let targets;
  if (isHome) {
    targets = {
      hemSky:    new THREE.Color("#ffffff"),
      hemGround: new THREE.Color("#F5EFEB"),
      hemInt:    2.0,
      keyColor:  new THREE.Color("#faf8f5"),
      keyInt:    1.8,
      fillColor: new THREE.Color("#ffeedd"),
      fillInt:   0.8,
      rimColor:  new THREE.Color("#cce6ff"),
      rimInt:    0.6,
    };
  } else if (isAbout) {
    targets = {
      hemSky:    new THREE.Color("#3c2b8c"),   // slightly brighter deep-purple ambient sky
      hemGround: new THREE.Color("#0d0d1a"),
      hemInt:    1.2,
      keyColor:  new THREE.Color("#ffffff"),   // crisp white key light to show real opaque skin & clothes
      keyInt:    2.4,                          // high intensity key to keep character fully lit & solid
      fillColor: new THREE.Color("#8b5cf6"),   // rich purple fill light
      fillInt:   0.9,
      rimColor:  new THREE.Color("#00f3ff"),   // vibrant neon cyan rim accent matching the hologram platform
      rimInt:    2.0,
    };
  } else {
    // Premium Deep Space Ambient studio theme (Projects & Contact)
    targets = {
      hemSky:    new THREE.Color("#818cf8"),   // soft blue-purple ambient sky
      hemGround: new THREE.Color("#0f172a"),   // deep space navy-grey ground
      hemInt:    1.4,                          // atmospheric ambient scale
      keyColor:  new THREE.Color("#ffffff"),   // pristine white key
      keyInt:    2.2,
      fillColor: new THREE.Color("#1e1b4b"),   // deep indigo fill
      fillInt:   1.0,
      rimColor:  new THREE.Color("#22d3ee"),   // glowing sharp cyber cyan rim light
      rimInt:    2.2,
    };
  }

  useFrame(() => {
    const speed = 0.08;

    if (hemRef.current) {
      hemRef.current.color.lerp(targets.hemSky, speed);
      hemRef.current.groundColor.lerp(targets.hemGround, speed);
      hemRef.current.intensity = THREE.MathUtils.lerp(hemRef.current.intensity, targets.hemInt, speed);
    }
    if (keyRef.current) {
      keyRef.current.color.lerp(targets.keyColor, speed);
      keyRef.current.intensity = THREE.MathUtils.lerp(keyRef.current.intensity, targets.keyInt, speed);
    }
    if (fillRef.current) {
      fillRef.current.color.lerp(targets.fillColor, speed);
      fillRef.current.intensity = THREE.MathUtils.lerp(fillRef.current.intensity, targets.fillInt, speed);
    }
    if (rimRef.current) {
      rimRef.current.color.lerp(targets.rimColor, speed);
      rimRef.current.intensity = THREE.MathUtils.lerp(rimRef.current.intensity, targets.rimInt, speed);
    }
  });

  return (
    <group>
      {/* Hemisphere — sky/ground ambient */}
      <hemisphereLight
        ref={hemRef}
        skyColor="#ffffff"
        groundColor="#F5EFEB"
        intensity={2.0}
      />

      {/* Main overhead key — casts soft shadows */}
      <directionalLight
        ref={keyRef}
        position={[4, 6, 4]}
        intensity={1.8}
        color="#faf8f5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      >
        <orthographicCamera attach="shadow-camera" args={[-3, 3, 3, -3, 0.1, 20]} />
      </directionalLight>

      {/* Soft warm fill */}
      <directionalLight
        ref={fillRef}
        position={[-4, 3, 2]}
        intensity={0.8}
        color="#ffeedd"
      />

      {/* Cool rim / accent */}
      <directionalLight
        ref={rimRef}
        position={[-2, 1, -4]}
        intensity={0.6}
        color="#cce6ff"
      />
    </group>
  );
}
