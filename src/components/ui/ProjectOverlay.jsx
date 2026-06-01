"use client";

import React from "react";
import { useStore } from "@/store/useStore";

/**
 * ProjectOverlay — Split-screen cinematic projects layout.
 * Left: Project card list sliding in based on scroll progress.
 * Right: Blank column to frame the 3D floating ProjectBox inside the WebGL canvas.
 */
export default function ProjectOverlay() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const phase = useStore((state) => state.phase);

  // Normalize progress inside Projects phase (0.50 -> 0.75)
  const minScroll = 0.50;
  const maxScroll = 0.75;
  const rawProgress = (scrollProgress - minScroll) / (maxScroll - minScroll);
  const relProgress = Math.max(0, Math.min(1, rawProgress));

  // Translate: -100% (hidden) to 0% (aligned)
  const translateX = -100 + relProgress * 100;
  // Fade card opacity as it slides in
  const cardOpacity = relProgress;

  const projects = [
    {
      title: "Neo-Diorama Portfolio",
      desc: "A cinematic 3D portfolio featuring procedural claymorphic models and dynamic HTML projections.",
      tech: ["React", "Three.js", "R3F", "Zustand"],
      color: "border-purple-500/20 shadow-[0_8px_32px_rgba(168,85,247,0.08)]",
      badgeColor: "bg-purple-500/8 text-purple-300 border-purple-500/25",
      dot: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]",
    },
    {
      title: "SaaS Analytics Engine",
      desc: "Real-time traffic monitoring and performance telemetry for enterprise server clusters.",
      tech: ["Next.js", "Tailwind", "PostgreSQL", "Chart.js"],
      color: "border-blue-500/20 shadow-[0_8px_32px_rgba(59,130,246,0.08)]",
      badgeColor: "bg-blue-500/8 text-blue-300 border-blue-500/25",
      dot: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]",
    },
    {
      title: "DeFi Yield Dashboard",
      desc: "Smart contract staking performance and transaction telemetry dashboard.",
      tech: ["Solidity", "Ethers.js", "React", "Node.js"],
      color: "border-emerald-500/20 shadow-[0_8px_32px_rgba(16,185,129,0.08)]",
      badgeColor: "bg-emerald-500/8 text-emerald-300 border-emerald-500/25",
      dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
    },
  ];

  const isVisible = phase === "projects";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 w-full h-full overflow-hidden transition-opacity duration-500 flex items-center"
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full px-6 md:px-24 items-center">
        {/* ── LEFT COLUMN: SCROLL-BASED CARD SLIDER ────────────────── */}
        <div className="flex flex-col justify-center h-full max-w-xl pointer-events-auto overflow-hidden relative">
          {/* Header */}
          <div
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              opacity: cardOpacity,
              transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            }}
            className="mb-8"
          >
            <span className="text-[11px] font-bold tracking-[0.25em] text-emerald-400 uppercase">Selected Work</span>
            <h2 className="text-white text-3xl font-extrabold tracking-wide mt-2">Projects</h2>
          </div>

          {/* Cards container */}
          <div
            style={{
              transform: `translate3d(${translateX}%, 0, 0)`,
              opacity: cardOpacity,
              transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease-out",
            }}
            className="space-y-6"
          >
            {projects.map((project, idx) => (
              <div
                key={idx}
                className={`bg-[#0f0c19]/80 backdrop-blur-2xl border ${project.color} rounded-2xl p-6 hover:scale-[1.02] hover:border-emerald-400/35 transition-all duration-300 group`}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className={`w-2 h-2 rounded-full ${project.dot}`} />
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Project 0{idx + 1}</span>
                </div>
                <h3 className="text-white text-lg font-bold tracking-wide mb-1.5 group-hover:text-emerald-300 transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((skill) => (
                    <span
                      key={skill}
                      className={`text-[9px] border px-2 py-0.5 rounded-full font-mono tracking-wide ${project.badgeColor}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: TRANSPARENT FRAME FOR 3D CANVAS ────────── */}
        <div className="hidden md:block h-full w-full pointer-events-none" />
      </div>
    </div>
  );
}
