"use client";

import React from "react";

/**
 * EnvironmentSetup — Stylized room background and floor.
 * Upgraded:
 *   • Extended floor plane and grid helper to 100x100 to cover the entire viewport
 *     and eliminate any raw grey cut-off edges, making the scene look 100% finished.
 *   • Deep purple square tiled floor (with custom gridHelper matching screenshot 10).
 */
export default function EnvironmentSetup() {
  return (
    <group>
      {/* Warm matte-cream backdrop sphere envelope (physical studio background) */}
      <mesh position={[0, 2, -5]}>
        <sphereGeometry args={[18, 16, 16]} />
        <meshStandardMaterial color="#F5EFEB" side={2} roughness={1.0} metalness={0.0} />
      </mesh>

      {/* Shadow-catching floor plane (now extended all the way to 100x100!) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.4, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#16132b" roughness={0.92} metalness={0.08} />
      </mesh>

      {/* ── SEAMLESS EXTENDED TILE GRID FLOOR (Wipes all raw edges) ── */}
      <gridHelper
        args={[100, 100, "#4338ca", "#28234a"]}
        position={[0, -0.396, 0]}
      />

      {/* Stylized rounded geometric orange rug plane beneath the desk */}
      <group position={[0, -0.378, 0.4]}>
        {/* Main outer rug plate */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.8, 2.0]} />
          <meshStandardMaterial color="#FF923E" roughness={0.9} metalness={0.0} />
        </mesh>
        {/* Inside concentric detail stripe */}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 1.6]} />
          <meshStandardMaterial color="#FFC837" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
