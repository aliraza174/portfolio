"use client";

import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useStore } from "@/store/useStore";
import * as THREE from "three";

const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

export default function CameraController() {
  const { camera, size } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const s = useStore.getState().scrollProgress;
    const phase = useStore.getState().phase;
    const isMobile = size.width < 768;

    let targetX, targetY, targetZ;
    let lookX, lookY, lookZ;

    if (phase === "home") {
      // Home phase (s: 0 -> 0.1667): subtle zoom-out and tracking
      const targetFov = isMobile ? 54 : 38;
      if (camera.fov !== targetFov) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }

      const p = Math.min(1, s / 0.1667);
      if (isMobile) {
        // Zoom out camera slightly and elevate it to get a perfect bird's eye view of the room diorama on portrait mobile screens
        targetX = lerp(-3.8, -3.6, p);
        targetY = lerp(2.8, 2.75, p);
        targetZ = 4.2;
        lookX = 0;
        lookY = 0.3;
        lookZ = 0.5;
      } else {
        targetX = lerp(-3.5, -3.3, p);
        targetY = lerp(2.2, 2.15, p);
        targetZ = 3.2;
        lookX = 0;
        lookY = 0.5;
        lookZ = 0.8;
      }

      // Subtle idle drift
      targetX += Math.sin(t * 0.25) * 0.08;
      targetY += Math.cos(t * 0.2) * 0.05;
      targetZ += Math.sin(t * 0.15) * 0.08;
    } else if (phase === "about") {
      // Medium narrow FOV to frame standing character like a premium collectible toy
      const targetFov = isMobile ? 32 : 24;
      if (camera.fov !== targetFov) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }

      if (isMobile) {
        // Move camera slightly higher and shift target up so the standing character is positioned in the top half of the screen, leaving room for the stacked text cards at the bottom
        targetX = 0;
        targetY = 0.45;
        targetZ = 6.2;
        lookX = 0;
        lookY = 0.3;
        lookZ = 0;
      } else {
        targetX = 0;
        targetY = 0;
        targetZ = 6.0;
        lookX = 0;
        lookY = -0.15;
        lookZ = 0;
      }
    } else if (phase === "projects") {
      // Extremely narrow FOV to achieve a gorgeous, flat isometric projection.
      const targetFov = isMobile ? 26 : 18;
      if (camera.fov !== targetFov) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }

      if (isMobile) {
        // Center the 3D holographic box horizontally and elevate it slightly
        targetX = 0;
        targetY = 0.6;
        targetZ = 8.5;
        lookX = 0;
        lookY = 0.5;
        lookZ = 0;
      } else {
        targetX = 0.38;
        targetY = 0;
        targetZ = 8.5;
        lookX = 0.38;
        lookY = 0;
        lookZ = 0;
      }
    } else {
      // Contact / other phases
      const targetFov = isMobile ? 36 : 26;
      if (camera.fov !== targetFov) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }

      if (isMobile) {
        targetX = 0;
        targetY = 0.5;
        targetZ = 5.6;
        lookX = 0;
        lookY = 0.3;
        lookZ = 0;
      } else {
        targetX = 0;
        targetY = 0;
        targetZ = 5.2;
        lookX = 0;
        lookY = 0;
        lookZ = 0;
      }
    }

    // Apply positions smoothly
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.07);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.07);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.07);
    
    // Lerp camera target direction
    const currentTarget = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
    const targetLook = new THREE.Vector3(lookX, lookY, lookZ);
    const nextLook = new THREE.Vector3().lerpVectors(currentTarget, targetLook, 0.07);
    camera.lookAt(nextLook);
  });

  return null;
}
