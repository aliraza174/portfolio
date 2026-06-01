// src/components/scene/DeskScene.jsx
"use client";

import React, { useRef } from "react";
import { useStore } from "@/store/useStore";
import { useFrame } from "@react-three/fiber";
import EnvironmentSetup from "./Environment";
import Desk from "./Desk";
import Chair from "./Chair";

/**
  * DeskScene — renders the volumetric room, L-desk, office chair, and stylized environment.
  * Hides instantly when scrollProgress >= 0.1 to clear the scene for the hologram phase.
  */
function DeskScene(props) {
  return (
    <group {...props}>
      <EnvironmentSetup />
      <Desk position={[0, -0.4, 0.5]} />
      <Chair position={[0, -0.26, 1.48]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}

export default DeskScene;
